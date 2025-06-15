// Check if we're on the login page
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Directly redirect to dashboard without checking credentials
        window.location.href = 'dashboard.html';
    });
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
        const response = await fetch('http://localhost:3000/api/videos');
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
        const response = await fetch(`http://localhost:3000/api/videos/${videoId}`, {
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
        const response = await fetch('http://localhost:3000/api/urls');
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
        const response = await fetch(`http://localhost:3000/api/urls/${urlId}`, {
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