import { supabase } from './supabase.js';
import { toast } from './notifications.js'

const appId = new URLSearchParams(window.location.search).get('id');

async function refreshUI() {
    const { data: app } = await supabase.from('apps').select('*').eq('id', appId).single();
    const { data: testers } = await supabase.from('testers').select('*').eq('app_id', appId);
    const { data: feedback } = await supabase.from('feedback').select('*').eq('app_id', appId);

    document.getElementById('appTitle').innerText = app.name;

    // Handle Top Banner Logic
    const pending = testers.filter(t => t.status === 'pending');
    const banner = document.getElementById('approvalBanner');

    if (pending.length > 0) {
        banner.classList.remove('hidden');
        banner.innerHTML = `
            <div><strong>${pending.length}</strong> Pending Requests</div>
            <div style="display:flex; gap: 15px; align-items:center;">
                <small>${pending[0].name}</small>
                <button class="approve-all-btn" id="approveOne">Approve This</button>
                <button class="glass-btn" id="approveAll">Approve All</button>
            </div>
        `;

        document.getElementById('approveOne').onclick = () => updateStatus(pending[0].id, 'approved');
        document.getElementById('approveAll').onclick = approveAll;
    } else {
        banner.classList.add('hidden');
    }

    // Render Lists
    renderList('approvedList', testers.filter(t => t.status === 'approved'), t => `<strong>${t.name}</strong><small>${t.email}</small>`);
    renderList('feedbackList', feedback, f => `<strong>${f.title} - ${f.name} - ${f.rating} stars</strong><p style="margin-top:5px; opacity:0.8; color: #e6e6e6">${f.message}</p>`);
}

function renderList(id, data, template) {
    const container = document.getElementById(id);
    container.innerHTML = data.map(item => `<div class="item-card">${template(item)}</div>`).join('') || '<p>Nothing found.</p>';
}

async function updateStatus(id, status) {
    await supabase.from('testers').update({ status }).eq('id', id);
    refreshUI();
}

async function approveAll() {
    if(!confirm("Approve all pending?")) return;
    await supabase.from('testers').update({ status: 'approved' }).eq('app_id', appId).eq('status', 'pending');
    refreshUI();
}

// Links
document.getElementById('copyJoin').onclick = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join.html?appId=${appId}`);
    toast.show("Link Copied!", "The join link has been copied to your clipboard", "info", 3000);
};

document.getElementById('copyFeedback').onclick = () => {
    navigator.clipboard.writeText(`${window.location.origin}/feedback.html?appId=${appId}`);
    toast.show("Link Copied!", "The feedback link has been copied to your clipboard", "info", 3000);
};

refreshUI();
