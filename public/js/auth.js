document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        const loginMessage = document.getElementById('loginMessage');

        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Store the token in localStorage
                    localStorage.setItem('studyhub_token', data.token);
                    localStorage.setItem('studyhub_user', JSON.stringify(data.user));
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    showMessage(loginMessage, data.message, 'danger');
                }
            } catch (error) {
                showMessage(loginMessage, 'An error occurred. Please try again.', 'danger');
                console.error('Login error:', error);
            }
        });
    }
    
    // Check if we're on the signup page
    if (document.getElementById('signupForm')) {
        const signupForm = document.getElementById('signupForm');
        const signupMessage = document.getElementById('signupMessage');
        
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('signupUsername').value;
            const email = document.getElementById('signupEmail').value;
            const grade = document.getElementById('signupGrade').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showMessage(signupMessage, 'Passwords do not match', 'danger');
                return;
            }
            
            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, grade_level: grade, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showMessage(signupMessage, 'Account created successfully! Redirecting to login...', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showMessage(signupMessage, data.message, 'danger');
                }
            } catch (error) {
                showMessage(signupMessage, 'An error occurred. Please try again.', 'danger');
                console.error('Signup error:', error);
            }
        });
    }
    
    // Check if we're on a page with logout button
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('studyhub_token');
            localStorage.removeItem('studyhub_user');
            window.location.href = 'index.html';
        });
    }
    
    // Display username if logged in
    if (document.getElementById('usernameDisplay')) {
        const user = JSON.parse(localStorage.getItem('studyhub_user'));
        if (user) {
            document.getElementById('usernameDisplay').textContent = user.username;
        } else {
            // If not logged in, redirect to login page
            window.location.href = 'login.html';
        }
    }
    
    function showMessage(element, message, type) {
        element.textContent = message;
        element.classList.remove('d-none', 'alert-success', 'alert-danger');
        element.classList.add(`alert-${type}`, 'alert');
    }
});