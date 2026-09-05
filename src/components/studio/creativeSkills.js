export const CREATIVE_SKILLS = [
  "Drawing",
  "Illustration",
  "Graphic Design",
  "3D Design",
  "Animation",
  "Photography",
  "Writing",
  "Storytelling",
  "Video Editing",
  "Social Media"
];

export const STAGES = ["idea", "sketching", "creating", "review", "published"];

export const STAGE_LABELS = {
  idea: "Idea",
  sketching: "Sketching",
  creating: "Creating",
  review: "Review",
  published: "Published"
};

export function stageProgress(stage) {
  const i = STAGES.indexOf(stage || "idea");
  return Math.round(((i + 1) / STAGES.length) * 100);
}

export function matchScore(mySkills = [], wanted = []) {
  if (!wanted.length) return 0;
  const mine = mySkills.map((s) => s.toLowerCase());
  const hits = wanted.filter((w) => mine.includes(w.toLowerCase())).length;
  const base = (hits / wanted.length) * 100;
  return hits ? Math.min(98, Math.round(base * 0.92 + 8)) : 0;
}

export function sharedSkills(mySkills = [], wanted = []) {
  const mine = mySkills.map((s) => s.toLowerCase());
  return wanted.filter((w) => mine.includes(w.toLowerCase()));
}