import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function CommentsPanel({ comments, onAdd }) {
  const [text, setText] = useState("");
  const [kind, setKind] = useState("comment");
  const [saving, setSaving] = useState(false);

  const send = async () => {
    setSaving(true);
    await onAdd(text.trim(), kind);
    setText("");
    setSaving(false);
  };

  return (
    <section>
      <h3 className="text-2xl">Comments & suggestions</h3>
      <div className="mt-5 space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share an idea, encouragement or a creative suggestion…"
          className="rounded-md bg-card"
        />
        <div className="flex flex-wrap items-center gap-3">
          {["comment", "suggestion"].map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`brand-pill border capitalize ${
                kind === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
              }`}
            >
              {k}
            </button>
          ))}
          <button onClick={send} disabled={!text.trim() || saving} className="ba-btn-primary ml-auto disabled:opacity-40">
            {saving ? "Posting…" : "Post"}
          </button>
        </div>
      </div>

      <ul className="mt-8 border-t border-border">
        {comments.length === 0 && (
          <li className="py-6 text-sm text-muted-foreground">No comments yet — start the conversation.</li>
        )}
        {comments.map((c) => (
          <li key={c.id} className="border-b border-border py-5">
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-foreground">{c.author_name}</span>
              {c.kind === "suggestion" && <span className="brand-pill brand-pill-pending">Suggestion</span>}
            </div>
            <p className="mt-2 text-[15px] text-muted-foreground">{c.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}