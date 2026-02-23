const STORAGE_KEY = "leaveflow-data-v1";

const state = {
  employees: [],
  requests: [],
};

const employeeForm = document.getElementById("employeeForm");
const leaveForm = document.getElementById("leaveForm");
const employeeSelect = document.getElementById("employeeSelect");
const requestRows = document.getElementById("requestRows");
const statusFilter = document.getElementById("statusFilter");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const approvedCount = document.getElementById("approvedCount");
const rejectedCount = document.getElementById("rejectedCount");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    state.employees = parsed.employees || [];
    state.requests = parsed.requests || [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function addEmployeeOption(employee) {
  const option = document.createElement("option");
  option.value = employee.id;
  option.textContent = `${employee.name} (${employee.department})`;
  employeeSelect.append(option);
}

function renderEmployees() {
  employeeSelect.innerHTML = '<option value="">Choose an employee</option>';
  state.employees.forEach(addEmployeeOption);
}

function dateDiffInDays(start, end) {
  const ms = new Date(end).setHours(0, 0, 0, 0) - new Date(start).setHours(0, 0, 0, 0);
  return Math.floor(ms / (24 * 60 * 60 * 1000)) + 1;
}

function updateStats() {
  totalCount.textContent = state.requests.length;
  pendingCount.textContent = state.requests.filter((r) => r.status === "pending").length;
  approvedCount.textContent = state.requests.filter((r) => r.status === "approved").length;
  rejectedCount.textContent = state.requests.filter((r) => r.status === "rejected").length;
}

function formatDateRange(start, end) {
  const fmt = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" });
  return `${fmt.format(new Date(start))} - ${fmt.format(new Date(end))}`;
}

function renderRequests() {
  requestRows.innerHTML = "";
  const filter = statusFilter.value;

  const filtered = state.requests.filter((request) => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  if (!filtered.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="7" class="empty">No leave requests yet.</td>';
    requestRows.append(tr);
    return;
  }

  filtered.forEach((request) => {
    const employee = state.employees.find((item) => item.id === request.employeeId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${employee?.name || "Unknown"}</td>
      <td>${employee?.department || "-"}</td>
      <td>${request.type}</td>
      <td>${formatDateRange(request.startDate, request.endDate)}</td>
      <td>${request.days}</td>
      <td><span class="badge ${request.status}">${request.status}</span></td>
      <td>
        <div class="action-buttons">
          <button data-action="approved" data-id="${request.id}">Approve</button>
          <button class="secondary" data-action="rejected" data-id="${request.id}">Reject</button>
        </div>
      </td>
    `;
    requestRows.append(tr);
  });
}

function addSeedDataIfEmpty() {
  if (state.employees.length || state.requests.length) return;

  const employee = {
    id: crypto.randomUUID(),
    name: "Demo Employee",
    department: "Operations",
  };

  state.employees.push(employee);
  state.requests.push({
    id: crypto.randomUUID(),
    employeeId: employee.id,
    type: "Vacation",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    days: 1,
    reason: "Kickoff demo request",
    status: "pending",
    submittedAt: new Date().toISOString(),
  });
  save();
}

employeeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("employeeName").value.trim();
  const department = document.getElementById("employeeDepartment").value.trim();
  if (!name || !department) return;

  state.employees.push({ id: crypto.randomUUID(), name, department });
  save();
  renderEmployees();
  renderRequests();
  employeeForm.reset();
});

leaveForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const employeeId = employeeSelect.value;
  const type = document.getElementById("leaveType").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const reason = document.getElementById("reason").value.trim();

  if (!employeeId || !type || !startDate || !endDate || !reason) return;
  if (new Date(endDate) < new Date(startDate)) {
    alert("End date cannot be before start date.");
    return;
  }

  state.requests.unshift({
    id: crypto.randomUUID(),
    employeeId,
    type,
    startDate,
    endDate,
    days: dateDiffInDays(startDate, endDate),
    reason,
    status: "pending",
    submittedAt: new Date().toISOString(),
  });

  save();
  updateStats();
  renderRequests();
  leaveForm.reset();
});

statusFilter.addEventListener("change", renderRequests);

requestRows.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const id = target.dataset.id;
  const nextStatus = target.dataset.action;
  if (!id || !nextStatus) return;

  const request = state.requests.find((item) => item.id === id);
  if (!request) return;

  request.status = nextStatus;
  save();
  updateStats();
  renderRequests();
});

load();
addSeedDataIfEmpty();
renderEmployees();
updateStats();
renderRequests();
