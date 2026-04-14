const Storage = {
    KEY: 'srmEscape',

    load() {
        const raw = JSON.parse(localStorage.getItem(this.KEY)) || {};
        return {
            completed: raw.completed || [],
            scores: raw.scores || {},
            totalScore: raw.totalScore || 0
        };
    },

    save(data) {
        localStorage.setItem(this.KEY, JSON.stringify(data));
    },

    complete(buildingId, score) {
        const data = this.load();
        if (!data.completed.includes(buildingId)) {
            data.completed.push(buildingId);
        }
        const prev = data.scores[buildingId] || { best: 0, last: 0, attempts: 0 };
        data.scores[buildingId] = {
            best: Math.max(prev.best, score),
            last: score,
            attempts: prev.attempts + 1
        };
        data.totalScore = Object.values(data.scores).reduce((sum, s) => sum + s.best, 0);
        this.save(data);
        return data;
    },

    isUnlocked(buildingId, buildingOrder) {
        const idx = buildingOrder.indexOf(buildingId);
        if (idx === 0) return true;
        return this.load().completed.includes(buildingOrder[idx - 1]);
    },

    reset() {
        localStorage.removeItem(this.KEY);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
