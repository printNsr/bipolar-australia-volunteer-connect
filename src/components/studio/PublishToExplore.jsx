import { useState } from "react";
import { LANDMARKS } from "@/components/explore/landmarks";

export default function PublishToExplore({ busy, onPublish }) {
  const [landmarkId, setLandmarkId] = useState(LANDMARKS[0].id);

  return (
    <div className="w-full space-y-3">
      <label className="block text-sm text-foreground" htmlFor="publish-landmark">
        Choose an Explore landmark
      </label>
      <select
        id="publish-landmark"
        value={landmarkId}
        onChange={(event) => setLandmarkId(event.target.value)}
        className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {LANDMARKS.map((landmark) => (
          <option key={landmark.id} value={landmark.id}>{landmark.name}</option>
        ))}
      </select>
      <button onClick={() => onPublish(landmarkId)} disabled={busy} className="ba-btn-primary disabled:opacity-40">
        {busy ? "Publishing…" : "Publish to Explore"}
      </button>
    </div>
  );
}