import { supabase } from "./supabase.js";
import { toast } from './notifications.js'

/* ---------- Email + Password Login ---------- */
const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let attempts = 0
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        if (error.message == 'Invalid login credentials') {
            if (attempts > 6) {
                toast.show("Auth Error", "Too many attempts. Try later.", "error", 3000);
            }
            else {
                toast.show("Auth Error", "The credentials you provided are invalid.", "error", 3000);
                attempts += 1
            }

            
        }
        else {
            alert(error.message);
        }
        
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
            redirectTo: window.location.origin + "./dev.html"
        }
    });
});
