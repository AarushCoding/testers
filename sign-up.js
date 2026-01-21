import { supabase } from "./supabase.js";

const signupForm = document.querySelector(".signup-form");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: fullName,
                role: role
            }
        }
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Check your email to confirm your account!");
    window.location.href = "/dev.html"
});
