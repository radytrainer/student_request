// Firestore data access for document requests.
//
//   requests/{code}  staff only:  full request incl. contact + price
//   tracking/{code}  public by exact code only:  masked name, batch, what was requested, status, timeline
//   staff/{uid}      marks a Firebase Auth user as staff
//
// {code} is a short tracking code students use to follow their request.
// Both docs are written together; `timeline` records when each status was reached.
import {
  collection, doc, writeBatch, onSnapshot, query, orderBy,
  getDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const STATUSES = [
  { id: "requested", label: "Requested", desc: "We received your request." },
  { id: "waiting", label: "Waiting", desc: "In the queue, waiting to be processed." },
  { id: "in_progress", label: "In progress", desc: "Staff are preparing your documents." },
  { id: "completed", label: "Completed", desc: "Ready to collect at the office." },
  { id: "collected", label: "Collected", desc: "Documents have been collected." },
];

export const statusLabel = (id) => STATUSES.find((s) => s.id === id)?.label ?? id ?? "—";
export const statusIndex = (id) => STATUSES.findIndex((s) => s.id === id);

export const STATUS_STYLE = {
  requested: { cls: "bg-sky-50 text-sky-700 ring-sky-600/20", dot: "bg-sky-500" },
  waiting: { cls: "bg-amber-50 text-amber-800 ring-amber-600/20", dot: "bg-amber-500" },
  in_progress: { cls: "bg-violet-50 text-violet-700 ring-violet-600/20", dot: "bg-violet-500" },
  completed: { cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  collected: { cls: "bg-slate-100 text-slate-700 ring-slate-500/20", dot: "bg-slate-400" },
};

// "Sok Dara Chan" -> "Sok D. C."  — recognisable to the student, not a full public name.
export const maskName = (name) => {
  const [first, ...rest] = String(name).trim().split(/\s+/);
  return [first, ...rest.map((w) => `${w[0].toUpperCase()}.`)].join(" ");
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I
const newCode = () =>
  Array.from(crypto.getRandomValues(new Uint32Array(6)), (n) => CODE_CHARS[n % CODE_CHARS.length]).join("");

export const normalizeCode = (s) => String(s ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function createRequest(data) {
  // Retry on the (rare) chance the code already exists — rules reject overwrites.
  for (let attempt = 0; ; attempt++) {
    const code = newCode();
    const now = serverTimestamp();
    const batch = writeBatch(db);
    batch.set(doc(db, "requests", code), {
      ...data,
      status: "requested",
      timeline: { requested: now },
      createdAt: now,
    });
    batch.set(doc(db, "tracking", code), {
      name: maskName(data.fullName),
      batch: data.batch,
      requestKind: data.requestKind,
      requestType: data.requestType,
      transcriptCount: data.transcriptCount,
      certificateCount: data.certificateCount,
      status: "requested",
      timeline: { requested: now },
      createdAt: now,
    });
    try {
      await batch.commit();
      return code;
    } catch (err) {
      if (err.code !== "permission-denied" || attempt >= 2) throw err;
    }
  }
}

const listen = (q, onData, onError) =>
  onSnapshot(q, (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError);

// One request's public progress. Calls onData(null) if the code doesn't exist.
export const watchTrackingCode = (code, onData, onError) =>
  onSnapshot(doc(db, "tracking", code), (d) => onData(d.exists() ? { id: d.id, ...d.data() } : null), onError);

// Staff: full requests (newest first).
export const watchRequests = (onData, onError) =>
  listen(query(collection(db, "requests"), orderBy("createdAt", "desc")), onData, onError);

// Staff: move a request to a status and stamp the time it happened.
export async function setStatus(code, status) {
  const now = serverTimestamp();
  const patch = { status, [`timeline.${status}`]: now, updatedAt: now };
  const batch = writeBatch(db);
  batch.update(doc(db, "requests", code), patch);
  batch.update(doc(db, "tracking", code), patch);
  await batch.commit();
}

export async function isStaff(uid) {
  try {
    return (await getDoc(doc(db, "staff", uid))).exists();
  } catch {
    return false;
  }
}

// Codes submitted from this browser, so students can find them again without logging in.
const MY_KEY = "pnc.myRequests";
export const myCodes = () => {
  try {
    return JSON.parse(localStorage.getItem(MY_KEY)) || [];
  } catch {
    return [];
  }
};
export const rememberCode = (code) => {
  try {
    localStorage.setItem(MY_KEY, JSON.stringify([code, ...myCodes().filter((c) => c !== code)].slice(0, 10)));
  } catch {
    /* storage unavailable */
  }
};
