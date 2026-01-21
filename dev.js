import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- 1. Supabase config ---
const SUPABASE_URL = "https://hjfclbfqlrpiyfrxifut.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZmNsYmZxbHJwaXlmcnhpZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTAzMzEsImV4cCI6MjA4Mzk4NjMzMX0.MvsITfTMFgTVzHh2iVBj06-lldlqMEjU8AWkL0y2uIE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- 2. DOM elements ---
const tableBody = document.getElementById("tableBody");
const title = document.getElementById("title");

let mode = "developer"; // default view

// --- 3. Auth check ---
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "/login.html"; // redirect if not logged in
    return null;
  }
  return session.user.id;
}

// --- 4. Load apps ---
async function loadApps() {
  const userId = await checkAuth();
  if (!userId) return;

  tableBody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  let query;
  if (mode === "developer") {
    title.textContent = "Your Apps";
    query = supabase
      .from("apps")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });
  } else {
    title.textContent = "Apps You're Testing";
    query = supabase
      .from("app_testers")
      .select("apps(name, status, description, created_at)")
      .eq("tester_id", userId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error loading apps:", error);
    tableBody.innerHTML = "<tr><td colspan='4'>Error loading apps</td></tr>";
    return;
  }

  let apps = [];
  if (mode === "developer") apps = data;
  else apps = data.map(row => row.apps);

  renderTable(apps);
}

// --- 5. Render table ---
function renderTable(apps) {
  tableBody.innerHTML = "";
  if (!apps || apps.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='4'>No apps found</td></tr>";
    return;
  }

  apps.forEach(app => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${app.name}</td>
      <td>${app.description ?? ""}</td>
      <td>${new Date(app.created_at).toLocaleDateString()}</td>
      <td><button class="view-btn" onclick="goToApp('${app.id}')"><i class="fa-solid fa-ellipsis"></i></button></td>
    `;
    tableBody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    // Redirect to landing page
    window.location.href = "/";
    // or "/index.html"
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const addAppBtn = document.getElementById("addAppBtn");
  const modal = document.getElementById("addAppModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const form = document.getElementById("addAppForm");

  if (!addAppBtn || !modal || !cancelBtn || !form) return;

  addAppBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    form.reset();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("appName").value.trim();
    const description = document.getElementById("appDescription").value.trim();

    if (!name) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("apps").insert({
      name,
      description,
      owner_id: user.id
    });

    if (error) {
      console.error("Failed to create app:", error.message);
      return;
    }

    modal.classList.add("hidden");
    form.reset();

    // 🔁 auto refresh dashboard
    await loadApps();
  });
});

/* 🔁 realtime auto-refresh (optional but recommended) */
supabase
  .channel("apps-auto-refresh")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "apps" },
    () => loadApps()
  )
  .subscribe();

window.goToApp = (id) => {
  window.location.href = `details.html?id=${id}`;
}


// --- 8. Initial load ---
loadApps();
