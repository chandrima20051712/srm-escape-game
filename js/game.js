// SRM Escape Game - Sprint 1 Campus Map
// Day 1: Building cards + basic interactions

class SRMEscapeGame {
    constructor() {
        this.buildings = [
            { id: 'crc', name: 'CRC Building', icon: '🏛️', status: 'Ready to Play' },
            { id: 'ub', name: 'UB Building', icon: '🏢', status: 'Complete CRC first' },
            { id: 'tp', name: 'TP Building', icon: '🔬', status: 'Complete UB first' },
            { id: 'tp2', name: 'TP2 Building', icon: '🏗️', status: 'Complete TP first' },
            { id: 'career', name: 'Career Centre', icon: '🎓', status: 'Complete TP2 first' }
        ];
        this.progress = this.loadProgress();
        this.init();
    }

    init() {
        this.renderCampusMap();
        this.updateProgressBar();
        this.bindEvents();
    }

    loadProgress() {
        return JSON.parse(localStorage.getItem('srmProgress')) || { 
            completed: [], 
            currentBuilding: 'crc' 
        };
    }

    saveProgress() {
        localStorage.setItem('srmProgress', JSON.stringify(this.progress));
    }

    renderCampusMap() {
        const mapContainer = document.getElementById('campusMap');
        mapContainer.innerHTML = '';

        this.buildings.forEach((building, index) => {
            const isUnlocked = index === 0 || this.progress.completed.includes(this.buildings[index-1].id);
            const isCompleted = this.progress.completed.includes(building.id);
            
            const card = document.createElement('div');
            card.className = `building-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.dataset.building = building.id;
            card.innerHTML = `
                <div class="building-icon">${building.icon}</div>
                <h2 class="building-title">${building.name}</h2>
                <div class="building-status">${isCompleted ? '✅ Completed!' : building.status}</div>
                <button class="play-btn">${isCompleted ? 'Replay' : 'Play'}</button>
                ${!isUnlocked ? `<div class="tooltip">${building.status}</div>` : ''}
            `;
            
            mapContainer.appendChild(card);
        });
    }

    updateProgressBar() {
        const completedCount = this.progress.completed.length;
        const progressPercent = (completedCount / 5) * 100;
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
        document.getElementById('progressText').textContent = `${completedCount}/5 Buildings`;
    }

    bindEvents() {
        document.getElementById('campusMap').addEventListener('click', (e) => {
            if (e.target.classList.contains('play-btn')) {
                const buildingId = e.target.closest('.building-card').dataset.building;
                if (this.isBuildingUnlocked(buildingId)) {
                    this.playBuilding(buildingId);
                }
            }
        });
    }

    isBuildingUnlocked(buildingId) {
        const index = this.buildings.findIndex(b => b.id === buildingId);
        return index === 0 || this.progress.completed.includes(this.buildings[index-1].id);
    }

    playBuilding(buildingId) {
        // Stub: Navigate to level select (replace with real navigation)
        alert(`Loading ${this.buildings.find(b => b.id === buildingId).name}...\n\nSprint 1 Demo: Campus Map Complete! 🎉`);
        
        // Simulate completion for demo (remove in Sprint 2)
        if (buildingId === 'crc') {
            this.progress.completed.push('crc');
            this.saveProgress();
            this.renderCampusMap();
            this.updateProgressBar();
            alert('CRC Completed! UB now unlocked. Refresh page to test persistence!');
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SRMEscapeGame();
});
