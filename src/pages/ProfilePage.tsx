import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import StudyBuddy from "../components/StudyBuddy";
import ToggleRow from "../components/Toggle";
import { amenityOptions, environmentOptions, goalOptions, optionLabel, sessionOptions, venueOptions } from "../data/profileOptions";
import type { StudySpot } from "../types/spot";
import type { User, UserData } from "../types/user";
import { communityBadges, hiddenGemsSaved, studyStreak, xpProgress } from "../utils/progress";
import { formatDuration, formatHours, fullName, memberSince, totalFocusedMinutes } from "../utils/user";
import { ageFrom } from "../utils/validation";

type ProfilePageProps = {
  user: User;
  data: UserData;
  spots: StudySpot[];
  reviewsWritten: number;
  vibeUpdates: number;
  notificationPermission: NotificationPermission | "unsupported";
  onEditProfile: () => void;
  onOpenWardrobe: () => void;
  onToggleReminders: (enabled: boolean) => void;
  onLogout: () => void;
};

export default function ProfilePage({ user, data, spots, reviewsWritten, vibeUpdates, notificationPermission, onEditProfile, onOpenWardrobe, onToggleReminders, onLogout }: ProfilePageProps) {
  const focusedMinutes = totalFocusedMinutes(data.sessions);
  const xp = xpProgress(data);
  const streak = studyStreak(data.sessions);
  const badges = communityBadges(data, spots, reviewsWritten);
  const earnedBadges = badges.filter((badge) => badge.earned).length;
  const age = user.dateOfBirth ? ageFrom(user.dateOfBirth) : null;
  const profile = data.studyProfile;
  const spotName = (id: number) => spots.find((spot) => spot.id === id)?.name ?? "A study spot";

  const reminderDescription = !data.notifications.studyReminders
    ? "Get a daily focus nudge"
    : notificationPermission === "granted"
      ? "Daily nudge in the app and as a browser notification"
      : "Daily nudge on the Explore page";

  const profileRows = profile
    ? [
        { label: "Study vibe", value: optionLabel(environmentOptions, profile.environment) },
        { label: "Favourite spot", value: optionLabel(venueOptions, profile.venueType) },
        { label: "Session length", value: optionLabel(sessionOptions, profile.sessionLength) },
        { label: "Study goal", value: optionLabel(goalOptions, profile.goal) },
      ]
    : [];

  return (
    <section className="px-5 pb-32 pt-4">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8a8295]">Your study profile</p>
      <h1 className="mt-1 text-[30px] font-extrabold tracking-[-0.05em] text-[#20201f]">Hey, {user.firstName}</h1>

      {/* Identity */}
      <div className="mt-5 flex items-center gap-3.5 rounded-[22px] border border-[#20201f]/7 bg-white p-4 shadow-[0_8px_24px_rgba(35,38,48,0.05)]">
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[17px] font-extrabold text-[#20201f]">{fullName(user)}</h2>
          <p className="truncate text-[12px] font-semibold text-[#766f72]">{user.email}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-[#9a9198]">
            Member since {memberSince(user)}
            {age !== null && ` · ${age} yrs`}
          </p>
        </div>
      </div>
      {profile?.fieldOfStudy && (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#f1eee8] px-3 py-1.5 text-[11px] font-extrabold text-[#20201f]">🎓 {profile.fieldOfStudy}</p>
      )}

      {/* Study Buddy */}
      <div className="relative mt-4 overflow-hidden rounded-[28px] bg-[#afc5f1] p-5 text-[#20201f] shadow-[0_16px_36px_rgba(69,83,120,0.18)]">
        <div className="absolute -right-5 -top-8 h-32 w-32 rounded-full bg-white/20" />
        <div className="relative flex items-center justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full bg-white/55 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em]">Level {xp.level}</span>
            <h2 className="mt-3 text-[20px] font-extrabold">{user.firstName}’s Study Buddy</h2>
            <p className="mt-1 max-w-[170px] text-[11px] font-semibold leading-4 text-[#20201f]/60">Study, earn XP, and make your little focus friend your own.</p>
          </div>
          <StudyBuddy className="h-32 w-28 shrink-0" equipped={data.equippedCosmetics} />
        </div>
        <div className="relative mt-3 rounded-[18px] bg-white/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold">{xp.intoLevel} / 100 XP to level {xp.level + 1}</span>
            <span className="rounded-full bg-[#f8d66d] px-2.5 py-1 text-[10px] font-extrabold">{xp.balance} XP to spend</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#20201f]/10" role="progressbar" aria-label="Progress to next level" aria-valuemin={0} aria-valuemax={100} aria-valuenow={xp.intoLevel}>
            <div className="h-full rounded-full bg-[#ff7048] transition-all duration-500" style={{ width: `${xp.intoLevel}%` }} />
          </div>
        </div>
        <button className="relative mt-3 w-full rounded-[15px] bg-[#20201f] py-3 text-[12px] font-extrabold text-white shadow-sm transition hover:bg-[#383836] active:scale-[0.98]" onClick={onOpenWardrobe} type="button">
          Customise my buddy
        </button>
      </div>

      {/* Streak & stats */}
      <div className="mt-4 rounded-[22px] border border-[#20201f]/7 bg-white p-4 shadow-[0_8px_24px_rgba(35,38,48,0.05)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-extrabold text-[#20201f]">Study streak</h2>
            <p className="mt-0.5 text-[11px] font-semibold text-[#817986]">Every check-in grows your buddy</p>
          </div>
          <span className="rounded-full bg-[#fff1c6] px-3 py-1.5 text-[11px] font-extrabold text-[#9a5c20]">
            {streak ? `${streak} day${streak === 1 ? "" : "s"}` : "Start today"}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 divide-x divide-[#20201f]/10 text-center">
          <div><p className="text-[18px] font-extrabold">{data.sessions.length}</p><p className="text-[9px] uppercase tracking-wider text-[#20201f]/55">Sessions</p></div>
          <div><p className="text-[18px] font-extrabold">{data.savedSpotIds.length}</p><p className="text-[9px] uppercase tracking-wider text-[#20201f]/55">Saved</p></div>
          <div><p className="text-[18px] font-extrabold">{formatHours(focusedMinutes)}</p><p className="text-[9px] uppercase tracking-wider text-[#20201f]/55">Focused</p></div>
        </div>
      </div>

      {/* Community */}
      <div className="mt-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ff7048]">Student-powered</p>
            <h2 className="mt-1 text-[16px] font-extrabold text-[#20201f]">Community Badges</h2>
          </div>
          <span className="text-[11px] font-bold text-[#817986]">{earnedBadges} of {badges.length} earned</span>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {badges.map((badge, index) => (
            <li
              className={`flex items-center gap-2.5 rounded-[16px] border p-3 ${badge.earned ? "border-[#20201f]/7 bg-white" : "border-dashed border-[#20201f]/15 bg-white/50"} ${index === badges.length - 1 && badges.length % 2 ? "col-span-2" : ""}`}
              key={badge.id}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-[17px] ${badge.earned ? "" : "grayscale opacity-50"}`} style={{ backgroundColor: badge.color }}>
                {badge.symbol}
              </span>
              <span className="min-w-0">
                <span className={`block text-[11px] font-extrabold leading-4 ${badge.earned ? "text-[#20201f]" : "text-[#8a8283]"}`}>{badge.label}</span>
                <span className="block text-[10px] font-semibold leading-4 text-[#9a9198]">{badge.earned ? "Earned" : badge.hint}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-[20px] bg-[#20201f] p-4 text-white shadow-[0_10px_24px_rgba(32,32,31,0.14)]">
          <h3 className="text-[13px] font-extrabold">Your community impact</h3>
          <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 text-center">
            <div><p className="text-[17px] font-extrabold">{reviewsWritten}</p><p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-white/55">Reviews</p></div>
            <div><p className="text-[17px] font-extrabold">{vibeUpdates}</p><p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-white/55">Vibe updates</p></div>
            <div><p className="text-[17px] font-extrabold">{hiddenGemsSaved(data, spots)}</p><p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-white/55">Hidden gems</p></div>
          </div>
        </div>
      </div>

      {/* Study preferences */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-extrabold text-[#20201f]">Study preferences</h2>
          <button className="rounded-full px-2 py-1 text-[12px] font-extrabold text-[#e9532f] transition hover:bg-[#fff1eb]" onClick={onEditProfile} type="button">
            {profile ? "Edit" : "Set up"}
          </button>
        </div>
        {profile ? (
          <div className="mt-3 rounded-[20px] border border-[#20201f]/7 bg-white p-4">
            <dl className="grid grid-cols-2 gap-x-3 gap-y-3">
              {profileRows.map((row) => (
                <div key={row.label}>
                  <dt className="text-[9px] font-bold uppercase tracking-wider text-[#9a9198]">{row.label}</dt>
                  <dd className="mt-0.5 text-[13px] font-extrabold text-[#20201f]">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[9px] font-bold uppercase tracking-wider text-[#9a9198]">Must-have amenities</p>
            {profile.amenities.length ? (
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {profile.amenities.map((amenity) => (
                  <li className="rounded-full bg-[#fff1c6] px-2.5 py-1 text-[11px] font-bold text-[#20201f]" key={amenity}>{optionLabel(amenityOptions, amenity)}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-[12px] text-[#817986]">None selected</p>
            )}
          </div>
        ) : (
          <button
            className="mt-3 flex w-full items-center gap-3 rounded-[20px] border border-dashed border-[#ff7048]/40 bg-[#fff3d6] p-4 text-left transition hover:bg-[#ffecc0]"
            onClick={onEditProfile}
            type="button"
          >
            <Icon name="star" className="h-5 w-5 shrink-0 text-[#ff7048]" filled />
            <span className="text-[12px] font-bold leading-5 text-[#6b4a12]">Add your study preferences to get personalised spot picks.</span>
          </button>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-[16px] font-extrabold text-[#20201f]">Notifications</h2>
        <div className="mt-3 overflow-hidden rounded-[20px] border border-[#20201f]/7 bg-white">
          <ToggleRow
            checked={data.notifications.studyReminders}
            description={
              <>
                {reminderDescription}
                {data.notifications.studyReminders && notificationPermission === "denied" && (
                  <span className="mt-0.5 block text-[#c2410c]">Browser notifications are blocked, so we'll remind you in the app.</span>
                )}
              </>
            }
            label="Study reminders"
            last
            onChange={onToggleReminders}
          />
        </div>
      </div>

      {data.sessions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-[16px] font-extrabold text-[#20201f]">Recent sessions</h2>
          <ul className="mt-3 overflow-hidden rounded-[20px] border border-[#20201f]/7 bg-white">
            {data.sessions.slice(0, 3).map((session, index) => (
              <li className={`flex items-center justify-between gap-3 px-4 py-3 ${index ? "border-t border-[#20201f]/7" : ""}`} key={session.id}>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-extrabold text-[#20201f]">{spotName(session.spotId)}</span>
                  <span className="block text-[11px] text-[#817986]">
                    {new Date(session.startedAt).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}
                    {session.xp > 0 && ` · +${session.xp} XP`}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-[#f1eee8] px-2.5 py-1 text-[11px] font-extrabold text-[#20201f]">{formatDuration(session.minutes)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-[16px] border border-[#20201f]/10 bg-white py-3.5 text-[12px] font-extrabold text-[#e9532f] transition hover:bg-[#fff1eb] active:scale-[0.98]"
        onClick={onLogout}
        type="button"
      >
        <Icon name="logout" className="h-4 w-4" /> Log out
      </button>
    </section>
  );
}
