import { supabase } from "./supabase.js";

/* ---------- Email + Password Login ---------- */
const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert(error.message);
        return;
    }

    window.location.href = "/dev.html";
});

/* ---------- OAuth Login ---------- */
document.querySelector(".google-btn").addEventListener("click", async () => {
    await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin + "/dev.html"
        }
    });
});

document.querySelector(".github-btn").addEventListener("click", async () => {
    await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: window.location.origin + "/dev.html"
        }
    });
});
