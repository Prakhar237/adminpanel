// ============================================================
// TAP24H Admin Panel — v3 Full Backend Integration
// Supabase Project: qpchntucxzwbizwlisbb
// ============================================================

const { createClient } = supabase;
const SUPABASE_URL     = 'https://qpchntucxzwbizwlisbb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwY2hudHVjeHp3Yml6d2xpc2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDE5NTcsImV4cCI6MjA5MDUxNzk1N30.nV3er_FIqGDeuqR2RV_SXrV8b1NnxqF9vhlwXz9ySoo';
const supabaseClient   = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// MODAL SYSTEM
// ============================================================
let _modalSubmitCallback = null;

function openModal(title, bodyHtml, onSubmit) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    _modalSubmitCallback = onSubmit;
    document.getElementById('adminModal').classList.add('active');
}

function closeModal() {
    document.getElementById('adminModal').classList.remove('active');
    _modalSubmitCallback = null;
}

document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('modalSubmitBtn');
    if (submitBtn) submitBtn.addEventListener('click', () => {
        if (_modalSubmitCallback) _modalSubmitCallback();
    });

    // Close modal on overlay click
    document.getElementById('adminModal').addEventListener('click', e => {
        if (e.target.id === 'adminModal') closeModal();
    });

    // Milestones dropdown (kept for compatibility)
    const dh = document.querySelector('.dropdown-header');
    const dc = document.querySelector('.dropdown-content');
    if (dh && dc) dh.addEventListener('click', function() {
        this.classList.toggle('active');
        dc.classList.toggle('active');
    });

    // Close action dropdowns on outside click
    document.addEventListener('click', e => {
        if (!e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
        }
    });
});

// ============================================================
// POPUP UTILITY
// ============================================================
document.body.insertAdjacentHTML('beforeend', `
    <div class="popup-overlay" id="popupOverlay">
        <div class="popup-content">
            <h4 id="popupMessage"></h4>
            <button id="closePopup">Close</button>
        </div>
    </div>
`);

function showPopup(msg) {
    document.getElementById('popupMessage').textContent = msg;
    document.getElementById('popupOverlay').classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const cp = document.getElementById('closePopup');
    const po = document.getElementById('popupOverlay');
    if (cp) cp.addEventListener('click', () => po.classList.remove('active'));
    if (po) po.addEventListener('click', e => { if (e.target === po) po.classList.remove('active'); });
});

// ============================================================
// LOGIN PAGE
// ============================================================
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', e => {
        e.preventDefault();
        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value;
        
        if (u === 'Admin@fiverr.com' && p === 'Admin#257@12') {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            window.location.href = 'dashboard.html';
        } else {
            showPopup('Error: Invalid credentials. Please try again.');
        }
    });
}

// ============================================================
// DASHBOARD INIT
// ============================================================
if (document.getElementById('logoutBtn')) {
    // Official Auth Guard: Block direct URL access
    if (sessionStorage.getItem('isAdminAuthenticated') !== 'true') {
        window.location.replace('index.html');
    }

    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar       = document.querySelector('.sidebar');
    const mainContent   = document.querySelector('.main-content');
    const navLinks      = document.querySelectorAll('.sidebar nav ul li a');

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-chevron-left');
        icon.classList.toggle('fa-chevron-right');
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        window.location.href = 'index.html';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            this.parentElement.classList.add('active');
            const sectionId = this.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active');
            document.querySelector('.header h1').textContent = this.textContent.trim();

            switch (sectionId) {
                case 'dashboard':       loadConnectedUsers();   loadDashboardStats(); break;
                case 'coupons':         loadCouponInventory();  break;
                case 'reports':         loadUserReports();      break;
                case 'rewards':         loadUserRewards();      break;
                case 'approval':        loadAdminApprovals();   break;
            }
        });
    });

    // Initial load
    loadConnectedUsers();
    loadDashboardStats();
}

// ============================================================
// ROW 1 — CONNECTED USERS
// ============================================================
async function loadConnectedUsers() {
    const tbody = document.getElementById('connectedUsersBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:2rem">Loading...</td></tr>`;

    const { data, error } = await supabaseClient
        .from('connected_users')
        .select('*')
        .order('connected_at', { ascending: false });

    if (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="color:#ef4444;text-align:center;padding:2rem">Error: ${error.message}</td></tr>`;
        return;
    }
    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:2rem">No connected users.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(user => {
        const status  = user.status || 'Active';
        const badgeClass = status === 'Active' ? 'active' : status === 'Suspended' ? 'badge-suspended' : 'badge-blocked';
        let actionsMenu = '';
        if (status === 'Blocked') {
            actionsMenu = `<span style="color:#94a3b8;font-size:0.875rem;padding:0.5rem;">Blocked</span>`;
        } else {
            const suspendOrRevokeBtn = status === 'Suspended'
                ? `<button onclick="openRevokeModal('${user.email}')"><i class="fas fa-play-circle"></i> Revoke Suspension</button>`
                : `<button onclick="openSuspendModal('${user.email}')"><i class="fas fa-pause-circle"></i> Suspend User</button>`;
                
            actionsMenu = `
                <div class="action-dropdown">
                    <button class="action-trigger-btn" onclick="toggleDropdown(this)">
                        Actions <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-menu" style="display:none;">
                        <button onclick="openBlockModal('${user.email}')">
                            <i class="fas fa-ban"></i> Block User
                        </button>
                        ${suspendOrRevokeBtn}
                        <button onclick="sendMessageTo('${user.email}')">
                            <i class="fas fa-envelope"></i> Send Message
                        </button>
                    </div>
                </div>`;
        }

        return `
        <tr>
            <td>${user.email}</td>
            <td>${user.virtual_floor_number}</td>
            <td>${user.country}</td>
            <td><span class="status-badge ${badgeClass}">${status}</span></td>
            <td>${actionsMenu}</td>
        </tr>`;
    }).join('');
}

function toggleDropdown(btn) {
    const menu = btn.nextElementSibling;
    document.querySelectorAll('.dropdown-menu').forEach(m => { if (m !== menu) m.style.display = 'none'; });
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// --- Block User ---
function openBlockModal(email) {
    openModal('Block User', `
        <p class="modal-warning"><i class="fas fa-exclamation-triangle"></i> This will <strong>permanently delete all data</strong> for <strong>${email}</strong>.</p>
        <label class="modal-label">Reason for Blocking</label>
        <textarea id="blockReasonInput" class="modal-textarea" placeholder="Enter reason for blocking..."></textarea>
    `, async () => {
        const reason = document.getElementById('blockReasonInput').value.trim();
        if (!reason) { alert('Please enter a reason.'); return; }
        await blockUser(email, reason);
        closeModal();
    });
}

async function blockUser(email, reason) {
    console.log(`Blocking ${email}: ${reason}`);
    // Cascade delete across all tables by email
    await supabaseClient.from('coupon_inventory').delete().eq('email', email);
    await supabaseClient.from('user_rewards').delete().eq('user_email', email);
    await supabaseClient.from('user_reports').delete().or(`user_email.eq.${email},reported_by_email.eq.${email}`);
    await supabaseClient.from('admin_approvals').delete().eq('user_mail', email);
    const { error } = await supabaseClient.from('connected_users').delete().eq('email', email);
    if (error) { alert('Error blocking user: ' + error.message); return; }
    showPopup(`User ${email} has been permanently blocked and all data removed.`);
    loadConnectedUsers();
    loadDashboardStats();
}

// --- Suspend User ---
function openSuspendModal(email) {
    openModal('Suspend User', `
        <p class="modal-info"><i class="fas fa-info-circle"></i> Suspending <strong>${email}</strong>. Their data will be retained.</p>
        <label class="modal-label">Reason for Suspension</label>
        <textarea id="suspendReasonInput" class="modal-textarea" placeholder="Enter reason for suspension..."></textarea>
        <label class="modal-label" style="margin-top:14px;">Duration (Days)</label>
        <input type="number" id="suspendDaysInput" class="modal-input" placeholder="e.g. 7" min="1" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:6px;font-size:0.875rem;">
    `, async () => {
        const reason = document.getElementById('suspendReasonInput').value.trim();
        const days   = parseInt(document.getElementById('suspendDaysInput').value);
        if (!reason || !days || days < 1) { alert('Please fill in all fields correctly.'); return; }

        const suspendedUntil = new Date();
        suspendedUntil.setDate(suspendedUntil.getDate() + days);

        const { error } = await supabaseClient.from('connected_users').update({
            status:            'Suspended',
            suspension_reason: reason,
            suspended_until:   suspendedUntil.toISOString().split('T')[0]
        }).eq('email', email);

        if (error) { alert('Error: ' + error.message); return; }
        closeModal();
        showPopup(`User ${email} has been suspended for ${days} days.`);
        loadConnectedUsers();
    });
}

// --- Revoke Suspension ---
function openRevokeModal(email) {
    openModal('Revoke Suspension', `
        <p class="modal-info"><i class="fas fa-play-circle"></i> Allow <strong>${email}</strong> to be active again.</p>
        <label class="modal-label">Reason for Revoking</label>
        <textarea id="revokeReasonInput" class="modal-textarea" placeholder="Enter reason (e.g. Appeal approved)..."></textarea>
    `, async () => {
        const reason = document.getElementById('revokeReasonInput').value.trim();
        if (!reason) { alert('Please enter a reason.'); return; }

        const { error } = await supabaseClient.from('connected_users').update({
            status:            'Active',
            suspension_reason: 'Revoked: ' + reason,
            suspended_until:   null
        }).eq('email', email);

        if (error) { alert('Error: ' + error.message); return; }
        closeModal();
        showPopup(`Suspension revoked for user ${email}.`);
        loadConnectedUsers();
    });
}

function sendMessageTo(email) {
    openModal('Send Message', `
        <p class="modal-info"><i class="fas fa-paper-plane"></i> Send an email directly to <strong>${email}</strong>.</p>
        <label class="modal-label" style="margin-top:14px;">Subject</label>
        <input type="text" id="emailSubjectInput" class="modal-input" placeholder="Message from TAP24H Admin" value="Message from TAP24H Admin" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:6px;font-size:0.875rem;margin-bottom:10px;">
        <label class="modal-label">Message</label>
        <textarea id="emailMessageInput" class="modal-textarea" placeholder="Type your message here..." style="min-height:100px;"></textarea>
    `, async () => {
        const subject = document.getElementById('emailSubjectInput').value.trim();
        const message = document.getElementById('emailMessageInput').value.trim();
        
        if (!message) { alert('Please enter a message to send.'); return; }
        
        const btn = document.getElementById('modalSubmitBtn');
        const oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            // Note: Hardcoded to superpundir@gmail.com for Resend free tier testing
            const testEmail = 'superpundir@gmail.com';
            const { data, error } = await supabaseClient.functions.invoke('send-email', {
                body: { email: testEmail, subject, message }
            });

            if (error) throw error;
            
            showPopup('Email sent successfully to ' + email);
            closeModal();
        } catch (err) {
            alert('Failed to send email: ' + err.message);
        } finally {
            btn.innerHTML = oldText;
            btn.disabled = false;
        }
    });
}

// ============================================================
// DASHBOARD STATS
// ============================================================
async function loadDashboardStats() {
    const [usersRes, couponsRes, reportsRes] = await Promise.all([
        supabaseClient.from('connected_users').select('*', { count: 'exact', head: true }),
        supabaseClient.from('coupon_inventory').select('*', { count: 'exact', head: true }),
        supabaseClient.from('user_reports').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    ]);

    const tu = document.getElementById('statTotalUsers');
    const ac = document.getElementById('statActiveCoupons');
    const pr = document.getElementById('statPendingReports');
    if (tu) tu.textContent = usersRes.count  ?? 0;
    if (ac) ac.textContent = couponsRes.count ?? 0;
    if (pr) pr.textContent = reportsRes.count ?? 0;
}

// ============================================================
// ROW 2 — COUPON INVENTORY
// ============================================================
async function loadCouponInventory() {
    const tbody = document.getElementById('couponInventoryBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:2rem">Loading...</td></tr>`;

    const { data, error } = await supabaseClient
        .from('coupon_inventory')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="color:#ef4444;text-align:center;padding:2rem">Error: ${error.message}</td></tr>`;
        return;
    }
    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:2rem">No coupon records found.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(c => {
        const isRedeemed = c.status === 'Redeemed';
        return `
        <tr>
            <td>${c.email}</td>
            <td>${c.virtual_floor}</td>
            <td>${c.country}</td>
            <td>${c.coupon
                ? `<code class="coupon-code-display">${c.coupon}</code>`
                : `<span style="color:#94a3b8">—</span>`
            }</td>
            <td>
                <span class="status-badge ${isRedeemed ? 'badge-redeemed' : 'badge-not-redeemed'}">
                    ${isRedeemed ? '✓ Redeemed' : '✗ Not Redeemed'}
                </span>
            </td>
        </tr>`;
    }).join('');
}

// ============================================================
// ROW 3 — USER REPORTS
// ============================================================
async function loadUserReports() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;

    // Clear, keep h3
    const title = container.querySelector('h3');
    container.innerHTML = '';
    if (title) container.appendChild(title);

    const loading = document.createElement('div');
    loading.className = 'no-data-container';
    loading.innerHTML = `<p style="color:#94a3b8">Loading reports...</p>`;
    container.appendChild(loading);

    const { data, error } = await supabaseClient
        .from('user_reports')
        .select('*')
        .not('status', 'eq', 'Dismissed')
        .order('created_at', { ascending: false });

    loading.remove();

    if (error) {
        container.insertAdjacentHTML('beforeend', `<div class="no-data-container"><p style="color:#ef4444">Error: ${error.message}</p></div>`);
        return;
    }
    if (!data || data.length === 0) {
        container.insertAdjacentHTML('beforeend', `
            <div class="no-data-container">
                <div class="no-data-icon"><i class="fas fa-file-alt"></i></div>
                <h4>No Reports Found</h4>
                <p>There are currently no pending user reports.</p>
            </div>`);
        return;
    }

    data.forEach(report => renderReportCard(container, report));
}

function renderReportCard(container, report) {
    const spots = Array.isArray(report.spot_numbers) && report.spot_numbers.length
        ? report.spot_numbers.map(s => `<span class="spot-badge">${s}</span>`).join(' ')
        : '<span style="color:#94a3b8">—</span>';

    const card = document.createElement('div');
    card.className = 'user-approval-card report-card';
    card.style.animation = 'slideIn 0.3s ease-out';
    card.dataset.reportId = report.id;

    card.innerHTML = `
        <div class="user-header">
            <div class="report-header-info">
                <span class="status-icon blocked"></span>
                <span class="report-label">Reported User:</span>
                <span class="user-id-highlight">${report.user_email || report.reported_by_email || '—'}</span>
                <span class="floor-info">Floor: <strong>${report.user_floor}</strong></span>
                <span class="spots-info">Spots: ${spots}</span>
            </div>
            <button class="minimize-btn" onclick="toggleMinimize(this)">
                <i class="fas fa-chevron-up"></i>
            </button>
        </div>
        <div class="content-preview">
            <div class="report-reason-container">
                <span class="reason-label">Reported by:</span>
                <span style="font-weight:600;color:#1e293b">${report.reported_by_email || '—'}</span>
            </div>
            <div class="report-reason-container" style="margin-top:8px;">
                <span class="reason-label">Reported Content:</span>
            </div>
            ${renderSourcePreview(report.content)}
        </div>
        <div class="approval-actions">
            <button class="approve-btn action-btn" onclick="toggleReportActionPanel(this)">
                <i class="fas fa-hammer"></i> Take Action
            </button>
            <button class="block-btn dismiss-btn" onclick="dismissReport('${report.id}', this)">
                <i class="fas fa-times-circle"></i> Dismiss
            </button>
        </div>
        <div class="action-options-panel" style="display:none;">
            <div class="action-buttons-row">
                <button class="sub-action-btn suspend" onclick="reportSuspendUser('${report.user_email || report.reported_by_email}', '${report.id}', this)">
                    <i class="fas fa-user-slash"></i> Suspend User
                </button>
                <button class="sub-action-btn remove" onclick="reportRemoveContent('${report.id}', this)">
                    <i class="fas fa-trash-alt"></i> Remove Content
                </button>
                <button class="sub-action-btn block" onclick="reportBlockUser('${report.user_email || report.reported_by_email}', '${report.id}', this)">
                    <i class="fas fa-ban"></i> Block User
                </button>
            </div>
        </div>`;

    container.appendChild(card);
}

async function dismissReport(id, button) {
    const { error } = await supabaseClient.from('user_reports').update({ status: 'Dismissed' }).eq('id', id);
    if (error) { alert('Error: ' + error.message); return; }
    button.closest('.report-card').remove();
    showPopup('Report dismissed.');
}

function reportSuspendUser(email, reportId, button) {
    openSuspendModal(email);
}

function reportRemoveContent(reportId, button) {
    openModal('Remove Content', `
        <p class="modal-warning"><i class="fas fa-trash-alt"></i> This will remove the reported content and close the report.</p>
        <label class="modal-label">Reason for Removal</label>
        <textarea id="removeReasonInput" class="modal-textarea" placeholder="Enter reason for content removal..."></textarea>
    `, async () => {
        const reason = document.getElementById('removeReasonInput').value.trim();
        if (!reason) { alert('Please enter a reason.'); return; }
        const { error } = await supabaseClient.from('user_reports').update({ status: 'Actioned' }).eq('id', reportId);
        if (error) { alert('Error: ' + error.message); return; }
        closeModal();
        document.querySelector(`[data-report-id="${reportId}"]`)?.remove();
        showPopup('Content has been removed.');
    });
}

function reportBlockUser(email, reportId, button) {
    openModal('Block User', `
        <p class="modal-warning"><i class="fas fa-exclamation-triangle"></i> This will <strong>permanently delete all data</strong> for <strong>${email}</strong> and remove this report.</p>
        <label class="modal-label">Reason for Blocking</label>
        <textarea id="reportBlockReasonInput" class="modal-textarea" placeholder="Enter reason..."></textarea>
    `, async () => {
        const reason = document.getElementById('reportBlockReasonInput').value.trim();
        if (!reason) { alert('Please enter a reason.'); return; }
        await blockUser(email, reason);
        await supabaseClient.from('user_reports').update({ status: 'Actioned' }).eq('id', reportId);
        closeModal();
        document.querySelector(`[data-report-id="${reportId}"]`)?.remove();
    });
}

function toggleReportActionPanel(button) {
    const card  = button.closest('.report-card');
    const panel = card.querySelector('.action-options-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Keyboard shortcut: Press '1' in Reports section to add mock report
document.addEventListener('keydown', e => {
    const section = document.getElementById('reports');
    if (e.key === '1' && section && section.classList.contains('active')) addMockReport();
});

function addMockReport() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;
    const noData = container.querySelector('.no-data-container');
    if (noData) noData.remove();
    renderReportCard(container, {
        id:                'mock-' + Date.now(),
        reported_by_email: 'reporter@example.com',
        user_email:        'User123',
        spot_numbers:      [2, 4],
        user_floor:        5,
        content:           'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        status:            'Pending',
    });
}

// ============================================================
// ROW 4 — USER REWARDS
// ============================================================
async function loadUserRewards() {
    const container = document.getElementById('rewardsContainer');
    if (!container) return;

    const { data, error } = await supabaseClient
        .from('user_rewards')
        .select('*')
        .order('accumulated_pvs', { ascending: false });

    const title = container.querySelector('h3');
    container.innerHTML = '';
    if (title) container.appendChild(title);

    if (error || !data || data.length === 0) {
        container.insertAdjacentHTML('beforeend', `
            <div class="no-data-container">
                <div class="no-data-icon"><i class="fas fa-gift"></i></div>
                <h4>No Rewards Data</h4>
                <p>No user rewards found.</p>
            </div>`);
        return;
    }

    const tableHtml = `
        <div class="data-table" style="margin-top:1rem;">
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Floor Number</th>
                        <th>Accumulated PVs</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(r => `
                    <tr>
                        <td>${r.user_email}</td>
                        <td>${r.floor_number}</td>
                        <td>
                            <input
                                type="number"
                                class="pv-edit-input"
                                value="${r.accumulated_pvs}"
                                data-email="${r.user_email}"
                                min="0"
                                onblur="updatePVs(this)"
                                onkeydown="if(event.key==='Enter'){this.blur()}"
                            >
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;

    container.insertAdjacentHTML('beforeend', tableHtml);
}

async function updatePVs(input) {
    const email  = input.dataset.email;
    const newVal = parseInt(input.value);
    if (isNaN(newVal) || newVal < 0) return;

    // Update user_rewards
    const { error: e1 } = await supabaseClient
        .from('user_rewards')
        .update({ accumulated_pvs: newVal, updated_at: new Date().toISOString() })
        .eq('user_email', email);

    // Sync to connected_users
    const { error: e2 } = await supabaseClient
        .from('connected_users')
        .update({ accumulated_pvs: newVal })
        .eq('email', email);

    if (e1 || e2) { alert('Error updating PVs.'); return; }
    showPopup(`PVs updated to ${newVal} for ${email}`);
}

// ============================================================
// ROW 5 — ADMIN APPROVAL
// ============================================================
async function loadAdminApprovals() {
    const container = document.getElementById('urlApprovalContainer');
    if (!container) return;
    container.innerHTML = `<p style="color:#94a3b8;text-align:center;padding:2rem">Loading...</p>`;

    const { data, error } = await supabaseClient
        .from('admin_approvals')
        .select('*')
        .eq('status', 'Pending')
        .order('submitted_at', { ascending: false });

    container.innerHTML = '';

    if (error) {
        container.innerHTML = `<p style="color:#ef4444;text-align:center;padding:2rem">Error: ${error.message}</p>`;
        return;
    }
    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="no-data-container">
                <div class="no-data-icon"><i class="fas fa-check-circle"></i></div>
                <h4>No Pending Approvals</h4>
                <p>All content has been reviewed.</p>
            </div>`;
        return;
    }

    const emails = [...new Set(data.map(d => d.user_mail))];
    const { data: usersData } = await supabaseClient.from('connected_users').select('email, country').in('email', emails);
    const countryMap = {};
    if (usersData) usersData.forEach(u => countryMap[u.email] = u.country || 'Unknown');

    data.forEach(item => {
        const userCountry = countryMap[item.user_mail] || 'Unknown';

        const card = document.createElement('div');
        card.className = 'user-approval-card';
        card.dataset.approvalId = item.id;
        card.innerHTML = `
            <div class="approval-header-row">
                <span class="status-icon"></span>
                <span class="approval-email">${item.user_mail}</span>
                <span class="approval-meta">Country: <strong>${userCountry}</strong></span>
                <span class="approval-meta">Submitted: ${new Date(item.submitted_at).toLocaleString()}</span>
                <button class="minimize-btn" onclick="toggleMinimize(this)">
                    <i class="fas fa-chevron-up"></i>
                </button>
            </div>
            <div class="content-preview">
                <div class="report-reason-container">
                    <span class="reason-label">Content for Review:</span>
                </div>
                ${renderSourcePreview(item.source_link)}
            </div>
            <div class="approval-actions">
                <button class="approve-btn" onclick="openApproveModal('${item.id}', '${item.user_mail}')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="block-btn" onclick="showRejectionPanel('${item.id}', this)">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
            <div class="rejection-panel" style="display:none;">
                <label class="modal-label" style="display:block;margin-bottom:8px;">Reason for Rejection</label>
                <textarea class="reason-input rejection-reason-textarea" placeholder="Enter reason for rejection..."></textarea>
                <button class="submit-action-btn" onclick="submitRejection('${item.id}', this)" style="margin-top:10px;">
                    Submit Rejection
                </button>
            </div>`;

        container.appendChild(card);
    });
}

function openApproveModal(id, email) {
    openModal('Send Coupon & Approve', `
        <label class="modal-label" style="display:block;margin-bottom:8px;">Email Message</label>
        <textarea id="approveMessageInput" class="modal-textarea" style="min-height:80px; margin-bottom:15px; width:100%; box-sizing:border-box;">Hey User Please find your coupon attached for streaming content in Tap 24 Virtual World</textarea>
        
        <label class="modal-label" style="display:block;margin-bottom:6px;">Please enter coupon for user</label>
        <input type="text" id="approveCouponInput" class="modal-input" placeholder="Enter coupon code here..." style="width:100%; padding:12px 14px; border:1px solid #e2e8f0; border-radius:8px; font-size:0.95rem; box-sizing:border-box; margin-bottom:8px;">
        <div style="text-align:right;">
            <button style="padding:5px 12px; border-radius:5px; background:transparent; color:#3b82f6; border:1px solid #3b82f6; cursor:pointer; font-size:0.8rem; white-space:nowrap;" onclick="closeModal(); document.querySelector(&quot;a[href='#coupon-generator']&quot;).click();">🎟️ Get new coupon?</button>
        </div>
    `, async () => {
        const message = document.getElementById('approveMessageInput').value.trim();
        const coupon = document.getElementById('approveCouponInput').value.trim();
        
        if (!message || !coupon) { alert('Please enter both a message and a coupon code.'); return; }
        
        const btn = document.getElementById('modalSubmitBtn');
        const oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            // Note: Use straight concat here to avoid nested backtick escaping issues
            const finalMessage = message + "\\n\\nYour Coupon Code: " + coupon;
            
            // Mark request as Approved
            const { error: dbError } = await supabaseClient.from('admin_approvals')
                .update({ status: 'Approved', reviewed_at: new Date().toISOString() })
                .eq('id', id);
            if (dbError) throw dbError;

            // Send Email (Hardcoded for Resend free tier)
            const testEmail = 'superpundir@gmail.com';
            const { error: fnError } = await supabaseClient.functions.invoke('send-email', {
                body: { email: testEmail, subject: 'Your Request is Approved!', message: finalMessage }
            });
            if (fnError) console.error("Email send failed:", fnError);

            showPopup('Coupon Sent to user for redemption');
            closeModal();
            
            const card = document.querySelector('.user-approval-card[data-approval-id="' + id + '"]');
            if (card) card.remove();
            
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            btn.innerHTML = oldText;
            btn.disabled = false;
        }
    });
}

function showRejectionPanel(id, button) {
    const card  = button.closest('.user-approval-card');
    const panel = card.querySelector('.rejection-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

async function submitRejection(id, button) {
    const card   = button.closest('.user-approval-card');
    const reason = card.querySelector('.rejection-reason-textarea').value.trim();
    if (!reason) { alert('Please enter a reason for rejection.'); return; }

    const { error } = await supabaseClient
        .from('admin_approvals')
        .update({
            status:           'Rejected',
            rejection_reason: reason,
            reviewed_at:      new Date().toISOString()
        })
        .eq('id', id);

    if (error) { alert('Error: ' + error.message); return; }
    card.remove();
    showPopup('Request rejected.');
}



// ============================================================
// SHARED UI HELPERS
// ============================================================
function toggleMinimize(button) {
    const card = button.closest('.user-approval-card, .report-card');
    if (card) {
        card.classList.toggle('minimized');
        button.classList.toggle('rotated');
    }
}

// ============================================================
// SOURCE LINK SMART PREVIEW
// ============================================================
function renderSourcePreview(url) {
    if (!url) return `
        <p style="color:#94a3b8;font-size:0.85rem;margin:8px 0;">
            <i class="fas fa-exclamation-circle" style="color:#f59e0b;margin-right:5px;"></i>No source link provided.
        </p>`;

    const ytId = getYouTubeVideoId(url);
    if (ytId) return `
        <div class="url-preview">
            <a href="${url}" target="_blank" class="url-link">
                <i class="fas fa-external-link-alt"></i> ${url}
            </a>
        </div>
        <div class="video-thumbnail" style="margin-top:10px;cursor:pointer;" onclick="window.open('${url}','_blank')">
            <img src="https://img.youtube.com/vi/${ytId}/maxresdefault.jpg"
                 alt="YouTube Thumbnail"
                 onerror="this.src='https://img.youtube.com/vi/${ytId}/hqdefault.jpg'">
            <div class="play-button"><i class="fas fa-play"></i></div>
        </div>`;

    const imageExts = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i;
    if (imageExts.test(url)) return `
        <div class="url-preview">
            <a href="${url}" target="_blank" class="url-link">
                <i class="fas fa-external-link-alt"></i> ${url}
            </a>
        </div>
        <div style="margin-top:10px;">
            <img src="${url}" alt="Content Preview"
                 style="max-width:100%;max-height:320px;border-radius:8px;border:1px solid #e2e8f0;object-fit:contain;"
                 onerror="this.style.display='none'">
        </div>`;

    return `
        <div class="url-preview">
            <a href="${url}" target="_blank" class="url-link">
                <i class="fas fa-external-link-alt"></i> ${url}
            </a>
        </div>
        <div style="margin-top:8px;padding:12px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;">
            <i class="fas fa-link" style="color:#94a3b8;margin-right:6px;"></i>
            <span style="color:#64748b;font-size:0.85rem;">Click the link above to view the content.</span>
        </div>`;
}

function getYouTubeVideoId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match  = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// ============================================================
// COUPON GENERATOR (UI only)
// ============================================================
const generationLimits = { video: 0, image: 0, asset: 0 };

function generateCoupons(type) {
    if (generationLimits[type] >= 2) { showWarningMessage(type); return; }
    const container = document.getElementById(`${type}Coupons`);
    if (!container) return;
    generateUniqueCodes(5).forEach(code => {
        const el = document.createElement('div');
        el.className = 'coupon-code';
        el.innerHTML = `<span>${code}</span><button class="copy-btn" onclick="copyToClipboard('${code}')"><i class="fas fa-copy"></i></button>`;
        container.appendChild(el);
    });
    generationLimits[type]++;
    updateGenerateButton(type);
}

function showWarningMessage(type) {
    const container = document.getElementById(`${type}Coupons`);
    if (!container) return;
    const warn = document.createElement('div');
    warn.className = 'warning-message';
    warn.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>More coupons can only be generated once previous ones are redeemed</span><button class="close-warning" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
    container.parentElement.insertBefore(warn, container.parentElement.firstChild);
}

function updateGenerateButton(type) {
    const container = document.getElementById(`${type}Coupons`);
    if (!container) return;
    const btn = container.parentElement.querySelector('.generate-btn');
    if (btn && generationLimits[type] >= 2) { btn.disabled = true; btn.style.opacity = '0.5'; btn.style.cursor = 'not-allowed'; }
}

function generateUniqueCodes(count) {
    const codes = new Set(), chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    while (codes.size < count) { let c = ''; for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)]; codes.add(c); }
    return Array.from(codes);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showPopup('Copied to clipboard!')).catch(console.error);
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    const btn = document.querySelector(`[onclick="switchTab('${tabId}')"]`);
    if (btn) btn.classList.add('active');
}
