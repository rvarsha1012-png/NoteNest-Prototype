document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notes-container");

  function loadAndRenderNotes(filterSubject = "All notes") {
    fetch("notes.json")
      .then((response) => response.json())
      .then((notes) => {
        if (!notesContainer) return;
        notesContainer.innerHTML = "";

        const filteredNotes = notes.filter((note) => {
          if (filterSubject === "All notes" || filterSubject.includes("All notes")) {
            return true;
          }
          return note.subject.toLowerCase().includes(filterSubject.toLowerCase());
        });

        filteredNotes.forEach((note) => {
          const noteCard = document.createElement("div");
          noteCard.className = "note-card";
          noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p><strong>Subject:</strong> ${note.subject}</p>
            <p>${note.content}</p>
          `;
          notesContainer.appendChild(noteCard);
        });
      });
  }

  // Initial load
  loadAndRenderNotes();

  // Subject filter button click events
  document.querySelectorAll(".subject-tag, .category-btn, button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const subjectName = e.target.innerText.trim();
      if (subjectName) {
        loadAndRenderNotes(subjectName);
      }
    });
  });
});
