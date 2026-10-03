import { useId, useState } from "react";
import { amenityOptions, defaultStudyProfile, environmentOptions, goalOptions, sessionOptions, venueOptions } from "../data/profileOptions";
import type { StudyProfile } from "../types/user";
import FormField from "./FormField";
import Icon from "./Icon";
import PreferenceSelector from "./PreferenceSelector";
import Sheet from "./Sheet";

type EditProfileModalProps = {
  profile: StudyProfile | null;
  onSave: (profile: StudyProfile) => void;
  onClose: () => void;
};

/** Lets a signed-in user create or edit their study preferences. */
export default function EditProfileModal({ profile, onSave, onClose }: EditProfileModalProps) {
  const titleId = useId();
  const [draft, setDraft] = useState<StudyProfile>(profile ?? defaultStudyProfile);
  const update = <K extends keyof StudyProfile>(field: K, value: StudyProfile[K]) => setDraft((current) => ({ ...current, [field]: value }));

  return (
    <Sheet labelledBy={titleId} onClose={onClose} className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8a8295]">Personalise your picks</p>
          <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#20201f]" id={titleId}>{profile ? "Edit study preferences" : "Set up your study profile"}</h2>
        </div>
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1eee8] text-[#20201f] transition-colors hover:bg-[#e7e2d9]" data-autofocus onClick={onClose} aria-label="Close" type="button">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <PreferenceSelector label="Preferred study environment" onChange={(value) => update("environment", value)} options={environmentOptions} value={draft.environment} />
        <PreferenceSelector label="Favourite type of spot" onChange={(value) => update("venueType", value)} options={venueOptions} value={draft.venueType} />
        <PreferenceSelector label="Typical study session" onChange={(value) => update("sessionLength", value)} options={sessionOptions} value={draft.sessionLength} />
        <PreferenceSelector label="Main study goal" onChange={(value) => update("goal", value)} options={goalOptions} value={draft.goal} />
        <PreferenceSelector hint="Pick as many as you like" label="Must-have amenities" multiple onChange={(value) => update("amenities", value)} options={amenityOptions} value={draft.amenities} />
        <FormField hint="Optional" label="University, course or field of study" maxLength={80} onValueChange={(value) => update("fieldOfStudy", value)} placeholder="e.g. RMIT · Computer Science" value={draft.fieldOfStudy} />
      </div>

      <div className="sticky bottom-0 -mx-5 -mb-5 mt-5 flex gap-2 rounded-b-[28px] bg-[#fffdf8]/95 p-5 pt-3 backdrop-blur">
        <button className="rounded-[16px] border border-[#20201f]/10 bg-white px-5 py-4 text-[12px] font-extrabold text-[#20201f] transition hover:bg-[#f8f4ee]" onClick={onClose} type="button">Cancel</button>
        <button
          className="flex-1 rounded-[16px] bg-[#ff7048] py-4 text-[13px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,112,72,0.25)] transition hover:bg-[#f45f36] active:scale-[0.98]"
          onClick={() => onSave({ ...draft, fieldOfStudy: draft.fieldOfStudy.trim() })}
          type="button"
        >
          Save preferences
        </button>
      </div>
    </Sheet>
  );
}
