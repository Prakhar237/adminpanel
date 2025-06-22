// Import Supabase client
const { createClient } = supabase;

// Initialize Supabase client
const supabaseClient = createClient(
    'https://hlxmcnykwjdbpxxyosoc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseG1jbnlrd2pkYnB4eHlvc29jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg4MDgyNSwiZXhwIjoyMDY0NDU2ODI1fQ.RGe-KTVUK2F71Uv9EpIl2Nmlj_mJEEmxHN091Fs0a-c',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Check if we're on the login page
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted, redirecting to dashboard...');
        
        // Get form data (optional, for future authentication)
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // For now, just redirect to dashboard
        // In the future, you can add actual authentication here
        window.location.href = 'dashboard.html';
    });
    
    // Also add click handler for the submit button as backup
    const submitButton = loginForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Login button clicked, redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        });
    }
}

// Check if we're on the dashboard page
if (document.getElementById('logoutBtn')) {
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    
    // Sidebar toggle functionality
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-chevron-left');
        icon.classList.toggle('fa-chevron-right');
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Handle sidebar navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Show corresponding content section
            const sectionId = this.getAttribute('href').substring(1);
            document.getElementById(sectionId).classList.add('active');
            
            // Update header title
            document.querySelector('.header h1').textContent = this.textContent.trim();
        });
    });
}

// Add popup HTML to the body
document.body.insertAdjacentHTML('beforeend', `
    <div class="popup-overlay" id="popupOverlay">
        <div class="popup-content">
            <h4 id="popupMessage"></h4>
            <button id="closePopup">Close</button>
        </div>
    </div>
`);

// Handle sign-up kit functionality
if (document.getElementById('sendKitBtn')) {
    const sendKitBtn = document.getElementById('sendKitBtn');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupMessage = document.getElementById('popupMessage');
    const closePopup = document.getElementById('closePopup');
    const assignedUsersTable = document.getElementById('assignedUsersTable');
    const pendingUserInfo = document.querySelector('.pending-user-info');

    sendKitBtn.addEventListener('click', function() {
        // Show popup
        popupMessage.textContent = 'supabaseuser.com has been sent the sign-up kit';
        popupOverlay.classList.add('active');

        // Move user to assigned table
        const userRow = document.createElement('tr');
        userRow.innerHTML = `
            <td>supabaseuser.com</td>
            <td>1</td>
            <td>database connection in progress</td>
            <td>Active</td>
        `;
        assignedUsersTable.appendChild(userRow);

        // Remove from pending section
        pendingUserInfo.style.display = 'none';
    });

    closePopup.addEventListener('click', function() {
        popupOverlay.classList.remove('active');
    });

    // Close popup when clicking outside
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
        }
    });
}

// Milestones Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdownHeader = document.querySelector('.dropdown-header');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdownHeader.addEventListener('click', function() {
        this.classList.toggle('active');
        dropdownContent.classList.toggle('active');
    });
});

// Handle minimize toggle
function toggleMinimize(button) {
    const card = button.closest('.user-approval-card');
    card.classList.toggle('minimized');
    button.classList.toggle('rotated');
}

// Handle approval actions
function handleApproval(action) {
    const userCard = document.querySelector('.user-approval-card');
    const statusIcon = document.querySelector('.status-icon');
    const blockComments = document.querySelector('.block-comments');
    
    switch(action) {
        case 'approve':
            userCard.classList.add('minimized');
            statusIcon.classList.add('approved');
            blockComments.style.display = 'none';
            break;
            
        case 'block':
            blockComments.style.display = 'block';
            break;
            
        case 'ask':
            const email = 'supabaseuser.com';
            const subject = 'Please change your content';
            const body = 'Your content is found to be in violation of our community guidelines. Please review and make the necessary changes to comply with our content standards. We appreciate your cooperation in maintaining a positive and appropriate environment for all users.';
            
            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
            break;
    }
}

// Handle user details expansion
function toggleUserDetails(button) {
    const userRow = button.closest('tr');
    const detailsRow = userRow.nextElementSibling;
    const icon = button.querySelector('i');
    
    button.classList.toggle('rotated');
    detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
}

// Show block reason input
function showBlockReason() {
    const blockReason = document.getElementById('blockReason');
    const suspendReason = document.getElementById('suspendReason');
    
    blockReason.style.display = 'block';
    suspendReason.style.display = 'none';
}

// Show suspend reason input
function showSuspendReason() {
    const blockReason = document.getElementById('blockReason');
    const suspendReason = document.getElementById('suspendReason');
    
    suspendReason.style.display = 'block';
    blockReason.style.display = 'none';
}

// Handle block reason submission
function submitBlockReason() {
    const reason = document.querySelector('#blockReason .reason-input').value;
    if (reason.trim()) {
        // Here you would typically send this to your backend
        console.log('Block reason:', reason);
        alert('User has been blocked');
        document.getElementById('blockReason').style.display = 'none';
    } else {
        alert('Please enter a reason for blocking');
    }
}

// Handle suspend reason submission
function submitSuspendReason() {
    const reason = document.querySelector('#suspendReason .reason-input').value;
    if (reason.trim()) {
        // Here you would typically send this to your backend
        console.log('Suspend reason:', reason);
        alert('User has been suspended');
        document.getElementById('suspendReason').style.display = 'none';
    } else {
        alert('Please enter a reason for suspension');
    }
}

// Handle send message
function sendMessage() {
    const email = 'supabaseuser.com';
    const subject = 'Message from TAP24H Admin';
    const body = 'Hello, I would like to discuss something with you regarding your account.';
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

// Remove the automatic tab switching on 'M' key press
document.removeEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 'm') {
        // ... existing code ...
    }
});

// Video Approval Functions
async function fetchPendingVideos() {
    try {
        const response = await fetch('/api/youtube-urls');
        const videos = await response.json();
        displayVideos(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        showNoVideosMessage();
    }
}

function displayVideos(videos) {
    const container = document.getElementById('videoApprovalContainer');
    
    if (!videos || videos.length === 0) {
        showNoVideosMessage();
        return;
    }

    container.innerHTML = videos.map(video => `
        <div class="user-approval-card" data-video-id="${video.id}">
            <div class="user-header">
                <div class="user-info">
                    <h4><span class="status-icon"></span>${video.userId}</h4>
                    <div class="user-details">
                        <span>Request Time: ${new Date(video.timestamp).toLocaleString()}</span>
                    </div>
                </div>
                <button class="minimize-btn" onclick="toggleMinimize(this)">
                    <i class="fas fa-chevron-up"></i>
                </button>
            </div>
            <div class="content-preview">
                <h5>Content Permission Requested</h5>
                <div class="video-preview">
                    <iframe 
                        width="560" 
                        height="315" 
                        src="${video.videoUrl}" 
                        title="Content Preview" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
            <div class="approval-actions">
                <button class="approve-btn" onclick="handleVideoApproval(${video.id}, 'approved')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="block-btn" onclick="handleVideoApproval(${video.id}, 'blocked')">
                    <i class="fas fa-times"></i> Block
                </button>
                <button class="ask-btn" onclick="handleVideoApproval(${video.id}, 'needs_changes')">
                    <i class="fas fa-envelope"></i> Ask User for Change
                </button>
            </div>
        </div>
    `).join('');
}

function showNoVideosMessage() {
    const container = document.getElementById('videoApprovalContainer');
    if (!container) return; // Exit if container doesn't exist
    
    container.innerHTML = `
        <div class="no-data-container">
            <div class="no-data-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h4>No Content to Review</h4>
            <p>There are currently no content approval requests pending.</p>
        </div>
    `;
}

async function handleVideoApproval(videoId, status) {
    try {
        const response = await fetch(`/api/youtube-urls/${videoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            // Refresh the video list
            fetchPendingVideos();
        } else {
            console.error('Error updating video status');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fetch videos when the approval section is loaded
document.addEventListener('DOMContentLoaded', function() {
    const approvalLink = document.querySelector('a[href="#approval"]');
    if (approvalLink) {
        approvalLink.addEventListener('click', fetchPendingVideos);
    }
});

// URL Approval Functions
async function fetchPendingUrls() {
    try {
        const response = await fetch('/api/youtube-urls');
        const urls = await response.json();
        displayUrls(urls);
    } catch (error) {
        console.error('Error fetching URLs:', error);
        showNoUrlsMessage();
    }
}

function displayUrls(urls) {
    const container = document.getElementById('urlApprovalContainer');
    
    if (!urls || urls.length === 0) {
        showNoUrlsMessage();
        return;
    }

    container.innerHTML = urls.map(url => `
        <div class="user-approval-card" data-url-id="${url.id}">
            <div class="user-header">
                <div class="user-info">
                    <h4>URL Submission</h4>
                    <div class="user-details">
                        <span>Submitted: ${new Date(url.timestamp).toLocaleString()}</span>
                    </div>
                </div>
                <button class="minimize-btn" onclick="toggleMinimize(this)">
                    <i class="fas fa-chevron-up"></i>
                </button>
            </div>
            <div class="content-preview">
                <h5>URL to Review</h5>
                <div class="url-preview">
                    <a href="${url.url}" target="_blank" class="url-link">${url.url}</a>
                </div>
            </div>
            <div class="approval-actions">
                <button class="approve-btn" onclick="handleUrlApproval(${url.id}, 'approved')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="block-btn" onclick="handleUrlApproval(${url.id}, 'blocked')">
                    <i class="fas fa-times"></i> Block
                </button>
            </div>
        </div>
    `).join('');
}

function showNoUrlsMessage() {
    const container = document.getElementById('urlApprovalContainer');
    if (!container) return; // Exit if container doesn't exist
    
    container.innerHTML = `
        <div class="no-data-container">
            <div class="no-data-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h4>No URLs to Review</h4>
            <p>There are currently no URL approval requests pending.</p>
        </div>
    `;
}

async function handleUrlApproval(urlId, status) {
    try {
        const response = await fetch(`/api/youtube-urls/${urlId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            // Refresh the URL list
            fetchPendingUrls();
        } else {
            console.error('Error updating URL status');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fetch URLs when the approval section is loaded
document.addEventListener('DOMContentLoaded', function() {
    const approvalLink = document.querySelector('a[href="#approval"]');
    if (approvalLink) {
        approvalLink.addEventListener('click', fetchPendingUrls);
    }
});

// Function to fetch YouTube URLs
async function fetchYouTubeUrls() {
    try {
        const response = await fetch('/api/youtube-urls');
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure we have an array of URLs
        const urls = Array.isArray(data) ? data : [];
        
        console.log('Fetched YouTube URLs:', urls);
        displayYouTubeUrls(urls);
    } catch (error) {
        console.error('Error fetching YouTube URLs:', error);
        showNoYouTubeUrlsMessage();
    }
}

// Function to extract YouTube video ID from URL
function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function displayYouTubeUrls(urls) {
    const container = document.getElementById('urlApprovalContainer');
    
    // Ensure urls is an array
    if (!Array.isArray(urls)) {
        console.error('displayYouTubeUrls: urls is not an array:', urls);
        showNoYouTubeUrlsMessage();
        return;
    }
    
    if (!urls || urls.length === 0) {
        showNoYouTubeUrlsMessage();
        return;
    }

    try {
        container.innerHTML = urls.map(url => {
            // Ensure url is an object with required properties
            if (!url || typeof url !== 'object') {
                console.error('Invalid url object:', url);
                return '';
            }
            
            const videoId = getYouTubeVideoId(url.url || '');
            const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
            const userEmail = url.user?.email || url.user_id || 'Unknown User';
            const userCountry = url.user?.raw_user_meta_data?.country || 'Not set';
            
            return `
                <div class="user-approval-card" data-url-id="${url.id || 'unknown'}">
                    <div class="user-header">
                        <div class="user-info">
                            <h4><span class="status-icon"></span>${userEmail}</h4>
                            <div class="user-details">
                                <span>Country: ${userCountry}</span>
                                <span>Submitted: ${new Date(url.created_at || Date.now()).toLocaleString()}</span>
                            </div>
                        </div>
                        <button class="minimize-btn" onclick="toggleMinimize(this)">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                    </div>
                    <div class="content-preview">
                        <h5>YouTube URL to Review</h5>
                        <div class="url-preview">
                            <a href="${url.url || '#'}" target="_blank" class="url-link">${url.url || 'No URL provided'}</a>
                        </div>
                        ${thumbnailUrl ? `
                            <div class="video-thumbnail">
                                <img src="${thumbnailUrl}" alt="Video Thumbnail" onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">
                                <div class="play-button">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="approval-actions">
                        <button class="approve-btn" onclick="handleUrlApproval(${url.id || 'unknown'}, 'approved')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="block-btn" onclick="handleUrlApproval(${url.id || 'unknown'}, 'blocked')">
                            <i class="fas fa-times"></i> Block
                        </button>
                        <button class="ask-btn" onclick="handleUrlApproval(${url.id || 'unknown'}, 'needs_changes')">
                            <i class="fas fa-question"></i> Request Changes
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error displaying YouTube URLs:', error);
        showNoYouTubeUrlsMessage();
    }
}

function showNoYouTubeUrlsMessage() {
    const container = document.getElementById('urlApprovalContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="no-data-container">
            <div class="no-data-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h4>No YouTube URLs to Review</h4>
            <p>There are currently no YouTube URL approval requests pending.</p>
        </div>
    `;
}

// Update the event listener for the approval section
document.addEventListener('DOMContentLoaded', function() {
    const approvalLink = document.querySelector('a[href="#approval"]');
    if (approvalLink) {
        approvalLink.addEventListener('click', fetchYouTubeUrls);
    }
});

// Coupon Generator Functions
const generationLimits = {
    video: 0,
    image: 0,
    asset: 0
};

function generateCoupons(type) {
    if (generationLimits[type] >= 2) {
        showWarningMessage(type);
        return;
    }

    const container = document.getElementById(`${type}Coupons`);
    const codes = generateUniqueCodes(5);
    
    codes.forEach(code => {
        const couponElement = document.createElement('div');
        couponElement.className = 'coupon-code';
        couponElement.innerHTML = `
            <span>${code}</span>
            <button class="copy-btn" onclick="copyToClipboard('${code}')">
                <i class="fas fa-copy"></i>
            </button>
        `;
        container.appendChild(couponElement);
    });

    generationLimits[type]++;
    updateGenerateButton(type);
}

function showWarningMessage(type) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'warning-message';
    warningDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>More coupons can only be generated once previous ones are redeemed</span>
        <button class="close-warning" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    const container = document.getElementById(`${type}Coupons`).parentElement;
    container.insertBefore(warningDiv, container.firstChild);
}

function updateGenerateButton(type) {
    const button = document.querySelector(`#${type}Coupons`).parentElement.querySelector('.generate-btn');
    if (generationLimits[type] >= 2) {
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
    }
}

function generateUniqueCodes(count) {
    const codes = new Set();
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    while (codes.size < count) {
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        codes.add(code);
    }
    
    return Array.from(codes);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show a temporary success message
        const button = event.currentTarget;
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = originalIcon;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Function to fetch users from Supabase
async function fetchUsers() {
    try {
        const { data: users, error } = await supabaseClient
            .auth.admin.listUsers();

        if (error) throw error;
        return users.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// Function to update dashboard stats
async function updateDashboardStats() {
    const users = await fetchUsers();
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.last_sign_in_at).length;
    
    // Update stats in the dashboard
    document.querySelector('.stat-card:nth-child(1) .value').textContent = totalUsers;
    document.querySelector('.stat-card:nth-child(2) .value').textContent = '0'; // Active coupons
    document.querySelector('.stat-card:nth-child(3) .value').textContent = '0'; // Total rewards

    // Update user table
    const tbody = document.querySelector('#dashboard .data-table tbody');
    tbody.innerHTML = users.map(user => `
        <tr class="user-row">
            <td>${user.email}</td>
            <td>1</td>
            <td>${user.raw_user_meta_data?.country || 'Not set'}</td>
            <td>
                <button class="expand-btn" onclick="toggleUserDetails(this)">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </td>
        </tr>
        <tr class="user-details-row" style="display: none;">
            <td colspan="4">
                <div class="user-details-expanded">
                    <div class="details-grid">
                        <div class="detail-item">
                            <label>Signed Up:</label>
                            <span>${new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-item">
                            <label>Current Status:</label>
                            <span class="status-badge ${user.last_sign_in_at ? 'active' : 'idle'}">${user.last_sign_in_at ? 'Active' : 'Idle'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Coupons Redeemed:</label>
                            <div class="coupons-list">
                                <span>no coupons yet</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label>Country:</label>
                            <span>${user.raw_user_meta_data?.country || 'Not set'}</span>
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
                    <div class="action-reason" id="blockReason" style="display: none;">
                        <textarea placeholder="Enter reason for blocking..." class="reason-input"></textarea>
                        <button class="submit-reason" onclick="submitBlockReason()">Submit</button>
                    </div>
                    <div class="action-reason" id="suspendReason" style="display: none;">
                        <textarea placeholder="Enter reason for suspension..." class="reason-input"></textarea>
                        <button class="submit-reason" onclick="submitSuspendReason()">Submit</button>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

// Function to periodically check for updates
function startPeriodicUpdates() {
    // Initial update
    updateDashboardStats();
    
    // Set up periodic updates every 30 seconds
    setInterval(updateDashboardStats, 30000);
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    startPeriodicUpdates();
    
    // Add event listeners for tab switching
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            switchTab(targetId);
        });
    });
});

// Function to update coupon inventory users
async function updateCouponInventoryUsers() {
    const users = await fetchUsers();
    const assignedUsersTable = document.getElementById('assignedUsersTable');
    
    if (users.length === 0) {
        assignedUsersTable.innerHTML = `
            <tr>
                <td colspan="4" class="no-data">No users found</td>
            </tr>
        `;
        return;
    }

    assignedUsersTable.innerHTML = users.map(user => `
        <tr>
            <td>${user.email}</td>
            <td>1</td>
            <td>${user.raw_user_meta_data?.country || 'Not specified'}</td>
            <td>Active</td>
        </tr>
    `).join('');
}

// Function to update rewards section users
async function updateRewardsUsers() {
    const users = await fetchUsers();
    const rewardsContainer = document.querySelector('.rewards-container');
    
    if (users.length === 0) {
        rewardsContainer.innerHTML = `
            <div class="no-data-container">
                <div class="no-data-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h4>No Users Found</h4>
                <p>There are currently no users in the system.</p>
            </div>
        `;
        return;
    }

    rewardsContainer.innerHTML = users.map(user => `
        <div class="user-reward-status">
            <div class="user-level">
                <div class="level-circle">
                    <span class="level-number">1</span>
                    <span class="level-label">Level</span>
                </div>
                <div class="level-info">
                    <h4>
                        ${user.email}
                        <span class="status-blip active"></span>
                    </h4>
                    <div class="xp-bar">
                        <div class="xp-progress" style="width: 0%"></div>
                    </div>
                    <span class="xp-text">0/100 XP</span>
                </div>
            </div>
        </div>

        <div class="milestones-dropdown">
            <div class="dropdown-header">
                <h4>Milestones</h4>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="dropdown-content">
                <div class="milestone-card">
                    <div class="milestone-icon">
                        <i class="fas fa-compass"></i>
                    </div>
                    <div class="milestone-content">
                        <h5>Explore Virtual Floor</h5>
                        <p>Take your first steps in the virtual space</p>
                        <div class="milestone-reward">
                            <i class="fas fa-star"></i>
                            <span>100 XP</span>
                        </div>
                    </div>
                    <div class="milestone-status">
                        <span class="status-badge pending">Pending</span>
                    </div>
                </div>

                <div class="milestone-card locked">
                    <div class="milestone-icon">
                        <i class="fas fa-video"></i>
                    </div>
                    <div class="milestone-content">
                        <h5>Place Your First Video</h5>
                        <p>Upload and place your first video in the virtual space</p>
                        <div class="milestone-reward">
                            <i class="fas fa-star"></i>
                            <span>200 XP</span>
                        </div>
                    </div>
                    <div class="milestone-status">
                        <span class="status-badge locked">Locked</span>
                    </div>
                </div>

                <div class="milestone-card locked">
                    <div class="milestone-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="milestone-content">
                        <h5>AI Image Creator</h5>
                        <p>Generate your first image using Leonardo AI</p>
                        <div class="milestone-reward">
                            <i class="fas fa-star"></i>
                            <span>300 XP</span>
                        </div>
                    </div>
                    <div class="milestone-status">
                        <span class="status-badge locked">Locked</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Re-add dropdown functionality
    const dropdownHeaders = document.querySelectorAll('.dropdown-header');
    dropdownHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            content.classList.toggle('active');
        });
    });
}

// Update users when dashboard is loaded
document.addEventListener('DOMContentLoaded', function() {
    const dashboardLink = document.querySelector('a[href="#dashboard"]');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', updateDashboardStats);
    }

    const couponsLink = document.querySelector('a[href="#coupons"]');
    if (couponsLink) {
        couponsLink.addEventListener('click', updateCouponInventoryUsers);
    }

    const rewardsLink = document.querySelector('a[href="#rewards"]');
    if (rewardsLink) {
        rewardsLink.addEventListener('click', updateRewardsUsers);
    }

    // Initial load if on dashboard
    if (window.location.hash === '#dashboard' || !window.location.hash) {
        updateDashboardStats();
    }
});

// Function to switch between tabs
function switchTab(tabId) {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(tabId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update active state in sidebar
    document.querySelectorAll('.sidebar nav ul li').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.sidebar nav ul li a[href="#${tabId}"]`);
    if (activeLink) {
        activeLink.parentElement.classList.add('active');
    }
}

// Add click event listeners for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation clicks
    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('href').substring(1);
            switchTab(tabId);
        });
    });

    // Show dashboard by default
    switchTab('dashboard');
}); 