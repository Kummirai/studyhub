document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the subjects page
    if (document.getElementById('subjectsContainer')) {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('studyhub_user'));
        const token = localStorage.getItem('studyhub_token');
        
        if (!user || !token) {
            window.location.href = 'login.html';
            return;
        }
        
        // Display username if on a page with the display
        if (document.getElementById('usernameDisplay')) {
            document.getElementById('usernameDisplay').textContent = user.username;
        }
        
        // Logout button
        if (document.getElementById('logoutBtn')) {
            document.getElementById('logoutBtn').addEventListener('click', function() {
                localStorage.removeItem('studyhub_token');
                localStorage.removeItem('studyhub_user');
                window.location.href = 'index.html';
            });
        }
        
        // Load subjects
        loadSubjects();
        
        // Grade filter buttons
        document.querySelectorAll('.grade-filter').forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('.grade-filter').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                loadSubjects(this.dataset.grade);
            });
        });
    }
    
    async function loadSubjects(grade = 'all') {
        const container = document.getElementById('subjectsContainer');
        container.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        
        try {
            const token = localStorage.getItem('studyhub_token');
            let url = '/api/study/subjects';
            if (grade !== 'all') {
                url += `?grade=${grade}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                container.innerHTML = '';
                
                if (data.length > 0) {
                    data.forEach(subject => {
                        const subjectCol = document.createElement('div');
                        subjectCol.className = 'col-md-6 col-lg-4 mb-4';
                        subjectCol.innerHTML = `
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="card-title">${subject.name}</h3>
                                    <p class="card-text">${subject.description || 'No description available.'}</p>
                                    <div class="badge bg-primary">Grade ${subject.grade_level}</div>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <a href="study-guide.html?subject=${subject.id}" class="btn btn-primary">View Guides</a>
                                </div>
                            </div>
                        `;
                        container.appendChild(subjectCol);
                    });
                } else {
                    container.innerHTML = '<div class="col-12 text-center"><p>No subjects found for the selected grade.</p></div>';
                }
            } else {
                console.error('Failed to load subjects:', data.message);
                container.innerHTML = '<div class="col-12 text-center"><p>Failed to load subjects. Please try again.</p></div>';
            }
        } catch (error) {
            console.error('Subjects load error:', error);
            container.innerHTML = '<div class="col-12 text-center"><p>An error occurred. Please try again.</p></div>';
        }
    }
});