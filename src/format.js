// Firestore Timestamp -> "13 Nov 2026, 14:05"
export const formatDateTime = (ts) =>
  ts?.toDate
    ? ts.toDate().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

// "2 transcripts · 1 certificate"
export const describeDocs = (r) =>
  [
    r.transcriptCount ? `${r.transcriptCount} transcript${r.transcriptCount > 1 ? "s" : ""}` : "",
    r.certificateCount ? `${r.certificateCount} certificate${r.certificateCount > 1 ? "s" : ""}` : "",
  ]
    .filter(Boolean)
    .join(" · ") || "—";
