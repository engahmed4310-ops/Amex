import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  LayoutDashboard, BookOpen, ClipboardCheck, BarChart3, Users, Send,
  Trophy, Star, Clock, CheckCircle2, XCircle, PlusCircle, Download,
  Award, Flame, Target, ChevronRight, X, Shield, UserCog, GraduationCap,
  Sparkles, TrendingUp, FileSpreadsheet, Crown, Medal, Zap, Upload, Paperclip, FileText, Image as ImageIcon, File as FileIcon,
  MessageSquare, AlertTriangle, Headphones
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
const initialEmployees = [
  { id: 1, name: "Sara Al-Otaibi", dept: "Mass", role: "trainee", managerId: 101, points: 480, streak: 4, status: "active", pin: "4821" },
  { id: 2, name: "Faisal Al-Harbi", dept: "Mass", role: "trainee", managerId: 101, points: 210, streak: 1, status: "active", pin: "3390" },
  { id: 3, name: "Noura Al-Qahtani", dept: "Platinum", role: "trainee", managerId: 102, points: 630, streak: 7, status: "active", pin: "7715" },
  { id: 4, name: "Khalid Al-Zahrani", dept: "Platinum", role: "trainee", managerId: 102, points: 95, streak: 0, status: "active", pin: "2204" },
  { id: 5, name: "Lama Al-Dosari", dept: "Centurion", role: "trainee", managerId: 101, points: 340, streak: 2, status: "active", pin: "9067" },
];

const initialManagers = [
  { id: 101, name: "Omar Al-Ghamdi", dept: "Operations", pin: "1120" },
  { id: 102, name: "Reem Al-Sulaiman", dept: "Compliance", pin: "5543" },
];

const initialModules = [
  { id: 1, title: "AML & Financial Crime Awareness", desc: "Core anti-money-laundering principles and red flags.", points: 100, hasQuiz: true, mandatory: true },
  { id: 2, title: "Customer Data Privacy (PDPL)", desc: "Handling customer data under KSA's PDPL.", points: 80, hasQuiz: true, mandatory: true },
  { id: 3, title: "Service Excellence Standards", desc: "Card-member service expectations and etiquette.", points: 60, hasQuiz: false, mandatory: false },
];

const initialClassTrainings = [
  {
    id: 9001, name: "AML Refresher Workshop", date: "2026-07-20",
    sessions: [{ date: "2026-07-20", hours: 3 }, { date: "2026-07-21", hours: 2 }],
    quizEnabled: true,
    enrollments: [
      { employeeId: 3, quizScore: 90, comments: [{ text: "Engaged well, asked strong questions.", date: "2026-07-20" }] },
    ],
  },
];

const initialNotifications = [
  { id: 1, text: "Noura Al-Qahtani was enrolled in \"AML Refresher Workshop\" by Reem Al-Sulaiman.", date: "2026-07-20" },
];

const initialMonthlyFeedback = [];
const initialCoachingSessions = [];

const initialAssignments = [
  { id: 1, employeeId: 1, moduleId: 1, progress: 100, timeSpentMin: 42, quizScore: 92, status: "completed" },
  { id: 2, employeeId: 1, moduleId: 2, progress: 60, timeSpentMin: 18, quizScore: null, status: "in_progress" },
  { id: 3, employeeId: 2, moduleId: 1, progress: 30, timeSpentMin: 9, quizScore: null, status: "in_progress" },
  { id: 4, employeeId: 3, moduleId: 1, progress: 100, timeSpentMin: 35, quizScore: 100, status: "completed" },
  { id: 5, employeeId: 3, moduleId: 2, progress: 100, timeSpentMin: 25, quizScore: 88, status: "completed" },
  { id: 6, employeeId: 4, moduleId: 1, progress: 0, timeSpentMin: 0, quizScore: null, status: "not_started" },
  { id: 7, employeeId: 5, moduleId: 3, progress: 100, timeSpentMin: 15, quizScore: null, status: "completed" },
];

const initialPending = [
  { id: 501, name: "Yousef Al-Anazi", dept: "Platinum", requestedAt: "2 days ago" },
  { id: 502, name: "Hind Al-Muteiri", dept: "Mass", requestedAt: "1 day ago" },
];

const initialQuiz = [
  { id: 1, q: "What is the primary purpose of AML controls?", options: ["Increase sales", "Detect and prevent illicit fund flows", "Reduce paperwork", "Speed up onboarding"], correct: 1 },
  { id: 2, q: "A 'red flag' transaction is best described as:", options: ["A large but explainable transfer", "One matching a customer's normal profile", "One inconsistent with known customer behavior", "Any transaction over 100 SAR"], correct: 2 },
  { id: 3, q: "Suspicious activity should be reported to:", options: ["A colleague informally", "The compliance/MLRO function", "The customer directly", "Social media"], correct: 1 },
];

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
function deptColor(name) {
  return DEPARTMENTS.find(d => d.name === name)?.color || "var(--slate)";
}
function managerName(managers, managerId) {
  return managers.find(m => m.id === managerId)?.name || "Unassigned";
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
function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
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
  if (!res.ok) throw new Error(`${table} select failed (${res.status})`);
  return res.json();
}
async function sbInsert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...sbHeaders, Prefer: "return=representation" },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`${table} insert failed (${res.status})`);
  return res.json();
}
async function sbDelete(table, column, value) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, { method: "DELETE", headers: sbHeaders });
  if (!res.ok) throw new Error(`${table} delete failed (${res.status})`);
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
    first_name, last_name,
    department_id: deptNameToId[appEmp.dept] || null,
    manager_id: appEmp.managerId || null,
    role: appEmp.role, points: appEmp.points || 0, streak: appEmp.streak || 0,
    status: appEmp.status || "active", pin: appEmp.pin,
  };
}
function fromDbEmployee(row, deptIdToName) {
  return {
    id: row.id, name: `${row.first_name} ${row.last_name}`.trim(),
    dept: deptIdToName[row.department_id] || DEPARTMENTS[0].name,
    managerId: row.manager_id, role: row.role, points: row.points, streak: row.streak,
    status: row.status, pin: row.pin,
  };
}
function fromDbPending(row, deptIdToName) {
  return {
    id: row.id, name: `${row.first_name} ${row.last_name}`.trim(),
    dept: deptIdToName[row.department_id] || DEPARTMENTS[0].name,
    managerId: row.requested_manager_id, requestedAt: row.requested_at?.slice(0, 10) || "recently",
    pin: row.pin,
  };
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
  const [deptFilter, setDeptFilter] = useState("all");
  const [uploadFileName, setUploadFileName] = useState("");
  const [materialText, setMaterialText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkFileName, setBulkFileName] = useState("");
  const [bulkError, setBulkError] = useState("");
  const [reportFileName, setReportFileName] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [reportQuestion, setReportQuestion] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");

  const handleReportFile = (file) => {
    setReportFileName(file.name);
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
      actions.saveReport({ id: Date.now(), fileName: reportFileName || "Pasted content", question: reportQuestion, analysis: text, date: new Date().toISOString().slice(0, 10) });
      setReportQuestion("");
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
          const dept = get("department", "category");
          const mgr = get("manager", "manager name");
          const matchedMgr = managers.find(m => m.name.toLowerCase().includes(mgr.toLowerCase()) || mgr.toLowerCase().includes(m.name.toLowerCase()));
          const matchedDept = DEPARTMENTS.find(d => d.name.toLowerCase() === dept.toLowerCase())?.name || DEPARTMENTS[0].name;
          return { name: `${first} ${last}`.trim(), dept: matchedDept, managerId: matchedMgr?.id || managers[0]?.id, managerLabel: matchedMgr?.name || `Unmatched — defaulting to ${managers[0]?.name}` };
        }).filter(r => r.name);
        if (parsed.length === 0) setBulkError("No valid rows found. Make sure the sheet has First Name, Last Name, Department, and Manager columns.");
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

  const generateQuizFromUpload = async () => {
    if (!materialText.trim()) return;
    setGenerating(true); setGenError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are creating a multiple-choice quiz for an employee training module at a financial services company in Saudi Arabia. Based on the training content below, write exactly 5 quiz questions, each with 4 answer options and exactly one correct answer. Respond ONLY with valid JSON and nothing else — no markdown fences, no preamble — in this exact shape: [{"q": "question text", "options": ["a","b","c","d"], "correct": 0}]. Training content:\n\n${materialText}`
          }]
        })
      });
      const data = await res.json();
      const textOut = (data.content || []).map(c => c.text || "").join("");
      const clean = textOut.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const newId = Date.now();
      const modTitle = uploadFileName.replace(/\.(pptx|ppt)$/i, "") || "Uploaded Training Module";
      actions.addModule({ id: newId, title: modTitle, desc: materialText.slice(0, 140), points: 50, hasQuiz: false });
      setQuizDraft(parsed);
      setShowQuizBuilder(newId);
      setMaterialText(""); setUploadFileName("");
    } catch (err) {
      setGenError("Couldn't generate the quiz automatically — check the content and try again, or build the quiz manually below.");
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
              {DEPARTMENTS.map(d => {
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
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map(d => {
                const count = state.employees.filter(e => e.dept === d.name).length;
                if (!count) return null;
                return (
                  <div key={d.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: d.color + "15" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs font-medium" style={{ color: d.color }}>{d.name}</span>
                    <span className="text-xs tp-slate-text">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "content" && (
        <div>
          <div className="tp-card p-4 mb-4">
            <div className="font-semibold mb-1 flex items-center gap-2"><Sparkles size={16} className="tp-gold-text" /> Upload training material</div>
            <p className="text-xs tp-slate-text mb-3">Upload a PowerPoint file, paste its key content below, and generate a quiz automatically. The module PDF and file conversion happen on the backend — this demo generates the quiz live using AI.</p>
            <input type="file" accept=".ppt,.pptx,.pdf" onChange={e => setUploadFileName(e.target.files[0]?.name || "")}
              className="text-xs mb-2 block" />
            {uploadFileName && <div className="text-xs tp-blue-text mb-2">Selected: {uploadFileName} → will be converted to PDF on upload</div>}
            <textarea className="tp-input" rows={4} placeholder="Paste the slide content / key talking points here so the AI can write quiz questions from it"
              value={materialText} onChange={e => setMaterialText(e.target.value)} />
            <button onClick={generateQuizFromUpload} disabled={generating || !materialText.trim()}
              className="tp-btn-gold rounded-lg px-4 py-2 text-sm font-semibold mt-3 flex items-center gap-2 disabled:opacity-40">
              <Sparkles size={15} /> {generating ? "Generating quiz…" : "Generate quiz with AI"}
            </button>
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
                        <a key={i} href={f.url} download={f.name} className="text-xs px-2 py-1 rounded-full tp-ice-bg tp-blue-text flex items-center gap-1">
                          <Paperclip size={11} /> {f.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => setShowQuizBuilder(m.id)} className="text-sm tp-blue-text font-medium flex items-center gap-1">
                  {m.hasQuiz ? "Edit quiz" : "Add quiz"} <ChevronRight size={14} />
                </button>
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
            <p className="text-xs tp-slate-text mb-3">Upload a spreadsheet with columns: First Name, Last Name, Department (Mass/Platinum/Centurion), Manager. Employees are added directly — no individual approval needed since you're uploading the list yourself.</p>
            <input type="file" accept=".xlsx,.xls,.csv" className="text-xs" onChange={e => e.target.files[0] && parseBulkFile(e.target.files[0])} />
            {bulkError && <div className="text-xs tp-red-text mt-2">{bulkError}</div>}
            {bulkRows.length > 0 && (
              <div className="mt-3">
                <div className="text-xs tp-slate-text mb-2">{bulkFileName} · {bulkRows.length} employees found</div>
                <div className="tp-card overflow-x-auto tp-scrollbar mb-3">
                  <table className="w-full text-xs">
                    <thead><tr className="text-left tp-slate-text border-b" style={{ borderColor: "var(--line)" }}>
                      <th className="p-2">Name</th><th className="p-2">Department</th><th className="p-2">Manager</th>
                    </tr></thead>
                    <tbody>
                      {bulkRows.map((r, i) => (
                        <tr key={i} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                          <td className="p-2">{r.name}</td><td className="p-2"><DeptBadge dept={r.dept} /></td><td className="p-2">{r.managerLabel}</td>
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
              <div className="font-semibold mb-1 flex items-center gap-2"><Shield size={16} className="tp-gold-text" /> New login PINs for bulk-imported employees</div>
              <p className="text-xs tp-slate-text mb-3">These were imported directly, not self-registered, so a PIN was generated for them. Share it once, then dismiss. (Employees who sign themselves up choose their own PIN — nothing to share for those.)</p>
              <div className="grid gap-2">
                {state.credentialsToShare.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded-lg tp-ice-bg">
                    <span className="text-sm font-medium">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="tp-display font-bold text-lg tracking-widest tp-navy-text">{c.pin}</span>
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
                      <span className="text-xs tp-slate-text">requested {p.requestedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select id={`role-${p.id}`} defaultValue="trainee" className="tp-input text-sm w-auto">
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
                <th className="p-3">Employee</th><th className="p-3">Category</th><th className="p-3">Manager</th>
              </tr></thead>
              <tbody>
                {state.employees.filter(e => e.role === "trainee").map(e => (
                  <tr key={e.id} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                    <td className="p-3 font-medium">{e.name}</td>
                    <td className="p-3"><DeptBadge dept={e.dept} /></td>
                    <td className="p-3 tp-slate-text">{managerName(managers, e.managerId)}</td>
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
              {DEPARTMENTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
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
              </div>
            ))}
          </div>
        </div>
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
            <input type="file" multiple className="text-xs" onChange={e => {
              const files = Array.from(e.target.files).map(f => ({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f) }));
              setNewModule({ ...newModule, attachments: [...newModule.attachments, ...files] });
            }} />
            {newModule.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newModule.attachments.map((f, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full tp-ice-bg flex items-center gap-1">
                    <Paperclip size={11} /> {f.name}
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

  return (
    <div>
      <Tabs active={tab} onChange={setTab} tabs={[
        { key: "team", label: "My Team", icon: Users },
        { key: "assign", label: "Assign Training", icon: Send },
        { key: "progress", label: "Progress", icon: TrendingUp },
        { key: "classes", label: "In-Class Training", icon: GraduationCap },
        { key: "coaching", label: "Coaching & Comments", icon: Headphones },
        { key: "feedback", label: "Monthly Feedback", icon: ClipboardCheck },
      ]} />

      {tab === "team" && (
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
      )}

      {tab === "assign" && (
        <div className="tp-card p-4 grid gap-3 max-w-md">
          <label className="text-xs tp-slate-text">Employee</label>
          <select className="tp-input" value={assignEmp} onChange={e => setAssignEmp(e.target.value)}>
            {team.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <label className="text-xs tp-slate-text">Training module</label>
          <select className="tp-input" value={assignMod} onChange={e => setAssignMod(e.target.value)}>
            {state.modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
          <button onClick={() => actions.assign(assignEmp, assignMod, myName)} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 justify-center">
            <Send size={15} /> Assign module
          </button>
        </div>
      )}

      {tab === "progress" && (
        <div className="tp-card overflow-x-auto tp-scrollbar">
          <table className="w-full text-sm">
            <thead><tr className="text-left tp-slate-text border-b" style={{ borderColor: "var(--line)" }}>
              <th className="p-3">Employee</th><th className="p-3">Module</th><th className="p-3">Progress</th>
              <th className="p-3"><Clock size={13} className="inline mr-1" />Time</th><th className="p-3">Quiz Score</th>
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
                    <td className="p-3">{a.timeSpentMin}m</td>
                    <td className="p-3">{a.quizScore != null ? `${a.quizScore}%` : "—"}</td>
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
    </div>
  );
}
function TraineeView({ state, employeeId, actions }) {
  const [tab, setTab] = useState("training");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

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

  const selectAnswer = (oi) => {
    const next = [...answers]; next[qIndex] = oi; setAnswers(next);
  };

  const finishQuiz = () => {
    const correct = state.quiz.filter((q, i) => answers[i] === q.correct).length;
    const score = Math.round((correct / state.quiz.length) * 100);
    setResult(score);
    actions.submitQuiz(employeeId, activeQuiz, score);
  };

  return (
    <div>
      <Tabs active={tab} onChange={setTab} tabs={[
        { key: "training", label: "My Training", icon: BookOpen },
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
                  <span className="text-xs tp-slate-text">{a.progress}% complete · {a.timeSpentMin} min spent</span>
                  {mod.hasQuiz && a.quizScore == null && (
                    <button onClick={() => startQuiz(mod.id)} className="tp-btn-primary rounded-lg px-3 py-1.5 text-xs font-medium">Take quiz</button>
                  )}
                  {a.quizScore != null && <span className="text-xs tp-green-text font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> Scored {a.quizScore}%</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "achievements" && (
        <div>
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
              <div className="text-xs tp-slate-text mb-2">Question {qIndex + 1} of {state.quiz.length}</div>
              <ProgressBar value={((qIndex) / state.quiz.length) * 100} />
              <div className="font-semibold my-4">{state.quiz[qIndex].q}</div>
              <div className="grid gap-2 mb-4">
                {state.quiz[qIndex].options.map((opt, oi) => (
                  <button key={oi} onClick={() => selectAnswer(oi)}
                    className={`text-left tp-input ${answers[qIndex] === oi ? "tp-blue-bg text-white" : ""}`}>
                    {opt}
                  </button>
                ))}
              </div>
              {qIndex < state.quiz.length - 1 ? (
                <button disabled={answers[qIndex] == null} onClick={() => setQIndex(qIndex + 1)} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40">Next</button>
              ) : (
                <button disabled={answers[qIndex] == null} onClick={finishQuiz} className="tp-btn-gold rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40">Submit quiz</button>
              )}
            </div>
          ) : (
            <div className="text-center py-4 tp-pop">
              <Sparkles size={36} className="tp-gold-text mx-auto mb-2" />
              <div className="tp-display font-bold text-2xl mb-1">{result}%</div>
              <div className="tp-slate-text text-sm mb-4">{result >= 80 ? "Great work — badge points added!" : "Nice try — review the module and retake later."}</div>
              <button onClick={() => setActiveQuiz(null)} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Close</button>
            </div>
          )}
        </Modal>
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

  const createClass = (prefillDate) => {
    if (!newClass.name.trim() || !(newClass.date || prefillDate)) return;
    const id = Date.now();
    actions.addClassTraining({ id, name: newClass.name, date: prefillDate || newClass.date, sessions: [], quizEnabled: false, enrollments: [] }, actorName);
    setNewClass({ name: "", date: "" });
    setShowNewClass(false);
    setClassTab(id);
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
                      {activeClass.quizEnabled && (
                        scope === "admin" ? (
                          <input type="number" className="tp-input w-20 text-xs" placeholder="Score %" defaultValue={en.quizScore ?? ""}
                            onBlur={e => actions.setClassQuizScore(activeClass.id, en.employeeId, e.target.value === "" ? null : Number(e.target.value))} />
                        ) : (
                          <span className="text-xs font-semibold">{en.quizScore != null ? `${en.quizScore}%` : "Not scored yet"}</span>
                        )
                      )}
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

/* ---------------------------------- MONTHLY FEEDBACK (manager) ---------------------------------- */
function MonthlyFeedbackView({ state, managerId, actions }) {
  const team = state.employees.filter(e => e.managerId === managerId);
  const monthKey = currentMonthKey();
  const [drafts, setDrafts] = useState({});

  const submittedFor = (employeeId) => state.monthlyFeedback.find(f => f.managerId === managerId && f.employeeId === employeeId && f.month === monthKey);

  const submit = (employeeId) => {
    const d = drafts[employeeId] || {};
    actions.submitMonthlyFeedback({
      id: Date.now(), managerId, employeeId, month: monthKey,
      needsTraining: !!d.needsTraining, comment: d.comment || "", submittedAt: new Date().toISOString().slice(0, 10),
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
          const d = drafts[e.id] || { needsTraining: false, comment: "" };
          return (
            <div key={e.id} className="tp-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold flex items-center gap-2">{e.name} <DeptBadge dept={e.dept} /></div>
                {submitted ? <span className="text-xs tp-green-text font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> Submitted {submitted.submittedAt}</span>
                  : <span className="text-xs tp-red-text font-semibold">Not submitted this month</span>}
              </div>
              {!submitted && (
                <div className="grid gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={d.needsTraining} onChange={ev => setDrafts({ ...drafts, [e.id]: { ...d, needsTraining: ev.target.checked } })} />
                    This employee needs additional training
                  </label>
                  <textarea className="tp-input" rows={2} placeholder="Monthly feedback comments"
                    value={d.comment} onChange={ev => setDrafts({ ...drafts, [e.id]: { ...d, comment: ev.target.value } })} />
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


/* ---------------------------------- LOGIN GATES (name + PIN, no company data) ---------------------------------- */
function EmployeeLoginGate({ employees, onSuccess, onGoToSignUp, onPreview }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const tryLogin = () => {
    const full = `${firstName.trim()} ${lastName.trim()}`.trim().toLowerCase();
    const match = employees.find(e => e.name.toLowerCase() === full && e.pin === pin);
    if (match) { setError(""); onSuccess(match.id); }
    else setError("Name or PIN didn't match — check with your manager if you're unsure of your PIN.");
  };

  return (
    <div className="tp-card p-6 max-w-sm mx-auto text-center mt-6">
      <GraduationCap size={28} className="tp-navy-text mx-auto mb-2" />
      <div className="font-semibold mb-1">Employee login</div>
      <div className="text-xs tp-slate-text mb-4">Enter your name and the 4-digit PIN your manager gave you.</div>
      <div className="grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <input className="tp-input" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input className="tp-input" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
        <input className="tp-input text-center tracking-widest" placeholder="PIN" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} />
        {error && <div className="text-xs tp-red-text">{error}</div>}
        <button onClick={tryLogin} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Log in</button>
        <button onClick={onGoToSignUp} className="text-xs tp-blue-text font-medium">New here? Sign up for access →</button>
        <button onClick={onPreview} className="text-xs tp-slate-text mt-2">Admin: skip login for testing →</button>
      </div>
    </div>
  );
}

function ManagerLoginGate({ managers, onSuccess, onPreview }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const tryLogin = () => {
    const full = `${firstName.trim()} ${lastName.trim()}`.trim().toLowerCase();
    const match = managers.find(m => m.name.toLowerCase() === full && m.pin === pin);
    if (match) { setError(""); onSuccess(match.id); }
    else setError("Name or PIN didn't match.");
  };

  return (
    <div className="tp-card p-6 max-w-sm mx-auto text-center mt-6">
      <UserCog size={28} className="tp-navy-text mx-auto mb-2" />
      <div className="font-semibold mb-1">Manager login</div>
      <div className="text-xs tp-slate-text mb-4">Enter your name and your 4-digit PIN.</div>
      <div className="grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <input className="tp-input" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input className="tp-input" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
        <input className="tp-input text-center tracking-widest" placeholder="PIN" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} />
        {error && <div className="text-xs tp-red-text">{error}</div>}
        <button onClick={tryLogin} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Log in</button>
        <button onClick={onPreview} className="text-xs tp-slate-text mt-2">Admin: skip login for testing →</button>
      </div>
    </div>
  );
}

function SignUpView({ onSubmit, managers }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dept, setDept] = useState(DEPARTMENTS[0].name);
  const [managerId, setManagerId] = useState(managers[0]?.id);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!firstName.trim() || !lastName.trim()) { setError("Enter your first and last name."); return; }
    if (pin.length !== 4) { setError("Choose a 4-digit PIN."); return; }
    if (pin !== confirmPin) { setError("PINs don't match."); return; }
    setError("");
    onSubmit(`${firstName.trim()} ${lastName.trim()}`, dept, managerId, pin);
    setSubmitted(true);
  };

  return (
    <div className="tp-card p-6 max-w-sm mx-auto text-center mt-10">
      {submitted ? (
        <div className="tp-pop">
          <ClipboardCheck size={32} className="tp-blue-text mx-auto mb-3" />
          <div className="font-semibold mb-1">Request submitted</div>
          <div className="text-sm tp-slate-text">Your access is pending approval from the training team. Once approved, log in with your name and the PIN you just chose.</div>
        </div>
      ) : (
        <div className="grid gap-3">
          <UserCog size={28} className="tp-navy-text mx-auto mb-1" />
          <div className="font-semibold">Sign up</div>
          <div className="text-xs tp-slate-text -mt-2">No company email or ID needed — just your name, department, manager, and a PIN you'll remember.</div>
          <div className="grid grid-cols-2 gap-2">
            <input className="tp-input" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input className="tp-input" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <label className="text-xs tp-slate-text text-left -mb-2">Department</label>
          <select className="tp-input" value={dept} onChange={e => setDept(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
          <label className="text-xs tp-slate-text text-left -mb-2">Manager</label>
          <select className="tp-input" value={managerId} onChange={e => setManagerId(e.target.value)}>
            {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <label className="text-xs tp-slate-text text-left -mb-2">Choose a 4-digit PIN</label>
          <div className="grid grid-cols-2 gap-2">
            <input className="tp-input text-center tracking-widest" placeholder="PIN" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} />
            <input className="tp-input text-center tracking-widest" placeholder="Confirm PIN" maxLength={4} value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ""))} />
          </div>
          {error && <div className="text-xs tp-red-text">{error}</div>}
          <button onClick={submit} className="tp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Submit for approval</button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- ROOT APP ---------------------------------- */
export default function TrainingPlatformPrototype() {
  const [employees, setEmployees] = useState([
    ...initialEmployees,
    ...initialManagers.map(m => ({ id: m.id, name: m.name, dept: m.dept, role: "manager", managerId: null, points: 0, streak: 0, status: "active", pin: m.pin })),
  ]);
  const [modules, setModules] = useState(initialModules);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [pending, setPending] = useState(initialPending);
  const [quiz, setQuiz] = useState(initialQuiz);
  const [classTrainings, setClassTrainings] = useState(initialClassTrainings);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [monthlyFeedback, setMonthlyFeedback] = useState(initialMonthlyFeedback);
  const [endorsements, setEndorsements] = useState([]);
  const [coachingSessions, setCoachingSessions] = useState(initialCoachingSessions);
  const [credentialsToShare, setCredentialsToShare] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [role, setRole] = useState("admin");
  const [demoUserId, setDemoUserId] = useState(1);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null);
  const [loggedInManagerId, setLoggedInManagerId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [dataStatus, setDataStatus] = useState({ loading: true, error: null, connected: false });
  const [deptMaps, setDeptMaps] = useState({ nameToId: {}, idToName: {} });
  const [trainingRequests, setTrainingRequests] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const depts = await sbSelect("departments", "select=id,name");
        const nameToId = {}, idToName = {};
        depts.forEach(d => { nameToId[d.name] = d.id; idToName[d.id] = d.name; });
        setDeptMaps({ nameToId, idToName });

        let dbManagers = await sbSelect("employees", "role=eq.manager&select=*");
        if (dbManagers.length === 0) {
          // First run — seed the two demo managers into the real database so
          // manager_id references work from here on.
          const seeded = await sbInsert("employees", initialManagers.map(m => ({
            first_name: splitName(m.name).first_name, last_name: splitName(m.name).last_name,
            department_id: nameToId[m.dept] || null, role: "manager", points: 0, streak: 0, status: "active", pin: m.pin,
          })));
          dbManagers = seeded;
        }
        const dbTrainees = await sbSelect("employees", "role=eq.trainee&select=*");
        const dbPending = await sbSelect("pending_signups", "select=*");

        setEmployees([...dbManagers, ...dbTrainees].map(r => fromDbEmployee(r, idToName)));
        setPending(dbPending.map(r => fromDbPending(r, idToName)));
        setDataStatus({ loading: false, error: null, connected: true });
      } catch (err) {
        setDataStatus({ loading: false, error: err.message, connected: false });
      }
    })();
  }, []);

  const managers = employees.filter(e => e.role === "manager");
  const myNotifications = role === "admin" ? notifications.filter(n => n.audience === "admin" || !n.audience)
    : role === "manager" ? notifications.filter(n => n.audience === "manager" && n.recipientId === loggedInManagerId)
    : notifications.filter(n => n.audience === "trainee" && n.recipientId === loggedInEmployeeId);
  const state = { employees, modules, assignments, pending, quiz, classTrainings, notifications, monthlyFeedback, endorsements, coachingSessions, credentialsToShare, trainingRequests, reports };

  const notify = (text, audience = "admin", recipientId = null) => {
    setNotifications(prev => [{ id: Date.now() + Math.random(), text, audience, recipientId, date: new Date().toISOString().slice(0, 10) }, ...prev]);
  };

  const actions = {
    addModule: (m) => setModules([...modules, { hasQuiz: false, ...m }]),
    saveQuiz: (moduleId, questions) => {
      setQuiz(questions.map((q, i) => ({ id: i + 1, ...q })));
      setModules(modules.map(m => m.id === moduleId ? { ...m, hasQuiz: true } : m));
    },
    approve: async (id, assignedRole, managerId) => {
      const p = pending.find(p => p.id === id);
      const pin = p.pin || generatePin(); // fallback for any legacy request without a self-chosen PIN
      const finalManagerId = managerId || managers[0]?.id;
      const localEmp = { name: p.name, dept: p.dept, role: assignedRole, managerId: finalManagerId, points: 0, streak: 0, status: "active", pin };
      try {
        const [inserted] = await sbInsert("employees", [toDbEmployee(localEmp, deptMaps.nameToId)]);
        await sbDelete("pending_signups", "id", id);
        const newEmp = fromDbEmployee(inserted, deptMaps.idToName);
        setEmployees([...employees, newEmp]);
        if (!p.pin) setCredentialsToShare([{ id: newEmp.id, name: newEmp.name, pin }, ...credentialsToShare]);
      } catch (err) {
        // Fallback: keep working locally even if the database write failed, and surface it.
        const newId = Date.now();
        setEmployees([...employees, { id: newId, ...localEmp }]);
        if (!p.pin) setCredentialsToShare([{ id: newId, name: p.name, pin }, ...credentialsToShare]);
        setDataStatus({ ...dataStatus, error: `Couldn't save approval to the database: ${err.message}` });
      }
      setPending(pending.filter(x => x.id !== id));
    },
    reject: async (id) => {
      setPending(pending.filter(x => x.id !== id));
      try { await sbDelete("pending_signups", "id", id); }
      catch (err) { setDataStatus({ ...dataStatus, error: `Couldn't remove request from database: ${err.message}` }); }
    },
    assign: (employeeId, moduleId, actorName) => {
      if (assignments.some(a => a.employeeId === employeeId && a.moduleId === moduleId)) return;
      setAssignments([...assignments, { id: Date.now(), employeeId, moduleId, progress: 0, timeSpentMin: 0, quizScore: null, status: "not_started" }]);
      const mod = modules.find(m => m.id === moduleId);
      notify(`You were assigned "${mod?.title}"${actorName ? ` by ${actorName}` : ""}.`, "trainee", employeeId);
    },
    submitQuiz: (employeeId, moduleId, score) => {
      setAssignments(assignments.map(a => a.employeeId === employeeId && a.moduleId === moduleId
        ? { ...a, quizScore: score, progress: 100, status: "completed" } : a));
      const mod = modules.find(m => m.id === moduleId);
      if (score >= 80) setEmployees(employees.map(e => e.id === employeeId ? { ...e, points: e.points + mod.points, streak: e.streak + 1 } : e));
    },
    signUp: async (name, dept, managerId, pin) => {
      const { first_name, last_name } = splitName(name);
      try {
        const [inserted] = await sbInsert("pending_signups", [{
          first_name, last_name, department_id: deptMaps.nameToId[dept] || null, requested_manager_id: managerId, pin,
        }]);
        setPending([...pending, fromDbPending(inserted, deptMaps.idToName)]);
      } catch (err) {
        setPending([...pending, { id: Date.now(), name, dept, managerId, requestedAt: "just now", pin }]);
        setDataStatus({ ...dataStatus, error: `Couldn't save sign-up to database: ${err.message}` });
      }
    },
    addClassTraining: (c, actorName) => {
      setClassTrainings([...classTrainings, c]);
      managers.forEach(m => notify(`New training class added: "${c.name}" on ${c.date} — you can enroll your team from the calendar.`, "manager", m.id));
    },
    logSession: (classId, date, hours) => setClassTrainings(classTrainings.map(c =>
      c.id === classId ? { ...c, sessions: [...c.sessions, { date, hours }] } : c)),
    toggleClassQuiz: (classId, enabled) => setClassTrainings(classTrainings.map(c =>
      c.id === classId ? { ...c, quizEnabled: enabled } : c)),
    enrollInClass: (classId, employeeId, actorName) => {
      const cls = classTrainings.find(c => c.id === classId);
      const emp = employees.find(e => e.id === employeeId);
      setClassTrainings(classTrainings.map(c => c.id === classId
        ? { ...c, enrollments: [...c.enrollments, { employeeId, quizScore: null, comments: [] }] } : c));
      notify(`${emp?.name} was enrolled in "${cls?.name}" by ${actorName}.`, "admin");
      notify(`You were enrolled in "${cls?.name}" by ${actorName}.`, "trainee", employeeId);
      if (emp?.managerId && managerName(managers, emp.managerId) !== actorName) {
        notify(`${emp?.name} was enrolled in "${cls?.name}" by ${actorName}.`, "manager", emp.managerId);
      }
    },
    setClassQuizScore: (classId, employeeId, score) => setClassTrainings(classTrainings.map(c =>
      c.id === classId ? { ...c, enrollments: c.enrollments.map(en => en.employeeId === employeeId ? { ...en, quizScore: score } : en) } : c)),
    addClassComment: (classId, employeeId, text) => setClassTrainings(classTrainings.map(c =>
      c.id === classId ? { ...c, enrollments: c.enrollments.map(en => en.employeeId === employeeId
        ? { ...en, comments: [...en.comments, { text, date: new Date().toISOString().slice(0, 10) }] } : en) } : c)),
    submitMonthlyFeedback: (fb) => setMonthlyFeedback([...monthlyFeedback, fb]),
    endorseTopEmployee: (employeeId, managerId) => {
      if (isEndorsedThisMonth(endorsements, employeeId)) return;
      setEndorsements([...endorsements, { employeeId, managerId, month: currentMonthKey() }]);
      notify(`Congratulations — you're endorsed as Top Employee of the Month!`, "trainee", employeeId);
    },
    bulkImportEmployees: async (rows) => {
      const withPins = rows.map(r => ({ ...r, pin: generatePin() }));
      try {
        const dbRows = withPins.map(r => toDbEmployee({ name: r.name, dept: r.dept, role: "trainee", managerId: r.managerId, points: 0, streak: 0, status: "active", pin: r.pin }, deptMaps.nameToId));
        const inserted = await sbInsert("employees", dbRows);
        const newEmployees = inserted.map(row => fromDbEmployee(row, deptMaps.idToName));
        setEmployees([...employees, ...newEmployees]);
        setCredentialsToShare([...newEmployees.map(e => ({ id: e.id, name: e.name, pin: e.pin })), ...credentialsToShare]);
      } catch (err) {
        const newEmployees = withPins.map((r, i) => ({ id: Date.now() + i, name: r.name, dept: r.dept, role: "trainee", managerId: r.managerId, points: 0, streak: 0, status: "active", pin: r.pin }));
        setEmployees([...employees, ...newEmployees]);
        setCredentialsToShare([...newEmployees.map(e => ({ id: e.id, name: e.name, pin: e.pin })), ...credentialsToShare]);
        setDataStatus({ ...dataStatus, error: `Couldn't save import to database: ${err.message}` });
      }
    },
    addCoachingSession: (session) => setCoachingSessions([...coachingSessions, session]),
    escalateCoaching: (sessionId, actorName) => {
      const session = coachingSessions.find(s => s.id === sessionId);
      const emp = employees.find(e => e.id === session.employeeId);
      setCoachingSessions(coachingSessions.map(s => s.id === sessionId ? { ...s, escalated: true } : s));
      notify(`${actorName} escalated ${emp?.name} for intervention — call quality concern.`, "admin");
    },
    dismissCredential: (id) => setCredentialsToShare(credentialsToShare.filter(c => c.id !== id)),
    requestTraining: (title, reason, suggestedDate, managerId, managerNameStr) => {
      setTrainingRequests([{ id: Date.now(), title, reason, suggestedDate, managerId, status: "pending", requestedAt: new Date().toISOString().slice(0, 10) }, ...trainingRequests]);
      notify(`${managerNameStr} requested a new training: "${title}".`, "admin");
    },
    respondToTrainingRequest: (requestId, approve) => {
      const req = trainingRequests.find(r => r.id === requestId);
      setTrainingRequests(trainingRequests.map(r => r.id === requestId ? { ...r, status: approve ? "approved" : "declined" } : r));
      if (approve) {
        actions.addClassTraining({ id: Date.now(), name: req.title, date: req.suggestedDate, sessions: [], quizEnabled: false, enrollments: [] }, "You (Admin)");
      }
      notify(`Your training request "${req.title}" was ${approve ? "approved and added to the calendar" : "declined"}.`, "manager", req.managerId);
    },
    saveReport: (report) => setReports([report, ...reports]),
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
            {Object.entries(roleMeta).map(([key, meta]) => (
              <button key={key} onClick={() => { setRole(key); setShowSignUp(false); setLoggedInEmployeeId(null); setLoggedInManagerId(null); setPreviewMode(false); }}
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
          {role === "trainee" && !loggedInEmployeeId && !showSignUp && !previewMode && (
            <EmployeeLoginGate employees={employees} onSuccess={setLoggedInEmployeeId} onGoToSignUp={() => setShowSignUp(true)} onPreview={() => setPreviewMode(true)} />
          )}
          {role === "trainee" && previewMode && !loggedInEmployeeId && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>Preview mode — pick anyone:</span>
              <select className="tp-input w-auto text-xs" value={demoUserId} onChange={e => setDemoUserId(Number(e.target.value))}>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <button onClick={() => setLoggedInEmployeeId(demoUserId)} className="tp-btn-primary rounded-lg px-3 py-1.5 text-xs font-medium">View</button>
            </div>
          )}
          {role === "trainee" && loggedInEmployeeId && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>Logged in as {employees.find(e => e.id === loggedInEmployeeId)?.name}</span>
              <button onClick={() => { setLoggedInEmployeeId(null); setPreviewMode(false); }} className="text-xs tp-gold-text font-medium">Log out</button>
            </div>
          )}

          {role === "manager" && !loggedInManagerId && !previewMode && (
            <ManagerLoginGate managers={managers} onSuccess={setLoggedInManagerId} onPreview={() => setPreviewMode(true)} />
          )}
          {role === "manager" && previewMode && !loggedInManagerId && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>Preview mode — pick anyone:</span>
              <select className="tp-input w-auto text-xs" value={demoUserId} onChange={e => setDemoUserId(Number(e.target.value))}>
                {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <button onClick={() => setLoggedInManagerId(demoUserId)} className="tp-btn-primary rounded-lg px-3 py-1.5 text-xs font-medium">View</button>
            </div>
          )}
          {role === "manager" && loggedInManagerId && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>Logged in as {managers.find(m => m.id === loggedInManagerId)?.name}</span>
              <button onClick={() => { setLoggedInManagerId(null); setPreviewMode(false); }} className="text-xs tp-gold-text font-medium">Log out</button>
            </div>
          )}

          {role === "admin" && <AdminView state={state} actions={actions} />}
          {role === "manager" && loggedInManagerId && <ManagerView state={state} managerId={loggedInManagerId} actions={actions} />}
          {role === "trainee" && showSignUp && <SignUpView onSubmit={actions.signUp} managers={managers} />}
          {role === "trainee" && loggedInEmployeeId && <TraineeView state={state} employeeId={loggedInEmployeeId} actions={actions} />}
        </div>
      </div>
    </div>
  );
}
