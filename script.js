const UNIT_OPTIONS = ["Hours", "Landing", "Engine Cycle"];
const STARTING_ROWS = 10;

const tbody = document.querySelector("#taskTable tbody");
const rowCountEl = document.getElementById("rowCount");

// ------------------------------
// Build a single row element
// ------------------------------
function buildRow(description = "", current = "", interval = "", tsn = "", unit = "") {
  const row = document.createElement("tr");

  const unitOptionsHtml = UNIT_OPTIONS.map(
    opt => `<option value="${opt}" ${unit === opt ? "selected" : ""}>${opt}</option>`
  ).join("");

  row.innerHTML = `
    <td class="col-num"></td>
    <td><input class="cell cell-desc" value="${escapeHtml(description)}" placeholder="e.g. Engine oil filter"></td>
    <td><input class="cell cell-num" type="number" value="${current}"></td>
    <td><input class="cell cell-num" type="number" value="${interval}"></td>
    <td><input class="cell cell-num" type="number" value="${tsn}"></td>
    <td>
      <select class="cell cell-select">
        <option value="">Select</option>
        ${unitOptionsHtml}
      </select>
    </td>
    <td class="computed">0</td>
    <td class="col-actions">
      <div class="row-actions">
        <button class="icon-btn dup" title="Duplicate with same description" type="button">+</button>
        <button class="icon-btn del" title="Delete row" type="button">&times;</button>
      </div>
    </td>
  `;

  return row;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// ------------------------------
// Add a new row to the table
// ------------------------------
function addTaskRow(description = "", current = "", interval = "", tsn = "", unit = "") {
  const row = buildRow(description, current, interval, tsn, unit);
  tbody.appendChild(row);
  computeRow(row);
  renumberRows();
}

// ------------------------------
// Duplicate a row, keeping only the description
// ------------------------------
function duplicateRow(button) {
  const row = button.closest("tr");
  const desc = row.querySelector(".cell-desc").value;
  const row2 = buildRow(desc, "", "", "", "");
  row.after(row2);
  computeRow(row2);
  renumberRows();
}

// ------------------------------
// Delete a row (always keep at least one)
// ------------------------------
function deleteRow(button) {
  if (tbody.children.length <= 1) return;
  button.closest("tr").remove();
  renumberRows();
}

// ------------------------------
// Renumber the "#" column and update the footer count
// ------------------------------
function renumberRows() {
  const rows = tbody.querySelectorAll("tr");
  rows.forEach((row, i) => {
    row.querySelector(".col-num").textContent = i + 1;
  });
  rowCountEl.textContent = rows.length;
}

// ------------------------------
// Compute a single row's value
// ------------------------------
function computeRow(row) {
  const inputs = row.querySelectorAll("input[type=number]");
  const current = parseFloat(inputs[0].value) || 0;
  const interval = parseFloat(inputs[1].value) || 0;
  const tsnValue = inputs[2].value;
  const tsn = tsnValue === "" ? 0 : parseFloat(tsnValue);

  const computed = current + interval - tsn;
  row.querySelector(".computed").textContent = computed;
}

// ------------------------------
// Event delegation: typing, duplicate, delete
// ------------------------------
tbody.addEventListener("input", e => {
  const row = e.target.closest("tr");
  if (row) computeRow(row);
});

tbody.addEventListener("click", e => {
  if (e.target.classList.contains("dup")) duplicateRow(e.target);
  if (e.target.classList.contains("del")) deleteRow(e.target);
});

// ------------------------------
// Add row button
// ------------------------------
document.getElementById("addRowBtn").addEventListener("click", () => {
  addTaskRow();
});

// ------------------------------
// Import from Excel
// ------------------------------
document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("excelFile").click();
});

document.getElementById("excelFile").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    tbody.innerHTML = "";

    rows.slice(1).forEach(r => {
      addTaskRow(r[0] ?? "", r[1] ?? "", r[2] ?? "", r[3] ?? "", r[4] ?? "");
    });

    if (tbody.children.length === 0) {
      for (let i = 0; i < STARTING_ROWS; i++) addTaskRow();
    }
  };
  reader.readAsArrayBuffer(file);

  // allow re-importing the same file name later
  e.target.value = "";
});

// ------------------------------
// Export to Excel
// ------------------------------
document.getElementById("exportBtn").addEventListener("click", () => {
  const rows = [["Description", "Current", "Interval", "TSN/TSI/TSO", "Unit", "Computed"]];

  tbody.querySelectorAll("tr").forEach(row => {
    const inputs = row.querySelectorAll("input");
    rows.push([
      inputs[0].value,
      inputs[1].value,
      inputs[2].value,
      inputs[3].value,
      row.querySelector("select").value,
      row.querySelector(".computed").textContent
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
  XLSX.writeFile(workbook, "updated_tasks.xlsx");
});

// ------------------------------
// Start with a fixed number of empty rows
// ------------------------------
window.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < STARTING_ROWS; i++) addTaskRow();
});
