document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('studyhub_user'));
    const token = localStorage.getItem('studyhub_token');
    
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display username
    document.getElementById('usernameDisplay').textContent = user.username;
    
    // Get guide ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const guideId = urlParams.get('id');
    
    if (!guideId) {
        window.location.href = 'subjects.html';
        return;
    }
    
    // Fetch guide data
    fetchGuideData(guideId);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('studyhub_token');
        localStorage.removeItem('studyhub_user');
        window.location.href = 'index.html';
    });
    
    // Mark as complete button
    document.getElementById('markAsCompleteBtn').addEventListener('click', function() {
        updateProgress(guideId, 100);
    });
    
    // Save notes button
    document.getElementById('saveNotesBtn').addEventListener('click', function() {
        const notes = document.getElementById('userNotes').value;
        saveNotes(guideId, notes);
    });
    
    async function fetchGuideData(guideId) {
        try {
            const response = await fetch(`/api/study/guide/${guideId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Display guide info
                document.getElementById('guideTitle').textContent = data.guide.title;
                document.getElementById('guideTitleBreadcrumb').textContent = data.guide.title;
                document.getElementById('subjectBreadcrumb').textContent = data.guide.subject_name;
                document.getElementById('guideDifficulty').textContent = data.guide.difficulty_level;
                document.getElementById('guideContent').innerHTML = data.guide.content;
                
                // Update progress
                document.getElementById('guideProgressBar').style.width = `${data.user_progress.completion_percentage}%`;
                document.getElementById('guideProgressBar').textContent = `${data.user_progress.completion_percentage}%`;
                document.getElementById('userNotes').value = data.user_progress.notes || '';
                
                // Load related guides
                const relatedContainer = document.getElementById('relatedGuides');
                relatedContainer.innerHTML = '';
                
                if (data.related_guides.length > 0) {
                    data.related_guides.forEach(guide => {
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
                        relatedContainer.appendChild(guideItem);
                    });
                } else {
                    relatedContainer.innerHTML = '<div class="list-group-item">No related guides found</div>';
                }
                
                // Update last accessed time
                updateLastAccessed(guideId);
            } else {
                console.error('Failed to fetch guide data:', data.message);
                window.location.href = 'subjects.html';
            }
        } catch (error) {
            console.error('Guide error:', error);
        }
    }
    
    async function updateProgress(guideId, percentage) {
        try {
            const response = await fetch(`/api/user/progress/${guideId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completion_percentage: percentage })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update progress bar
                document.getElementById('guideProgressBar').style.width = `${percentage}%`;
                document.getElementById('guideProgressBar').textContent = `${percentage}%`;
                
                // Show success message
                alert('Progress updated successfully!');
            } else {
                console.error('Failed to update progress:', data.message);
            }
        } catch (error) {
            console.error('Progress update error:', error);
        }
    }
    
    async function saveNotes(guideId, notes) {
        try {
            const response = await fetch(`/api/user/notes/${guideId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ notes })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Show success message
                alert('Notes saved successfully!');
            } else {
                console.error('Failed to save notes:', data.message);
            }
        } catch (error) {
            console.error('Notes save error:', error);
        }
    }
    
    async function updateLastAccessed(guideId) {
        try {
            await fetch(`/api/user/progress/${guideId}/access`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Last accessed update error:', error);
        }
    }
});