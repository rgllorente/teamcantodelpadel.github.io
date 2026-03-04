/* =========================================================
   Estado de las jornadas (pasadas / próximas)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".schedule tbody tr").forEach(row => {
    const dateCell = row.children[1];
    const badge = row.querySelector("td:first-child .badge");
    if (!dateCell || !badge) return;

    const [datePart, timePart] = dateCell.textContent.trim().split("⌚");
    if (!datePart || !timePart) return;

    const [d, m, y] = datePart.split("/").map(Number);
    const [h, min] = timePart.split(":").map(Number);

    const matchDate = new Date(y, m - 1, d, h, min);
    const now = new Date();
    const diffDays = (matchDate - now) / (1000 * 60 * 60 * 24);

    if (matchDate < now) {
      badge.classList.add("j-past");
    } else if (diffDays <= 15) {
      badge.classList.add("j-upcoming");
    }
  });

});


/* =========================================================
   Ordenación de columnas
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  const getCellValue = (row, idx) =>
    row.children[idx].innerText.trim();

  const parseDate = value => {
    const [datePart, timePart] = value.split("⌚");
    const [d, m, y] = datePart.split("/").map(Number);
    const [h, min] = timePart.split(":").map(Number);
    return new Date(y, m - 1, d, h, min);
  };

  const headers = document.querySelectorAll("th.sortable");
  let activeHeader = null;

  headers.forEach((th, index) => {

    th.addEventListener("click", () => {

      /* ── Reset otras columnas ───────────────── */
      if (activeHeader && activeHeader !== th) {
        activeHeader.classList.remove("asc", "desc");
      }

      /* ── Dirección ─────────────────────────── */
      let direction = 1;

      if (th === activeHeader && th.classList.contains("asc")) {
        direction = -1;
      }

      /* ── Marcar columna activa ─────────────── */
      th.classList.toggle("asc", direction === 1);
      th.classList.toggle("desc", direction === -1);

      activeHeader = th;

      /* ── Ordenar filas ─────────────────────── */
      const table = th.closest("table");
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));
      const type = th.dataset.type;

      rows.sort((a, b) => {
        let A = getCellValue(a, index);
        let B = getCellValue(b, index);

        if (type === "number") return direction * (A - B);
        if (type === "date") return direction * (parseDate(A) - parseDate(B));

        return direction * A.localeCompare(B, "es", { sensitivity: "base" });
      });

      rows.forEach(row => tbody.appendChild(row));
    });
  });

});