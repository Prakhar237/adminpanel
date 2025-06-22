// Import Supabase client
const { createClient } = supabase;

// Initialize Supabase client
const supabaseClient = createClient(
    'https://hlxmcnykwjdbpxxyosoc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseG1jbnlrd2pkYnB4eHlvc29jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg4MDgyNSwiZXhwIjoyMDY0NDU2ODI1fQ.RGe-KTVUK2F71Uv9EpIl2Nmlj_mJEEmxHN091Fs0a-c'
);

// Check if we're on the login page
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted, redirecting to dashboard...');
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

    if (dropdownHeader && dropdownContent) {
        dropdownHeader.addEventListener('click', function() {
            this.classList.toggle('active');
            dropdownContent.classList.toggle('active');
        });
    }
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
    
    if (blockReason) blockReason.style.display = 'block';
    if (suspendReason) suspendReason.style.display = 'none';
}

// Show suspend reason input
function showSuspendReason() {
    const blockReason = document.getElementById('blockReason');
    const suspendReason = document.getElementById('suspendReason');
    
    if (suspendReason) suspendReason.style.display = 'block';
    if (blockReason) blockReason.style.display = 'none';
}

// Handle block reason submission
function submitBlockReason() {
    const reasonInput = document.querySelector('#blockReason .reason-input');
    if (reasonInput && reasonInput.value.trim()) {
        console.log('Block reason:', reasonInput.value);
        alert('User has been blocked');
        document.getElementById('blockReason').style.display = 'none';
    } else {
        alert('Please enter a reason for blocking');
    }
}

// Handle suspend reason submission
function submitSuspendReason() {
    const reasonInput = document.querySelector('#suspendReason .reason-input');
    if (reasonInput && reasonInput.value.trim()) {
        console.log('Suspend reason:', reasonInput.value);
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

// YouTube URL Functions
async function fetchYouTubeUrls() {
    try {
        console.log('Fetching YouTube URLs...');
        console.log('Making request to:', '/api/youtube-urls');
        
        const response = await fetch('/api/youtube-urls');
        
        console.log('Response received:', response);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check content type
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Response is not JSON:', contentType);
            const text = await response.text();
            console.error('Response text:', text.substring(0, 200) + '...');
            throw new Error('Response is not JSON');
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
    
    if (!container) {
        console.error('URL approval container not found');
        return;
    }
    
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
            const userEmail = url.user_email || url.user_id || 'Unknown User';
            
            return `
                <div class="user-approval-card" data-url-id="${url.id || 'unknown'}">
                    <div class="user-header">
                        <div class="user-info">
                            <h4><span class="status-icon"></span>${userEmail}</h4>
                            <div class="user-details">
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

async function handleUrlApproval(urlId, status) {
    try {
        console.log(`Updating URL ${urlId} status to ${status}`);
        
        const response = await fetch(`/api/youtube-urls?id=${urlId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('URL status updated:', result);
        
        // Refresh the YouTube URLs list
        fetchYouTubeUrls();
    } catch (error) {
        console.error('Error updating URL status:', error);
        alert('Failed to update URL status. Please try again.');
    }
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
    if (!container) return;
    
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
    const container = document.getElementById(`${type}Coupons`);
    if (!container) return;
    
    const warningDiv = document.createElement('div');
    warningDiv.className = 'warning-message';
    warningDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>More coupons can only be generated once previous ones are redeemed</span>
        <button class="close-warning" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    const parentContainer = container.parentElement;
    parentContainer.insertBefore(warningDiv, parentContainer.firstChild);
}

function updateGenerateButton(type) {
    const container = document.getElementById(`${type}Coupons`);
    if (!container) return;
    
    const button = container.parentElement.querySelector('.generate-btn');
    if (button && generationLimits[type] >= 2) {
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
    navigator.clipboard.writeText(text).then(function() {
        console.log('Copied to clipboard:', text);
        // You could add a toast notification here
    }).catch(function(err) {
        console.error('Failed to copy text: ', err);
    });
}

// Tab switching function
function switchTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = document.querySelector(`[onclick="switchTab('${tabId}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
} 