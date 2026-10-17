const starterNotes = [
  { id: "demo-1", title: "Introduction to Machine Learning", subject: "AI & Data Science", semester: "Semester 5", description: "A beginner-friendly overview of ML types, workflows, and key terms.", author: "Aarav", kind: "PDF", cover: "purple", demoText: "INTRODUCTION TO MACHINE LEARNING\n\n1. Machine Learning enables systems to learn patterns from data.\n2. Supervised learning uses labelled examples.\n3. Unsupervised learning discovers patterns in unlabelled data.\n4. Reinforcement learning learns through rewards and penalties.\n5. Typical workflow: collect data, clean data, train, evaluate, improve.\n\nNoteNest demo study material." },
  { id: "demo-2", title: "Python Programming Essentials", subject: "Programming", semester: "Semester 3", description: "Core syntax, loops, functions, lists, and small examples.", author: "Diya", kind: "PDF", cover: "blue", demoText: "PYTHON PROGRAMMING ESSENTIALS\n\nVariables store values. Use if/elif/else for decisions. for and while loops repeat tasks. Functions are defined using def. Lists store ordered collections.\n\nExample:\ndef square(n):\n    return n * n\n\nNoteNest demo study material." },
  { id: "demo-3", title: "Probability & Statistics Notes", subject: "Mathematics", semester: "Semester 4", description: "Important formulas and concepts for quick revision.", author: "Meera", kind: "PDF", cover: "peach", demoText: "PROBABILITY & STATISTICS\n\nProbability of an event = favourable outcomes / total equally likely outcomes.\nMean = sum of observations / number of observations.\nVariance measures spread around the mean.\nStandard deviation is the square root of variance.\n\nNoteNest demo study material." },
  { id: "demo-4", title: "Database Management Systems", subject: "Computer Science", semester: "Semester 4", description: "Keys, normalization, SQL concepts, and transaction basics.", author: "Kavin", kind: "PDF", cover: "green", demoText: "DATABASE MANAGEMENT SYSTEMS\n\nA DBMS helps create, store, retrieve, and manage data. Primary keys uniquely identify rows. Foreign keys connect tables. Normalization reduces unnecessary duplication. SQL examples: SELECT, INSERT, UPDATE, DELETE.\n\nNoteNest demo study material." },
  { id: "demo-5", title: "Neural Networks – Quick Revision", subject: "AI & Data Science", semester: "Semester 5", description: "Neurons, activation functions, loss, and backpropagation.", author: "Ishita", kind: "PDF", cover: "yellow", demoText: "NEURAL NETWORKS QUICK REVISION\n\nA neuron computes a weighted sum plus bias, then applies an activation function. Training adjusts weights to reduce loss. Backpropagation computes gradients. Common activations include ReLU, sigmoid, and tanh.\n\nNoteNest demo study material." },
  { id: "demo-6", title: "Data Structures: Arrays & Linked Lists", subject: "Computer Science", semester: "Semester 3", description: "Compare common linear data structures and operations.", author: "Rohan", kind: "PDF", cover: "pink", demoText: "DATA STRUCTURES\n\nArrays store elements in contiguous indexed positions. Linked lists use nodes connected by links. Arrays offer fast index access. Linked lists can insert nodes without shifting all later elements, depending on position and available node reference.\n\nNoteNest demo study material." }
];

const STORAGE_KEY = "notenest-user-notes-v1";
let userNotes = loadUserNotes();
let activeCategory = "all";
let activeView = "dashboard";
let toastTimer;

const notesGrid = document.getElementById("notesGrid");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const emptyState = document.getElementById("emptyState");
const uploadModal = document.getElementById("uploadModal");
const uploadForm = document.getElementById("uploadForm");
const toast = document.getElementById("toast");

function loadUserNotes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch (error) { return []; }
}
function saveUserNotes() {
  // File bytes are not saved here; metadata stays in this browser.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userNotes.map(({ fileData, ...note }) => note)));
}
function allNotes() { return [...userNotes, ...starterNotes]; }
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function getCover(subject) {
  return ({ "AI & Data Science":"purple", "Programming":"blue", "Mathematics":"peach", "Computer Science":"green", "Other":"pink" })[subject] || "yellow";
}
function refreshSubjects() {
  const current = subjectFilter.value || "all";
  const subjects = [...new Set(allNotes().map(note => note.subject))].sort();
  subjectFilter.innerHTML = '<option value="all">All subjects</option>' + subjects.map(subject => `<option value="${escapeHTML(subject)}">${escapeHTML(subject)}</option>`).join("");
  subjectFilter.value = subjects.includes(current) ? current : "all";
}
function updateStats() {
  const notes = allNotes();
  document.getElementById("totalNotes").textContent = notes.length;
  document.getElementById("totalSubjects").textContent = new Set(notes.map(note => note.subject)).size;
  document.getElementById("myUploads").textContent = userNotes.length;
  document.getElementById("uploadCount").textContent = userNotes.length;
  document.getElementById("allChipCount").textContent = notes.length;
}
function filteredNotes() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedSubject = subjectFilter.value;
  return allNotes().filter(note => {
    const haystack = `${note.title} ${note.subject} ${note.description} ${note.semester} ${note.author}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesSubject = selectedSubject === "all" || note.subject === selectedSubject;
    const matchesCategory = activeCategory === "all" || note.subject === activeCategory;
    const matchesView = activeView !== "uploads" || userNotes.some(userNote => userNote.id === note.id);
    return matchesQuery && matchesSubject && matchesCategory && matchesView;
  });
}
function renderNotes() {
  const notes = filteredNotes();
  notesGrid.innerHTML = notes.map(note => {
    const isUser = userNotes.some(item => item.id === note.id);
    const cover = note.cover || getCover(note.subject);
    const fileLabel = (note.fileName || "STUDY NOTES").split(".").pop().toUpperCase().slice(0, 5);
    return `<article class="note-card">
      <div class="note-cover cover-${escapeHTML(cover)}"><div class="document-art"><i></i><i></i><i></i></div><span class="file-badge">${escapeHTML(fileLabel || "NOTES")}</span></div>
      <div class="note-body">
        <div class="note-tags"><span class="subject-tag">${escapeHTML(note.subject)}</span><span class="semester-tag">${escapeHTML(note.semester || "Study notes")}</span></div>
        <h3>${escapeHTML(note.title)}</h3>
        <p class="note-description">${escapeHTML(note.description || "A student-shared resource for your revision.")}</p>
        <div class="note-meta"><span class="note-author"><span class="mini-avatar">${escapeHTML((note.author || "S").slice(0,1).toUpperCase())}</span>${escapeHTML(note.author || "Student")}</span>
          <span class="note-actions"><button class="download-button" data-download="${escapeHTML(note.id)}">↓ Download</button>${isUser ? `<button class="delete-button" data-delete="${escapeHTML(note.id)}" title="Remove from this browser">×</button>` : ""}</span>
        </div>
      </div>
    </article>`;
  }).join("");
  emptyState.classList.toggle("hidden", notes.length !== 0);
  notesGrid.classList.toggle("hidden", notes.length === 0);
}
function render() { refreshSubjects(); updateStats(); renderNotes(); }
function openUploadModal() {
  uploadModal.classList.remove("hidden");
  document.getElementById("noteTitle").focus();
}
function closeUploadModal() { uploadModal.classList.add("hidden"); uploadForm.reset(); }
function setView(view) {
  activeView = view;
  document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  const titles = {
    dashboard: ["Dashboard", "A little progress, <span>a lot of growth.</span>", "Find your next useful note and keep learning together.", "Explore study notes"],
    explore: ["Explore Notes", "Your next <span>aha moment</span> starts here.", "Browse shared resources and find a new way to learn.", "Explore all study notes"],
    uploads: ["My Uploads", "Your notes can <span>help someone grow.</span>", "Manage the resources you have added from this browser.", "Your uploaded notes"]
  };
  const content = titles[view] || titles.dashboard;
  document.getElementById("breadcrumbPage").textContent = content[0];
  document.getElementById("pageTitle").innerHTML = content[1];
  document.getElementById("pageSubtitle").textContent = content[2];
  document.getElementById("libraryTitle").textContent = content[3];
  document.getElementById("sidebar").classList.remove("open");
  renderNotes();
}
function downloadNote(id) {
  const note = allNotes().find(item => item.id === id);
  if (!note) return;
  if (note.fileData) {
    const link = document.createElement("a");
    link.href = note.fileData;
    link.download = note.fileName || note.title;
    document.body.appendChild(link); link.click(); link.remove();
  } else if (note.fileUrl) {
    const link = document.createElement("a");
    link.href = note.fileUrl; link.download = note.fileName || note.title;
    document.body.appendChild(link); link.click(); link.remove();
  } else {
    const blob = new Blob([note.demoText || `${note.title}\n\n${note.description}\n\nNoteNest demo study material.`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = `${note.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  }
  showToast("Download started. Demo notes download as TXT files.");
}
function removeNote(id) {
  const note = userNotes.find(item => item.id === id);
  if (!note) return;
  if (!confirm(`Remove "${note.title}" from this browser?`)) return;
  userNotes = userNotes.filter(item => item.id !== id);
  saveUserNotes(); render(); showToast("Your note was removed from this browser.");
}

document.getElementById("openUpload").addEventListener("click", openUploadModal);
document.getElementById("sidebarUpload").addEventListener("click", openUploadModal);
document.getElementById("closeUpload").addEventListener("click", closeUploadModal);
document.getElementById("cancelUpload").addEventListener("click", closeUploadModal);
uploadModal.addEventListener("click", event => { if (event.target === uploadModal) closeUploadModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeUploadModal(); });
document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
document.getElementById("mobileMenu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
searchInput.addEventListener("input", renderNotes);
subjectFilter.addEventListener("change", renderNotes);
document.querySelectorAll(".category-chip").forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category-chip").forEach(chip => chip.classList.toggle("selected", chip === button));
  renderNotes();
}));
document.getElementById("clearFilters").addEventListener("click", () => {
  searchInput.value = ""; subjectFilter.value = "all"; activeCategory = "all";
  document.querySelectorAll(".category-chip").forEach(chip => chip.classList.toggle("selected", chip.dataset.category === "all"));
  renderNotes();
});
notesGrid.addEventListener("click", event => {
  const downloadButton = event.target.closest("[data-download]");
  const deleteButton = event.target.closest("[data-delete]");
  if (downloadButton) downloadNote(downloadButton.dataset.download);
  if (deleteButton) removeNote(deleteButton.dataset.delete);
});
uploadForm.addEventListener("submit", event => {
  event.preventDefault();
  const file = document.getElementById("noteFile").files[0];
  if (!file) { showToast("Please choose a file first."); return; }
  if (file.size > 10 * 1024 * 1024) { showToast("Please choose a file smaller than 10 MB."); return; }
  const reader = new FileReader();
  reader.onload = () => {
    const note = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      title: document.getElementById("noteTitle").value.trim(),
      subject: document.getElementById("noteSubject").value,
      semester: document.getElementById("noteSemester").value,
      description: document.getElementById("noteDescription").value.trim() || "A student-shared resource for your revision.",
      author: "You", fileName: file.name, fileData: reader.result, cover: getCover(document.getElementById("noteSubject").value)
    };
    // Keep file data in memory for this open session; store only metadata persistently.
    userNotes.push(note);
    saveUserNotes();
    closeUploadModal();
    activeView = "uploads";
    document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === "uploads"));
    document.getElementById("breadcrumbPage").textContent = "My Uploads";
    document.getElementById("pageTitle").innerHTML = "Your notes can <span>help someone grow.</span>";
    document.getElementById("pageSubtitle").textContent = "Manage the resources you have added from this browser.";
    document.getElementById("libraryTitle").textContent = "Your uploaded notes";
    render();
    showToast("Note added for this browser session!");
  };
  reader.onerror = () => showToast("Could not read this file. Please try again.");
  reader.readAsDataURL(file);
});
document.getElementById("dateLabel").textContent = new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
render();
