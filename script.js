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