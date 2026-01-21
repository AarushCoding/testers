import { supabase } from './supabase.js';

const params = new URLSearchParams(window.location.search);
const appId = params.get('appId');

async function initializeJoinPage() {
    if (!appId) {
        console.error("No App ID provided");
        return;
    }

    // Fetch App Name to show on the glass card
    const { data: app, error } = await supabase
        .from('apps')
        .select('name')
        .eq('id', appId)
        .single();

    if (app) {
        document.getElementById('appNameDisplay').innerText = `Join ${app.name}`;
    }
}

document.getElementById('testerOnboardingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    const name = document.getElementById('testerName').value;
    const email = document.getElementById('testerEmail').value;

    // Connect to 'testers' table
    const { error } = await supabase
        .from('testers')
        .insert([{
            app_id: appId,
            name: name,
            email: email
        }]);

    if (!error) {
        // Success State
        document.querySelector('.glass-card').innerHTML = `
            <div style="padding: 20px 0;">
                <h1 style="font-size: 2.5rem; margin-bottom: 10px;">Welcome.</h1>
                <p class="subtitle" style="margin-bottom: 0;">You've been added to the team.</p>
            </div>
        `;
    } else {
        alert("Registration failed: " + error.message);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
});

initializeJoinPage();
