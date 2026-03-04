// ─── Default Player Data ───────────────────────────────────────────────────
const DEFAULT_PLAYERS = [
  // ── Seniors ──
  { id:  1, number:  9, name: "Tripp Grizzle",       grade: "Senior",    pos: "Midfield", team: "Var",     notes: "" },
  { id:  2, number:  6, name: "Andrew Godfrey",       grade: "Senior",    pos: "Midfield", team: "Var",     notes: "" },
  { id:  3, number: 11, name: "Charleston Englar",    grade: "Senior",    pos: "Midfield", team: "Var",     notes: "" },
  { id:  4, number:  8, name: "Cole McCormack",       grade: "Senior",    pos: "Midfield", team: "Var",     notes: "" },
  { id:  5, number: 34, name: "Connor Hairfield",     grade: "Senior",    pos: "Midfield", team: "Var",     notes: "" },
  { id:  6, number: 10, name: "Eli King",             grade: "Senior",    pos: "Goalie",   team: "Var",     notes: "" },
  { id:  7, number:  1, name: "Patrick Redican",      grade: "Senior",    pos: "Attack",   team: "Var",     notes: "" },
  { id:  8, number: 24, name: "Peter Rosato",         grade: "Senior",    pos: "FOGO",     team: "Var",     notes: "" },
  { id:  9, number:  3, name: "Rivers Matheney",      grade: "Senior",    pos: "Attack",   team: "Var",     notes: "Lefty" },
  { id: 10, number: 11, name: "Tommy King",           grade: "Senior",    pos: "Attack",   team: "Var",     notes: "" },
  { id: 11, number: 16, name: "Tyler Cubello",        grade: "Senior",    pos: "Defense",  team: "Var",     notes: "" },
  // ── Juniors ──
  { id: 12, number:  7, name: "Connor McGovern",      grade: "Junior",    pos: "Midfield", team: "Var",     notes: "" },
  { id: 13, number: 27, name: "Ben Nesseralla",       grade: "Junior",    pos: "Attack",   team: "Var",     notes: "" },
  { id: 14, number: 22, name: "Matthew Ponkow",       grade: "Junior",    pos: "Defense",  team: "Var",     notes: "" },
  { id: 15, number: 24, name: "Tate Murray",          grade: "Junior",    pos: "Defense",  team: "Var",     notes: "" },
  // ── Sophomores ──
  { id: 16, number:  4, name: "Chase Tonon",          grade: "Sophomore", pos: "Midfield", team: "Var",     notes: "" },
  { id: 17, number: 21, name: "Trever Tonon",         grade: "Sophomore", pos: "Midfield", team: "Var",     notes: "" },
  { id: 18, number:  8, name: "Chase Jackson",        grade: "Sophomore", pos: "Attack",   team: "Var",     notes: "" },
  { id: 19, number: 21, name: "John Shultz",          grade: "Sophomore", pos: "Midfield", team: "Var",     notes: "" },
  { id: 20, number: 13, name: "Liam Rodgers",         grade: "Sophomore", pos: "Midfield", team: "Var",     notes: "" },
  { id: 21, number: 29, name: "Noah Jackson",         grade: "Sophomore", pos: "Attack",   team: "Var",     notes: "Lefty" },
  { id: 22, number:  7, name: "Tommy Romano",         grade: "Sophomore", pos: "LSM",      team: "Var",     notes: "" },
  { id: 23, number: 22, name: "Will Garton",          grade: "Sophomore", pos: "Midfield", team: "Var",     notes: "" },
  { id: 24, number: 23, name: "Andrew Horstman",      grade: "Sophomore", pos: "FOGO",     team: "Var",     notes: "" },
  { id: 25, number: 21, name: "Wyatt Combs",          grade: "Sophomore", pos: "Defense",  team: "Var",     notes: "" },
  // ── Freshmen ──
  { id: 26, number: 10, name: "Caden Sheninger",      grade: "Freshman",  pos: "Goalie",   team: "Var",     notes: "" },
  { id: 27, number:  3, name: "Chase Coffey",         grade: "Freshman",  pos: "Midfield", team: "Var",     notes: "" },
  { id: 28, number:  4, name: "Luke Hanson",          grade: "Freshman",  pos: "Defense",  team: "Var",     notes: "" },
  // ── Manager ──
  { id: 29, number:  0, name: "Charlie Godfrey",      grade: "Sophomore", pos: "",         team: "Manager", notes: "" },
];

function emptyStats() {
  return { G: 0, A: 0, SOG: 0, GB: 0, TO: 0, FOU: 0, FOL: 0, shots: [] };
}

// ─── App State ─────────────────────────────────────────────────────────────
let state = {
  players: [],
  stats: {},      // keyed by player id
  selectedId: null,
  game: { opponent: "", date: "" },
  shotType: "goal",
  heatmapEnabled: false,
  nextId: 30
};

// ─── Persistence ───────────────────────────────────────────────────────────
async function loadFromDisk() {
  try {
    if (window.lacrosseAPI) {
      const data = await window.lacrosseAPI.loadData();
      if (data) {
        state.players  = data.players  || DEFAULT_PLAYERS;
        state.stats    = data.stats    || {};
        state.game     = data.game     || { opponent: "", date: "" };
        state.nextId   = data.nextId   || 30;
        // Ensure every player has stats
        state.players.forEach(p => {
          if (!state.stats[p.id]) state.stats[p.id] = emptyStats();
        });
        return;
      }
    }
  } catch(e) { console.warn("Load failed", e); }
  // First run defaults
  state.players = DEFAULT_PLAYERS;
  state.stats = {};
  state.players.forEach(p => { state.stats[p.id] = emptyStats(); });
}

async function saveToDisk() {
  try {
    if (window.lacrosseAPI) {
      await window.lacrosseAPI.saveData({
        players: state.players,
        stats:   state.stats,
        game:    state.game,
        nextId:  state.nextId
      });
      showToast("Saved!", "success");
    }
  } catch(e) { showToast("Save failed", "error"); }
}

// ─── Toast ─────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = ""; }, 2200);
}

// ─── Render Player List ────────────────────────────────────────────────────
function renderPlayerList(filter = "") {
  const list = document.getElementById("player-list");
  const filtered = filter
    ? state.players.filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        String(p.number).includes(filter) ||
        (p.pos  || "").toLowerCase().includes(filter.toLowerCase()) ||
        (p.grade|| "").toLowerCase().includes(filter.toLowerCase())
      )
    : state.players;

  list.innerHTML = `
    <button id="btn-add-player">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Add Player
    </button>
  `;

  filtered.forEach(p => {
    const s = state.stats[p.id] || emptyStats();
    const el = document.createElement("div");
    el.className = "player-item" + (p.id === state.selectedId ? " selected" : "");
    el.dataset.id = p.id;

    const numDisplay = p.number > 0 ? `#${p.number}` : "—";
    const metaStr = [p.grade, p.pos].filter(Boolean).join(" · ");
    const hasG  = s.G  > 0, hasA = s.A > 0;

    el.innerHTML = `
      <div class="player-jersey">${numDisplay}</div>
      <div class="player-item-info">
        <div class="player-item-name">${p.name}</div>
        <div class="player-item-meta">${metaStr || p.team}</div>
      </div>
      <div class="player-item-stats">
        <div class="mini-stat ${hasG ? 'has-val':''}" title="Goals">G:${s.G}</div>
        <div class="mini-stat ${hasA ? 'has-val':''}" title="Assists">A:${s.A}</div>
      </div>
    `;

    el.addEventListener("click", () => selectPlayer(p.id));
    list.appendChild(el);
  });

  document.getElementById("btn-add-player").addEventListener("click", openAddModal);
}

// ─── Select Player ─────────────────────────────────────────────────────────
function selectPlayer(id) {
  state.selectedId = id;
  renderPlayerList(document.getElementById("player-search").value);

  const p = state.players.find(x => x.id === id);
  if (!p) return;

  if (!state.stats[p.id]) state.stats[p.id] = emptyStats();

  document.getElementById("empty-state").classList.add("hidden");
  document.getElementById("player-detail").classList.remove("hidden");

  // Header
  document.getElementById("player-number-badge").textContent = p.number > 0 ? `#${p.number}` : "—";
  document.getElementById("player-name-display").textContent = p.name;
  document.getElementById("player-grade-display").textContent = p.grade;
  document.getElementById("player-pos-display").textContent  = p.pos || "—";
  document.getElementById("player-team-display").textContent  = p.team === "Var" ? "Varsity" : p.team;

  renderStatsTab(p);
  renderProfileTab(p);
  if (document.querySelector(".tab-btn.active")?.dataset.tab === "heatmap") {
    setTimeout(() => drawField(), 50);
  }
}

// ─── Stats Tab ─────────────────────────────────────────────────────────────
const STAT_DEFS = [
  { key: "G",   label: "Goals",         desc: "Total goals scored",       color: "var(--accent)" },
  { key: "A",   label: "Assists",        desc: "Passes leading to goals",  color: "var(--blue)" },
  { key: "SOG", label: "Shots on Goal",  desc: "Shots on cage",            color: "var(--purple)" },
  { key: "GB",  label: "Ground Balls",   desc: "Loose ball pickups",       color: "var(--yellow)" },
  { key: "TO",  label: "Turnovers",      desc: "Possessions lost",         color: "var(--red)" },
  { key: "FOU", label: "Face-Off Wins",  desc: "Face-offs won",            color: "var(--accent)" },
  { key: "FOL", label: "Face-Off Losses",desc: "Face-offs lost",           color: "var(--red)" },
];

function renderStatsTab(p) {
  const s = state.stats[p.id];
  const grid = document.getElementById("stats-grid");
  grid.innerHTML = "";

  STAT_DEFS.forEach(def => {
    const val = s[def.key] || 0;
    const card = document.createElement("div");
    card.className = "stat-card" + (val > 0 ? " has-value" : "");
    card.dataset.stat = def.key;

    card.innerHTML = `
      <div class="stat-label">${def.key}</div>
      <div class="stat-description">${def.desc}</div>
      <div class="stat-value-row">
        <div class="stat-value" style="color:${val > 0 ? def.color : ''}">${val}</div>
        <div class="stat-btn-group">
          <button class="stat-btn plus"  data-stat="${def.key}" title="+1">+</button>
          <button class="stat-btn minus" data-stat="${def.key}" title="-1">−</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Quick add buttons
  const qb = document.getElementById("quick-buttons");
  qb.innerHTML = "";
  const quickDefs = [
    { stat: "G",   label: "+ Goal",         cls: "goal"   },
    { stat: "A",   label: "+ Assist",        cls: "assist" },
    { stat: "SOG", label: "+ Shot on Goal",  cls: "sog"    },
    { stat: "GB",  label: "+ Ground Ball",   cls: "gb"     },
    { stat: "TO",  label: "+ Turnover",      cls: "to"     },
    { stat: "FOU", label: "+ FO Win",        cls: "fow"    },
    { stat: "FOL", label: "+ FO Loss",       cls: "fol"    },
  ];
  quickDefs.forEach(qd => {
    const btn = document.createElement("button");
    btn.className = `quick-btn ${qd.cls}`;
    btn.textContent = qd.label;
    btn.addEventListener("click", () => adjustStat(p.id, qd.stat, 1));
    qb.appendChild(btn);
  });

  // +/- button listeners
  grid.querySelectorAll(".stat-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const stat  = e.currentTarget.dataset.stat;
      const delta = e.currentTarget.classList.contains("plus") ? 1 : -1;
      adjustStat(p.id, stat, delta);
    });
  });
}

function adjustStat(playerId, stat, delta) {
  const s = state.stats[playerId];
  s[stat] = Math.max(0, (s[stat] || 0) + delta);
  const p = state.players.find(x => x.id === playerId);
  if (p) {
    renderStatsTab(p);
    renderPlayerList(document.getElementById("player-search").value);
  }
  autoSave();
}

// ─── Profile Tab ───────────────────────────────────────────────────────────
function renderProfileTab(p) {
  document.getElementById("edit-number").value   = p.number;
  document.getElementById("edit-name").value     = p.name;
  document.getElementById("edit-grade").value    = p.grade;
  document.getElementById("edit-position").value = p.pos;
  document.getElementById("edit-team").value     = p.team;
  document.getElementById("edit-notes").value    = p.notes || "";
}

function saveProfile() {
  const p = state.players.find(x => x.id === state.selectedId);
  if (!p) return;
  p.number = parseInt(document.getElementById("edit-number").value) || 0;
  p.name   = document.getElementById("edit-name").value.trim() || p.name;
  p.grade  = document.getElementById("edit-grade").value;
  p.pos    = document.getElementById("edit-position").value;
  p.team   = document.getElementById("edit-team").value;
  p.notes  = document.getElementById("edit-notes").value.trim();
  renderPlayerList(document.getElementById("player-search").value);
  selectPlayer(p.id);
  showToast("Profile updated!");
  autoSave();
}

function deletePlayer() {
  if (!confirm(`Delete ${state.players.find(x=>x.id===state.selectedId)?.name}? This cannot be undone.`)) return;
  state.players = state.players.filter(x => x.id !== state.selectedId);
  delete state.stats[state.selectedId];
  state.selectedId = null;
  document.getElementById("empty-state").classList.remove("hidden");
  document.getElementById("player-detail").classList.add("hidden");
  renderPlayerList();
  autoSave();
}

// ─── Heat Map / Field Canvas ───────────────────────────────────────────────
let fieldImg = null;
const FIELD_W = 560, FIELD_H = 330;

function drawField() {
  const canvas = document.getElementById("field-canvas");
  const ctx    = canvas.getContext("2d");

  // Scale for device pixel ratio
  const dpr = window.devicePixelRatio || 1;
  const container = document.getElementById("field-container");
  const maxW = container.clientWidth  - 32;
  const maxH = container.clientHeight - 32;
  const scale = Math.min(maxW / FIELD_W, maxH / FIELD_H, 1);
  const cW = Math.floor(FIELD_W * scale);
  const cH = Math.floor(FIELD_H * scale);

  canvas.style.width  = cW + "px";
  canvas.style.height = cH + "px";
  canvas.width  = cW * dpr;
  canvas.height = cH * dpr;
  ctx.scale(dpr * scale, dpr * scale);

  // ── Draw grass field ──
  // Grass gradient
  const grad = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  grad.addColorStop(0,   "#1a4a1a");
  grad.addColorStop(0.5, "#1f5a1f");
  grad.addColorStop(1,   "#1a4a1a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  // Alternating grass strips
  ctx.fillStyle = "rgba(0,0,0,0.07)";
  for (let i = 0; i < FIELD_W; i += 40) {
    ctx.fillRect(i, 0, 20, FIELD_H);
  }

  // Field boundary
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, FIELD_W - 20, FIELD_H - 20);

  // Center line
  ctx.beginPath();
  ctx.moveTo(FIELD_W / 2, 10);
  ctx.lineTo(FIELD_W / 2, FIELD_H - 10);
  ctx.stroke();

  // Center circle
  ctx.beginPath();
  ctx.arc(FIELD_W / 2, FIELD_H / 2, 28, 0, Math.PI * 2);
  ctx.stroke();

  // Center faceoff dot
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(FIELD_W / 2, FIELD_H / 2, 3, 0, Math.PI * 2);
  ctx.fill();

  // ── Goals ──
  drawGoal(ctx, 10,          FIELD_H / 2);  // left goal
  drawGoal(ctx, FIELD_W - 10, FIELD_H / 2);  // right goal

  // ── Crease circles ──
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(10,           FIELD_H/2, 55, -Math.PI/2, Math.PI/2); ctx.stroke();
  ctx.beginPath(); ctx.arc(FIELD_W - 10, FIELD_H/2, 55, Math.PI/2, -Math.PI/2); ctx.stroke();

  // ── Restraining lines ──
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.beginPath(); ctx.moveTo(120, 10); ctx.lineTo(120, FIELD_H-10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(FIELD_W-120, 10); ctx.lineTo(FIELD_W-120, FIELD_H-10); ctx.stroke();
  ctx.setLineDash([]);

  // ── Faceoff boxes ──
  drawFaceoffX(ctx, FIELD_W/2 - 70, FIELD_H/2);
  drawFaceoffX(ctx, FIELD_W/2 + 70, FIELD_H/2);

  // ── Labels ──
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "bold 11px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ATTACK", 80, FIELD_H - 18);
  ctx.fillText("DEFENSE", FIELD_W - 80, FIELD_H - 18);

  // ── Heat map overlay ──
  const pid = state.selectedId;
  if (pid && state.heatmapEnabled) {
    drawHeatmap(ctx, state.stats[pid]?.shots || []);
  }

  // ── Shot dots ──
  if (pid) {
    const shots = state.stats[pid]?.shots || [];
    shots.forEach((sh, i) => drawShotDot(ctx, sh, i));
  }
}

function drawGoal(ctx, x, y) {
  const gW = 6, gH = 30;
  ctx.fillStyle = "#ffffff";
  // Posts
  ctx.fillRect(x - 3, y - gH/2, gW, 3);
  ctx.fillRect(x - 3, y + gH/2 - 3, gW, 3);
  // Back (pipe)
  const bDepth = x < FIELD_W/2 ? 18 : -18;
  ctx.fillRect(x + bDepth - 3, y - gH/2, 3, gH);
  // Net outline
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y - gH/2);
  ctx.lineTo(x + bDepth, y - gH/2);
  ctx.lineTo(x + bDepth, y + gH/2);
  ctx.lineTo(x, y + gH/2);
  ctx.stroke();
}

function drawFaceoffX(ctx, x, y) {
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 1;
  const s = 8;
  ctx.beginPath(); ctx.moveTo(x-s,y-s); ctx.lineTo(x+s,y+s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+s,y-s); ctx.lineTo(x-s,y+s); ctx.stroke();
}

const SHOT_COLORS = { goal: "#4ade80", sog: "#60a5fa", miss: "#f87171", gb: "#fbbf24" };

function drawShotDot(ctx, shot, idx) {
  const r = 6;
  const color = SHOT_COLORS[shot.type] || "#fff";
  ctx.beginPath();
  ctx.arc(shot.x, shot.y, r, 0, Math.PI * 2);
  ctx.fillStyle = color + "cc";
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawHeatmap(ctx, shots) {
  if (shots.length === 0) return;
  const offscreen = document.createElement("canvas");
  offscreen.width  = FIELD_W;
  offscreen.height = FIELD_H;
  const oct = offscreen.getContext("2d");

  shots.forEach(sh => {
    const r = 50;
    const g = oct.createRadialGradient(sh.x, sh.y, 0, sh.x, sh.y, r);
    g.addColorStop(0,   "rgba(255,50,0,0.3)");
    g.addColorStop(0.5, "rgba(255,160,0,0.15)");
    g.addColorStop(1,   "rgba(255,255,0,0)");
    oct.fillStyle = g;
    oct.beginPath();
    oct.arc(sh.x, sh.y, r, 0, Math.PI * 2);
    oct.fill();
  });

  ctx.drawImage(offscreen, 0, 0, FIELD_W, FIELD_H);
}

function canvasCoords(canvas, e) {
  const rect  = canvas.getBoundingClientRect();
  const scaleX = FIELD_W / rect.width;
  const scaleY = FIELD_H / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top)  * scaleY
  };
}

function addShot(x, y) {
  const pid = state.selectedId;
  if (!pid) return;
  if (!state.stats[pid]) state.stats[pid] = emptyStats();
  const shot = { type: state.shotType, x, y, ts: Date.now() };
  state.stats[pid].shots.push(shot);

  // Also increment corresponding stat
  const statMap = { goal: "G", sog: "SOG", miss: "SOG" };  // miss still counts as SOG attempt logged
  if (statMap[shot.type]) {
    // Only auto-increment if it's a goal or explicit sog
    if (shot.type === "goal") { state.stats[pid].G++; state.stats[pid].SOG++; }
    else if (shot.type === "sog") { state.stats[pid].SOG++; }
    else if (shot.type === "gb") { state.stats[pid].GB++; }
  }

  renderShotList();
  drawField();
  autoSave();

  // Refresh stats tab if visible
  if (document.getElementById("tab-stats").classList.contains("active")) {
    const p = state.players.find(x => x.id === pid);
    if (p) renderStatsTab(p);
  }
  renderPlayerList(document.getElementById("player-search").value);
}

function renderShotList() {
  const pid = state.selectedId;
  if (!pid) return;
  const shots = state.stats[pid]?.shots || [];
  const listEl = document.getElementById("shot-list");
  const badge  = document.getElementById("shot-count-badge");
  badge.textContent = shots.length;

  listEl.innerHTML = "";
  const typeLabels = { goal: "Goal", sog: "Shot on Goal", miss: "Miss", gb: "Ground Ball" };
  shots.slice().reverse().forEach((sh, ri) => {
    const i = shots.length - 1 - ri;
    const el = document.createElement("div");
    el.className = "shot-entry";
    el.innerHTML = `
      <div class="shot-entry-label">
        <span class="dot ${sh.type}"></span>
        <span>${typeLabels[sh.type] || sh.type}</span>
      </div>
      <button class="shot-entry-del" data-idx="${i}" title="Remove">×</button>
    `;
    el.querySelector(".shot-entry-del").addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.dataset.idx);
      removeShot(pid, idx);
    });
    listEl.appendChild(el);
  });
}

function removeShot(pid, idx) {
  const sh = state.stats[pid].shots[idx];
  // Reverse stat increment
  if (sh.type === "goal") { state.stats[pid].G = Math.max(0, state.stats[pid].G - 1); state.stats[pid].SOG = Math.max(0, state.stats[pid].SOG - 1); }
  else if (sh.type === "sog") { state.stats[pid].SOG = Math.max(0, state.stats[pid].SOG - 1); }
  else if (sh.type === "gb") { state.stats[pid].GB  = Math.max(0, state.stats[pid].GB  - 1); }
  state.stats[pid].shots.splice(idx, 1);
  renderShotList();
  drawField();
  const p = state.players.find(x => x.id === pid);
  if (p && document.getElementById("tab-stats").classList.contains("active")) renderStatsTab(p);
  renderPlayerList(document.getElementById("player-search").value);
  autoSave();
}

// ─── Add Player Modal ──────────────────────────────────────────────────────
function openAddModal() {
  document.getElementById("new-number").value = "";
  document.getElementById("new-name").value   = "";
  document.getElementById("modal-overlay").classList.remove("hidden");
  document.getElementById("new-name").focus();
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}

function addPlayer() {
  const name = document.getElementById("new-name").value.trim();
  if (!name) { document.getElementById("new-name").focus(); return; }
  const p = {
    id:     state.nextId++,
    number: parseInt(document.getElementById("new-number").value) || 0,
    name,
    grade:  document.getElementById("new-grade").value,
    pos:    document.getElementById("new-position").value,
    team:   document.getElementById("new-team").value,
    notes:  ""
  };
  state.players.push(p);
  state.stats[p.id] = emptyStats();
  closeModal();
  renderPlayerList();
  selectPlayer(p.id);
  autoSave();
}

// ─── CSV Export ────────────────────────────────────────────────────────────
function exportCSV() {
  const header = ["#", "Name", "Grade", "Pos", "Team", "G", "A", "SOG", "GB", "TO", "FOU", "FOL"];
  const rows   = state.players.map(p => {
    const s = state.stats[p.id] || emptyStats();
    return [p.number, `"${p.name}"`, p.grade, p.pos, p.team, s.G, s.A, s.SOG, s.GB, s.TO, s.FOU, s.FOL];
  });
  const csv = [header, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `lacrosse-stats-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("CSV exported!");
}

// ─── Auto-save debounce ────────────────────────────────────────────────────
let autoSaveTimer;
function autoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(saveToDisk, 1500);
}

// ─── Tab Switching ─────────────────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".tab-content").forEach(c => {
    c.classList.toggle("active", c.id === `tab-${tab}`);
    c.classList.toggle("hidden", c.id !== `tab-${tab}`);
  });
  if (tab === "heatmap") {
    renderShotList();
    setTimeout(drawField, 50);
  }
}

// ─── Prev / Next player ────────────────────────────────────────────────────
function navigatePlayer(dir) {
  if (!state.selectedId) return;
  const idx = state.players.findIndex(p => p.id === state.selectedId);
  const next = idx + dir;
  if (next >= 0 && next < state.players.length) selectPlayer(state.players[next].id);
}

// ─── Init ──────────────────────────────────────────────────────────────────
async function init() {
  await loadFromDisk();
  renderPlayerList();

  // Game info
  if (state.game.opponent) document.getElementById("opponent-input").value = state.game.opponent;
  if (state.game.date)     document.getElementById("game-date").value     = state.game.date;

  // ── Event Listeners ──

  document.getElementById("player-search").addEventListener("input", e => {
    renderPlayerList(e.target.value);
  });

  document.getElementById("opponent-input").addEventListener("input", e => {
    state.game.opponent = e.target.value;
    autoSave();
  });
  document.getElementById("game-date").addEventListener("change", e => {
    state.game.date = e.target.value;
    autoSave();
  });

  document.getElementById("btn-save").addEventListener("click", saveToDisk);
  document.getElementById("btn-export").addEventListener("click", exportCSV);

  // Tabs
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.addEventListener("click", () => switchTab(b.dataset.tab));
  });

  // Stats profile save / delete
  document.getElementById("btn-save-profile").addEventListener("click", saveProfile);
  document.getElementById("btn-delete-player").addEventListener("click", deletePlayer);

  // Nav buttons
  document.getElementById("btn-prev-player").addEventListener("click", () => navigatePlayer(-1));
  document.getElementById("btn-next-player").addEventListener("click", () => navigatePlayer( 1));

  // Modal
  document.getElementById("btn-modal-cancel").addEventListener("click", closeModal);
  document.getElementById("btn-modal-add").addEventListener("click", addPlayer);
  document.getElementById("modal-overlay").addEventListener("click", e => {
    if (e.target === document.getElementById("modal-overlay")) closeModal();
  });
  document.getElementById("new-name").addEventListener("keydown", e => {
    if (e.key === "Enter") addPlayer();
    if (e.key === "Escape") closeModal();
  });

  // Shot type selector
  document.querySelectorAll(".shot-type-btn").forEach(b => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".shot-type-btn").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      state.shotType = b.dataset.type;
    });
  });

  // Heatmap toggle
  document.getElementById("heatmap-toggle").addEventListener("change", e => {
    state.heatmapEnabled = e.target.checked;
    drawField();
  });

  // Clear shots
  document.getElementById("btn-clear-shots").addEventListener("click", () => {
    if (!state.selectedId) return;
    if (!confirm("Clear all shot markers for this player?")) return;
    state.stats[state.selectedId].shots = [];
    renderShotList();
    drawField();
    autoSave();
  });

  // Canvas click
  const canvas = document.getElementById("field-canvas");
  canvas.addEventListener("click", e => {
    const { x, y } = canvasCoords(canvas, e);
    addShot(x, y);
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
    if (!state.selectedId) return;
    const pid = state.selectedId;
    const shortcuts = {
      "g": () => adjustStat(pid, "G",   1),
      "a": () => adjustStat(pid, "A",   1),
      "s": () => adjustStat(pid, "SOG", 1),
      "b": () => adjustStat(pid, "GB",  1),
      "t": () => adjustStat(pid, "TO",  1),
      "w": () => adjustStat(pid, "FOU", 1),
      "l": () => adjustStat(pid, "FOL", 1),
      "ArrowLeft":  () => navigatePlayer(-1),
      "ArrowRight": () => navigatePlayer( 1),
    };
    if (shortcuts[e.key]) { shortcuts[e.key](); }
  });

  // Resize field canvas when window resizes
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (document.getElementById("tab-heatmap").classList.contains("active")) drawField();
    }, 100);
  });
}

document.addEventListener("DOMContentLoaded", init);
