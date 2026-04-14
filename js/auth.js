const Auth = {
    KEY: 'srmAuth',
    ADMIN_KEY: 'srmAdminAuth',
    API_BASE: 'http://localhost:5000',

    useBackend() {
        return typeof window !== 'undefined' && window.SRM_USE_BACKEND === true;
    },

    getUsers() {
        return JSON.parse(localStorage.getItem(this.KEY + '_users')) || {};
    },

    saveUsers(users) {
        localStorage.setItem(this.KEY + '_users', JSON.stringify(users));
    },

    formatError(value, fallback) {
        if (value === null || value === undefined) return fallback;
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) {
            return value.map(function(item) {
                if (typeof item === 'string') return item;
                if (item && typeof item === 'object' && item.msg) return item.msg;
                try {
                    return JSON.stringify(item);
                } catch (err) {
                    return String(item);
                }
            }).join('; ');
        }
        if (typeof value === 'object') {
            if (value.msg) return value.msg;
            try {
                return JSON.stringify(value);
            } catch (err) {
                return String(value);
            }
        }
        return String(value);
    },

    async requestJson(path, options, fallbackError) {
        try {
            const requestOptions = options || {};
            const mergedHeaders = {
                'Content-Type': 'application/json',
                ...(requestOptions.headers || {})
            };

            const response = await fetch(this.API_BASE + path, {
                ...requestOptions,
                headers: mergedHeaders
            });

            const raw = await response.text();
            let data = {};

            if (raw) {
                try {
                    data = JSON.parse(raw);
                } catch (err) {
                    data = { message: raw };
                }
            }

            if (!response.ok) {
                const message = this.formatError(
                    data.error || data.detail || data.message,
                    (response.status + ' ' + response.statusText) || fallbackError
                );
                throw new Error(message || fallbackError);
            }

            return data;
        } catch (err) {
            if (err instanceof TypeError && /fetch/i.test(err.message)) {
                throw new Error('Unable to reach the API server at ' + this.API_BASE + '. Start the FastAPI backend first.');
            }
            throw err;
        }
    },

    getCurrentUser() {
        const email = localStorage.getItem(this.KEY + '_current');
        if (!email) return null;
        if (email.trim && email.trim().charAt(0) === '{') {
            try {
                return JSON.parse(email).user || null;
            } catch (err) {
                return null;
            }
        }
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

        if (this.useBackend()) {
            return this.requestJson('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: name, email: email, password: password })
            }, 'Registration failed')
                .then((data) => {
                    localStorage.setItem(this.KEY + '_current', JSON.stringify({ user: data.user, token: data.token }));
                    localStorage.setItem(this.KEY + '_token', data.token);
                    return { success: true, user: data.user };
                })
                .catch((err) => ({ success: false, error: err.message || 'Registration failed' }));
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

    registerAdmin(name, email, password) {
        if (!name || !email || !password) {
            return { success: false, error: 'All fields are required' };
        }
        if (password.length < 4) {
            return { success: false, error: 'Password must be at least 4 characters' };
        }

        if (!this.useBackend()) {
            return { success: false, error: 'Admin auth is available only in backend mode' };
        }

        return this.requestJson('/api/auth/admin/register', {
            method: 'POST',
            body: JSON.stringify({ username: name, email: email, password: password })
        }, 'Admin registration failed')
            .then((data) => {
                localStorage.setItem(this.ADMIN_KEY + '_current', JSON.stringify({ user: data.user, token: data.token }));
                localStorage.setItem(this.ADMIN_KEY + '_token', data.token);
                return { success: true, user: data.user };
            })
            .catch((err) => ({ success: false, error: err.message || 'Admin registration failed' }));
    },

    login(email, password) {
        if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        if (this.useBackend()) {
            return this.requestJson('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username: email, password: password })
            }, 'Login failed')
                .then((data) => {
                    localStorage.setItem(this.KEY + '_current', JSON.stringify({ user: data.user, token: data.token }));
                    localStorage.setItem(this.KEY + '_token', data.token);
                    return { success: true, user: data.user };
                })
                .catch((err) => ({ success: false, error: err.message || 'Login failed' }));
        }

        const users = this.getUsers();
        const user = users[email];
        if (!user || user.password !== password) {
            return { success: false, error: 'Invalid email or password' };
        }
        localStorage.setItem(this.KEY + '_current', email);
        return { success: true };
    },

    loginAdmin(email, password) {
        if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        if (!this.useBackend()) {
            return { success: false, error: 'Admin auth is available only in backend mode' };
        }

        return this.requestJson('/api/auth/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username: email, password: password })
        }, 'Admin login failed')
            .then((data) => {
                localStorage.setItem(this.ADMIN_KEY + '_current', JSON.stringify({ user: data.user, token: data.token }));
                localStorage.setItem(this.ADMIN_KEY + '_token', data.token);
                return { success: true, user: data.user };
            })
            .catch((err) => ({ success: false, error: err.message || 'Admin login failed' }));
    },

    getAdminToken() {
        return localStorage.getItem(this.ADMIN_KEY + '_token') || '';
    },

    getAdminUser() {
        const raw = localStorage.getItem(this.ADMIN_KEY + '_current');
        if (!raw) return null;
        try {
            return JSON.parse(raw).user || null;
        } catch (err) {
            return null;
        }
    },

    isAdminLoggedIn() {
        const user = this.getAdminUser();
        return !!(user && user.isAdmin === true);
    },

    logoutAdmin() {
        localStorage.removeItem(this.ADMIN_KEY + '_current');
        localStorage.removeItem(this.ADMIN_KEY + '_token');
    },

    logout() {
        localStorage.removeItem(this.KEY + '_current');
        localStorage.removeItem(this.KEY + '_token');
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = window.location.pathname.includes('/screens/') ? '../index.html' : 'index.html';
            return false;
        }
        return true;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
