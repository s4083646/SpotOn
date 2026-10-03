import { useCallback, useEffect, useMemo, useState } from "react";
import AuthModal, { type AuthMode, type AuthReason } from "./components/AuthModal";
import BottomNav, { type Tab } from "./components/BottomNav";
import CheckInModal from "./components/CheckInModal";
import EditProfileModal from "./components/EditProfileModal";
import FilterModal from "./components/FilterModal";
import Header from "./components/Header";
import LocationModal, { CURRENT_LOCATION_ID } from "./components/LocationModal";
import type { MapFocus, MapViewState } from "./components/MapView";
import ReviewModal from "./components/ReviewModal";
import SessionBar from "./components/SessionBar";
import SpotDetails from "./components/SpotDetails";
import Toast, { useToast } from "./components/Toast";
import VibeModal from "./components/VibeModal";
import WardrobeModal from "./components/WardrobeModal";
import { sampleReviews } from "./data/community";
import { defaultLocation, MELBOURNE_CBD, spots } from "./data/spots";
import { useAccount } from "./hooks/useAccount";
import { useCommunity, type ReviewInput } from "./hooks/useCommunity";
import { useNow } from "./hooks/useNow";
import ExplorePage, { type CommunitySummary } from "./pages/ExplorePage";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";
import SavedPage from "./pages/SavedPage";
import { authService } from "./services/auth";
import type { Review, VibeValues } from "./types/community";
import type { Coordinates, LocationOption, SpotFilters, SpotWithStatus, StudySpot } from "./types/spot";
import { GeolocationError, geolocationMessages, getCurrentPosition, isInMelbourne } from "./utils/geolocation";
import { xpProgress } from "./utils/progress";
import { getRecommendations } from "./utils/recommendations";
import { readStorage, writeStorage } from "./utils/storage";
import { emptyFilters, filterSpots, sortByDistance, withStatus } from "./utils/spots";
import { formatDuration, todayKey } from "./utils/user";

/** Something the user tried to do before logging in, completed automatically after they log in. */
type PendingAction =
  | { type: "save"; spotId: number }
  | { type: "tab"; tab: Tab }
  | { type: "checkin"; spotId: number }
  | { type: "review"; spotId: number }
  | { type: "vibe"; spotId: number }
  | { type: "helpful"; reviewId: string };

/** A community/check-in sheet opened on top of a spot's details. */
type Activity = { kind: "checkin" | "review" | "vibe"; spotId: number };

type AuthState = { mode: AuthMode; reason: AuthReason; pending: PendingAction | null };

const SPOT_ZOOM = 16;
const AREA_ZOOM = 14;

const notificationPermission = (): NotificationPermission | "unsupported" => ("Notification" in window ? Notification.permission : "unsupported");

export default function App() {
  const account = useAccount();
  const community = useCommunity();
  const { user, data } = account;
  const now = useNow();
  const { toast, showToast } = useToast();

  const [tab, setTab] = useState<Tab>("Explore");
  const [filters, setFilters] = useState<SpotFilters>(emptyFilters);
  const [location, setLocation] = useState<LocationOption>(() => readStorage("location", defaultLocation));
  const [detailsSpotId, setDetailsSpotId] = useState<number | null>(null);
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [sheet, setSheet] = useState<"filters" | "location" | "profile" | "wardrobe" | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [permission, setPermission] = useState(notificationPermission);

  // Map state lives here so the view survives switching tabs, and so Explore can send the map to a spot.
  const [mapView, setMapView] = useState<MapViewState>({ center: MELBOURNE_CBD, zoom: AREA_ZOOM });
  const [mapSelectedId, setMapSelectedId] = useState<number | null>(null);
  const [mapFocus, setMapFocus] = useState<MapFocus | null>(null);
  const [userPosition, setUserPosition] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => writeStorage("location", location), [location]);

  // Ratings and review counts include reviews students write in the app.
  const allSpots = useMemo(
    () => withStatus(spots.map((spot) => ({ ...spot, rating: community.ratingFor(spot), reviewCount: community.reviewCountFor(spot) })), location, now),
    [community, location, now],
  );
  const results = useMemo(() => sortByDistance(filterSpots(allSpots, filters)), [allSpots, filters]);
  const recommendations = useMemo(() => (data.studyProfile ? getRecommendations(data.studyProfile, allSpots) : []), [data.studyProfile, allSpots]);
  // Reasons for a user's top matches, shown in the details sheet and map preview.
  const matchReasons = useMemo(
    () => new Map(data.studyProfile ? getRecommendations(data.studyProfile, allSpots, 5).map((item) => [item.spot.id, item.explanation]) : []),
    [data.studyProfile, allSpots],
  );
  // The map shows filtered results, plus the selected spot so "View on map" always has a pin to highlight.
  const mapSpots = useMemo(() => {
    const selected = allSpots.find((spot) => spot.id === mapSelectedId);
    return selected && !results.includes(selected) ? [...results, selected] : results;
  }, [allSpots, results, mapSelectedId]);

  const communitySummary = useMemo<CommunitySummary>(() => {
    const byRating = [...allSpots].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    return {
      recentReviews: [...community.store.reviews, ...sampleReviews],
      totalRatings: allSpots.reduce((sum, spot) => sum + spot.reviewCount, 0),
      vibeUpdates: community.store.vibeReports.length,
      topSpot: byRating[0] ?? null,
      trending: [...allSpots].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5),
    };
  }, [allSpots, community]);

  const savedIds = data.savedSpotIds;
  const savedSpots = allSpots.filter((spot) => savedIds.includes(spot.id));
  const detailsSpot = allSpots.find((spot) => spot.id === detailsSpotId) ?? null;
  const activitySpot = activity ? (allSpots.find((spot) => spot.id === activity.spotId) ?? null) : null;
  const activeSessionSpot = data.activeSession ? spots.find((spot) => spot.id === data.activeSession?.spotId) : undefined;
  const sessionToday = data.sessions.some((session) => todayKey(new Date(session.startedAt)) === todayKey(now));
  const showReminder = Boolean(user && data.notifications.studyReminders && !sessionToday && !data.activeSession && data.reminderDismissedOn !== todayKey(now));

  // Browser notification: at most once a day, only if the user enabled reminders and granted permission.
  useEffect(() => {
    if (!user || !showReminder || permission !== "granted") return;
    const key = `last-notified:${user.id}`;
    if (readStorage<string | null>(key, null) === todayKey()) return;
    writeStorage(key, todayKey());
    try {
      new Notification("Time for a focus session?", { body: `Hey ${user.firstName}, pick a study spot and get started.` });
    } catch {
      // Some browsers (e.g. Android Chrome) only allow notifications from a service worker. The in-app nudge still shows.
    }
  }, [user, showReminder, permission]);

  const openAuth = (reason: AuthReason, pending: PendingAction | null = null, mode: AuthMode = "login") => setAuth({ mode, reason, pending });

  const runPending = (pending: PendingAction | null) => {
    if (!pending) return;
    if (pending.type === "save") {
      account.setSaved(pending.spotId, true);
      showToast("Saved to your spots", "heart");
    } else if (pending.type === "tab") {
      setTab(pending.tab);
    } else if (pending.type === "helpful") {
      account.setHelpful(pending.reviewId, true);
    } else {
      setActivity({ kind: pending.type, spotId: pending.spotId });
    }
  };

  const handleLogin = async (input: Parameters<typeof account.login>[0]) => {
    const loggedIn = await account.login(input);
    const pending = auth?.pending ?? null;
    setAuth(null);
    showToast(`Welcome back, ${loggedIn.firstName}!`, "user");
    runPending(pending);
  };

  const handleSignup = async (...args: Parameters<typeof account.signup>) => {
    const created = await account.signup(...args);
    const pending = auth?.pending ?? null;
    setAuth(null);
    showToast(`Welcome, ${created.firstName}! Your picks are ready.`, "star");
    runPending(pending);
    if (!pending) setTab("Explore");
  };

  const handleLogout = async () => {
    await account.logout();
    setTab("Explore");
    setDetailsSpotId(null);
    setActivity(null);
    setSheet(null);
    showToast("You've been logged out", "logout");
  };

  const changeTab = (next: Tab) => {
    if ((next === "Saved" || next === "Profile") && !user) {
      openAuth(next, { type: "tab", tab: next });
      return;
    }
    setTab(next);
    window.scrollTo({ top: 0 });
  };

  const toggleSave = (spot: SpotWithStatus) => {
    if (!user) {
      openAuth("save", { type: "save", spotId: spot.id });
      return;
    }
    const saved = savedIds.includes(spot.id);
    account.setSaved(spot.id, !saved);
    showToast(saved ? "Removed from saved" : "Saved to your spots", saved ? "x" : "heart");
  };

  /** Opens a check-in, review or vibe sheet, asking the user to log in first if needed. */
  const openActivity = (kind: Activity["kind"], spot: StudySpot) => {
    if (!user) {
      openAuth(kind === "checkin" ? "session" : kind, { type: kind, spotId: spot.id });
      return;
    }
    setActivity({ kind, spotId: spot.id });
  };

  const showXp = (xp: number, minutes: number) =>
    xp > 0 ? showToast(`Nice focus! +${xp} XP`, "star", "XP") : showToast(`${formatDuration(minutes)} logged. Sessions over 10 min earn XP.`, "clock");

  const logSession = (spotId: number, minutes: number) => {
    const session = account.logSession(spotId, minutes);
    setActivity(null);
    showXp(session.xp, session.minutes);
  };

  const startTimer = (spot: StudySpot) => {
    if (data.activeSession) account.endSession();
    account.startSession(spot.id);
    setActivity(null);
    setDetailsSpotId(null);
    showToast(`Timer started at ${spot.name}`, "play");
  };

  const endSession = () => {
    const session = account.endSession();
    if (session) showXp(session.xp, session.minutes);
  };

  const submitReview = (input: ReviewInput) => {
    if (!user) return;
    community.addReview(user, input);
    setActivity(null);
    showToast("Thanks! Your review is live", "star");
  };

  const submitVibe = (spotId: number, values: VibeValues) => {
    if (!user) return;
    community.addVibeReport(user, spotId, values);
    setActivity(null);
    showToast("Thanks for sharing the vibe!", "check");
  };

  const toggleHelpful = (review: Review) => {
    if (!user) {
      openAuth("helpful", { type: "helpful", reviewId: review.id });
      return;
    }
    account.setHelpful(review.id, !data.helpfulReviewIds.includes(review.id));
  };

  const focusMap = useCallback((center: Coordinates, zoom: number) => {
    setMapView({ center, zoom });
    setMapFocus({ center, zoom, key: Date.now() });
  }, []);

  const viewOnMap = (spot: SpotWithStatus) => {
    setDetailsSpotId(null);
    setMapSelectedId(spot.id);
    focusMap(spot, SPOT_ZOOM);
    setTab("Map");
    window.scrollTo({ top: 0 });
  };

  const selectLocation = (option: LocationOption) => {
    setLocation(option);
    setSheet(null);
    focusMap(option, option.id === CURRENT_LOCATION_ID ? 15 : AREA_ZOOM);
    showToast(`Showing spots around ${option.label === "Your location" ? "you" : option.label}`, "location");
  };

  const locateOnMap = async () => {
    setLocating(true);
    try {
      const position = await getCurrentPosition();
      setUserPosition(position);
      focusMap(position, 15);
      if (isInMelbourne(position)) {
        setLocation({ id: CURRENT_LOCATION_ID, label: "Your location", ...position });
        showToast("Showing spots near you", "crosshair");
      } else {
        showToast("You're outside Melbourne, so there are no spots nearby yet", "location");
      }
    } catch (error) {
      const reason = error instanceof GeolocationError ? error.reason : "unavailable";
      focusMap(MELBOURNE_CBD, AREA_ZOOM);
      showToast(geolocationMessages[reason], "location");
    } finally {
      setLocating(false);
    }
  };

  const toggleReminders = async (enabled: boolean) => {
    account.setNotifications({ studyReminders: enabled });
    if (enabled && "Notification" in window && Notification.permission === "default") {
      try {
        setPermission(await Notification.requestPermission());
      } catch {
        setPermission(notificationPermission());
      }
    }
    showToast(enabled ? "Study reminders on" : "Study reminders off", "bell");
  };

  const updateFilters = (patch: Partial<SpotFilters>) => setFilters((current) => ({ ...current, ...patch }));

  return (
    <main className="min-h-[100dvh] bg-[#f8c99b] sm:py-6">
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-[#fffdf8] shadow-[0_24px_80px_rgba(77,53,40,0.18)] sm:min-h-[calc(100dvh-3rem)] sm:rounded-[36px]">
        <Header locationLabel={location.label} onChangeLocation={() => setSheet("location")} onOpenProfile={() => changeTab("Profile")} user={user} />

        {data.activeSession && activeSessionSpot && <SessionBar onEnd={endSession} session={data.activeSession} spotName={activeSessionSpot.name} />}

        {tab === "Explore" && (
          <ExplorePage
            community={communitySummary}
            filters={filters}
            onDismissReminder={account.dismissReminder}
            onEditProfile={() => setSheet("profile")}
            onFiltersChange={updateFilters}
            onGetPersonalised={() => openAuth("recommendations", null, "signup")}
            onOpenFilters={() => setSheet("filters")}
            onOpenSpot={(spot) => setDetailsSpotId(spot.id)}
            onResetFilters={() => setFilters(emptyFilters)}
            onToggleSave={toggleSave}
            onViewOnMap={viewOnMap}
            recommendations={recommendations}
            results={results}
            savedIds={savedIds}
            showReminder={showReminder}
            studyProfile={data.studyProfile}
            user={user}
          />
        )}

        {tab === "Map" && (
          <MapPage
            filters={filters}
            focus={mapFocus}
            initialView={mapView}
            locating={locating}
            matchReasons={matchReasons}
            onBackToMelbourne={() => focusMap(MELBOURNE_CBD, AREA_ZOOM)}
            onFiltersChange={updateFilters}
            onLocate={locateOnMap}
            onOpenFilters={() => setSheet("filters")}
            onOpenSpot={(spot) => setDetailsSpotId(spot.id)}
            onSelect={setMapSelectedId}
            onToggleSave={toggleSave}
            onViewChange={setMapView}
            savedIds={savedIds}
            selectedId={mapSelectedId}
            spots={mapSpots}
            userPosition={userPosition}
          />
        )}

        {tab === "Saved" && user && (
          <SavedPage onExplore={() => changeTab("Explore")} onOpenSpot={(spot) => setDetailsSpotId(spot.id)} onToggleSave={toggleSave} onViewOnMap={viewOnMap} spots={savedSpots} />
        )}

        {tab === "Profile" && user && (
          <ProfilePage
            data={data}
            notificationPermission={permission}
            onEditProfile={() => setSheet("profile")}
            onLogout={handleLogout}
            onOpenWardrobe={() => setSheet("wardrobe")}
            onToggleReminders={toggleReminders}
            reviewsWritten={community.reviewsBy(user.id)}
            spots={spots}
            user={user}
            vibeUpdates={community.vibeUpdatesBy(user.id)}
          />
        )}

        <BottomNav onChange={changeTab} savedCount={savedIds.length} tab={tab} />

        {detailsSpot && (
          <SpotDetails
            activeSessionSpotId={data.activeSession?.spotId ?? null}
            currentUserId={user?.id ?? null}
            helpfulIds={data.helpfulReviewIds}
            matchReason={matchReasons.get(detailsSpot.id) ?? null}
            now={now}
            onCheckIn={(spot) => openActivity("checkin", spot)}
            onClose={() => setDetailsSpotId(null)}
            onToggleHelpful={toggleHelpful}
            onToggleSave={toggleSave}
            onUpdateVibe={(spot) => openActivity("vibe", spot)}
            onViewOnMap={viewOnMap}
            onWriteReview={(spot) => openActivity("review", spot)}
            reviews={community.reviewsFor(detailsSpot.id)}
            saved={savedIds.includes(detailsSpot.id)}
            spot={detailsSpot}
            vibe={community.vibeFor(detailsSpot, user?.id ?? null)}
          />
        )}

        {activitySpot && activity?.kind === "checkin" && (
          <CheckInModal
            equipped={data.equippedCosmetics}
            onClose={() => setActivity(null)}
            onLog={(minutes) => logSession(activitySpot.id, minutes)}
            onStartTimer={() => startTimer(activitySpot)}
            spot={activitySpot}
            timerRunningHere={data.activeSession?.spotId === activitySpot.id}
          />
        )}

        {activitySpot && activity?.kind === "review" && <ReviewModal onClose={() => setActivity(null)} onSubmit={submitReview} spot={activitySpot} />}

        {activitySpot && activity?.kind === "vibe" && (
          <VibeModal
            initial={community.vibeFor(activitySpot, user?.id ?? null)}
            onClose={() => setActivity(null)}
            onSubmit={(values) => submitVibe(activitySpot.id, values)}
            spot={activitySpot}
          />
        )}

        {sheet === "wardrobe" && user && (
          <WardrobeModal
            equipped={data.equippedCosmetics}
            onClose={() => setSheet(null)}
            onSelect={account.applyCosmetic}
            owned={data.ownedCosmetics}
            xpBalance={xpProgress(data).balance}
          />
        )}


        {sheet === "filters" && (
          <FilterModal
            filters={filters}
            onChange={updateFilters}
            onClose={() => setSheet(null)}
            onReset={() => setFilters((current) => ({ ...emptyFilters, query: current.query, category: current.category }))}
            resultCount={results.length}
          />
        )}

        {sheet === "location" && <LocationModal currentId={location.id} onClose={() => setSheet(null)} onSelect={selectLocation} />}

        {sheet === "profile" && user && (
          <EditProfileModal
            onClose={() => setSheet(null)}
            onSave={(profile) => {
              account.setStudyProfile(profile);
              setSheet(null);
              showToast("Preferences saved. Picks updated!", "star");
            }}
            profile={data.studyProfile}
          />
        )}

        {auth && (
          <AuthModal
            isEmailRegistered={(email) => authService.isEmailRegistered(email)}
            mode={auth.mode}
            onClose={() => setAuth(null)}
            onLogin={handleLogin}
            onModeChange={(mode) => setAuth((current) => (current ? { ...current, mode } : current))}
            onSignup={handleSignup}
            reason={auth.reason}
          />
        )}

        <Toast toast={toast} />
      </div>
    </main>
  );
}
