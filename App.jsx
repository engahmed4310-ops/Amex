import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  LayoutDashboard, BookOpen, ClipboardCheck, BarChart3, Users, Send,
  Trophy, Star, Clock, CheckCircle2, XCircle, PlusCircle, Download,
  Award, Flame, Target, ChevronRight, X, Shield, UserCog, GraduationCap,
  Sparkles, TrendingUp, FileSpreadsheet, Crown, Medal, Zap, Upload, Paperclip, FileText, Image as ImageIcon, File as FileIcon,
  MessageSquare, AlertTriangle, Headphones, Smartphone
} from "lucide-react";

/* ---------------------------------- THEME ---------------------------------- */
const Theme = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');
    .tp-root { font-family: 'Inter', sans-serif; color: var(--navy);
      background:
        radial-gradient(1100px 600px at 8% -10%, rgba(0,113,206,0.35), transparent 60%),
        radial-gradient(900px 500px at 105% 0%, rgba(201,162,75,0.22), transparent 55%),
        linear-gradient(160deg, #071A33 0%, #0B2545 42%, #0E2E5C 100%);
      background-attachment: fixed;
      min-height: 100vh;
    }
    .tp-root, .tp-root * { --navy:#0B2545; --blue:#0071CE; --ice:#F5F8FC; --slate:#5B6B8C; --gold:#C9A24B;
      --green:#1F9D64; --red:#D6534A; --line:#E3E9F3; }
    .tp-display { font-family: 'Manrope', sans-serif; }
    .tp-navy-bg { background: var(--navy); }
    .tp-blue-bg { background: var(--blue); }
    .tp-gold-bg { background: var(--gold); }
    .tp-ice-bg { background: var(--ice); }
    .tp-navy-text { color: var(--navy); }
    .tp-blue-text { color: var(--blue); }
    .tp-slate-text { color: var(--slate); }
    .tp-gold-text { color: var(--gold); }
    .tp-green-text { color: var(--green); }
    .tp-red-text { color: var(--red); }
    .tp-card { background: white; border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 10px 30px -18px rgba(11,37,69,0.35); }
    .tp-glass { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); border-radius: 16px; backdrop-filter: blur(10px); }
    .tp-btn-primary { background: var(--navy); color: white; transition: background .15s ease, transform .1s ease; }
    .tp-btn-primary:hover { background: #143563; transform: translateY(-1px); }
    .tp-btn-gold { background: linear-gradient(135deg, #E3C27A, var(--gold)); color: var(--navy); box-shadow: 0 6px 16px -6px rgba(201,162,75,0.7); }
    .tp-btn-gold:hover { transform: translateY(-1px); }
    .tp-tab-active { background: var(--navy); color: white; }
    .tp-tab { color: var(--slate); }
    .tp-progress-track { background: #E9EEF7; border-radius: 999px; overflow:hidden; }
    .tp-progress-fill { background: linear-gradient(90deg, var(--blue), var(--navy)); }
    .tp-input { border: 1px solid var(--line); border-radius: 10px; padding: 8px 12px; font-size: 14px; width: 100%; }
    .tp-input:focus { outline: 2px solid var(--blue); border-color: transparent; }
    .tp-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .tp-scrollbar::-webkit-scrollbar-thumb { background: var(--line); border-radius: 999px; }
    @keyframes tp-pop { 0%{ transform: scale(.8); opacity:0 } 100%{ transform: scale(1); opacity:1 } }
    .tp-pop { animation: tp-pop .25s ease-out; }
    @keyframes tp-shimmer { 0%{ background-position: -200% 0 } 100%{ background-position: 200% 0 } }
    .tp-shimmer { background: linear-gradient(110deg, #C9A24B 20%, #F3DFA5 40%, #C9A24B 60%); background-size: 200% 100%; animation: tp-shimmer 2.6s linear infinite; }
    @keyframes tp-float { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-6px) } }
    .tp-float { animation: tp-float 3s ease-in-out infinite; }
    @keyframes tp-glow { 0%,100%{ box-shadow: 0 0 0 0 rgba(201,162,75,0.5) } 50%{ box-shadow: 0 0 0 10px rgba(201,162,75,0) } }
    .tp-glow { animation: tp-glow 2s ease-out infinite; }
    .tp-badge-locked { filter: grayscale(1); opacity: 0.45; }
  `}</style>
);

/* ---------------------------------- MOCK DATA ---------------------------------- */
const initialEmployees = [];

const initialManagers = [];

const initialModules = [];

const initialClassTrainings = [];

const initialNotifications = [];

const initialMonthlyFeedback = [];
const initialCoachingSessions = [];

const initialAssignments = [];

const initialPending = [];

const initialQuiz = [];

function badgeForPoints(points) {
  if (points >= 600) return { label: "Gold", color: "var(--gold)" };
  if (points >= 300) return { label: "Silver", color: "#9AA7C7" };
  if (points >= 100) return { label: "Bronze", color: "#B08D57" };
  return { label: "Starter", color: "var(--slate)" };
}

const DEPARTMENTS = [
  { name: "Mass", color: "#0071CE" },
  { name: "Platinum", color: "#7A8699" },
  { name: "Centurion", color: "#0B2545" },
];
// Mutable live copy — starts as the seed list above, gets replaced with real
// data from Supabase on load, and grows when the admin adds a department.
// Components read this instead of the static DEPARTMENTS constant so new
// departments show up everywhere without threading a prop through the tree.
let LIVE_DEPARTMENTS = [...DEPARTMENTS];
const DEPT_COLOR_POOL = ["#0071CE", "#7A8699", "#0B2545", "#C9A24B", "#1F9D64", "#D6534A", "#7A5FC4", "#3AAFA9"];
function deptColor(name) {
  return LIVE_DEPARTMENTS.find(d => d.name === name)?.color || "var(--slate)";
}
function managerName(managers, managerId) {
  return managers.find(m => m.id === managerId)?.name || "Unassigned";
}
function formatActiveTime(activeSeconds, fallbackMin) {
  const totalMin = activeSeconds != null ? Math.round(activeSeconds / 60) : (fallbackMin || 0);
  if (totalMin < 60) return `${totalMin} min actual time`;
  return `${Math.floor(totalMin / 60)}h ${totalMin % 60}m actual time`;
}
function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}
function isDeadlineWeek() {
  const day = new Date().getDate();
  return day >= 15 && day <= 21;
}
function topEmployeeOfDept(employees, dept) {
  const inDept = employees.filter(e => e.dept === dept);
  if (inDept.length === 0) return null;
  return inDept.reduce((top, e) => (e.points > top.points ? e : top), inDept[0]);
}
function isEndorsedThisMonth(endorsements, employeeId) {
  return endorsements.some(en => en.employeeId === employeeId && en.month === currentMonthKey());
}
const PASSWORD_GUIDELINE = "At least 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character.";
function isValidPassword(pw) {
  return pw.length >= 8 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw);
}
function generateTempPassword() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ", lower = "abcdefghijkmnpqrstuvwxyz", digits = "23456789", special = "!@#$%&*";
  const pick = (s) => s[Math.floor(Math.random() * s.length)];
  let pw = pick(upper) + pick(lower) + pick(digits) + pick(special) + pick(upper) + pick(lower) + pick(digits);
  return pw.split("").sort(() => Math.random() - 0.5).join("");
}

/* ---------------------------------- SESSION PERSISTENCE (20-min inactivity timeout) ---------------------------------- */
// NOTE: uses localStorage, which only works once this runs as a real deployed
// site (Vercel etc.) — the sandboxed live-preview inside chat does not
// support browser storage, so session persistence can't be demonstrated
// there. It works correctly once deployed.
const SESSION_KEY = "amplify_session";
const SESSION_TIMEOUT_MS = 20 * 60 * 1000;

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (Date.now() - s.lastActivity > SESSION_TIMEOUT_MS) { localStorage.removeItem(SESSION_KEY); return null; }
    return s;
  } catch { return null; }
}
function saveSession(session) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, lastActivity: Date.now() })); } catch {}
}
function touchSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    s.lastActivity = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {}
}
function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

/* ---------------------------------- SUPABASE CONNECTION (plain fetch — no SDK needed) ---------------------------------- */
const SUPABASE_URL = "https://xnkzlelbhaezkzufonjt.supabase.co";
const SUPABASE_KEY = "sb_publishable_cZd3LZ3MD_RXBqub6SYWWg_LbyU1Qd7";
const sbHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

async function sbSelect(table, query = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: sbHeaders });
  if (!res.ok) { const body = await res.text().catch(() => ""); throw new Error(`${table} select failed (${res.status}): ${body}`); }
  return res.json();
}
async function sbInsert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...sbHeaders, Prefer: "return=representation" },
    body: JSON.stringify(rows),
  });
  if (!res.ok) { const body = await res.text().catch(() => ""); throw new Error(`${table} insert failed (${res.status}): ${body}`); }
  return res.json();
}
async function sbDelete(table, column, value) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, { method: "DELETE", headers: sbHeaders });
  if (!res.ok) { const body = await res.text().catch(() => ""); throw new Error(`${table} delete failed (${res.status}): ${body}`); }
}
async function sbUpdate(table, column, value, patch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, {
    method: "PATCH",
    headers: { ...sbHeaders, Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) { const body = await res.text().catch(() => ""); throw new Error(`${table} update failed (${res.status}): ${body}`); }
  return res.json();
}

const STORAGE_BUCKET = "training-files";
async function sbUploadFile(file, folder = "modules") {
  const path = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) { const body = await res.text().catch(() => ""); throw new Error(`File upload failed (${res.status}): ${body}`); }
  return { path, url: `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`, name: file.name, type: file.type, size: file.size };
}
async function sbDeleteFile(path) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`, {
    method: "DELETE",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) { const body = await res.text().catch(() => ""); throw new Error(`File delete failed (${res.status}): ${body}`); }
}

// Convert between the app's simple shape ({name, dept, managerId, ...})
// and the database's shape ({first_name, last_name, department_id, manager_id, ...})
function splitName(fullName) {
  const parts = fullName.trim().split(" ");
  return { first_name: parts[0] || "", last_name: parts.slice(1).join(" ") || "" };
}
function toDbEmployee(appEmp, deptNameToId) {
  const { first_name, last_name } = splitName(appEmp.name);
  return {
    first_name, last_name, email: appEmp.email,
    department_id: deptNameToId[appEmp.dept] || null,
    manager_id: appEmp.managerId || null,
    role: appEmp.role, points: appEmp.points || 0, streak: appEmp.streak || 0,
    status: appEmp.status || "active", password: appEmp.password,
  };
}
function fromDbEmployee(row, deptIdToName) {
  return {
    id: row.id, name: `${row.first_name} ${row.last_name}`.trim(), email: row.email,
    dept: deptIdToName[row.department_id] || LIVE_DEPARTMENTS[0].name,
    managerId: row.manager_id, role: row.role, points: row.points, streak: row.streak,
    status: row.status, password: row.password,
  };
}
function fromDbPending(row, deptIdToName) {
  return {
    id: row.id, name: `${row.first_name} ${row.last_name}`.trim(), email: row.email,
    dept: deptIdToName[row.department_id] || LIVE_DEPARTMENTS[0].name,
    managerId: row.requested_manager_id, requestedAt: row.requested_at?.slice(0, 10) || "recently",
    password: row.password, requestedRole: row.requested_role || "trainee",
  };
}

// --- Modules & quizzes ---
function fromDbModule(row) {
  return { id: row.id, title: row.title, desc: row.description || "", points: row.points, mandatory: row.mandatory, hasQuiz: row.has_quiz, attachments: [], createdAt: row.created_at };
}
function fromDbAttachment(row) {
  return { id: row.id, name: row.file_name, url: `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${row.storage_path}`, path: row.storage_path, type: row.file_type, size: row.file_size_bytes, moduleId: row.module_id };
}
function fromDbQuizQuestion(row) {
  return { id: row.id, q: row.question, options: row.options, correct: row.correct_index };
}
// --- Assignments ---
function fromDbAssignment(row) {
  return { id: row.id, employeeId: row.employee_id, moduleId: row.module_id, progress: row.progress, timeSpentMin: row.time_spent_minutes, quizScore: row.quiz_score, status: row.status, passThreshold: row.pass_threshold ?? 80, attempts: row.attempts || 0, activeSeconds: row.active_seconds || 0, assignedAt: row.assigned_at };
}
// --- Class trainings (nested: sessions, enrollments, comments) ---
function assembleClassTrainings(classRows, sessionRows, enrollRows, commentRows) {
  return classRows.map(c => ({
    id: c.id, name: c.name, date: c.class_date, quizEnabled: c.quiz_enabled,
    sessions: sessionRows.filter(s => s.class_id === c.id).map(s => ({ date: s.session_date, hours: Number(s.hours) })),
    enrollments: enrollRows.filter(e => e.class_id === c.id).map(e => ({
      employeeId: e.employee_id, quizScore: e.quiz_score,
      comments: commentRows.filter(cm => cm.enrollment_id === e.id).map(cm => ({ text: cm.comment, date: cm.created_at?.slice(0, 10) })),
      _enrollmentDbId: e.id,
    })),
  }));
}
// --- Notifications, feedback, endorsements, coaching ---
function fromDbNotification(row) {
  return { id: row.id, text: row.message, audience: row.audience || "admin", recipientId: row.recipient_id, date: row.created_at?.slice(0, 10) };
}
function fromDbMonthlyFeedback(row) {
  return { id: row.id, managerId: row.manager_id, employeeId: row.employee_id, month: row.month_key, needsTraining: row.needs_training, comment: row.comment, submittedAt: row.submitted_at?.slice(0, 10) };
}
function fromDbEndorsement(row) {
  return { employeeId: row.employee_id, managerId: row.manager_id, month: row.month_key };
}
function fromDbCoaching(row) {
  return { id: row.id, employeeId: row.employee_id, managerId: row.manager_id, category: row.category, notes: row.notes, escalated: row.escalated, date: row.session_date };
}
function fromDbTrainingRequest(row) {
  return { id: row.id, managerId: row.manager_id, title: row.title, reason: row.reason, suggestedDate: row.suggested_date, status: row.status, requestedAt: row.requested_at?.slice(0, 10) };
}
function fromDbReport(row) {
  return { id: row.id, fileName: row.file_name, question: row.question, analysis: row.analysis, date: row.created_at?.slice(0, 10), fileUrl: row.storage_path ? `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${row.storage_path}` : null };
}
function fromDbCelebration(row) {
  return { id: row.id, title: row.title, description: row.description, category: row.category, date: row.created_at?.slice(0, 10) };
}

const DeptBadge = ({ dept }) => (
  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: deptColor(dept) + "18", color: deptColor(dept) }}>
    {dept}
  </span>
);

/* ---------------------------------- SMALL UI PIECES ---------------------------------- */
const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="tp-card p-4 flex items-center gap-3">
    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: accent + "20" }}>
      <Icon size={18} color={accent} />
    </div>
    <div>
      <div className="text-xs tp-slate-text">{label}</div>
      <div className="text-lg font-bold tp-display tp-navy-text">{value}</div>
    </div>
  </div>
);

const ProgressBar = ({ value }) => (
  <div className="tp-progress-track h-2 w-full">
    <div className="tp-progress-fill h-2" style={{ width: `${value}%` }} />
  </div>
);

const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 p-1 tp-card mb-4 overflow-x-auto tp-scrollbar">
    {tabs.map(t => (
      <button key={t.key} onClick={() => onChange(t.key)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${active === t.key ? "tp-tab-active" : "tp-tab hover:bg-gray-50"}`}>
        <t.icon size={15} /> {t.label}
      </button>
    ))}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
    <div className="tp-card tp-pop w-full max-w-md p-5 max-h-[85vh] overflow-y-auto tp-scrollbar">
      <div className="flex items-center justify-between mb-4">
        <h3 className="tp-display font-bold text-lg">{title}</h3>
        <button onClick={onClose}><X size={18} className="tp-slate-text" /></button>
      </div>
      {children}
    </div>
  </div>
);

/* ---------------------------------- ADMIN VIEW ---------------------------------- */
function AdminView({ state, actions }) {
  const managers = state.employees.filter(e => e.role === "manager");
  const [tab, setTab] = useState("overview");
  const [showNewModule, setShowNewModule] = useState(false);
  const [showQuizBuilder, setShowQuizBuilder] = useState(null);
  const [newModule, setNewModule] = useState({ title: "", desc: "", points: 50, mandatory: false, attachments: [] });
  const [quizDraft, setQuizDraft] = useState([{ q: "", options: ["", "", "", ""], correct: 0 }]);
  const [qbAiContent, setQbAiContent] = useState("");
  const [qbAiGenerating, setQbAiGenerating] = useState(false);
  const [qbAiError, setQbAiError] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkFileName, setBulkFileName] = useState("");
  const [bulkError, setBulkError] = useState("");
  const [reportFileName, setReportFileName] = useState("");
  const [reportFileObj, setReportFileObj] = useState(null);
  const [reportContent, setReportContent] = useState("");
  const [reportQuestion, setReportQuestion] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [newDeptName, setNewDeptName] = useState("");
  const [celebTitle, setCelebTitle] = useState("");
  const [celebDesc, setCelebDesc] = useState("");
  const [celebCategory, setCelebCategory] = useState("achievement");
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deletePasswordInput, setDeletePasswordInput] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [viewAsRole, setViewAsRole] = useState("manager");
  const [viewAsId, setViewAsId] = useState("");
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachError, setAttachError] = useState("");

  const handleReportFile = (file) => {
    setReportFileName(file.name);
    setReportFileObj(file);
    const ext = file.name.split(".").pop().toLowerCase();
    if (["xlsx", "xls", "csv"].includes(ext)) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const wb = XLSX.read(evt.target.result, { type: "array" });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const csv = XLSX.utils.sheet_to_csv(sheet);
          setReportContent(csv.slice(0, 6000));
        } catch { /* leave for manual paste */ }
      };
      reader.readAsArrayBuffer(file);
    }
    // PDFs/images/docs: no in-browser parser available here — admin pastes key content below.
  };

  const analyzeReport = async () => {
    if (!reportContent.trim() || !reportQuestion.trim()) return;
    setAnalyzing(true); setAnalyzeError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          messages: [{ role: "user", content: `You are analyzing a workplace training/performance report for a manager at a financial services company. Answer the specific question below based only on the report content provided. Be concise and concrete, use bullet points where helpful.\n\nQuestion: ${reportQuestion}\n\nReport content:\n${reportContent}` }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).map(c => c.text || "").join("");
      let fileInfo = {};
      if (reportFileObj) {
        try { const uploaded = await sbUploadFile(reportFileObj, "reports"); fileInfo = { storagePath: uploaded.path, fileSize: uploaded.size, fileUrl: uploaded.url }; }
        catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't upload the report file: ${err.message}` })); }
      }
      actions.saveReport({ fileName: reportFileName || "Pasted content", question: reportQuestion, analysis: text, ...fileInfo });
      setReportQuestion(""); setReportFileObj(null);
    } catch (err) {
      setAnalyzeError("Couldn't analyze that report — try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const parseBulkFile = (file) => {
    setBulkError(""); setBulkFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        const parsed = rows.map(r => {
          const get = (...keys) => { for (const k of keys) { const found = Object.keys(r).find(rk => rk.toLowerCase().trim() === k); if (found) return String(r[found]).trim(); } return ""; };
          const first = get("first name", "firstname");
          const last = get("last name", "lastname");
          const email = get("email", "work email", "e-mail");
          const dept = get("department", "category");
          const mgr = get("manager", "manager name");
          const matchedMgr = managers.find(m => m.name.toLowerCase().includes(mgr.toLowerCase()) || mgr.toLowerCase().includes(m.name.toLowerCase()));
          const matchedDept = LIVE_DEPARTMENTS.find(d => d.name.toLowerCase() === dept.toLowerCase())?.name || LIVE_DEPARTMENTS[0].name;
          return { name: `${first} ${last}`.trim(), email, dept: matchedDept, managerId: matchedMgr?.id || managers[0]?.id, managerLabel: matchedMgr?.name || `Unmatched — defaulting to ${managers[0]?.name}` };
        }).filter(r => r.name);
        if (parsed.length === 0) setBulkError("No valid rows found. Make sure the sheet has First Name, Last Name, Email, Department, and Manager columns.");
        setBulkRows(parsed);
      } catch (err) {
        setBulkError("Couldn't read that file — make sure it's a valid .xlsx or .csv.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const confirmBulkImport = () => {
    actions.bulkImportEmployees(bulkRows);
    setBulkRows([]); setBulkFileName("");
  };

  const generateQuizForModule = async (moduleId) => {
    const mod = state.modules.find(m => m.id === moduleId);
    const content = qbAiContent.trim() || `${mod?.title || ""}. ${mod?.desc || ""}`;
    if (!content.trim()) { setQbAiError("Add a title/description to the module, or paste some content above, first."); return; }
    setQbAiGenerating(true); setQbAiError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are creating a multiple-choice quiz for an employee training module at a financial services company in Saudi Arabia. Based on the training content below, write exactly 5 quiz questions, each with 4 answer options and exactly one correct answer. Respond ONLY with valid JSON and nothing else — no markdown fences, no preamble — in this exact shape: [{"q": "question text", "options": ["a","b","c","d"], "correct": 0}]. Training content:\n\n${content}`
          }]
        })
      });
      const data = await res.json();
      const textOut = (data.content || []).map(c => c.text || "").join("");
      const clean = textOut.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQuizDraft(parsed);
    } catch (err) {
      setQbAiError("Couldn't generate questions automatically — try adding more content, or write them manually below.");
    } finally {
      setQbAiGenerating(false);
    }
  };

  const handleQuickUpload = async (file) => {
    setGenerating(true); setGenError("");
    try {
      const uploaded = await sbUploadFile(file, "modules");
      const title = file.name.replace(/\.[^.]+$/, "");
      let extractedText = "";
      const ext = file.name.split(".").pop().toLowerCase();
      if (["xlsx", "xls", "csv"].includes(ext)) {
        extractedText = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            try {
              const wb = XLSX.read(evt.target.result, { type: "array" });
              const sheet = wb.Sheets[wb.SheetNames[0]];
              resolve(XLSX.utils.sheet_to_csv(sheet).slice(0, 2000));
            } catch { resolve(""); }
          };
          reader.onerror = () => resolve("");
          reader.readAsArrayBuffer(file);
        });
      }
      const created = await actions.addModule({ title, desc: extractedText.slice(0, 300), points: 50, mandatory: false, attachments: [uploaded] });
      setQuizDraft([{ q: "", options: ["", "", "", ""], correct: 0 }]);
      setQbAiContent(extractedText);
      setQbAiError("");
      setShowQuizBuilder(created.id);
    } catch (err) {
      setGenError(`Couldn't upload the file: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const totalEmployees = state.employees.length;
  const completedCount = state.assignments.filter(a => a.status === "completed").length;
  const avgScore = Math.round(
    state.assignments.filter(a => a.quizScore != null).reduce((s, a) => s + a.quizScore, 0) /
    (state.assignments.filter(a => a.quizScore != null).length || 1)
  );

  const exportCSV = () => {
    const rows = [["Employee", "Department", "Module", "Progress %", "Time Spent (min)", "Quiz Score", "Status"]];
    state.assignments.forEach(a => {
      const emp = state.employees.find(e => e.id === a.employeeId);
      const mod = state.modules.find(m => m.id === a.moduleId);
      rows.push([emp?.name, emp?.dept, mod?.title, a.progress, a.timeSpentMin, a.quizScore ?? "N/A", a.status]);
    });
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "training_analytics.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const submitModule = () => {
    if (!newModule.title.trim()) return;
    actions.addModule({ id: Date.now(), ...newModule });
    setNewModule({ title: "", desc: "", points: 50, mandatory: false, attachments: [] });
    setShowNewModule(false);
  };

  const saveQuiz = () => {
    actions.saveQuiz(showQuizBuilder, quizDraft.filter(q => q.q.trim()));
    setShowQuizBuilder(null);
    setQuizDraft([{ q: "", options: ["", "", "", ""], correct: 0 }]);
  };

  return (
    <div>
      <Tabs active={tab} onChange={setTab} tabs={[
        { key: "overview", label: "Overview", icon: LayoutDashboard },
        { key: "content", label: "Content & Quizzes", icon: BookOpen },
        { key: "classes", label: "In-Class Training", icon: Users },
        { key: "approvals", label: "Approvals", icon: ClipboardCheck },
        { key: "analytics", label: "Analytics", icon: BarChart3 },
        { key: "reports", label: "Reports & Analysis", icon: FileText },
        { key: "celebrations", label: "Celebrations", icon: Trophy },
        { key: "files", label: "Files", icon: Paperclip },
        { key: "viewas", label: "View As", icon: UserCog },
        { key: "activity", label: "Activity Log", icon: Clock },
      ]} />

      {tab === "overview" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <StatCard icon={Users} label="Employees" value={totalEmployees} accent="var(--blue)" />
            <StatCard icon={CheckCircle2} label="Completions" value={completedCount} accent="var(--green)" />
            <StatCard icon={Target} label="Avg Quiz Score" value={`${avgScore || 0}%`} accent="var(--gold)" />
            <StatCard icon={ClipboardCheck} label="Pending Approvals" value={state.pending.length} accent="var(--red)" />
          </div>
          <div className="tp-card p-4 mb-4">
            <div className="font-semibold mb-3 text-sm flex items-center gap-2"><AlertTriangle size={15} className="tp-red-text" /> Escalated for intervention</div>
            {state.coachingSessions.filter(s => s.escalated).length === 0 && <div className="text-xs tp-slate-text">No open escalations.</div>}
            <div className="grid gap-2">
              {state.coachingSessions.filter(s => s.escalated).map(s => {
                const emp = state.employees.find(e => e.id === s.employeeId);
                const mgr = managers.find(m => m.id === s.managerId);
                return (
                  <div key={s.id} className="p-2 rounded-lg" style={{ background: "#D6534A10" }}>
                    <div className="text-sm font-medium flex items-center gap-2">{emp?.name} <span className="text-xs tp-slate-text">· {s.category} · flagged by {mgr?.name}</span></div>
                    <div className="text-xs tp-slate-text mt-1">{s.notes}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="tp-card p-4 mb-4">
            <div className="font-semibold mb-3 text-sm flex items-center gap-2"><Crown size={15} className="tp-gold-text" /> Top performer by department — this month</div>
            <div className="grid gap-2">
              {LIVE_DEPARTMENTS.map(d => {
                const top = topEmployeeOfDept(state.employees, d.name);
                if (!top || top.points === 0) return (
                  <div key={d.name} className="flex items-center justify-between p-2 rounded-lg tp-ice-bg">
                    <DeptBadge dept={d.name} /><span className="text-xs tp-slate-text">No activity yet</span>
                  </div>
                );
                const endorsed = isEndorsedThisMonth(state.endorsements, top.id);
                return (
                  <div key={d.name} className="flex items-center justify-between p-2 rounded-lg tp-ice-bg">
                    <div className="flex items-center gap-2">
                      <DeptBadge dept={d.name} />
                      <span className="text-sm font-medium">{top.name}</span>
                      <span className="text-xs tp-slate-text">{top.points} pts</span>
                    </div>
                    {endorsed
                      ? <span className="text-xs tp-green-text font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Endorsed</span>
                      : <span className="text-xs tp-slate-text">Pending manager endorsement</span>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="tp-card p-4">
            <div className="font-semibold mb-3 text-sm">Employees by department</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {LIVE_DEPARTMENTS.map(d => {
                const count = state.employees.filter(e => e.dept === d.name).length;
                return (
                  <div key={d.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: d.color + "15" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs font-medium" style={{ color: d.color }}>{d.name}</span>
                    <span className="text-xs tp-slate-text">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 pt-2" style={{ borderTop: "1px dashed var(--line)" }}>
              <input className="tp-input w-auto text-sm" placeholder="New department name" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} />
              <button onClick={() => { if (newDeptName.trim()) { actions.addDepartment(newDeptName.trim()); setNewDeptName(""); } }}
                className="tp-btn-primary rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1">
                <PlusCircle size={14} /> Add department
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "content" && (
        <div>
          <div className="tp-card p-4 mb-4">
            <div className="font-semibold mb-1 flex items-center gap-2"><Sparkles size={16} className="tp-gold-text" /> Quick upload — any file type</div>
            <p className="text-xs tp-slate-text mb-3">Select a file — PowerPoint, PDF, Excel, image, or doc — and it uploads immediately as a new module, no conversion, nothing else required. The quiz builder opens right after so you can generate one with AI or write it yourself.</p>
            <input type="file" disabled={generating} onChange={e => e.target.files[0] && handleQuickUpload(e.target.files[0])}
              className="text-xs mb-2 block" />
            {generating && <div className="text-xs tp-blue-text">Uploading…</div>}
            {genError && <div className="text-xs tp-red-text mt-2">{genError}</div>}
          </div>

          <button onClick={() => setShowNewModule(true)} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 mb-4">
            <PlusCircle size={16} /> New training module (manual)
          </button>
          <div className="grid gap-3">
            {state.modules.map(m => (
              <div key={m.id} className="tp-card p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold flex items-center gap-2">{m.title}
                    {m.mandatory && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full tp-red-text" style={{ background: "#D6534A18" }}>Mandatory</span>}
                  </div>
                  <div className="text-sm tp-slate-text">{m.desc}</div>
                  <div className="text-xs tp-gold-text font-medium mt-1 flex items-center gap-1"><Star size={12} /> {m.points} pts</div>
                  {m.attachments?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {m.attachments.map((f, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full tp-ice-bg tp-blue-text flex items-center gap-1">
                          <a href={f.url} download={f.name} className="flex items-center gap-1"><Paperclip size={11} /> {f.name}</a>
                          <button onClick={() => { if (window.confirm(`Delete "${f.name}"?`)) actions.deleteAttachment(m.id, f); }} className="tp-red-text ml-1"><X size={11} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {m.hasQuiz && (
                    <button onClick={() => { if (window.confirm(`Delete the quiz for "${m.title}"?`)) actions.deleteQuiz(m.id); }} className="text-xs tp-red-text hover:underline">
                      Delete quiz
                    </button>
                  )}
                  <button onClick={() => { setQuizDraft(state.quizzes[m.id]?.length ? state.quizzes[m.id] : [{ q: "", options: ["", "", "", ""], correct: 0 }]); setQbAiContent(""); setQbAiError(""); setShowQuizBuilder(m.id); }}
                    className="text-sm tp-blue-text font-medium flex items-center gap-1">
                    {m.hasQuiz ? "Edit quiz" : "Add quiz"} <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "classes" && (
        <ClassTrainingSection state={state} actions={actions} scope="admin" actorName="You (Admin)" />
      )}

      {tab === "approvals" && (
        <div>
          <div className="tp-card p-4 mb-6">
            <div className="font-semibold mb-1 flex items-center gap-2"><Upload size={16} className="tp-blue-text" /> Mass enrollment via Excel/CSV</div>
            <p className="text-xs tp-slate-text mb-3">Upload a spreadsheet with columns: First Name, Last Name, Email, Department (Mass/Platinum/Centurion), Manager. Employees are added directly — no individual approval needed since you're uploading the list yourself.</p>
            <input type="file" accept=".xlsx,.xls,.csv" className="text-xs" onChange={e => e.target.files[0] && parseBulkFile(e.target.files[0])} />
            {bulkError && <div className="text-xs tp-red-text mt-2">{bulkError}</div>}
            {bulkRows.length > 0 && (
              <div className="mt-3">
                <div className="text-xs tp-slate-text mb-2">{bulkFileName} · {bulkRows.length} employees found</div>
                <div className="tp-card overflow-x-auto tp-scrollbar mb-3">
                  <table className="w-full text-xs">
                    <thead><tr className="text-left tp-slate-text border-b" style={{ borderColor: "var(--line)" }}>
                      <th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Department</th><th className="p-2">Manager</th>
                    </tr></thead>
                    <tbody>
                      {bulkRows.map((r, i) => (
                        <tr key={i} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                          <td className="p-2">{r.name}</td><td className="p-2 tp-slate-text">{r.email || "—"}</td><td className="p-2"><DeptBadge dept={r.dept} /></td><td className="p-2">{r.managerLabel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={confirmBulkImport} className="tp-btn-gold rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2">
                  <Users size={15} /> Confirm — enroll {bulkRows.length} employees
                </button>
              </div>
            )}
          </div>

          {state.credentialsToShare.length > 0 && (
            <div className="tp-card p-4 mb-6" style={{ borderColor: "var(--gold)" }}>
              <div className="font-semibold mb-1 flex items-center gap-2"><Shield size={16} className="tp-gold-text" /> New login passwords for bulk-imported employees</div>
              <p className="text-xs tp-slate-text mb-3">These were imported directly, not self-registered, so a temporary password was generated for them. Share it once, then dismiss. (Employees who sign themselves up choose their own password — nothing to share for those.)</p>
              <div className="grid gap-2">
                {state.credentialsToShare.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded-lg tp-ice-bg">
                    <span className="text-sm font-medium">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="tp-display font-bold text-base tracking-wide tp-navy-text">{c.password}</span>
                      <button onClick={() => actions.dismissCredential(c.id)} className="text-xs tp-slate-text hover:tp-red-text"><X size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-3 mb-6">
            {state.pending.length === 0 && <div className="tp-slate-text text-sm">No pending sign-ups.</div>}
            {state.pending.map(p => (
              <div key={p.id} className="tp-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <DeptBadge dept={p.dept} />
                      {p.requestedRole === "manager" && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full tp-blue-text" style={{ background: "#0071CE18" }}>Applied as Manager</span>}
                      <span className="text-xs tp-slate-text">requested {p.requestedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select id={`role-${p.id}`} defaultValue={p.requestedRole || "trainee"} className="tp-input text-sm w-auto">
                    <option value="trainee">Trainee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin (my team)</option>
                  </select>
                  <select id={`mgr-${p.id}`} defaultValue={p.managerId || managers[0]?.id} className="tp-input text-sm w-auto">
                    {managers.map(m => <option key={m.id} value={m.id}>Manager: {m.name}</option>)}
                  </select>
                  <button onClick={() => actions.approve(p.id, document.getElementById(`role-${p.id}`).value, document.getElementById(`mgr-${p.id}`).value)}
                    className="tp-btn-primary rounded-lg px-3 py-1.5 text-sm flex items-center gap-1"><CheckCircle2 size={14} /> Approve</button>
                  <button onClick={() => actions.reject(p.id)}
                    className="rounded-lg px-3 py-1.5 text-sm tp-red-text border border-red-200 flex items-center gap-1"><XCircle size={14} /> Reject</button>
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold text-sm mb-2 flex items-center gap-2"><Users size={15} /> Employee directory — manager assignments</div>
          <div className="tp-card overflow-x-auto tp-scrollbar">
            <table className="w-full text-sm">
              <thead><tr className="text-left tp-slate-text border-b" style={{ borderColor: "var(--line)" }}>
                <th className="p-3">Employee</th><th className="p-3">Category</th><th className="p-3">Manager</th><th className="p-3"></th>
              </tr></thead>
              <tbody>
                {state.employees.filter(e => e.role === "trainee").map(e => (
                  <tr key={e.id} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                    <td className="p-3 font-medium">{e.name}</td>
                    <td className="p-3"><DeptBadge dept={e.dept} /></td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {!e.managerId && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full tp-red-text" style={{ background: "#D6534A18" }}>No manager</span>}
                        <select className="tp-input text-xs w-auto" value={e.managerId || ""} onChange={ev => actions.reassignManager(e.id, ev.target.value)}>
                          <option value="" disabled>Assign manager…</option>
                          {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="p-3">
                      <button onClick={() => { if (window.confirm(`Delete ${e.name}? This removes their account and all their training records.`)) actions.deleteUser(e.id); }}
                        className="text-xs tp-red-text hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="font-semibold text-sm mb-2 mt-6 flex items-center gap-2"><UserCog size={15} /> Managers</div>
          <div className="tp-card overflow-x-auto tp-scrollbar">
            <table className="w-full text-sm">
              <thead><tr className="text-left tp-slate-text border-b" style={{ borderColor: "var(--line)" }}>
                <th className="p-3">Manager</th><th className="p-3">Category</th><th className="p-3"></th>
              </tr></thead>
              <tbody>
                {managers.map(m => (
                  <tr key={m.id} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                    <td className="p-3 font-medium">{m.name}</td>
                    <td className="p-3"><DeptBadge dept={m.dept} /></td>
                    <td className="p-3">
                      <button onClick={() => { if (window.confirm(`Delete ${m.name}? Their team will need a new manager assigned.`)) actions.deleteUser(m.id); }}
                        className="text-xs tp-red-text hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "analytics" && (
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button onClick={exportCSV} className="tp-btn-gold rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2">
              <FileSpreadsheet size={16} /> Export to Excel (CSV)
            </button>
            <select className="tp-input w-auto text-sm" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="all">All departments</option>
              {LIVE_DEPARTMENTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div className="tp-card overflow-x-auto tp-scrollbar">
            <table className="w-full text-sm">
              <thead><tr className="text-left tp-slate-text border-b" style={{ borderColor: "var(--line)" }}>
                <th className="p-3">Employee</th><th className="p-3">Department</th><th className="p-3">Module</th><th className="p-3">Progress</th>
                <th className="p-3">Time (min)</th><th className="p-3">Quiz Score</th>
              </tr></thead>
              <tbody>
                {state.assignments.filter(a => {
                  const emp = state.employees.find(e => e.id === a.employeeId);
                  return deptFilter === "all" || emp?.dept === deptFilter;
                }).map(a => {
                  const emp = state.employees.find(e => e.id === a.employeeId);
                  const mod = state.modules.find(m => m.id === a.moduleId);
                  return (
                    <tr key={a.id} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                      <td className="p-3 font-medium">{emp?.name}</td>
                      <td className="p-3"><DeptBadge dept={emp?.dept} /></td>
                      <td className="p-3">{mod?.title}</td>
                      <td className="p-3 w-32"><ProgressBar value={a.progress} /></td>
                      <td className="p-3">{a.timeSpentMin}</td>
                      <td className="p-3">{a.quizScore != null ? `${a.quizScore}%` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "reports" && (
        <div>
          <div className="tp-card p-4 mb-4">
            <div className="font-semibold mb-1 flex items-center gap-2"><FileText size={16} className="tp-blue-text" /> Upload a report for analysis</div>
            <p className="text-xs tp-slate-text mb-3">Upload any file type — Excel/CSV auto-reads its contents; for PDFs, images, or docs, paste the key content below so it can be analyzed. Then ask a specific question.</p>
            <input type="file" className="text-xs mb-2 block" onChange={e => e.target.files[0] && handleReportFile(e.target.files[0])} />
            {reportFileName && <div className="text-xs tp-blue-text mb-2">Selected: {reportFileName}</div>}
            <textarea className="tp-input" rows={4} placeholder="Report content (auto-filled for Excel/CSV, or paste text here for other file types)"
              value={reportContent} onChange={e => setReportContent(e.target.value)} />
            <label className="text-xs tp-slate-text mt-2 block">What do you want to know?</label>
            <input className="tp-input" placeholder='e.g. "Which department has the lowest quiz completion rate and why?"'
              value={reportQuestion} onChange={e => setReportQuestion(e.target.value)} />
            <button onClick={analyzeReport} disabled={analyzing || !reportContent.trim() || !reportQuestion.trim()}
              className="tp-btn-gold rounded-lg px-4 py-2 text-sm font-semibold mt-3 flex items-center gap-2 disabled:opacity-40">
              <Sparkles size={15} /> {analyzing ? "Analyzing…" : "Analyze with AI"}
            </button>
            {analyzeError && <div className="text-xs tp-red-text mt-2">{analyzeError}</div>}
          </div>

          <div className="grid gap-3">
            {(!state.reports || state.reports.length === 0) && <div className="text-sm tp-slate-text">No analyses yet.</div>}
            {state.reports?.map(r => (
              <div key={r.id} className="tp-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full tp-ice-bg tp-blue-text">{r.fileName}</span>
                  <span className="text-xs tp-slate-text">{r.date}</span>
                </div>
                <div className="text-sm font-medium mb-2">{r.question}</div>
                <div className="text-sm tp-slate-text whitespace-pre-wrap">{r.analysis}</div>
                {r.fileUrl && (
                  <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-xs tp-blue-text font-medium flex items-center gap-1 mt-2">
                    <Paperclip size={11} /> View original file
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "celebrations" && (
        <div>
          <div className="tp-card p-4 mb-4">
            <div className="font-semibold mb-2 flex items-center gap-2"><Trophy size={16} className="tp-gold-text" /> Post a celebration</div>
            <div className="grid gap-2">
              <input className="tp-input" placeholder="Title (e.g. 'Sara — Top Performer, Mass, July')" value={celebTitle} onChange={e => setCelebTitle(e.target.value)} />
              <textarea className="tp-input" rows={2} placeholder="Description" value={celebDesc} onChange={e => setCelebDesc(e.target.value)} />
              <select className="tp-input w-auto" value={celebCategory} onChange={e => setCelebCategory(e.target.value)}>
                <option value="achievement">Achievement</option>
                <option value="top_performer">Top Performer</option>
                <option value="event">Event</option>
                <option value="team_win">Team Win</option>
              </select>
              <button onClick={() => { if (celebTitle.trim()) { actions.addCelebration(celebTitle.trim(), celebDesc.trim(), celebCategory); setCelebTitle(""); setCelebDesc(""); } }}
                className="tp-btn-gold rounded-lg px-4 py-2 text-sm font-semibold w-fit">Post — visible to everyone</button>
            </div>
          </div>
          <div className="grid gap-3">
            {state.celebrations.length === 0 && <div className="text-sm tp-slate-text">Nothing posted yet.</div>}
            {state.celebrations.map(c => (
              <div key={c.id} className="tp-card p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold flex items-center gap-2"><Crown size={14} className="tp-gold-text" /> {c.title}</div>
                  {c.description && <div className="text-sm tp-slate-text mt-1">{c.description}</div>}
                  <div className="text-xs tp-slate-text mt-1">{c.date}</div>
                </div>
                <button onClick={() => actions.deleteCelebration(c.id)} className="text-xs tp-red-text hover:underline">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "files" && (
        <div>
          <div className="font-semibold text-sm mb-3">All uploaded files — training material, reports, analysis files</div>
          <div className="grid gap-2">
            {state.modules.flatMap(m => (m.attachments || []).map(f => ({ ...f, source: `Module: ${m.title}`, kind: "attachment", moduleId: m.id }))).map((f, i) => (
              <div key={`att-${i}`} className="tp-card p-3 flex items-center justify-between">
                <div className="text-sm flex items-center gap-2"><Paperclip size={14} className="tp-blue-text" /> {f.name} <span className="text-xs tp-slate-text">· {f.source}</span></div>
                <button onClick={() => setFileToDelete(f)} className="text-xs tp-red-text hover:underline">Delete</button>
              </div>
            ))}
            {state.reports.filter(r => r.fileUrl).map(r => (
              <div key={`rep-${r.id}`} className="tp-card p-3 flex items-center justify-between">
                <div className="text-sm flex items-center gap-2"><FileText size={14} className="tp-blue-text" /> {r.fileName} <span className="text-xs tp-slate-text">· Report analysis</span></div>
                <button onClick={() => setFileToDelete({ ...r, kind: "report" })} className="text-xs tp-red-text hover:underline">Delete</button>
              </div>
            ))}
            {state.modules.every(m => !m.attachments?.length) && state.reports.every(r => !r.fileUrl) && (
              <div className="text-sm tp-slate-text">No files uploaded yet.</div>
            )}
          </div>
        </div>
      )}

      {fileToDelete && (
        <Modal title="Confirm deletion" onClose={() => { setFileToDelete(null); setDeletePasswordInput(""); setDeleteError(""); }}>
          <div className="grid gap-2">
            <div className="text-sm">Delete <span className="font-semibold">{fileToDelete.name || fileToDelete.fileName}</span>? This can't be undone.</div>
            <label className="text-xs tp-slate-text">Confirm your admin password</label>
            <input type="password" className="tp-input" value={deletePasswordInput} onChange={e => setDeletePasswordInput(e.target.value)} />
            {deleteError && <div className="text-xs tp-red-text">{deleteError}</div>}
            <button onClick={() => {
              if (deletePasswordInput !== "Amex@1234") { setDeleteError("Incorrect password."); return; }
              if (fileToDelete.kind === "report") actions.deleteReport(fileToDelete.id);
              else actions.deleteAttachment(fileToDelete.moduleId, fileToDelete);
              setFileToDelete(null); setDeletePasswordInput(""); setDeleteError("");
            }} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium mt-1" style={{ background: "var(--red)" }}>Delete permanently</button>
          </div>
        </Modal>
      )}

      {tab === "viewas" && (
        <div>
          <div className="tp-card p-4 mb-4">
            <div className="font-semibold text-sm mb-2 flex items-center gap-2"><UserCog size={15} className="tp-blue-text" /> View exactly what a manager or trainee sees</div>
            <div className="flex flex-wrap items-center gap-2">
              <select className="tp-input w-auto text-sm" value={viewAsRole} onChange={e => { setViewAsRole(e.target.value); setViewAsId(""); }}>
                <option value="manager">Manager</option>
                <option value="trainee">Trainee</option>
              </select>
              <select className="tp-input w-auto text-sm" value={viewAsId} onChange={e => setViewAsId(e.target.value)}>
                <option value="">Select a person…</option>
                {(viewAsRole === "manager" ? managers : state.employees.filter(e => e.role === "trainee")).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          {viewAsId && viewAsRole === "manager" && <ManagerView state={state} managerId={viewAsId} actions={actions} />}
          {viewAsId && viewAsRole === "trainee" && <TraineeView state={state} employeeId={viewAsId} actions={actions} />}
        </div>
      )}

      {tab === "activity" && (
        <ActivityLogSection state={state} scope="admin" />
      )}

      {showNewModule && (
        <Modal title="New training module" onClose={() => setShowNewModule(false)}>
          <div className="grid gap-3">
            <input className="tp-input" placeholder="Title" value={newModule.title} onChange={e => setNewModule({ ...newModule, title: e.target.value })} />
            <textarea className="tp-input" placeholder="Description" rows={3} value={newModule.desc} onChange={e => setNewModule({ ...newModule, desc: e.target.value })} />
            <label className="text-xs tp-slate-text">Gamification points on completion</label>
            <input type="number" className="tp-input" value={newModule.points} onChange={e => setNewModule({ ...newModule, points: Number(e.target.value) })} />
            <label className="flex items-center gap-2 text-sm mt-1">
              <input type="checkbox" checked={newModule.mandatory} onChange={e => setNewModule({ ...newModule, mandatory: e.target.checked })} />
              Mandatory presence — employee must complete this training
            </label>
            <label className="text-xs tp-slate-text">Attach files (PDF, PPTX, images, docs — any type)</label>
            <input type="file" multiple className="text-xs" onChange={async e => {
              const files = Array.from(e.target.files);
              setUploadingAttachment(true); setAttachError("");
              try {
                const uploaded = await Promise.all(files.map(f => sbUploadFile(f, "modules")));
                setNewModule(nm => ({ ...nm, attachments: [...nm.attachments, ...uploaded] }));
              } catch (err) {
                setAttachError(`Couldn't upload file: ${err.message}`);
              } finally {
                setUploadingAttachment(false);
              }
            }} />
            {uploadingAttachment && <div className="text-xs tp-blue-text">Uploading…</div>}
            {attachError && <div className="text-xs tp-red-text">{attachError}</div>}
            {newModule.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newModule.attachments.map((f, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full tp-ice-bg flex items-center gap-1">
                    <Paperclip size={11} />
                    <a href={f.url} target="_blank" rel="noreferrer" className="tp-blue-text underline">{f.name}</a>
                    <button onClick={() => setNewModule({ ...newModule, attachments: newModule.attachments.filter((_, fi) => fi !== i) })}><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
            <button onClick={submitModule} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium mt-2">Create module</button>
          </div>
        </Modal>
      )}

      {showQuizBuilder && (
        <Modal title="Quiz builder" onClose={() => setShowQuizBuilder(null)}>
          <div className="grid gap-4">
            <div className="tp-card p-3" style={{ background: "#C9A24B10" }}>
              <div className="text-xs font-semibold mb-2 flex items-center gap-1"><Sparkles size={13} className="tp-gold-text" /> Generate questions with AI</div>
              <textarea className="tp-input mb-2" rows={3} placeholder="Paste or describe the training content to base the quiz on (or leave blank to use the module's title and description)"
                value={qbAiContent} onChange={e => setQbAiContent(e.target.value)} />
              <button onClick={() => generateQuizForModule(showQuizBuilder)} disabled={qbAiGenerating}
                className="tp-btn-gold rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-40">
                {qbAiGenerating ? "Generating…" : "Generate 5 questions with AI"}
              </button>
              {qbAiError && <div className="text-xs tp-red-text mt-2">{qbAiError}</div>}
            </div>
            {quizDraft.map((q, qi) => (
              <div key={qi} className="border rounded-lg p-3" style={{ borderColor: "var(--line)" }}>
                <input className="tp-input mb-2" placeholder={`Question ${qi + 1}`} value={q.q}
                  onChange={e => { const d = [...quizDraft]; d[qi].q = e.target.value; setQuizDraft(d); }} />
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2 mb-1">
                    <input type="radio" checked={q.correct === oi} onChange={() => { const d = [...quizDraft]; d[qi].correct = oi; setQuizDraft(d); }} />
                    <input className="tp-input" placeholder={`Option ${oi + 1}`} value={opt}
                      onChange={e => { const d = [...quizDraft]; d[qi].options[oi] = e.target.value; setQuizDraft(d); }} />
                  </div>
                ))}
              </div>
            ))}
            <button onClick={() => setQuizDraft([...quizDraft, { q: "", options: ["", "", "", ""], correct: 0 }])}
              className="text-sm tp-blue-text font-medium flex items-center gap-1"><PlusCircle size={14} /> Add question</button>
            <button onClick={saveQuiz} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Save quiz</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------------- MANAGER VIEW ---------------------------------- */
function ManagerView({ state, managerId, actions }) {
  const myName = state.employees.find(e => e.id === managerId)?.name;
  const [tab, setTab] = useState("team");
  const team = state.employees.filter(e => e.managerId === managerId);
  const [assignEmp, setAssignEmp] = useState(team[0]?.id || null);
  const [assignMod, setAssignMod] = useState(state.modules[0]?.id || null);
  const [assignPassThreshold, setAssignPassThreshold] = useState(80);

  useEffect(() => {
    if (new Date().getDate() > 21 && team.length > 0) {
      const monthKey = currentMonthKey();
      const missing = team.filter(e => !state.monthlyFeedback.some(f => f.managerId === managerId && f.employeeId === e.id && f.month === monthKey));
      if (missing.length > 0) actions.checkFeedbackOverdue(managerId, missing.map(e => e.name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managerId]);

  return (
    <div>
      <Tabs active={tab} onChange={setTab} tabs={[
        { key: "team", label: "My Team", icon: Users },
        { key: "assign", label: "Assign Training", icon: Send },
        { key: "library", label: "Training Library", icon: FileText },
        { key: "progress", label: "Progress", icon: TrendingUp },
        { key: "classes", label: "In-Class Training", icon: GraduationCap },
        { key: "coaching", label: "Coaching & Comments", icon: Headphones },
        { key: "feedback", label: "Monthly Feedback", icon: ClipboardCheck },
        { key: "activity", label: "Activity Log", icon: Clock },
      ]} />

      {tab === "team" && (
        <div>
          <CelebrationsBanner celebrations={state.celebrations} />
          <div className="grid gap-3">
          {team.map(e => {
            const badge = badgeForPoints(e.points);
            const isDeptTop = topEmployeeOfDept(state.employees, e.dept)?.id === e.id && e.points > 0;
            const endorsed = isEndorsedThisMonth(state.endorsements, e.id);
            return (
              <div key={e.id} className="tp-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="mt-1"><DeptBadge dept={e.dept} /></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: badge.color }}>
                    <Award size={14} /> {badge.label} · {e.points} pts
                  </div>
                </div>
                {isDeptTop && (
                  <div className="mt-3 pt-3 flex items-center justify-between flex-wrap gap-2" style={{ borderTop: "1px dashed var(--line)" }}>
                    <span className="text-xs font-semibold tp-gold-text flex items-center gap-1">
                      <Crown size={14} /> Currently #1 in {e.dept} this month
                    </span>
                    {endorsed ? (
                      <span className="text-xs tp-green-text font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> Endorsed as Top Employee</span>
                    ) : (
                      <button onClick={() => actions.endorseTopEmployee(e.id, managerId)} className="tp-btn-gold rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1">
                        <Crown size={13} /> Endorse as Top Employee of the Month
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      )}

      {tab === "assign" && (
        <div className="tp-card p-4 grid gap-3 max-w-md">
          <label className="text-xs tp-slate-text">Employee</label>
          <select className="tp-input" value={assignEmp} onChange={e => setAssignEmp(e.target.value)}>
            {team.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <label className="text-xs tp-slate-text">Training module</label>
          <select className="tp-input" value={assignMod} onChange={e => setAssignMod(e.target.value)}>
            {[...state.modules].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).map(m => <option key={m.id} value={m.id}>{m.title}{m.hasQuiz ? " (has quiz)" : ""}</option>)}
          </select>
          <label className="text-xs tp-slate-text">Passing score required {state.modules.find(m => m.id === assignMod)?.hasQuiz ? "" : "(no quiz on this module yet)"}</label>
          <input type="number" min={0} max={100} className="tp-input" value={assignPassThreshold} onChange={e => setAssignPassThreshold(Number(e.target.value))} />
          <p className="text-xs tp-slate-text -mt-1">They get 3 attempts. Falling short restarts the module; a 3rd miss auto-escalates to the admin team.</p>
          <button onClick={() => actions.assign(assignEmp, assignMod, myName, assignPassThreshold)} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 justify-center">
            <Send size={15} /> Assign module
          </button>
        </div>
      )}

      {tab === "library" && <TrainingLibrary modules={state.modules} />}

      {tab === "progress" && (
        <div className="tp-card overflow-x-auto tp-scrollbar">
          <table className="w-full text-sm">
            <thead><tr className="text-left tp-slate-text border-b" style={{ borderColor: "var(--line)" }}>
              <th className="p-3">Employee</th><th className="p-3">Module</th><th className="p-3">Progress</th>
              <th className="p-3"><Clock size={13} className="inline mr-1" />Time</th><th className="p-3">Quiz Score</th><th className="p-3"></th>
            </tr></thead>
            <tbody>
              {state.assignments.filter(a => team.some(t => t.id === a.employeeId)).map(a => {
                const emp = state.employees.find(e => e.id === a.employeeId);
                const mod = state.modules.find(m => m.id === a.moduleId);
                return (
                  <tr key={a.id} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                    <td className="p-3 font-medium">{emp?.name}</td>
                    <td className="p-3">{mod?.title}</td>
                    <td className="p-3 w-32"><ProgressBar value={a.progress} /></td>
                    <td className="p-3">{formatActiveTime(a.activeSeconds, a.timeSpentMin)}</td>
                    <td className="p-3">{a.quizScore != null ? `${a.quizScore}%` : "—"}</td>
                    <td className="p-3">
                      {a.status !== "completed" && (
                        <button onClick={() => actions.sendReminder(emp?.id, `Reminder from ${myName}: please finish "${mod?.title}".`)}
                          className="text-xs tp-blue-text hover:underline">Send reminder</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {tab === "classes" && (
        <ClassTrainingSection state={state} actions={actions} scope="manager" managerId={managerId} actorName={myName} />
      )}

      {tab === "coaching" && (
        <CoachingSection state={state} managerId={managerId} team={team} actions={actions} actorName={myName} />
      )}

      {tab === "feedback" && (
        <MonthlyFeedbackView state={state} managerId={managerId} actions={actions} />
      )}

      {tab === "activity" && (
        <ActivityLogSection state={state} scope="manager" managerId={managerId} />
      )}
    </div>
  );
}
function CelebrationsBanner({ celebrations }) {
  if (!celebrations || celebrations.length === 0) return null;
  const recent = celebrations.slice(0, 3);
  return (
    <div className="tp-card p-4 mb-4" style={{ background: "linear-gradient(135deg, #0B2545, #143563)" }}>
      <div className="font-semibold text-white mb-2 flex items-center gap-2"><Trophy size={16} className="tp-gold-text" /> Celebrations</div>
      <div className="grid gap-2">
        {recent.map(c => (
          <div key={c.id} className="tp-pop" style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 10 }}>
            <div className="text-sm font-semibold text-white flex items-center gap-2"><Crown size={13} className="tp-gold-text" /> {c.title}</div>
            {c.description && <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>{c.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrainingLibrary({ modules }) {
  const sorted = [...modules].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return (
    <div className="grid gap-3">
      {sorted.length === 0 && <div className="text-sm tp-slate-text">No training material uploaded yet.</div>}
      {sorted.map(m => (
        <div key={m.id} className="tp-card p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold flex items-center gap-2">{m.title}
              {m.mandatory && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full tp-red-text" style={{ background: "#D6534A18" }}>Mandatory</span>}
              {m.hasQuiz && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full tp-blue-text" style={{ background: "#0071CE18" }}>Has quiz</span>}
            </div>
            {m.createdAt && <span className="text-xs tp-slate-text">{m.createdAt.slice(0, 10)}</span>}
          </div>
          <p className="text-sm tp-slate-text mb-2">{m.desc}</p>
          {m.attachments?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {m.attachments.map((f, i) => (
                <a key={i} href={f.url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-full tp-ice-bg tp-blue-text flex items-center gap-1">
                  <Paperclip size={11} /> {f.name}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TraineeView({ state, employeeId, actions }) {
  const [tab, setTab] = useState("training");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [studyingAssignment, setStudyingAssignment] = useState(null);

  useEffect(() => {
    actions.checkStalledModules(employeeId);
    actions.checkUpcomingClasses(employeeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const emp = state.employees.find(e => e.id === employeeId);
  const myAssignments = state.assignments.filter(a => a.employeeId === employeeId);
  const badge = badgeForPoints(emp.points);
  const leaderboard = [...state.employees].sort((a, b) => b.points - a.points);

  const isDeptTop = topEmployeeOfDept(state.employees, emp.dept)?.id === employeeId && emp.points > 0;
  const isTopOfMonth = isDeptTop && isEndorsedThisMonth(state.endorsements, employeeId);
  const tierThresholds = [0, 100, 300, 600];
  const nextTierAt = tierThresholds.find(t => t > emp.points) || null;
  const prevTier = [...tierThresholds].reverse().find(t => t <= emp.points) || 0;
  const tierProgress = nextTierAt ? Math.min(1, (emp.points - prevTier) / (nextTierAt - prevTier)) : 1;

  const completedCount = myAssignments.filter(a => a.status === "completed").length;
  const milestones = [
    { label: "Perfect Score", desc: "Score 100% on a quiz", icon: Target, earned: myAssignments.some(a => a.quizScore === 100) },
    { label: "On Fire", desc: "5+ day streak", icon: Flame, earned: emp.streak >= 5 },
    { label: "Module Master", desc: "Complete 3+ modules", icon: BookOpen, earned: completedCount >= 3 },
    { label: "Quiz Ace", desc: "Score 90%+ twice", icon: Zap, earned: myAssignments.filter(a => (a.quizScore ?? 0) >= 90).length >= 2 },
  ];

  const startQuiz = (moduleId) => { setActiveQuiz(moduleId); setQIndex(0); setAnswers([]); setResult(null); };
  const currentQuiz = state.quizzes[activeQuiz] || [];

  const selectAnswer = (oi) => {
    const next = [...answers]; next[qIndex] = oi; setAnswers(next);
  };

  const finishQuiz = () => {
    const correct = currentQuiz.filter((q, i) => answers[i] === q.correct).length;
    const score = Math.round((correct / currentQuiz.length) * 100);
    setResult(score);
    actions.submitQuiz(employeeId, activeQuiz, score);
  };

  return (
    <div>
      <Tabs active={tab} onChange={setTab} tabs={[
        { key: "training", label: "My Training", icon: BookOpen },
        { key: "library", label: "Training Library", icon: FileText },
        { key: "achievements", label: "Achievements", icon: Trophy },
      ]} />

      {tab === "training" && (
        <div className="grid gap-3">
          {myAssignments.map(a => {
            const mod = state.modules.find(m => m.id === a.moduleId);
            return (
              <div key={a.id} className="tp-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold flex items-center gap-2">{mod.title}
                    {mod.mandatory && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full tp-red-text" style={{ background: "#D6534A18" }}>Mandatory</span>}
                  </div>
                  <span className="text-xs tp-gold-text font-medium flex items-center gap-1"><Star size={12} /> {mod.points} pts</span>
                </div>
                <p className="text-sm tp-slate-text mb-2">{mod.desc}</p>
                {mod.attachments?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {mod.attachments.map((f, i) => (
                      <a key={i} href={f.url} download={f.name} className="text-xs px-2 py-1 rounded-full tp-ice-bg tp-blue-text flex items-center gap-1">
                        <Paperclip size={11} /> {f.name}
                      </a>
                    ))}
                  </div>
                )}
                <ProgressBar value={a.progress} />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs tp-slate-text">{a.progress}% complete · {formatActiveTime(a.activeSeconds, a.timeSpentMin)}</span>
                  <div className="flex items-center gap-2">
                    {a.status !== "completed" && (
                      <button onClick={() => setStudyingAssignment(a)} className="tp-btn-gold rounded-lg px-3 py-1.5 text-xs font-semibold">Study</button>
                    )}
                    {mod.hasQuiz && a.status !== "completed" && (
                      <button onClick={() => startQuiz(mod.id)} className="tp-btn-primary rounded-lg px-3 py-1.5 text-xs font-medium">
                        {a.attempts > 0 ? "Retake quiz" : "Take quiz"}
                      </button>
                    )}
                  </div>
                  {a.status === "completed" && <span className="text-xs tp-green-text font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> Passed — {a.quizScore}%</span>}
                </div>
                {mod.hasQuiz && a.status !== "completed" && (
                  <div className="text-[11px] tp-slate-text mt-1">
                    Need {a.passThreshold ?? 80}%+ to pass · Attempt {a.attempts || 0} of 3
                    {a.attempts > 0 && a.quizScore != null && <span className="tp-red-text"> · last score {a.quizScore}%</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "library" && <TrainingLibrary modules={state.modules} />}

      {tab === "achievements" && (
        <div>
          <CelebrationsBanner celebrations={state.celebrations} />
          {isTopOfMonth && (
            <div className="tp-card p-5 mb-4 tp-pop tp-glow relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0B2545, #143563)" }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center tp-shimmer tp-float">
                  <Crown size={30} color="#0B2545" />
                </div>
                <div>
                  <div className="tp-display font-extrabold text-lg text-white">Top Employee of the Month</div>
                  <div className="text-sm tp-gold-text font-medium">#1 in {emp.dept} · endorsed by your manager</div>
                </div>
              </div>
            </div>
          )}

          <div className="tp-card p-5 mb-4 flex items-center gap-4" style={{ background: `linear-gradient(135deg, white, ${badge.color}12)` }}>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="absolute inset-0">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#E9EEF7" strokeWidth="6" />
                <circle cx="32" cy="32" r="28" fill="none" stroke={badge.color} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${2 * Math.PI * 28 * (1 - tierProgress)}`}
                  transform="rotate(-90 32 32)" />
              </svg>
              <Award size={24} color={badge.color} />
            </div>
            <div>
              <div className="tp-display font-bold text-lg">{badge.label} Level</div>
              <div className="text-sm tp-slate-text flex items-center gap-3 mb-1">
                <span className="flex items-center gap-1"><Star size={13} className="tp-gold-text" /> {emp.points} pts</span>
                <span className="flex items-center gap-1"><Flame size={13} className="tp-red-text" /> {emp.streak}-day streak</span>
              </div>
              {nextTierAt && <div className="text-xs tp-slate-text">{nextTierAt - emp.points} pts to next tier</div>}
            </div>
          </div>

          <div className="tp-card p-4 mb-4">
            <div className="font-semibold mb-3 flex items-center gap-2"><Medal size={16} className="tp-gold-text" /> Milestone badges</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {milestones.map(m => (
                <div key={m.label} className={`tp-card p-3 text-center ${m.earned ? "tp-pop" : "tp-badge-locked"}`}>
                  <m.icon size={22} className="mx-auto mb-1" color={m.earned ? "var(--gold)" : "var(--slate)"} />
                  <div className="text-xs font-semibold">{m.label}</div>
                  <div className="text-[10px] tp-slate-text">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="tp-card p-4">
            <div className="font-semibold mb-3 flex items-center gap-2"><Trophy size={16} className="tp-gold-text" /> Leaderboard</div>
            <div className="grid gap-2">
              {leaderboard.map((e, i) => (
                <div key={e.id} className={`flex items-center justify-between p-2 rounded-lg ${e.id === employeeId ? "tp-ice-bg" : ""}`}>
                  <span className="text-sm flex items-center gap-2">
                    {i === 0 ? <Crown size={14} className="tp-gold-text" /> : i === 1 ? <Medal size={14} color="#9AA7C7" /> : i === 2 ? <Medal size={14} color="#B08D57" /> : <span className="tp-slate-text w-4">{i + 1}</span>}
                    {e.name}
                  </span>
                  <span className="text-sm font-semibold tp-navy-text">{e.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeQuiz && (
        <Modal title="Quiz" onClose={() => setActiveQuiz(null)}>
          {result == null ? (
            <div>
              <div className="text-xs tp-slate-text mb-2">Question {qIndex + 1} of {currentQuiz.length}</div>
              <ProgressBar value={((qIndex) / currentQuiz.length) * 100} />
              <div className="font-semibold my-4">{currentQuiz[qIndex]?.q}</div>
              <div className="grid gap-2 mb-4">
                {currentQuiz[qIndex]?.options.map((opt, oi) => (
                  <button key={oi} onClick={() => selectAnswer(oi)}
                    className={`text-left tp-input ${answers[qIndex] === oi ? "tp-blue-bg text-white" : ""}`}>
                    {opt}
                  </button>
                ))}
              </div>
              {qIndex < currentQuiz.length - 1 ? (
                <button disabled={answers[qIndex] == null} onClick={() => setQIndex(qIndex + 1)} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40">Next</button>
              ) : (
                <button disabled={answers[qIndex] == null} onClick={finishQuiz} className="tp-btn-gold rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40">Submit quiz</button>
              )}
            </div>
          ) : (
            <div className="text-center py-4 tp-pop">
              <Sparkles size={36} className="tp-gold-text mx-auto mb-2" />
              <div className="tp-display font-bold text-2xl mb-1">{result}%</div>
              <div className="tp-slate-text text-sm mb-4">
                {result >= (myAssignments.find(a => a.moduleId === activeQuiz)?.passThreshold ?? 80)
                  ? "Great work — badge points added!"
                  : "Below the required score — the module has restarted. Check your remaining attempts."}
              </div>
              <button onClick={() => setActiveQuiz(null)} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Close</button>
            </div>
          )}
        </Modal>
      )}
      {studyingAssignment && (
        <StudyModal
          mod={state.modules.find(m => m.id === studyingAssignment.moduleId)}
          assignment={studyingAssignment}
          onClose={() => setStudyingAssignment(null)}
          onLogTime={(elapsedSeconds) => actions.logStudyTime(studyingAssignment.id, employeeId, studyingAssignment.moduleId, elapsedSeconds)}
        />
      )}
    </div>
  );
}

/* ---------------------------------- IN-CLASS TRAINING (shared, scoped by role) ---------------------------------- */
function monthMeta(offset = 0) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year = d.getFullYear(), month = d.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = d.getDay();
  const monthLabel = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  return { year, month, daysInMonth, startWeekday, monthLabel };
}

function TrainingCalendar({ classTrainings, onSelectClass, onAddDay, canAdd }) {
  const [offset, setOffset] = useState(0);
  const { year, month, daysInMonth, startWeekday, monthLabel } = monthMeta(offset);
  const cells = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const dateStr = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div className="tp-card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setOffset(offset - 1)} className="text-xs px-2 py-1 rounded-lg tp-ice-bg tp-slate-text">← Prev</button>
        <div className="font-semibold tp-display">{monthLabel}</div>
        <button onClick={() => setOffset(offset + 1)} className="text-xs px-2 py-1 rounded-lg tp-ice-bg tp-slate-text">Next →</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] tp-slate-text mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const ds = dateStr(d);
          const classesToday = classTrainings.filter(c => c.date === ds);
          return (
            <div key={i} className="border rounded-lg p-1 min-h-[64px] text-left" style={{ borderColor: "var(--line)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] tp-slate-text">{d}</span>
                {canAdd && <button onClick={() => onAddDay(ds)} className="text-[10px] tp-blue-text font-bold">+</button>}
              </div>
              <div className="grid gap-0.5 mt-0.5">
                {classesToday.map(c => (
                  <button key={c.id} onClick={() => onSelectClass(c.id)}
                    className="text-[9px] px-1 py-0.5 rounded tp-gold-bg text-left truncate" style={{ color: "var(--navy)" }} title={c.name}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClassTrainingSection({ state, actions, scope, managerId, actorName }) {
  const [classTab, setClassTab] = useState(state.classTrainings[0]?.id || null);
  const [showNewClass, setShowNewClass] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", date: "" });
  const [enrollId, setEnrollId] = useState("");
  const [sessionDraft, setSessionDraft] = useState({ date: "", hours: "" });
  const [commentDraft, setCommentDraft] = useState({});
  const [requestForm, setRequestForm] = useState({ title: "", reason: "", suggestedDate: "" });

  const eligibleEmployees = scope === "manager" ? state.employees.filter(e => e.managerId === managerId) : state.employees;
  const activeClass = state.classTrainings.find(c => c.id === classTab);
  const enrolledIds = activeClass ? activeClass.enrollments.map(e => e.employeeId) : [];
  const enrollable = eligibleEmployees.filter(e => !enrolledIds.includes(e.id));
  const visibleEnrollments = activeClass
    ? activeClass.enrollments.filter(en => scope === "admin" || eligibleEmployees.some(e => e.id === en.employeeId))
    : [];

  const createClass = async (prefillDate) => {
    if (!newClass.name.trim() || !(newClass.date || prefillDate)) return;
    setNewClass({ name: "", date: "" });
    setShowNewClass(false);
    const created = await actions.addClassTraining({ name: newClass.name, date: prefillDate || newClass.date }, actorName);
    setClassTab(created.id);
  };

  const submitRequest = () => {
    if (!requestForm.title.trim() || !requestForm.suggestedDate) return;
    actions.requestTraining(requestForm.title, requestForm.reason, requestForm.suggestedDate, managerId, actorName);
    setRequestForm({ title: "", reason: "", suggestedDate: "" });
  };

  return (
    <div>
      {scope === "admin" && (
        <button onClick={() => setShowNewClass(true)} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 mb-4">
          <PlusCircle size={16} /> New in-class training
        </button>
      )}

      {scope === "admin" && state.trainingRequests?.some(r => r.status === "pending") && (
        <div className="tp-card p-4 mb-4">
          <div className="font-semibold mb-2 text-sm flex items-center gap-2"><Send size={15} className="tp-blue-text" /> Training requests from managers</div>
          <div className="grid gap-2">
            {state.trainingRequests.filter(r => r.status === "pending").map(r => (
              <div key={r.id} className="border rounded-lg p-3 flex items-center justify-between flex-wrap gap-2" style={{ borderColor: "var(--line)" }}>
                <div>
                  <div className="text-sm font-medium">{r.title} <span className="text-xs tp-slate-text">· suggested {r.suggestedDate}</span></div>
                  {r.reason && <div className="text-xs tp-slate-text mt-0.5">{r.reason}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => actions.respondToTrainingRequest(r.id, true)} className="tp-btn-gold rounded-lg px-3 py-1.5 text-xs font-semibold">Approve & add to calendar</button>
                  <button onClick={() => actions.respondToTrainingRequest(r.id, false)} className="text-xs tp-red-text border border-red-200 rounded-lg px-3 py-1.5">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {scope === "manager" && (
        <div className="tp-card p-4 mb-4">
          <div className="font-semibold mb-1 text-sm flex items-center gap-2"><Send size={15} className="tp-blue-text" /> Request a new training</div>
          <p className="text-xs tp-slate-text mb-2">Can't find what your team needs? Ask the admin team to add it to the calendar.</p>
          <div className="grid gap-2">
            <input className="tp-input" placeholder="Training title" value={requestForm.title} onChange={e => setRequestForm({ ...requestForm, title: e.target.value })} />
            <input className="tp-input" placeholder="Why is this needed? (optional)" value={requestForm.reason} onChange={e => setRequestForm({ ...requestForm, reason: e.target.value })} />
            <div className="flex items-center gap-2">
              <input type="date" className="tp-input w-auto" value={requestForm.suggestedDate} onChange={e => setRequestForm({ ...requestForm, suggestedDate: e.target.value })} />
              <button onClick={submitRequest} className="tp-btn-primary rounded-lg px-3 py-1.5 text-xs font-medium">Send request</button>
            </div>
          </div>
        </div>
      )}

      <TrainingCalendar classTrainings={state.classTrainings} onSelectClass={setClassTab} canAdd={scope === "admin"}
        onAddDay={(ds) => { setNewClass({ name: "", date: ds }); setShowNewClass(true); }} />

      {state.classTrainings.length === 0 && <div className="text-sm tp-slate-text">No in-class trainings yet.</div>}

      {state.classTrainings.length > 0 && (
        <div className="flex gap-1 p-1 tp-card mb-4 overflow-x-auto tp-scrollbar">
          {state.classTrainings.map(c => (
            <button key={c.id} onClick={() => setClassTab(c.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${classTab === c.id ? "tp-tab-active" : "tp-tab hover:bg-gray-50"}`}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {activeClass && (
        <div className="grid gap-4">
          <div className="tp-card p-4">
            <div className="font-semibold tp-display text-lg">{activeClass.name}</div>
            <div className="text-xs tp-slate-text mb-3">Class date: {activeClass.date}</div>


            <div className="text-xs font-medium tp-slate-text mb-1">Hours logged per day</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {activeClass.sessions.length === 0 && <span className="text-xs tp-slate-text">No sessions logged yet.</span>}
              {activeClass.sessions.map((s, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full tp-ice-bg">{s.date} · {s.hours}h</span>
              ))}
            </div>
            {scope === "admin" && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <input type="date" className="tp-input w-auto text-xs" value={sessionDraft.date} onChange={e => setSessionDraft({ ...sessionDraft, date: e.target.value })} />
                <input type="number" placeholder="Hours" className="tp-input w-24 text-xs" value={sessionDraft.hours} onChange={e => setSessionDraft({ ...sessionDraft, hours: e.target.value })} />
                <button onClick={() => { if (sessionDraft.date && sessionDraft.hours) { actions.logSession(activeClass.id, sessionDraft.date, Number(sessionDraft.hours)); setSessionDraft({ date: "", hours: "" }); } }}
                  className="tp-btn-primary rounded-lg px-3 py-1.5 text-xs font-medium">Log day</button>
                <label className="flex items-center gap-1 text-xs tp-slate-text ml-2">
                  <input type="checkbox" checked={activeClass.quizEnabled} onChange={e => actions.toggleClassQuiz(activeClass.id, e.target.checked)} />
                  Quiz given in class
                </label>
              </div>
            )}
          </div>

          <div className="tp-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-sm">Enrolled employees{scope === "manager" ? " (your team)" : ""}</div>
              {enrollable.length > 0 && (
                <div className="flex items-center gap-2">
                  <select className="tp-input w-auto text-xs" value={enrollId} onChange={e => setEnrollId(e.target.value)}>
                    <option value="">Select employee…</option>
                    {enrollable.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                  <button onClick={() => { if (enrollId) { actions.enrollInClass(activeClass.id, enrollId, actorName); setEnrollId(""); } }}
                    className="tp-btn-gold rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1"><Send size={12} /> Enroll</button>
                </div>
              )}
            </div>

            {visibleEnrollments.length === 0 && <div className="text-xs tp-slate-text">No one enrolled yet.</div>}

            <div className="grid gap-3">
              {visibleEnrollments.map(en => {
                const emp = state.employees.find(e => e.id === en.employeeId);
                return (
                  <div key={en.employeeId} className="border rounded-lg p-3" style={{ borderColor: "var(--line)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm flex items-center gap-2">{emp?.name} <DeptBadge dept={emp?.dept} /></div>
                      <div className="flex items-center gap-2">
                        {scope === "manager" && (
                          <button onClick={() => actions.sendReminder(emp?.id, `Reminder from ${actorName}: don't forget "${activeClass.name}" on ${activeClass.date}.`)}
                            className="text-xs tp-blue-text hover:underline">Send reminder</button>
                        )}
                        {activeClass.quizEnabled && (
                          scope === "admin" ? (
                            <input type="number" className="tp-input w-20 text-xs" placeholder="Score %" defaultValue={en.quizScore ?? ""}
                              onBlur={e => actions.setClassQuizScore(activeClass.id, en.employeeId, e.target.value === "" ? null : Number(e.target.value))} />
                          ) : (
                            <span className="text-xs font-semibold">{en.quizScore != null ? `${en.quizScore}%` : "Not scored yet"}</span>
                          )
                        )}
                      </div>
                    </div>
                    <div className="text-xs tp-slate-text mb-1">Comments</div>
                    <div className="grid gap-1 mb-2">
                      {en.comments.length === 0 && <span className="text-xs tp-slate-text">No comments yet.</span>}
                      {en.comments.map((c, i) => (
                        <div key={i} className="text-xs tp-ice-bg rounded-md p-2">{c.text} <span className="tp-slate-text">· {c.date}</span></div>
                      ))}
                    </div>
                    {scope === "admin" && (
                      <div className="flex items-center gap-2">
                        <input className="tp-input text-xs" placeholder="Add a comment"
                          value={commentDraft[en.employeeId] || ""}
                          onChange={e => setCommentDraft({ ...commentDraft, [en.employeeId]: e.target.value })} />
                        <button onClick={() => {
                          const text = commentDraft[en.employeeId];
                          if (text?.trim()) { actions.addClassComment(activeClass.id, en.employeeId, text); setCommentDraft({ ...commentDraft, [en.employeeId]: "" }); }
                        }} className="tp-btn-primary rounded-lg px-3 py-1.5 text-xs font-medium">Add</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showNewClass && (
        <Modal title="New in-class training" onClose={() => setShowNewClass(false)}>
          <div className="grid gap-3">
            <input className="tp-input" placeholder="Class name" value={newClass.name} onChange={e => setNewClass({ ...newClass, name: e.target.value })} />
            <label className="text-xs tp-slate-text">Date</label>
            <input type="date" className="tp-input" value={newClass.date} onChange={e => setNewClass({ ...newClass, date: e.target.value })} />
            <button onClick={createClass} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium mt-2">Create class</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------------- COACHING & COMMENTS (manager, direct-manager only) ---------------------------------- */
function CoachingSection({ state, managerId, team, actions, actorName }) {
  const [selectedEmp, setSelectedEmp] = useState(team[0]?.id || null);
  const [category, setCategory] = useState("Call Quality");
  const [notes, setNotes] = useState("");

  const mySessions = state.coachingSessions.filter(s => s.managerId === managerId);

  const logSession = () => {
    if (!selectedEmp || !notes.trim()) return;
    actions.addCoachingSession({
      id: Date.now(), employeeId: selectedEmp, managerId, category, notes,
      date: new Date().toISOString().slice(0, 10), escalated: false,
    });
    setNotes("");
  };

  return (
    <div>
      <div className="tp-card p-4 mb-4">
        <div className="font-semibold mb-1 flex items-center gap-2"><Headphones size={16} className="tp-blue-text" /> Log a coaching session</div>
        <p className="text-xs tp-slate-text mb-3">As their direct manager, you provide the first coaching. Escalate to the admin team only if intervention is needed.</p>
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            <select className="tp-input w-auto text-sm" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)}>
              {team.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <select className="tp-input w-auto text-sm" value={category} onChange={e => setCategory(e.target.value)}>
              <option>Call Quality</option>
              <option>Product Knowledge</option>
              <option>Compliance</option>
              <option>Soft Skills</option>
              <option>General</option>
            </select>
          </div>
          <textarea className="tp-input" rows={3} placeholder="Coaching notes / observations" value={notes} onChange={e => setNotes(e.target.value)} />
          <button onClick={logSession} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium w-fit flex items-center gap-2">
            <MessageSquare size={15} /> Log coaching session
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {team.map(emp => {
          const sessions = mySessions.filter(s => s.employeeId === emp.id).sort((a, b) => b.date.localeCompare(a.date));
          if (sessions.length === 0) return null;
          return (
            <div key={emp.id} className="tp-card p-4">
              <div className="font-semibold mb-2 flex items-center gap-2">{emp.name} <DeptBadge dept={emp.dept} /></div>
              <div className="grid gap-2">
                {sessions.map(s => (
                  <div key={s.id} className="border rounded-lg p-3" style={{ borderColor: s.escalated ? "var(--red)" : "var(--line)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full tp-ice-bg tp-blue-text">{s.category}</span>
                      <span className="text-xs tp-slate-text">{s.date}</span>
                    </div>
                    <div className="text-sm mb-2">{s.notes}</div>
                    {s.escalated ? (
                      <span className="text-xs tp-red-text font-semibold flex items-center gap-1"><AlertTriangle size={13} /> Escalated to admin for intervention</span>
                    ) : (
                      <button onClick={() => actions.escalateCoaching(s.id, actorName)}
                        className="text-xs rounded-lg px-3 py-1.5 tp-red-text border border-red-200 flex items-center gap-1">
                        <AlertTriangle size={13} /> Escalate for intervention — call quality
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {mySessions.length === 0 && <div className="text-sm tp-slate-text">No coaching sessions logged yet.</div>}
      </div>
    </div>
  );
}

/* ---------------------------------- ACTIVITY LOG (period-based reporting, shared by role) ---------------------------------- */
function defaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

function ActivityLogSection({ state, scope, managerId }) {
  const initial = defaultDateRange();
  const [fromDate, setFromDate] = useState(initial.from);
  const [toDate, setToDate] = useState(initial.to);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const eligibleIds = scope === "manager" ? state.employees.filter(e => e.managerId === managerId).map(e => e.id) : null;

  const search = async () => {
    setLoading(true); setError(""); setSearched(true);
    try {
      const query = `select=*&created_at=gte.${fromDate}T00:00:00&created_at=lte.${toDate}T23:59:59&order=created_at.desc&limit=500`;
      const data = await sbSelect("activity_log", query);
      const filtered = scope === "admin" ? data
        : data.filter(r => eligibleIds.includes(r.employee_id) || eligibleIds.includes(r.actor_id));
      setRows(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const csvRows = [["Date", "Type", "Description"], ...rows.map(r => [r.created_at, r.action_type, r.description])];
    const csv = csvRows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `activity_log_${fromDate}_to_${toDate}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="tp-card p-4 mb-4">
        <div className="font-semibold mb-1 flex items-center gap-2"><Clock size={16} className="tp-blue-text" /> Activity log — pull any period</div>
        <p className="text-xs tp-slate-text mb-3">Every enrollment, quiz completion, coaching session, approval, and more is logged automatically. Pick a date range and pull it straight from the database.</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs tp-slate-text">From</label>
          <input type="date" className="tp-input w-auto text-sm" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <label className="text-xs tp-slate-text">To</label>
          <input type="date" className="tp-input w-auto text-sm" value={toDate} onChange={e => setToDate(e.target.value)} />
          <button onClick={search} disabled={loading} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40">
            {loading ? "Searching…" : "Search"}
          </button>
          {rows.length > 0 && (
            <button onClick={exportCSV} className="tp-btn-gold rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-1">
              <FileSpreadsheet size={14} /> Export CSV
            </button>
          )}
        </div>
        {error && <div className="text-xs tp-red-text mt-2">Couldn't load the log: {error}</div>}
      </div>

      {searched && !loading && (
        <div className="tp-card overflow-x-auto tp-scrollbar">
          {rows.length === 0 ? (
            <div className="p-4 text-sm tp-slate-text">No activity in this period.</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left tp-slate-text border-b" style={{ borderColor: "var(--line)" }}>
                <th className="p-3">Date</th><th className="p-3">Type</th><th className="p-3">Description</th>
              </tr></thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                    <td className="p-3 tp-slate-text whitespace-nowrap">{r.created_at?.slice(0, 16).replace("T", " ")}</td>
                    <td className="p-3"><span className="text-xs font-medium px-2 py-0.5 rounded-full tp-ice-bg tp-blue-text">{r.action_type}</span></td>
                    <td className="p-3">{r.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- MONTHLY FEEDBACK (manager) ---------------------------------- */
function MonthlyFeedbackView({ state, managerId, actions }) {
  const team = state.employees.filter(e => e.managerId === managerId);
  const monthKey = currentMonthKey();
  const [drafts, setDrafts] = useState({});

  const submittedFor = (employeeId) => state.monthlyFeedback.find(f => f.managerId === managerId && f.employeeId === employeeId && f.month === monthKey);

  const submit = (employeeId) => {
    const d = drafts[employeeId] || {};
    const combinedComment = d.comment + (d.development ? `\n\nDevelopment notes: ${d.development}` : "");
    actions.submitMonthlyFeedback({
      id: Date.now(), managerId, employeeId, month: monthKey,
      needsTraining: !!d.needsTraining, comment: combinedComment, submittedAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div>
      {isDeadlineWeek() && (
        <div className="tp-card p-4 mb-4 flex items-center gap-3" style={{ borderColor: "var(--gold)", background: "#C9A24B10" }}>
          <ClipboardCheck size={20} className="tp-gold-text" />
          <div className="text-sm"><span className="font-semibold">This is deadline week.</span> Monthly feedback for every employee is due by the end of the third week of this month.</div>
        </div>
      )}
      <div className="grid gap-3">
        {team.map(e => {
          const submitted = submittedFor(e.id);
          const d = drafts[e.id] || { needsTraining: false, comment: "", development: "" };
          const myAssignments = state.assignments.filter(a => a.employeeId === e.id);
          return (
            <div key={e.id} className="tp-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold flex items-center gap-2">{e.name} <DeptBadge dept={e.dept} /></div>
                {submitted ? <span className="text-xs tp-green-text font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> Submitted {submitted.submittedAt}</span>
                  : <span className="text-xs tp-red-text font-semibold">Not submitted this month</span>}
              </div>
              <div className="text-xs tp-slate-text mb-2">
                {myAssignments.length === 0 ? "No online material assigned yet." : myAssignments.map(a => {
                  const mod = state.modules.find(m => m.id === a.moduleId);
                  return `${mod?.title} (${a.status === "completed" ? `passed ${a.quizScore}%` : a.status.replace("_", " ")})`;
                }).join(" · ")}
              </div>
              {!submitted && (
                <div className="grid gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={d.needsTraining} onChange={ev => setDrafts({ ...drafts, [e.id]: { ...d, needsTraining: ev.target.checked } })} />
                    This employee needs additional training
                  </label>
                  <textarea className="tp-input" rows={2} placeholder="General feedback comments"
                    value={d.comment} onChange={ev => setDrafts({ ...drafts, [e.id]: { ...d, comment: ev.target.value } })} />
                  <textarea className="tp-input" rows={2} placeholder="Development notes (growth, promotion readiness, anything worth tracking)"
                    value={d.development} onChange={ev => setDrafts({ ...drafts, [e.id]: { ...d, development: ev.target.value } })} />
                  <div className="flex items-center gap-2">
                    <button onClick={() => submit(e.id)} className="tp-btn-primary rounded-lg px-3 py-1.5 text-xs font-medium">Submit feedback</button>
                    {d.needsTraining && <span className="text-xs tp-slate-text">Enroll them in a class from the In-Class Training tab.</span>}
                  </div>
                </div>
              )}
              {submitted && submitted.comment && <div className="text-xs tp-slate-text mt-1">"{submitted.comment}"</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ---------------------------------- LOGIN GATES (name + password, no company data) ---------------------------------- */
function EmployeeLoginGate({ employees, onSuccess, onGoToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const tryLogin = () => {
    const match = employees.find(e => e.email?.toLowerCase() === email.trim().toLowerCase() && e.password === password);
    if (match) { setError(""); onSuccess(match.id); }
    else setError("Email or password didn't match.");
  };

  return (
    <div className="tp-card p-6 max-w-sm mx-auto text-center mt-6">
      <GraduationCap size={28} className="tp-navy-text mx-auto mb-2" />
      <div className="font-semibold mb-1">Employee login</div>
      <div className="text-xs tp-slate-text mb-4">Enter your work email and the password you chose when you registered.</div>
      <div className="grid gap-2">
        <input type="email" className="tp-input" placeholder="Work email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="tp-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && tryLogin()} />
        {error && <div className="text-xs tp-red-text">{error}</div>}
        <button onClick={tryLogin} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Log in</button>
        <button onClick={onGoToSignUp} className="text-xs tp-blue-text font-medium">New here? Sign up for access →</button>
      </div>
    </div>
  );
}

function ManagerLoginGate({ managers, onSuccess, onGoToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const tryLogin = () => {
    const match = managers.find(m => m.email?.toLowerCase() === email.trim().toLowerCase() && m.password === password);
    if (match) { setError(""); onSuccess(match.id); }
    else setError("Email or password didn't match.");
  };

  return (
    <div className="tp-card p-6 max-w-sm mx-auto text-center mt-6">
      <UserCog size={28} className="tp-navy-text mx-auto mb-2" />
      <div className="font-semibold mb-1">Manager login</div>
      <div className="text-xs tp-slate-text mb-4">Enter your work email and the password you chose when you registered.</div>
      <div className="grid gap-2">
        <input type="email" className="tp-input" placeholder="Work email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="tp-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && tryLogin()} />
        {error && <div className="text-xs tp-red-text">{error}</div>}
        <button onClick={tryLogin} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Log in</button>
        <button onClick={onGoToSignUp} className="text-xs tp-blue-text font-medium">New here? Register as a manager →</button>
      </div>
    </div>
  );
}

function StudyModal({ mod, assignment, onClose, onLogTime }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const pausedRef = useRef(false);

  useEffect(() => {
    const tick = setInterval(() => { if (!pausedRef.current) setElapsed(e => e + 1); }, 1000);
    const onVisibility = () => { pausedRef.current = document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisibility);
      onLogTime(elapsed);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <Modal title={mod.title} onClose={onClose}>
      <div className="flex items-center justify-center gap-2 mb-4 tp-card p-3" style={{ background: "#0071CE10" }}>
        <Clock size={16} className="tp-blue-text" />
        <span className="tp-display font-bold text-lg tracking-wide">{mm}:{ss}</span>
        <span className="text-xs tp-slate-text">this session — pauses if you switch tabs</span>
      </div>
      <p className="text-sm tp-slate-text mb-3 whitespace-pre-wrap">{mod.desc}</p>
      {mod.attachments?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {mod.attachments.map((f, i) => (
            <a key={i} href={f.url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-full tp-ice-bg tp-blue-text flex items-center gap-1">
              <Paperclip size={11} /> {f.name}
            </a>
          ))}
        </div>
      )}
      <div className="text-xs tp-slate-text mb-3">Total time on this module so far: {formatActiveTime(assignment.activeSeconds, assignment.timeSpentMin)}</div>
      <button onClick={onClose} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Done studying for now</button>
    </Modal>
  );
}

function ChangePasswordModal({ onClose, onSubmit }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!isValidPassword(next)) { setError(`New password doesn't meet the requirements. ${PASSWORD_GUIDELINE}`); return; }
    if (next !== confirm) { setError("New passwords don't match."); return; }
    const result = await onSubmit(current, next);
    if (result.ok) { setError(""); setSuccess(true); }
    else setError(result.error);
  };

  return (
    <Modal title="Change password" onClose={onClose}>
      {success ? (
        <div className="text-center py-2 tp-pop">
          <CheckCircle2 size={28} className="tp-green-text mx-auto mb-2" />
          <div className="text-sm font-medium">Password updated.</div>
        </div>
      ) : (
        <div className="grid gap-2">
          <input type="password" className="tp-input" placeholder="Current password" value={current} onChange={e => setCurrent(e.target.value)} />
          <input type="password" className="tp-input" placeholder="New password" value={next} onChange={e => setNext(e.target.value)} />
          <input type="password" className="tp-input" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          <div className="text-[11px] tp-slate-text">{PASSWORD_GUIDELINE}</div>
          {error && <div className="text-xs tp-red-text">{error}</div>}
          <button onClick={submit} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium mt-1">Update password</button>
        </div>
      )}
    </Modal>
  );
}

function InstallGuideModal({ onClose }) {
  return (
    <Modal title="Add this to your phone's home screen" onClose={onClose}>
      <div className="grid gap-4">
        <div>
          <div className="font-semibold text-sm mb-1 flex items-center gap-2"><Smartphone size={15} className="tp-blue-text" /> iPhone (Safari)</div>
          <ol className="text-sm tp-slate-text list-decimal list-inside grid gap-1">
            <li>Open this link in Safari</li>
            <li>Tap the Share icon (square with an arrow) at the bottom</li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" in the top right</li>
          </ol>
        </div>
        <div>
          <div className="font-semibold text-sm mb-1 flex items-center gap-2"><Smartphone size={15} className="tp-blue-text" /> Android (Chrome)</div>
          <ol className="text-sm tp-slate-text list-decimal list-inside grid gap-1">
            <li>Open this link in Chrome</li>
            <li>Tap the ⋮ menu in the top right</li>
            <li>Tap "Add to Home Screen" or "Install app"</li>
            <li>Confirm</li>
          </ol>
        </div>
        <div className="text-xs tp-slate-text">Once added, it opens full-screen from your home screen like a regular app — no app store needed.</div>
      </div>
    </Modal>
  );
}

function AdminLoginGate({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const tryLogin = () => {
    if (username.trim() === "CX Training" && password === "Amex@1234") { setError(""); onSuccess(); }
    else setError("Username or password didn't match.");
  };

  return (
    <div className="tp-card p-6 max-w-sm mx-auto text-center mt-6">
      <Shield size={28} className="tp-navy-text mx-auto mb-2" />
      <div className="font-semibold mb-1">Admin login</div>
      <div className="text-xs tp-slate-text mb-4">Restricted to the training team.</div>
      <div className="grid gap-2">
        <input className="tp-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" className="tp-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && tryLogin()} />
        {error && <div className="text-xs tp-red-text">{error}</div>}
        <button onClick={tryLogin} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Log in</button>
      </div>
    </div>
  );
}

function SignUpView({ onSubmit, managers, defaultRole = "trainee" }) {
  const [applyingAs, setApplyingAs] = useState(defaultRole);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState(LIVE_DEPARTMENTS[0].name);
  const [managerId, setManagerId] = useState(managers[0]?.id);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!firstName.trim() || !lastName.trim()) { setError("Enter your first and last name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter a valid work email."); return; }
    if (!isValidPassword(password)) { setError(`Password doesn't meet the requirements. ${PASSWORD_GUIDELINE}`); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    setError("");
    onSubmit(`${firstName.trim()} ${lastName.trim()}`, email.trim().toLowerCase(), dept, applyingAs === "trainee" ? managerId : null, password, applyingAs);
    setSubmitted(true);
  };

  return (
    <div className="tp-card p-6 max-w-sm mx-auto text-center mt-10">
      {submitted ? (
        <div className="tp-pop">
          <ClipboardCheck size={32} className="tp-blue-text mx-auto mb-3" />
          <div className="font-semibold mb-1">Request submitted</div>
          <div className="text-sm tp-slate-text">Your access is pending approval from the training team. Once approved, log in with your work email and the password you just chose.</div>
        </div>
      ) : (
        <div className="grid gap-3">
          <UserCog size={28} className="tp-navy-text mx-auto mb-1" />
          <div className="font-semibold">Sign up</div>
          <div className="text-xs tp-slate-text -mt-2">Your work email is used to log in — no separate ID or PIN needed.</div>

          <div className="flex gap-1 p-1 tp-ice-bg rounded-lg">
            <button onClick={() => setApplyingAs("trainee")} className={`flex-1 text-xs font-medium py-1.5 rounded-md ${applyingAs === "trainee" ? "tp-btn-primary" : "tp-slate-text"}`}>Trainee</button>
            <button onClick={() => setApplyingAs("manager")} className={`flex-1 text-xs font-medium py-1.5 rounded-md ${applyingAs === "manager" ? "tp-btn-primary" : "tp-slate-text"}`}>Manager</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input className="tp-input" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input className="tp-input" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <label className="text-xs tp-slate-text text-left -mb-2">Work email</label>
          <input type="email" className="tp-input" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          <label className="text-xs tp-slate-text text-left -mb-2">Department</label>
          <select className="tp-input" value={dept} onChange={e => setDept(e.target.value)}>
            {LIVE_DEPARTMENTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
          {applyingAs === "trainee" && (
            managers.length > 0 ? (
              <>
                <label className="text-xs tp-slate-text text-left -mb-2">Manager</label>
                <select className="tp-input" value={managerId} onChange={e => setManagerId(e.target.value)}>
                  {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </>
            ) : (
              <div className="text-xs tp-slate-text text-left">No managers registered yet — the admin team will assign one once your account is approved.</div>
            )
          )}
          <label className="text-xs tp-slate-text text-left -mb-2">Choose a password</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="password" className="tp-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <input type="password" className="tp-input" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <div className="text-[11px] tp-slate-text text-left -mt-1">{PASSWORD_GUIDELINE}</div>
          {error && <div className="text-xs tp-red-text">{error}</div>}
          <button onClick={submit} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Submit for approval</button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- ROOT APP ---------------------------------- */
class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("Amplify crashed:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", background: "#0B2545", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 24 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 32, maxWidth: 480, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#0B2545", marginBottom: 8 }}>Something went wrong</div>
            <div style={{ fontSize: 13, color: "#5B6B8C", marginBottom: 16 }}>
              The app hit an unexpected error instead of showing a blank screen. Reloading usually fixes it — if it keeps happening, share this message with the admin team:
            </div>
            <div style={{ fontSize: 11, color: "#D6534A", background: "#D6534A10", borderRadius: 8, padding: 10, marginBottom: 16, textAlign: "left", wordBreak: "break-word" }}>
              {String(this.state.error?.message || this.state.error)}
            </div>
            <button onClick={() => window.location.reload()} style={{ background: "#0B2545", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Reload the app
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AmplifyTrainingAppInner() {
  const [employees, setEmployees] = useState([
    ...initialEmployees,
    ...initialManagers.map(m => ({ id: m.id, name: m.name, dept: m.dept, role: "manager", managerId: null, points: 0, streak: 0, status: "active", password: m.password })),
  ]);
  const [modules, setModules] = useState(initialModules);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [pending, setPending] = useState(initialPending);
  const [quizzes, setQuizzes] = useState({});
  const [classTrainings, setClassTrainings] = useState(initialClassTrainings);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [monthlyFeedback, setMonthlyFeedback] = useState(initialMonthlyFeedback);
  const [endorsements, setEndorsements] = useState([]);
  const [coachingSessions, setCoachingSessions] = useState(initialCoachingSessions);
  const [credentialsToShare, setCredentialsToShare] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [role, setRole] = useState("admin");
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpDefaultRole, setSignUpDefaultRole] = useState("trainee");
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null);
  const [loggedInManagerId, setLoggedInManagerId] = useState(null);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [dataStatus, setDataStatus] = useState({ loading: true, error: null, connected: false });
  const [deptMaps, setDeptMaps] = useState({ nameToId: {}, idToName: {} });
  const [trainingRequests, setTrainingRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [departmentsVersion, setDepartmentsVersion] = useState(0);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [celebrations, setCelebrations] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const depts = await sbSelect("departments", "select=id,name,color");
        const nameToId = {}, idToName = {};
        depts.forEach(d => { nameToId[d.name] = d.id; idToName[d.id] = d.name; });
        setDeptMaps({ nameToId, idToName });
        LIVE_DEPARTMENTS = depts.map(d => ({ name: d.name, color: d.color }));
        setDepartmentsVersion(v => v + 1);

        const dbManagers = await sbSelect("employees", "role=eq.manager&select=*");
        const dbTrainees = await sbSelect("employees", "role=eq.trainee&select=*");
        const dbPending = await sbSelect("pending_signups", "select=*");
        setEmployees([...dbManagers, ...dbTrainees].map(r => fromDbEmployee(r, idToName)));
        setPending(dbPending.map(r => fromDbPending(r, idToName)));

        const dbModules = await sbSelect("modules", "select=*");
        const dbAttachments = await sbSelect("module_attachments", "select=*");
        const attachmentsByModule = {};
        dbAttachments.forEach(a => { (attachmentsByModule[a.module_id] ||= []).push(fromDbAttachment(a)); });
        setModules(dbModules.map(m => ({ ...fromDbModule(m), attachments: attachmentsByModule[m.id] || [] })));

        const dbQuizQuestions = await sbSelect("quiz_questions", "select=*&order=sort_order");
        const quizMap = {};
        dbQuizQuestions.forEach(q => { (quizMap[q.module_id] ||= []).push(fromDbQuizQuestion(q)); });
        setQuizzes(quizMap);

        const dbAssignments = await sbSelect("assignments", "select=*");
        setAssignments(dbAssignments.map(fromDbAssignment));

        const [dbClasses, dbSessions, dbEnrollments, dbComments] = await Promise.all([
          sbSelect("class_trainings", "select=*"),
          sbSelect("class_sessions", "select=*"),
          sbSelect("class_enrollments", "select=*"),
          sbSelect("class_comments", "select=*"),
        ]);
        setClassTrainings(assembleClassTrainings(dbClasses, dbSessions, dbEnrollments, dbComments));

        const dbNotifications = await sbSelect("notifications", "select=*&order=created_at.desc");
        setNotifications(dbNotifications.map(fromDbNotification));

        const dbFeedback = await sbSelect("monthly_feedback", "select=*");
        setMonthlyFeedback(dbFeedback.map(fromDbMonthlyFeedback));

        const dbEndorsements = await sbSelect("endorsements", "select=*");
        setEndorsements(dbEndorsements.map(fromDbEndorsement));

        const dbCoaching = await sbSelect("coaching_sessions", "select=*");
        setCoachingSessions(dbCoaching.map(fromDbCoaching));

        const dbTrainingRequests = await sbSelect("training_requests", "select=*");
        setTrainingRequests(dbTrainingRequests.map(fromDbTrainingRequest));

        const dbReports = await sbSelect("reports", "select=*&order=created_at.desc");
        setReports(dbReports.map(fromDbReport));

        const dbCelebrations = await sbSelect("celebrations", "select=*&order=created_at.desc");
        setCelebrations(dbCelebrations.map(fromDbCelebration));

        setDataStatus({ loading: false, error: null, connected: true });
      } catch (err) {
        setDataStatus({ loading: false, error: err.message, connected: false });
      }
    })();
  }, []);

  // Restore a still-valid session on page load (survives refresh, expires
  // after 20 minutes of inactivity or on explicit logout).
  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    if (s.type === "admin") { setRole("admin"); setAdminAuthenticated(true); }
    else if (s.type === "manager") { setRole("manager"); setLoggedInManagerId(s.id); }
    else if (s.type === "trainee") { setRole("trainee"); setLoggedInEmployeeId(s.id); }
  }, []);

  // Keep the session alive while the user is active; log out automatically
  // after 20 minutes of no activity.
  useEffect(() => {
    const isLoggedIn = adminAuthenticated || !!loggedInManagerId || !!loggedInEmployeeId;
    if (!isLoggedIn) return;
    const onActivity = () => touchSession();
    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach(e => window.addEventListener(e, onActivity, { passive: true }));
    const interval = setInterval(() => {
      if (!loadSession()) {
        setAdminAuthenticated(false); setLoggedInManagerId(null); setLoggedInEmployeeId(null);
      }
    }, 30000);
    return () => { events.forEach(e => window.removeEventListener(e, onActivity)); clearInterval(interval); };
  }, [adminAuthenticated, loggedInManagerId, loggedInEmployeeId]);

  const managers = employees.filter(e => e.role === "manager");
  const myNotifications = role === "admin" ? notifications.filter(n => n.audience === "admin" || !n.audience)
    : role === "manager" ? notifications.filter(n => n.audience === "manager" && n.recipientId === loggedInManagerId)
    : notifications.filter(n => n.audience === "trainee" && n.recipientId === loggedInEmployeeId);
  const state = { employees, modules, assignments, pending, quizzes, classTrainings, notifications, monthlyFeedback, endorsements, coachingSessions, credentialsToShare, trainingRequests, reports, celebrations };

  const notify = (text, audience = "admin", recipientId = null) => {
    setNotifications(prev => [{ id: Date.now() + Math.random(), text, audience, recipientId, date: new Date().toISOString().slice(0, 10) }, ...prev]);
    sbInsert("notifications", [{ recipient_id: recipientId, message: text, audience }]).catch(() => {});
  };

  const logActivity = (description, actionType, actorId = null, employeeId = null) => {
    sbInsert("activity_log", [{ actor_id: actorId, employee_id: employeeId, action_type: actionType, description }]).catch(() => {});
  };

  const actions = {
    addModule: async (m) => {
      try {
        const [inserted] = await sbInsert("modules", [{ title: m.title, description: m.desc, points: m.points, mandatory: !!m.mandatory, has_quiz: false }]);
        let attachments = m.attachments || [];
        if (attachments.length) {
          try {
            const rows = attachments.map(f => ({ module_id: inserted.id, file_name: f.name, storage_path: f.path, file_type: f.type, file_size_bytes: f.size }));
            const insertedAttachments = await sbInsert("module_attachments", rows);
            attachments = insertedAttachments.map(fromDbAttachment);
          } catch (err) {
            setDataStatus(s => ({ ...s, error: `Couldn't save attachment records: ${err.message}` }));
          }
        }
        const created = { ...fromDbModule(inserted), attachments };
        setModules(prev => [...prev, created]);
        logActivity(`Created module "${created.title}".`, "module_created", null, null);
        return created;
      } catch (err) {
        setDataStatus(s => ({ ...s, error: `Couldn't save module to database: ${err.message}` }));
        const fallback = { id: Date.now(), hasQuiz: false, ...m };
        setModules(prev => [...prev, fallback]);
        return fallback;
      }
    },
    saveQuiz: async (moduleId, questions) => {
      try {
        await sbDelete("quiz_questions", "module_id", moduleId).catch(() => {}); // clear any existing (edit case)
        const rows = questions.map((q, i) => ({ module_id: moduleId, question: q.q, options: q.options, correct_index: q.correct, sort_order: i }));
        const inserted = await sbInsert("quiz_questions", rows);
        await sbUpdate("modules", "id", moduleId, { has_quiz: true });
        setQuizzes(prev => ({ ...prev, [moduleId]: inserted.map(fromDbQuizQuestion) }));
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, hasQuiz: true } : m));
      } catch (err) {
        setDataStatus(s => ({ ...s, error: `Couldn't save quiz to database: ${err.message}` }));
        setQuizzes(prev => ({ ...prev, [moduleId]: questions.map((q, i) => ({ id: i + 1, ...q })) }));
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, hasQuiz: true } : m));
      }
    },
    approve: async (id, assignedRole, managerId) => {
      const p = pending.find(p => p.id === id);
      const password = p.password || generateTempPassword();
      const finalManagerId = managerId || managers[0]?.id;
      const localEmp = { name: p.name, email: p.email, dept: p.dept, role: assignedRole, managerId: assignedRole === "manager" ? null : finalManagerId, points: 0, streak: 0, status: "active", password };
      try {
        const [inserted] = await sbInsert("employees", [toDbEmployee(localEmp, deptMaps.nameToId)]);
        await sbDelete("pending_signups", "id", id);
        const newEmp = fromDbEmployee(inserted, deptMaps.idToName);
        setEmployees([...employees, newEmp]);
        if (!p.password) setCredentialsToShare([{ id: newEmp.id, name: newEmp.name, password }, ...credentialsToShare]);
        logActivity(`${p.name} approved as ${assignedRole}${assignedRole === "manager" ? "" : `, reporting to ${managerName(managers, finalManagerId)}`}.`, "approval", null, newEmp.id);
        if (assignedRole === "manager") {
          notify(`Welcome! You now have full manager access — team management, training assignment, in-class calendar, coaching, and monthly feedback, same as every other manager.`, "manager", newEmp.id);
        }
      } catch (err) {
        const newId = Date.now();
        setEmployees([...employees, { id: newId, ...localEmp }]);
        if (!p.password) setCredentialsToShare([{ id: newId, name: p.name, password }, ...credentialsToShare]);
        setDataStatus({ ...dataStatus, error: `Couldn't save approval to the database: ${err.message}` });
      }
      setPending(pending.filter(x => x.id !== id));
    },
    reject: async (id) => {
      setPending(pending.filter(x => x.id !== id));
      try { await sbDelete("pending_signups", "id", id); }
      catch (err) { setDataStatus({ ...dataStatus, error: `Couldn't remove request from database: ${err.message}` }); }
    },
    assign: async (employeeId, moduleId, actorName, passThreshold = 80) => {
      if (assignments.some(a => a.employeeId === employeeId && a.moduleId === moduleId)) return;
      const mod = modules.find(m => m.id === moduleId);
      try {
        const [inserted] = await sbInsert("assignments", [{ employee_id: employeeId, module_id: moduleId, progress: 0, time_spent_minutes: 0, quiz_score: null, status: "not_started", pass_threshold: passThreshold, attempts: 0, active_seconds: 0 }]);
        setAssignments(prev => [...prev, fromDbAssignment(inserted)]);
      } catch (err) {
        setDataStatus(s => ({ ...s, error: `Couldn't save assignment to database: ${err.message}` }));
        setAssignments(prev => [...prev, { id: Date.now(), employeeId, moduleId, progress: 0, timeSpentMin: 0, quizScore: null, status: "not_started", passThreshold, attempts: 0, activeSeconds: 0, assignedAt: new Date().toISOString() }]);
      }
      notify(`You were assigned "${mod?.title}"${actorName ? ` by ${actorName}` : ""}. You need ${passThreshold}%+ on the quiz to complete it.`, "trainee", employeeId);
      logActivity(`Assigned "${mod?.title}"${actorName ? ` by ${actorName}` : ""} — pass threshold ${passThreshold}%.`, "assignment", null, employeeId);
    },
    submitQuiz: async (employeeId, moduleId, score) => {
      const existing = assignments.find(a => a.employeeId === employeeId && a.moduleId === moduleId);
      const mod = modules.find(m => m.id === moduleId);
      const emp = employees.find(e => e.id === employeeId);
      const threshold = existing?.passThreshold ?? 80;
      const attempts = (existing?.attempts || 0) + 1;
      const passed = score >= threshold;

      if (passed) {
        setAssignments(assignments.map(a => a.employeeId === employeeId && a.moduleId === moduleId
          ? { ...a, quizScore: score, progress: 100, status: "completed", attempts } : a));
        if (mod && emp) {
          setEmployees(employees.map(e => e.id === employeeId ? { ...e, points: e.points + mod.points, streak: e.streak + 1 } : e));
          sbUpdate("employees", "id", employeeId, { points: emp.points + mod.points, streak: emp.streak + 1 }).catch(() => {});
        }
        if (existing) sbUpdate("assignments", "id", existing.id, { quiz_score: score, progress: 100, status: "completed", attempts }).catch(() => {});
        notify(`You passed the quiz for "${mod?.title}" — ${score}%! Module complete.`, "trainee", employeeId);
        logActivity(`${emp?.name || "Employee"} passed quiz for "${mod?.title}" — scored ${score}% (needed ${threshold}%), attempt ${attempts}.`, "quiz_completed", null, employeeId);
      } else {
        // Failed — restart the module (progress resets), but keep the attempt count.
        setAssignments(assignments.map(a => a.employeeId === employeeId && a.moduleId === moduleId
          ? { ...a, quizScore: score, progress: 0, status: "in_progress", attempts } : a));
        if (existing) sbUpdate("assignments", "id", existing.id, { quiz_score: score, progress: 0, status: "in_progress", attempts }).catch(() => {});
        logActivity(`${emp?.name || "Employee"} failed quiz for "${mod?.title}" — scored ${score}% (needed ${threshold}%), attempt ${attempts} of 3.`, "quiz_failed", null, employeeId);

        if (attempts >= 3) {
          notify(`You didn't reach ${threshold}% on "${mod?.title}" after 3 attempts. This has been escalated to the admin team for additional support.`, "trainee", employeeId);
          const managerId = emp?.managerId;
          try {
            const [inserted] = await sbInsert("coaching_sessions", [{
              employee_id: employeeId, manager_id: managerId, category: "Training Performance",
              notes: `Automatic escalation: failed to reach the required ${threshold}% on "${mod?.title}" after 3 attempts (scores logged in quiz history).`,
              escalated: true,
            }]);
            setCoachingSessions(prev => [...prev, fromDbCoaching(inserted)]);
          } catch (err) {
            setDataStatus(s => ({ ...s, error: `Couldn't save auto-escalation: ${err.message}` }));
          }
          notify(`${emp?.name} was auto-escalated after 3 failed attempts on "${mod?.title}" (needed ${threshold}%).`, "admin");
          logActivity(`${emp?.name || "Employee"} auto-escalated after 3 failed quiz attempts on "${mod?.title}".`, "escalation", null, employeeId);
        } else {
          notify(`You scored ${score}% on "${mod?.title}" — ${threshold}% needed to pass. Please restart the module. Attempt ${attempts} of 3.`, "trainee", employeeId);
        }
      }
    },
    sendReminder: (employeeId, text) => {
      notify(text, "trainee", employeeId);
      logActivity(`Reminder sent: "${text}"`, "reminder_sent", null, employeeId);
    },
    checkFeedbackOverdue: (managerId, missingNames) => {
      const already = notifications.some(n => n.audience === "manager" && n.recipientId === managerId && n.text.includes("Monthly feedback is overdue"));
      if (already) return;
      notify(`Monthly feedback is overdue for: ${missingNames.join(", ")}. Please submit it in the Monthly Feedback tab.`, "manager", managerId);
    },
    checkStalledModules: (employeeId) => {
      const fiveHoursMs = 5 * 60 * 60 * 1000;
      const mine = assignments.filter(a => a.employeeId === employeeId && a.status !== "completed" && a.assignedAt);
      mine.forEach(a => {
        const assignedAt = new Date(a.assignedAt).getTime();
        if (Date.now() - assignedAt > fiveHoursMs) {
          const already = notifications.some(n => n.audience === "trainee" && n.recipientId === employeeId && n.text.includes(`finish "${modules.find(m => m.id === a.moduleId)?.title}"`));
          if (!already) {
            const mod = modules.find(m => m.id === a.moduleId);
            notify(`Reminder: please finish "${mod?.title}" — it's been assigned for over 5 hours.`, "trainee", employeeId);
          }
        }
      });
    },
    checkUpcomingClasses: (employeeId) => {
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().slice(0, 10);
      classTrainings.forEach(c => {
        if (c.date === tomorrowStr && c.enrollments.some(en => en.employeeId === employeeId)) {
          const already = notifications.some(n => n.audience === "trainee" && n.recipientId === employeeId && n.text.includes(`"${c.name}" is tomorrow`));
          if (!already) notify(`"${c.name}" is tomorrow (${c.date}). Make sure you're ready to attend.`, "trainee", employeeId);
        }
      });
    },
    logStudyTime: async (assignmentId, employeeId, moduleId, elapsedSeconds) => {
      if (!elapsedSeconds || elapsedSeconds < 2) return; // ignore accidental instant-close
      const existing = assignments.find(a => a.id === assignmentId);
      const newActiveSeconds = (existing?.activeSeconds || 0) + elapsedSeconds;
      const newMin = Math.round(newActiveSeconds / 60);
      const newProgress = existing?.status === "completed" ? existing.progress : Math.max(existing?.progress || 0, 25);
      const newStatus = existing?.status === "not_started" ? "in_progress" : existing?.status;
      setAssignments(assignments.map(a => a.id === assignmentId
        ? { ...a, activeSeconds: newActiveSeconds, timeSpentMin: newMin, progress: newProgress, status: newStatus } : a));
      try { await sbUpdate("assignments", "id", assignmentId, { active_seconds: newActiveSeconds, time_spent_minutes: newMin, progress: newProgress, status: newStatus }); }
      catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't save study time: ${err.message}` })); }
    },
    signUp: async (name, email, dept, managerId, password, requestedRole = "trainee") => {
      const { first_name, last_name } = splitName(name);
      try {
        const [inserted] = await sbInsert("pending_signups", [{
          first_name, last_name, email, department_id: deptMaps.nameToId[dept] || null, requested_manager_id: managerId, password, requested_role: requestedRole,
        }]);
        setPending([...pending, fromDbPending(inserted, deptMaps.idToName)]);
      } catch (err) {
        setPending([...pending, { id: Date.now(), name, email, dept, managerId, requestedAt: "just now", password, requestedRole }]);
        setDataStatus({ ...dataStatus, error: `Couldn't save sign-up to database: ${err.message}` });
      }
    },
    addClassTraining: async (c, actorName) => {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { id: tempId, name: c.name, date: c.date, quizEnabled: false, sessions: [], enrollments: [] };
      setClassTrainings(prev => [...prev, optimistic]);
      managers.forEach(m => notify(`New training class added: "${c.name}" on ${c.date} — you can enroll your team from the calendar.`, "manager", m.id));
      try {
        const [inserted] = await sbInsert("class_trainings", [{ name: c.name, class_date: c.date, quiz_enabled: false }]);
        const created = { id: inserted.id, name: inserted.name, date: inserted.class_date, quizEnabled: false, sessions: [], enrollments: [] };
        setClassTrainings(prev => prev.map(cls => cls.id === tempId ? created : cls));
        return created;
      } catch (err) {
        setDataStatus(s => ({ ...s, error: `Couldn't save class to database: ${err.message}` }));
        return optimistic;
      }
    },
    logSession: async (classId, date, hours) => {
      setClassTrainings(classTrainings.map(c => c.id === classId ? { ...c, sessions: [...c.sessions, { date, hours }] } : c));
      const cls = classTrainings.find(c => c.id === classId);
      try { await sbInsert("class_sessions", [{ class_id: classId, session_date: date, hours }]); }
      catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't save session to database: ${err.message}` })); }
      logActivity(`Logged ${hours}h for "${cls?.name}" on ${date}.`, "class_session", null, null);
    },
    toggleClassQuiz: async (classId, enabled) => {
      setClassTrainings(classTrainings.map(c => c.id === classId ? { ...c, quizEnabled: enabled } : c));
      try { await sbUpdate("class_trainings", "id", classId, { quiz_enabled: enabled }); }
      catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't save quiz toggle to database: ${err.message}` })); }
    },
    enrollInClass: async (classId, employeeId, actorName) => {
      const cls = classTrainings.find(c => c.id === classId);
      const emp = employees.find(e => e.id === employeeId);
      try {
        const [inserted] = await sbInsert("class_enrollments", [{ class_id: classId, employee_id: employeeId, quiz_score: null }]);
        setClassTrainings(classTrainings.map(c => c.id === classId
          ? { ...c, enrollments: [...c.enrollments, { employeeId, quizScore: null, comments: [], _enrollmentDbId: inserted.id }] } : c));
      } catch (err) {
        setDataStatus(s => ({ ...s, error: `Couldn't save enrollment to database: ${err.message}` }));
        setClassTrainings(classTrainings.map(c => c.id === classId
          ? { ...c, enrollments: [...c.enrollments, { employeeId, quizScore: null, comments: [] }] } : c));
      }
      notify(`${emp?.name} was enrolled in "${cls?.name}" by ${actorName}.`, "admin");
      notify(`You were enrolled in "${cls?.name}" by ${actorName}.`, "trainee", employeeId);
      if (emp?.managerId && managerName(managers, emp.managerId) !== actorName) {
        notify(`${emp?.name} was enrolled in "${cls?.name}" by ${actorName}.`, "manager", emp.managerId);
      }
      logActivity(`${emp?.name} enrolled in "${cls?.name}" by ${actorName}.`, "enrollment", null, employeeId);
    },
    setClassQuizScore: async (classId, employeeId, score) => {
      setClassTrainings(classTrainings.map(c =>
        c.id === classId ? { ...c, enrollments: c.enrollments.map(en => en.employeeId === employeeId ? { ...en, quizScore: score } : en) } : c));
      const cls = classTrainings.find(c => c.id === classId);
      const enrollment = cls?.enrollments.find(en => en.employeeId === employeeId);
      if (enrollment?._enrollmentDbId) {
        try { await sbUpdate("class_enrollments", "id", enrollment._enrollmentDbId, { quiz_score: score }); }
        catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't save quiz score to database: ${err.message}` })); }
      }
      logActivity(`Scored ${score}% on in-class quiz for "${cls?.name}".`, "quiz_completed", null, employeeId);
    },
    addClassComment: async (classId, employeeId, text) => {
      const cls = classTrainings.find(c => c.id === classId);
      const enrollment = cls?.enrollments.find(en => en.employeeId === employeeId);
      const localComment = { text, date: new Date().toISOString().slice(0, 10) };
      setClassTrainings(classTrainings.map(c =>
        c.id === classId ? { ...c, enrollments: c.enrollments.map(en => en.employeeId === employeeId
          ? { ...en, comments: [...en.comments, localComment] } : en) } : c));
      if (enrollment?._enrollmentDbId) {
        try { await sbInsert("class_comments", [{ enrollment_id: enrollment._enrollmentDbId, comment: text }]); }
        catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't save comment to database: ${err.message}` })); }
      }
    },
    submitMonthlyFeedback: async (fb) => {
      try {
        const [inserted] = await sbInsert("monthly_feedback", [{ manager_id: fb.managerId, employee_id: fb.employeeId, month_key: fb.month, needs_training: fb.needsTraining, comment: fb.comment }]);
        setMonthlyFeedback(prev => [...prev, fromDbMonthlyFeedback(inserted)]);
      } catch (err) {
        setDataStatus(s => ({ ...s, error: `Couldn't save feedback to database: ${err.message}` }));
        setMonthlyFeedback(prev => [...prev, fb]);
      }
      logActivity(`Monthly feedback submitted${fb.needsTraining ? " — flagged as needing training" : ""}.`, "monthly_feedback", fb.managerId, fb.employeeId);
    },
    endorseTopEmployee: async (employeeId, managerId) => {
      if (isEndorsedThisMonth(endorsements, employeeId)) return;
      const entry = { employeeId, managerId, month: currentMonthKey() };
      setEndorsements([...endorsements, entry]);
      notify(`Congratulations — you're endorsed as Top Employee of the Month!`, "trainee", employeeId);
      logActivity(`Endorsed as Top Employee of the Month.`, "endorsement", managerId, employeeId);
      try { await sbInsert("endorsements", [{ employee_id: employeeId, manager_id: managerId, month_key: entry.month }]); }
      catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't save endorsement to database: ${err.message}` })); }
    },
    bulkImportEmployees: async (rows) => {
      const withPasswords = rows.map(r => ({ ...r, password: generateTempPassword() }));
      try {
        const dbRows = withPasswords.map(r => toDbEmployee({ name: r.name, email: r.email, dept: r.dept, role: "trainee", managerId: r.managerId, points: 0, streak: 0, status: "active", password: r.password }, deptMaps.nameToId));
        const inserted = await sbInsert("employees", dbRows);
        const newEmployees = inserted.map(row => fromDbEmployee(row, deptMaps.idToName));
        setEmployees([...employees, ...newEmployees]);
        setCredentialsToShare([...newEmployees.map(e => ({ id: e.id, name: e.name, password: e.password })), ...credentialsToShare]);
        logActivity(`Bulk imported ${newEmployees.length} employees via Excel/CSV.`, "bulk_import", null, null);
      } catch (err) {
        const newEmployees = withPasswords.map((r, i) => ({ id: Date.now() + i, name: r.name, email: r.email, dept: r.dept, role: "trainee", managerId: r.managerId, points: 0, streak: 0, status: "active", password: r.password }));
        setEmployees([...employees, ...newEmployees]);
        setCredentialsToShare([...newEmployees.map(e => ({ id: e.id, name: e.name, password: e.password })), ...credentialsToShare]);
        setDataStatus({ ...dataStatus, error: `Couldn't save import to database: ${err.message}` });
      }
    },
    addCoachingSession: async (session) => {
      try {
        const [inserted] = await sbInsert("coaching_sessions", [{ employee_id: session.employeeId, manager_id: session.managerId, category: session.category, notes: session.notes, session_date: session.date }]);
        setCoachingSessions(prev => [...prev, fromDbCoaching(inserted)]);
      } catch (err) {
        setDataStatus(s => ({ ...s, error: `Couldn't save coaching session to database: ${err.message}` }));
        setCoachingSessions(prev => [...prev, session]);
      }
      logActivity(`Coaching session logged — ${session.category}.`, "coaching_logged", session.managerId, session.employeeId);
    },
    escalateCoaching: async (sessionId, actorName) => {
      const session = coachingSessions.find(s => s.id === sessionId);
      const emp = employees.find(e => e.id === session.employeeId);
      setCoachingSessions(coachingSessions.map(s => s.id === sessionId ? { ...s, escalated: true } : s));
      notify(`${actorName} escalated ${emp?.name} for intervention — call quality concern.`, "admin");
      logActivity(`Escalated for intervention — call quality — by ${actorName}.`, "escalation", null, session.employeeId);
      try { await sbUpdate("coaching_sessions", "id", sessionId, { escalated: true }); }
      catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't save escalation to database: ${err.message}` })); }
    },
    dismissCredential: (id) => setCredentialsToShare(credentialsToShare.filter(c => c.id !== id)),
    requestTraining: async (title, reason, suggestedDate, managerId, managerNameStr) => {
      try {
        const [inserted] = await sbInsert("training_requests", [{ manager_id: managerId, title, reason, suggested_date: suggestedDate }]);
        setTrainingRequests(prev => [fromDbTrainingRequest(inserted), ...prev]);
      } catch (err) {
        setDataStatus(s => ({ ...s, error: `Couldn't save training request to database: ${err.message}` }));
        setTrainingRequests(prev => [{ id: Date.now(), title, reason, suggestedDate, managerId, status: "pending", requestedAt: new Date().toISOString().slice(0, 10) }, ...prev]);
      }
      notify(`${managerNameStr} requested a new training: "${title}".`, "admin");
      logActivity(`Requested new training: "${title}".`, "training_request", managerId, null);
    },
    respondToTrainingRequest: async (requestId, approve) => {
      const req = trainingRequests.find(r => r.id === requestId);
      setTrainingRequests(trainingRequests.map(r => r.id === requestId ? { ...r, status: approve ? "approved" : "declined" } : r));
      try { await sbUpdate("training_requests", "id", requestId, { status: approve ? "approved" : "declined" }); }
      catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't save request response to database: ${err.message}` })); }
      if (approve) {
        await actions.addClassTraining({ name: req.title, date: req.suggestedDate }, "You (Admin)");
      }
      notify(`Your training request "${req.title}" was ${approve ? "approved and added to the calendar" : "declined"}.`, "manager", req.managerId);
      logActivity(`Training request "${req.title}" was ${approve ? "approved" : "declined"}.`, "training_request", null, null);
    },
    saveReport: async (report) => {
      try {
        const [inserted] = await sbInsert("reports", [{ file_name: report.fileName, question: report.question, analysis: report.analysis, storage_path: report.storagePath || null, file_size_bytes: report.fileSize || null }]);
        setReports(prev => [fromDbReport(inserted), ...prev]);
      } catch (err) {
        setDataStatus(s => ({ ...s, error: `Couldn't save report to database: ${err.message}` }));
        setReports(prev => [{ ...report, date: new Date().toISOString().slice(0, 10) }, ...prev]);
      }
    },
    addDepartment: async (name) => {
      if (LIVE_DEPARTMENTS.some(d => d.name.toLowerCase() === name.toLowerCase())) return;
      const color = DEPT_COLOR_POOL[LIVE_DEPARTMENTS.length % DEPT_COLOR_POOL.length];
      try {
        const [inserted] = await sbInsert("departments", [{ name, color }]);
        LIVE_DEPARTMENTS = [...LIVE_DEPARTMENTS, { name: inserted.name, color: inserted.color }];
        setDeptMaps({ nameToId: { ...deptMaps.nameToId, [inserted.name]: inserted.id }, idToName: { ...deptMaps.idToName, [inserted.id]: inserted.name } });
      } catch (err) {
        LIVE_DEPARTMENTS = [...LIVE_DEPARTMENTS, { name, color }];
        setDataStatus({ ...dataStatus, error: `Couldn't save department to database: ${err.message}` });
      }
      setDepartmentsVersion(v => v + 1);
    },
    reassignManager: async (employeeId, newManagerId) => {
      setEmployees(employees.map(e => e.id === employeeId ? { ...e, managerId: newManagerId } : e));
      try { await sbUpdate("employees", "id", employeeId, { manager_id: newManagerId }); }
      catch (err) { setDataStatus({ ...dataStatus, error: `Couldn't save manager assignment to database: ${err.message}` }); }
      logActivity(`Assigned manager: ${managerName(managers, newManagerId)}.`, "manager_assignment", null, employeeId);
    },
    changePassword: async (employeeId, currentPassword, newPassword) => {
      const emp = employees.find(e => e.id === employeeId);
      if (!emp || emp.password !== currentPassword) return { ok: false, error: "Current password is incorrect." };
      setEmployees(employees.map(e => e.id === employeeId ? { ...e, password: newPassword } : e));
      try { await sbUpdate("employees", "id", employeeId, { password: newPassword }); }
      catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't save new password to database: ${err.message}` })); }
      logActivity(`Password changed.`, "password_change", null, employeeId);
      return { ok: true };
    },
    deleteUser: async (employeeId) => {
      const emp = employees.find(e => e.id === employeeId);
      setEmployees(employees.filter(e => e.id !== employeeId));
      try { await sbDelete("employees", "id", employeeId); }
      catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't delete user from database: ${err.message}` })); }
      logActivity(`${emp?.name || "A user"} was deleted.`, "user_deleted", null, null);
    },
    deleteQuiz: async (moduleId) => {
      setQuizzes(prev => ({ ...prev, [moduleId]: [] }));
      setModules(modules.map(m => m.id === moduleId ? { ...m, hasQuiz: false } : m));
      try {
        await sbDelete("quiz_questions", "module_id", moduleId);
        await sbUpdate("modules", "id", moduleId, { has_quiz: false });
      } catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't delete quiz from database: ${err.message}` })); }
      logActivity(`Quiz deleted for a module.`, "quiz_deleted", null, null);
    },
    deleteAttachment: async (moduleId, attachment) => {
      setModules(modules.map(m => m.id === moduleId ? { ...m, attachments: m.attachments.filter(a => a !== attachment) } : m));
      try {
        if (attachment.id) await sbDelete("module_attachments", "id", attachment.id);
        if (attachment.path) await sbDeleteFile(attachment.path);
      } catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't delete file from database: ${err.message}` })); }
      logActivity(`Deleted material "${attachment.name}".`, "material_deleted", null, null);
    },
    addCelebration: async (title, description, category) => {
      try {
        const [inserted] = await sbInsert("celebrations", [{ title, description, category }]);
        setCelebrations(prev => [fromDbCelebration(inserted), ...prev]);
      } catch (err) {
        setDataStatus(s => ({ ...s, error: `Couldn't save celebration to database: ${err.message}` }));
        setCelebrations(prev => [{ id: Date.now(), title, description, category, date: new Date().toISOString().slice(0, 10) }, ...prev]);
      }
      logActivity(`Celebration posted: "${title}".`, "celebration", null, null);
    },
    deleteCelebration: async (id) => {
      setCelebrations(celebrations.filter(c => c.id !== id));
      try { await sbDelete("celebrations", "id", id); }
      catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't delete celebration from database: ${err.message}` })); }
    },
    deleteReport: async (id) => {
      const report = reports.find(r => r.id === id);
      setReports(reports.filter(r => r.id !== id));
      try {
        await sbDelete("reports", "id", id);
        if (report?.fileUrl) {
          const path = report.fileUrl.split(`/${STORAGE_BUCKET}/`)[1];
          if (path) await sbDeleteFile(path);
        }
      } catch (err) { setDataStatus(s => ({ ...s, error: `Couldn't delete report file: ${err.message}` })); }
      logActivity(`Deleted report "${report?.fileName}".`, "material_deleted", null, null);
    },
  };

  const roleMeta = {
    admin: { label: "Admin (Training Team)", icon: Shield },
    manager: { label: "Manager", icon: UserCog },
    trainee: { label: "Trainee", icon: GraduationCap },
  };

  return (
    <div className="tp-root min-h-screen p-4 md:p-6">
      <Theme />
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="tp-display font-extrabold text-2xl text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center tp-shimmer tp-float" style={{ boxShadow: "0 8px 20px -6px rgba(201,162,75,0.6)" }}>
                <GraduationCap size={19} color="#0B2545" />
              </div>
              Amplify <span className="tp-gold-text">Training & Development</span>
            </div>
            <div className="text-xs ml-[52px] flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
              {dataStatus.loading ? "Connecting to database…" :
                dataStatus.connected ? <><span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)" }} /> Connected to live database</> :
                <span className="tp-red-text">Offline — using local data ({dataStatus.error})</span>}
            </div>
          </div>
          <div className="tp-card p-1 flex gap-1 items-center">
            <button onClick={() => setShowInstallGuide(true)} className="p-2 rounded-lg hover:bg-gray-50" title="Add to phone home screen">
              <Smartphone size={15} className="tp-navy-text" />
            </button>
            {Object.entries(roleMeta).map(([key, meta]) => (
              <button key={key} onClick={() => { setRole(key); setShowSignUp(false); setLoggedInEmployeeId(null); setLoggedInManagerId(null); setAdminAuthenticated(false); clearSession(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${role === key ? "tp-tab-active" : "tp-tab hover:bg-gray-50"}`}>
                <meta.icon size={13} /> {meta.label}
              </button>
            ))}
            {(role === "admin" || (role === "manager" && loggedInManagerId) || (role === "trainee" && loggedInEmployeeId)) && (
              <div className="relative ml-1">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg hover:bg-gray-50">
                  <Sparkles size={15} className="tp-navy-text" />
                  {myNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 tp-red-bg text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "var(--red)" }}>{myNotifications.length}</span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 tp-card p-3 z-40 tp-pop">
                    <div className="text-xs font-semibold mb-2">Notifications</div>
                    {myNotifications.length === 0 && <div className="text-xs tp-slate-text">No notifications.</div>}
                    <div className="grid gap-2 max-h-64 overflow-y-auto tp-scrollbar">
                      {myNotifications.map(n => (
                        <div key={n.id} className="text-xs tp-ice-bg rounded-md p-2">{n.text}<div className="tp-slate-text mt-1">{n.date}</div></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="tp-glass p-3 md:p-5">
          {role === "trainee" && !loggedInEmployeeId && !showSignUp && (
            <EmployeeLoginGate employees={employees} onSuccess={(id) => { setLoggedInEmployeeId(id); saveSession({ type: "trainee", id }); logActivity(`${employees.find(e => e.id === id)?.name} logged in.`, "login", null, id); }} onGoToSignUp={() => { setSignUpDefaultRole("trainee"); setShowSignUp(true); }} />
          )}
          {role === "trainee" && loggedInEmployeeId && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>Logged in as {employees.find(e => e.id === loggedInEmployeeId)?.name}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowChangePassword(true)} className="text-xs tp-gold-text font-medium">Change password</button>
                <button onClick={() => { setLoggedInEmployeeId(null); clearSession(); }} className="text-xs tp-gold-text font-medium">Log out</button>
              </div>
            </div>
          )}

          {role === "manager" && !loggedInManagerId && !showSignUp && (
            <ManagerLoginGate managers={managers} onSuccess={(id) => { setLoggedInManagerId(id); saveSession({ type: "manager", id }); logActivity(`${managers.find(m => m.id === id)?.name} logged in.`, "login", null, id); }} onGoToSignUp={() => { setSignUpDefaultRole("manager"); setShowSignUp(true); }} />
          )}
          {role === "manager" && loggedInManagerId && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>Logged in as {managers.find(m => m.id === loggedInManagerId)?.name}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowChangePassword(true)} className="text-xs tp-gold-text font-medium">Change password</button>
                <button onClick={() => { setLoggedInManagerId(null); clearSession(); }} className="text-xs tp-gold-text font-medium">Log out</button>
              </div>
            </div>
          )}

          {role === "admin" && !adminAuthenticated && <AdminLoginGate onSuccess={() => { setAdminAuthenticated(true); saveSession({ type: "admin", id: null }); logActivity("Admin logged in.", "login", null, null); }} />}
          {role === "admin" && adminAuthenticated && (
            <div className="flex items-center justify-end mb-3">
              <button onClick={() => { setAdminAuthenticated(false); clearSession(); }} className="text-xs tp-gold-text font-medium">Log out</button>
            </div>
          )}
          {role === "admin" && adminAuthenticated && <AdminView state={state} actions={actions} />}
          {role === "manager" && loggedInManagerId && <ManagerView state={state} managerId={loggedInManagerId} actions={actions} />}
          {(role === "trainee" || role === "manager") && showSignUp && (
            <SignUpView onSubmit={async (...args) => { await actions.signUp(...args); }} managers={managers} defaultRole={signUpDefaultRole} />
          )}
          {role === "trainee" && loggedInEmployeeId && <TraineeView state={state} employeeId={loggedInEmployeeId} actions={actions} />}
          {showChangePassword && (
            <ChangePasswordModal
              onClose={() => setShowChangePassword(false)}
              onSubmit={(current, next) => actions.changePassword(role === "trainee" ? loggedInEmployeeId : loggedInManagerId, current, next)}
            />
          )}
          {showInstallGuide && <InstallGuideModal onClose={() => setShowInstallGuide(false)} />}
        </div>
      </div>
    </div>
  );
}

export default function AmplifyTrainingApp() {
  return (
    <AppErrorBoundary>
      <AmplifyTrainingAppInner />
    </AppErrorBoundary>
  );
}
