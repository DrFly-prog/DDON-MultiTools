document.addEventListener("DOMContentLoaded", function() {
    const summarySection = document.getElementById("summary");
    const selections = JSON.parse(localStorage.getItem("selections")) || {};

    // Affiche le résumé des sélections
    summarySection.innerHTML = Object.keys(selections).length > 0
        ? Object.entries(selections).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join("")
        : "<p>Aucune sélection enregistrée.</p>";
});
