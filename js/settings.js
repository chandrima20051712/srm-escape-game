const Settings = {
    KEY: 'srmEscapeSettings',

    defaults() {
        return {
            sound: true,
            hints: true,
            reduceMotion: false,
            autoAdvance: true,
            compactMode: false
        };
    },

    load() {
        let raw = {};
        try {
            raw = JSON.parse(localStorage.getItem(this.KEY)) || {};
        } catch (err) {
            raw = {};
        }
        return Object.assign({}, this.defaults(), raw);
    },

    save(data) {
        localStorage.setItem(this.KEY, JSON.stringify(Object.assign({}, this.defaults(), data)));
    },

    set(key, value) {
        const current = this.load();
        current[key] = value;
        this.save(current);
        return current;
    },

    reset() {
        localStorage.removeItem(this.KEY);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Settings;
}
