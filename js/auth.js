const Auth = {
    KEY: 'srmAuth',

    getUsers() {
        return JSON.parse(localStorage.getItem(this.KEY + '_users')) || {};
    },

    saveUsers(users) {
        localStorage.setItem(this.KEY + '_users', JSON.stringify(users));
    },

    getCurrentUser() {
        const email = localStorage.getItem(this.KEY + '_current');
        if (!email) return null;
        const users = this.getUsers();
        return users[email] || null;
    },

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    register(name, email, password) {
        if (!name || !email || !password) {
            return { success: false, error: 'All fields are required' };
        }
        if (password.length < 4) {
            return { success: false, error: 'Password must be at least 4 characters' };
        }
        const users = this.getUsers();
        if (users[email]) {
            return { success: false, error: 'Email already registered' };
        }
        users[email] = {
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        this.saveUsers(users);
        localStorage.setItem(this.KEY + '_current', email);
        return { success: true };
    },

    login(email, password) {
        if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
        }
        const users = this.getUsers();
        const user = users[email];
        if (!user || user.password !== password) {
            return { success: false, error: 'Invalid email or password' };
        }
        localStorage.setItem(this.KEY + '_current', email);
        return { success: true };
    },

    logout() {
        localStorage.removeItem(this.KEY + '_current');
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = window.location.pathname.includes('/screens/') ? '../index.html' : 'index.html';
            return false;
        }
        return true;
    }
};
