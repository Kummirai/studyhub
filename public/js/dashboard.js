document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('studyhub_user'));
    const token = localStorage.getItem('studyhub_token');
    
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user info
    document.getElementById('usernameDisplay').textContent = user.username;
    document.getElementById('userGrade').textContent = `Grade ${user.grade_level}`;
    
    // Fetch dashboard data
    fetchDashboardData();
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('studyhub_token');
        localStorage.removeItem('studyhub_user');
        window.location.href = 'index.html';
    });
    
    async function fetchDashboardData() {
        try {
            const response = await fetch('/api/user/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update dashboard stats
                document.getElementById('guidesCompleted').textContent = data.guides_completed;
                document.getElementById('avgProgress').textContent = `${data.avg_progress}%`;
                
                // Update recent activity
                const activityContainer = document.getElementById('recentActivity');
                activityContainer.innerHTML = '';
                
                if (data.recent_activity.length > 0) {
                    data.recent_activity.forEach(activity => {
                        const activityItem = document.createElement('a');
                        activityItem.href = `study-guide.html?id=${activity.guide_id}`;
                        activityItem.className = 'list-group-item list-group-item-action';
                        activityItem.innerHTML = `
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">${activity.guide_title}</h6>
                                <small>${new Date(activity.last_accessed).toLocaleDateString()}</small>
                            </div>
                            <p class="mb-1">${activity.subject_name}</p>
                            <div class="progress" style="height: 5px;">
                                <div class="progress-bar" role="progressbar" style="width: ${activity.completion_percentage}%"></div>
                            </div>
                        `;
                        activityContainer.appendChild(activityItem);
                    });
                } else {
                    activityContainer.innerHTML = '<div class="list-group-item">No recent activity</div>';
                }
                
                // Update recommended guides
                const recommendedContainer = document.getElementById('recommendedGuides');
                recommendedContainer.innerHTML = '';
                
                if (data.recommended_guides.length > 0) {
                    data.recommended_guides.forEach(guide => {
                        const guideItem = document.createElement('a');
                        guideItem.href = `study-guide.html?id=${guide.id}`;
                        guideItem.className = 'list-group-item list-group-item-action';
                        guideItem.innerHTML = `
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">${guide.title}</h6>
                                <small class="badge bg-primary">${guide.difficulty_level}</small>
                            </div>
                            <p class="mb-1">${guide.subject_name}</p>
                        `;
                        recommendedContainer.appendChild(guideItem);
                    });
                } else {
                    recommendedContainer.innerHTML = '<div class="list-group-item">No recommendations available</div>';
                }
                
                // Create progress chart
                createProgressChart(data.progress_by_subject);
            } else {
                console.error('Failed to fetch dashboard data:', data.message);
            }
        } catch (error) {
            console.error('Dashboard error:', error);
        }
    }
    
    function createProgressChart(progressData) {
        const ctx = document.getElementById('progressChart').getContext('2d');
        
        const subjects = progressData.map(item => item.subject_name);
        const progress = progressData.map(item => item.avg_progress);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: [{
                    label: 'Average Progress (%)',
                    data: progress,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
});