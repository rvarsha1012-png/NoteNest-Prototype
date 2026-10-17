document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notes-container");

  fetch("notes.json")
    .then((response) => response.json())
    .then((notes) => {
      if (!notesContainer) return;
      notesContainer.innerHTML = "";
      notes.forEach((note) => {
        const noteCard = document.createElement("div");
        noteCard.className = "note-card";
        noteCard.innerHTML = `
          <h3>${note.title}</h3>
          <p><strong>Subject:</strong> ${note.subject}</p>
          <p>${note.content}</p>
        `;
        notesContainer.appendChild(noteCard);
      });
    })
    .catch((error) => console.error("Error loading notes:", error));
});
