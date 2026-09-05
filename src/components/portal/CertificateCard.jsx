export default function CertificateCard({ volunteerName, hours, granted, project }) {
  const pct = Math.min(100, (hours / 8) * 100);

  if (granted) {
    return (
      <div className="brand-profcard">
        <div className="avatar">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5" /><path d="m9 13.5-1 6 4-2 4 2-1-6" /></svg>
        </div>
        <h3>{volunteerName}</h3>
        <p className="role">Certificate of contribution</p>
        <p className="quote">
          {hours} hours you chose to give{project ? ` — ${project}` : ""}. Thank you for standing with our community.
        </p>
        <span className="tag">Recovering together</span>
      </div>
    );
  }

  return (
    <div className="brand-learncard">
      <div className="eyebrow">Recognition</div>
      <h3>Certificate progress</h3>
      <div className="bar"><span style={{ width: `${pct}%` }} /></div>
      <div className="meta">
        <span>{hours} of 8 hours logged</span>
        <b>{Math.max(0, 8 - hours)} to go</b>
      </div>
    </div>
  );
}