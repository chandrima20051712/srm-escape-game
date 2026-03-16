const BUILDING_ORDER = ['crc', 'ub', 'tp', 'tp2', 'career'];

const BUILDINGS = [
    { id: 'crc', name: 'CRC Building', emoji: '\u{1F3DB}\uFE0F', theme: 'Agile Basics' },
    { id: 'ub',  name: 'UB Building',  emoji: '\u{1F3E2}', theme: 'Scrum & Sprints' },
    { id: 'tp',  name: 'TP Building',  emoji: '\u{1F52C}', theme: 'DevOps & CI/CD' },
    { id: 'tp2', name: 'TP2 Building', emoji: '\u{1F3D7}\uFE0F', theme: 'Testing & QA' },
    { id: 'career', name: 'Career Centre', emoji: '\u{1F393}', theme: 'Leadership & Soft Skills' }
];

function createBuildings() {
    const campus = document.getElementById('campus');
    const progress = Storage.load();
    campus.innerHTML = '';

    BUILDINGS.forEach((b, i) => {
        const unlocked = Storage.isUnlocked(b.id, BUILDING_ORDER);
        const completed = progress.completed.includes(b.id);
        const scoreData = progress.scores[b.id];

        const div = document.createElement('div');
        div.className = 'building';
        if (completed) {
            div.className += ' completed';
        } else if (unlocked) {
            div.className += ' unlocked';
        } else {
            div.className += ' locked';
        }

        let statusText;
        if (completed) {
            statusText = '\u2705 COMPLETED!';
        } else if (unlocked) {
            statusText = '\u{1F3AE} READY TO PLAY!';
        } else {
            const prevName = BUILDINGS[i - 1].name.toUpperCase();
            statusText = `\u{1F512} Complete ${prevName} first`;
        }

        let scoreBadge = '';
        if (scoreData) {
            const stars = scoreData.best >= 800 ? '\u2B50\u2B50\u2B50' : scoreData.best >= 500 ? '\u2B50\u2B50' : '\u2B50';
            scoreBadge = `<div class="score-badge">${stars} Best: ${scoreData.best} pts</div>`;
        }

        div.innerHTML = `
            <div class="emoji">${b.emoji}</div>
            <div class="name">${b.name}</div>
            <div class="theme">${b.theme}</div>
            <div class="status">${statusText}</div>
            ${scoreBadge}
            <button class="play-btn" ${!unlocked ? 'disabled' : ''} onclick="play('${b.id}')">
                ${completed ? '\u{1F504} REPLAY' : '\u{1F680} PLAY NOW'}
            </button>
        `;

        campus.appendChild(div);
    });

    updateProgress(progress);
}

function updateProgress(progress) {
    const done = progress.completed.length;
    document.getElementById('progressFill').style.width = (done / 5) * 100 + '%';
    document.getElementById('progressText').textContent = `${done}/5 BUILDINGS`;
}

function play(id) {
    window.location.href = 'quiz.html?building=' + id;
}

window.onload = createBuildings;
