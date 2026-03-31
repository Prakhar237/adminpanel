// ============================================================
// TAP24H Admin Panel — Supabase Backend Integration
// Project: qpchntucxzwbizwlisbb
// ============================================================

const { createClient } = supabase;

const SUPABASE_URL = 'https://qpchntucxzwbizwlisbb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwY2hudHVjeHp3Yml6d2xpc2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDE5NTcsImV4cCI6MjA5MDUxNzk1N30.nV3er_FIqGDeuqR2RV_SXrV8b1NnxqF9vhlwXz9ySoo';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// LOGIN PAGE
// ============================================================
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        window.location.href = 'dashboard.html';
    });
}

// ============================================================
// DASHBOARD PAGE INIT
// ============================================================
if (document.getElementById('logoutBtn')) {
    const logoutBtn      = document.getElementById('logoutBtn');
    const sidebarToggle  = document.getElementById('sidebarToggle');
    const sidebar        = document.querySelector('.sidebar');
    const mainContent    = document.querySelector('.main-content');
    const navLinks       = document.querySelectorAll('.sidebar nav ul li a');

    // Sidebar toggle
    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-chevron-left');
        icon.classList.toggle('fa-chevron-right');
    });

    // Logout
    logoutBtn.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // Sidebar navigation — load section data on click
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));

            this.parentElement.classList.add('active');

            const sectionId = this.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active');

            document.querySelector('.header h1').textContent = this.textContent.trim();

            // Load appropriate data
            switch (sectionId) {
                case 'dashboard':      loadConnectedUsers();    break;
                case 'coupons':        loadCouponInventory();   break;
                case 'reports':        loadUserReports();       break;
                case 'rewards':        loadUserRewards();       break;
                case 'approval':       loadAdminApprovals();    break;
            }
        });
    });

    // On page load — load dashboard data immediately
    loadConnectedUsers();
    loadDashboardStats();
}

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

document.addEventListener('DOMContentLoaded', function () {
    const closePopup    = document.getElementById('closePopup');
    const popupOverlay  = document.getElementById('popupOverlay');
    if (closePopup) closePopup.addEventListener('click', () => popupOverlay.classList.remove('active'));
    if (popupOverlay) popupOverlay.addEventListener('click', e => {
        if (e.target === popupOverlay) popupOverlay.classList.remove('active');
    });

    // Milestones dropdown
    const dropdownHeader  = document.querySelector('.dropdown-header');
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownHeader && dropdownContent) {
        dropdownHeader.addEventListener('click', function () {
            this.classList.toggle('active');
            dropdownContent.classList.toggle('active');
        });
    }
});

// ============================================================
// 1. DASHBOARD — Connected Users
// ============================================================
async function loadConnectedUsers() {
    const tbody = document.querySelector('#dashboard .data-table tbody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:2rem">Loading...</td></tr>`;

    const { data, error } = await supabaseClient
        .from('connected_users')
        .select('*')
        .order('connected_at', { ascending: false });

    if (error) {
        tbody.innerHTML = `<tr><td colspan="4" style="color:#ef4444;text-align:center;padding:2rem">Error: ${error.message}</td></tr>`;
        return;
    }

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:2rem">No connected users found.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(user => `
        <tr class="user-row">
            <td>${user.email}</td>
            <td>${user.virtual_floor_number}</td>
            <td>${user.country}</td>
            <td>
                <button class="expand-btn" onclick="toggleUserDetails(this)">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </td>
        </tr>
        <tr class="user-details-row" style="display:none;">
            <td colspan="4">
                <div class="user-details-expanded">
                    <div class="details-grid">
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${user.email}</span>
                        </div>
                        <div class="detail-item">
                            <label>Floor:</label>
                            <span>${user.virtual_floor_number}</span>
                        </div>
                        <div class="detail-item">
                            <label>Country:</label>
                            <span>${user.country}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status-badge ${user.is_active ? 'active' : 'locked'}">${user.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Connected At:</label>
                            <span>${new Date(user.connected_at).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="user-actions">
                        <button class="block-user-btn" onclick="showBlockReason()">
                            <i class="fas fa-ban"></i> Block User
                        </button>
                        <button class="suspend-user-btn" onclick="showSuspendReason()">
                            <i class="fas fa-pause-circle"></i> Suspend User
                        </button>
                        <button class="message-user-btn" onclick="sendMessage()">
                            <i class="fas fa-envelope"></i> Send Message
                        </button>
                    </div>
                    <div class="action-reason" id="blockReason" style="display:none;">
                        <textarea placeholder="Enter reason for blocking..." class="reason-input"></textarea>
                        <button class="submit-reason" onclick="submitBlockReason()">Submit</button>
                    </div>
                    <div class="action-reason" id="suspendReason" style="display:none;">
                        <textarea placeholder="Enter reason for suspension..." class="reason-input"></textarea>
                        <button class="submit-reason" onclick="submitSuspendReason()">Submit</button>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

async function loadDashboardStats() {
    const stats = [
        { table: 'connected_users', selector: '.stat-card:nth-child(1) .value' },
        { table: 'coupon_inventory', selector: '.stat-card:nth-child(2) .value' },
        { table: 'user_rewards', selector: '.stat-card:nth-child(3) .value' },
    ];

    for (const s of stats) {
        const { count } = await supabaseClient.from(s.table).select('*', { count: 'exact', head: true });
        const el = document.querySelector(s.selector);
        if (el) el.textContent = count ?? 0;
    }
}

// ============================================================
// 2. COUPON INVENTORY
// ============================================================
async function loadCouponInventory() {
    const container = document.querySelector('#coupons .assigned-coupons .data-table tbody');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:2rem">Loading...</td></tr>`;

    const { data, error } = await supabaseClient
        .from('coupon_inventory')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = `<tr><td colspan="4" style="color:#ef4444;text-align:center;padding:2rem">Error: ${error.message}</td></tr>`;
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:2rem">No coupon records found.</td></tr>`;
        return;
    }

    container.innerHTML = data.map(c => `
        <tr>
            <td>${c.email}</td>
            <td>${c.virtual_floor}</td>
            <td>${c.country}</td>
            <td><span class="status-badge ${c.status === 'Active' ? 'active' : c.status === 'Redeemed' ? 'approved' : 'pending'}">${c.status}</span></td>
        </tr>
    `).join('');
}

// ============================================================
// 3. USER REPORTS
// ============================================================
async function loadUserReports() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;

    // Keep the h3 title, clear rest
    const title = container.querySelector('h3');
    container.innerHTML = '';
    if (title) container.appendChild(title);

    const loadingEl = document.createElement('div');
    loadingEl.className = 'no-data-container';
    loadingEl.innerHTML = `<p style="color:#94a3b8">Loading reports...</p>`;
    container.appendChild(loadingEl);

    const { data, error } = await supabaseClient
        .from('user_reports')
        .select('*')
        .order('created_at', { ascending: false });

    loadingEl.remove();

    if (error) {
        container.insertAdjacentHTML('beforeend', `<div class="no-data-container"><p style="color:#ef4444">Error: ${error.message}</p></div>`);
        return;
    }

    if (!data || data.length === 0) {
        container.insertAdjacentHTML('beforeend', `
            <div class="no-data-container">
                <div class="no-data-icon"><i class="fas fa-file-alt"></i></div>
                <h4>No Reports Found</h4>
                <p>There are currently no user activity reports available.</p>
            </div>
        `);
        return;
    }

    data.forEach(report => renderReportCard(container, report));
}

function renderReportCard(container, report) {
    const spots = Array.isArray(report.spot_numbers)
        ? report.spot_numbers.map(s => `<span class="spot-badge">${s}</span>`).join(' ')
        : report.spot_numbers;

    const card = document.createElement('div');
    card.className = 'user-approval-card report-card';
    card.style.animation = 'slideIn 0.3s ease-out';
    card.innerHTML = `
        <div class="user-header">
            <div class="report-header-info">
                <span class="status-icon blocked"></span>
                <span class="report-label">Report by -</span>
                <span class="user-id-highlight">${report.reported_by_email}</span>
                <span class="floor-info">Floor: <strong>${report.user_floor}</strong></span>
                <span class="spots-info">Spots: ${spots}</span>
            </div>
            <button class="minimize-btn" onclick="toggleMinimize(this)">
                <i class="fas fa-chevron-up"></i>
            </button>
        </div>
        <div class="content-preview">
            <div class="report-reason-container">
                <span class="reason-label">Reported Content:</span>
                <span class="reason-value">${report.content}</span>
            </div>
            <div class="url-preview">
                ${report.content.startsWith('http') ? `<a href="${report.content}" target="_blank" class="url-link"><i class="fas fa-external-link-alt"></i> ${report.content}</a>` : ''}
            </div>
        </div>
        <div class="approval-actions">
            <button class="approve-btn action-btn" onclick="toggleReportActionPanel(this)">
                <i class="fas fa-hammer"></i> Take Action
            </button>
            <button class="block-btn dismiss-btn" onclick="updateReportStatus('${report.id}', 'Dismissed', this)">
                <i class="fas fa-times-circle"></i> Dismiss Report
            </button>
        </div>
        <div class="action-options-panel" style="display:none;">
            <div class="action-buttons-row">
                <button class="sub-action-btn suspend" onclick="showActionReason('suspend', this)">
                    <i class="fas fa-user-slash"></i> Suspend User
                </button>
                <button class="sub-action-btn remove" onclick="showActionReason('remove', this)">
                    <i class="fas fa-trash-alt"></i> Remove Content
                </button>
                <button class="sub-action-btn block" onclick="showActionReason('block', this)">
                    <i class="fas fa-ban"></i> Block User
                </button>
            </div>
            <div class="action-input-container" style="display:none;">
                <textarea placeholder="Enter reason..." class="reason-input"></textarea>
                <button class="submit-action-btn" onclick="updateReportStatus('${report.id}', 'Actioned', this)">Confirm Action</button>
            </div>
        </div>
    `;
    container.appendChild(card);
}

async function updateReportStatus(id, status, button) {
    const { error } = await supabaseClient
        .from('user_reports')
        .update({ status })
        .eq('id', id);

    if (error) { alert('Error: ' + error.message); return; }
    button.closest('.report-card').remove();
    showPopup(`Report marked as ${status}.`);
}

// ============================================================
// 4. USER REWARDS
// ============================================================
async function loadUserRewards() {
    const container = document.querySelector('#rewards .cyber-card .rewards-container');
    if (!container) return;

    const { data, error } = await supabaseClient
        .from('user_rewards')
        .select('*')
        .order('accumulated_pvs', { ascending: false });

    if (error || !data || data.length === 0) return;

    // Update the first user card with real data
    const first = data[0];
    const emailEl = container.querySelector('.level-info h4');
    const xpEl    = container.querySelector('.xp-text');
    const xpBar   = container.querySelector('.xp-progress');
    const lvlEl   = container.querySelector('.level-number');

    if (emailEl) emailEl.innerHTML = `${first.user_email} <span class="status-blip active"></span>`;
    if (xpEl)    xpEl.textContent  = `${first.accumulated_pvs} PVs accumulated`;
    if (xpBar)   xpBar.style.width = `${Math.min((first.accumulated_pvs % 100), 100)}%`;
    if (lvlEl)   lvlEl.textContent = Math.floor(first.accumulated_pvs / 100) + 1;
}

// ============================================================
// 5. ADMIN APPROVAL
// ============================================================
async function loadAdminApprovals() {
    const container = document.getElementById('urlApprovalContainer');
    if (!container) return;

    container.innerHTML = `<div class="no-data-container"><p style="color:#94a3b8">Loading approvals...</p></div>`;

    const { data, error } = await supabaseClient
        .from('admin_approvals')
        .select('*')
        .eq('status', 'Pending')
        .order('submitted_at', { ascending: false });

    container.innerHTML = '';

    if (error) {
        container.innerHTML = `<div class="no-data-container"><p style="color:#ef4444">Error: ${error.message}</p></div>`;
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

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'user-approval-card';
        card.innerHTML = `
            <div class="user-header">
                <div class="user-info">
                    <h4><span class="status-icon"></span>${item.user_mail}</h4>
                    <div class="user-details">
                        <span>Floor: <strong>${item.user_floor}</strong></span>
                        <span>Spot: <span class="spot-badge">${item.spot_number}</span></span>
                        <span>Submitted: ${new Date(item.submitted_at).toLocaleString()}</span>
                    </div>
                </div>
                <button class="minimize-btn" onclick="toggleMinimize(this)">
                    <i class="fas fa-chevron-up"></i>
                </button>
            </div>
            ${item.source_link ? `
            <div class="content-preview">
                <div class="report-reason-container">
                    <span class="reason-label">Content for Review:</span>
                </div>
                <div class="url-preview">
                    <a href="${item.source_link}" target="_blank" class="url-link">
                        <i class="fas fa-external-link-alt"></i> ${item.source_link}
                    </a>
                </div>
            </div>` : `
            <div class="content-preview">
                <p style="color:#94a3b8;font-size:0.85rem;margin:8px 0 0;">
                    <i class="fas fa-exclamation-circle" style="color:#f59e0b;margin-right:5px;"></i>No source link provided.
                </p>
            </div>`}
            <div class="approval-actions">
                <button class="approve-btn" onclick="updateApprovalStatus('${item.id}', 'Approved', this)">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="block-btn" onclick="updateApprovalStatus('${item.id}', 'Rejected', this)">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

async function updateApprovalStatus(id, status, button) {
    const { error } = await supabaseClient
        .from('admin_approvals')
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq('id', id);

    if (error) { alert('Error: ' + error.message); return; }
    button.closest('.user-approval-card').remove();
    showPopup(`Request has been ${status.toLowerCase()}.`);
}

// Also load approvals when clicking the approval nav link
document.addEventListener('DOMContentLoaded', function () {
    const approvalLink = document.querySelector('a[href="#approval"]');
    if (approvalLink) {
        approvalLink.addEventListener('click', loadAdminApprovals);
    }
});

// ============================================================
// UI HELPERS
// ============================================================
function toggleMinimize(button) {
    const card = button.closest('.user-approval-card');
    card.classList.toggle('minimized');
    button.classList.toggle('rotated');
}

function toggleUserDetails(button) {
    const userRow    = button.closest('tr');
    const detailsRow = userRow.nextElementSibling;
    button.classList.toggle('rotated');
    detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
}

function showBlockReason() {
    document.getElementById('blockReason').style.display = 'block';
    document.getElementById('suspendReason').style.display = 'none';
}

function showSuspendReason() {
    document.getElementById('suspendReason').style.display = 'block';
    document.getElementById('blockReason').style.display = 'none';
}

function submitBlockReason() {
    const input = document.querySelector('#blockReason .reason-input');
    if (input && input.value.trim()) {
        alert('User has been blocked.');
        document.getElementById('blockReason').style.display = 'none';
    } else {
        alert('Please enter a reason for blocking.');
    }
}

function submitSuspendReason() {
    const input = document.querySelector('#suspendReason .reason-input');
    if (input && input.value.trim()) {
        alert('User has been suspended.');
        document.getElementById('suspendReason').style.display = 'none';
    } else {
        alert('Please enter a reason for suspension.');
    }
}

function sendMessage() {
    const mailtoLink = `mailto:admin@tap24h.com?subject=Message from TAP24H Admin&body=Hello, we would like to discuss your account.`;
    window.location.href = mailtoLink;
}

function toggleReportActionPanel(button) {
    const card  = button.closest('.report-card');
    const panel = card.querySelector('.action-options-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function showActionReason(type, button) {
    const card           = button.closest('.report-card');
    const inputContainer = card.querySelector('.action-input-container');
    const textarea       = inputContainer.querySelector('textarea');

    inputContainer.style.display = 'block';

    const placeholders = {
        suspend: 'Enter reason for suspension...',
        remove:  'Enter reason for content removal...',
        block:   'Enter reason for blocking...',
    };
    textarea.placeholder = placeholders[type] || 'Enter reason...';
    textarea.focus();
}

// ============================================================
// KEYBOARD SHORTCUT — Press '1' in Reports to add mock report
// ============================================================
document.addEventListener('keydown', function (e) {
    const reportsSection = document.getElementById('reports');
    if (e.key === '1' && reportsSection && reportsSection.classList.contains('active')) {
        addMockReport();
    }
});

function addMockReport() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;

    const noData = container.querySelector('.no-data-container');
    if (noData) noData.remove();

    const mockReport = {
        id: 'mock-' + Date.now(),
        reported_by_email: 'User123',
        spot_numbers: [2, 4],
        user_floor: 5,
        content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        status: 'Pending',
        created_at: new Date().toISOString()
    };

    renderReportCard(container, mockReport);
}

// ============================================================
// COUPON GENERATOR (kept as UI-only feature)
// ============================================================
const generationLimits = { video: 0, image: 0, asset: 0 };

function generateCoupons(type) {
    if (generationLimits[type] >= 2) { showWarningMessage(type); return; }

    const container = document.getElementById(`${type}Coupons`);
    if (!container) return;

    generateUniqueCodes(5).forEach(code => {
        const el = document.createElement('div');
        el.className = 'coupon-code';
        el.innerHTML = `
            <span>${code}</span>
            <button class="copy-btn" onclick="copyToClipboard('${code}')">
                <i class="fas fa-copy"></i>
            </button>`;
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
    warn.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>More coupons can only be generated once previous ones are redeemed</span>
        <button class="close-warning" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
    container.parentElement.insertBefore(warn, container.parentElement.firstChild);
}

function updateGenerateButton(type) {
    const container = document.getElementById(`${type}Coupons`);
    if (!container) return;
    const btn = container.parentElement.querySelector('.generate-btn');
    if (btn && generationLimits[type] >= 2) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    }
}

function generateUniqueCodes(count) {
    const codes = new Set();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    while (codes.size < count) {
        let code = '';
        for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        codes.add(code);
    }
    return Array.from(codes);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showPopup('Code copied to clipboard!'))
        .catch(err => console.error('Copy failed:', err));
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    const btn = document.querySelector(`[onclick="switchTab('${tabId}')"]`);
    if (btn) btn.classList.add('active');
}

// ============================================================
// YOUTUBE HELPERS (kept for report card previews)
// ============================================================
function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match  = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
