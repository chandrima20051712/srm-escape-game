const SRMApi = {
    baseUrl: 'http://localhost:5000',

    formatError(value, fallback) {
        if (value === null || value === undefined) return fallback;
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) {
            return value.map((item) => {
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

    enabled() {
        return typeof window !== 'undefined' && window.SRM_USE_BACKEND === true;
    },

    async request(path, options) {
        try {
            const requestOptions = options || {};
            const mergedHeaders = {
                'Content-Type': 'application/json',
                ...(requestOptions.headers || {})
            };

            const response = await fetch(this.baseUrl + path, {
                ...requestOptions,
                headers: mergedHeaders
            });

            const raw = await response.text();
            let payload = {};
            if (raw) {
                try {
                    payload = JSON.parse(raw);
                } catch (err) {
                    payload = { message: raw };
                }
            }

            if (!response.ok) {
                const message = this.formatError(
                    payload && (payload.error || payload.detail || payload.message),
                    'Request failed'
                );
                throw new Error(message);
            }

            return payload;
        } catch (err) {
            if (err instanceof TypeError && /fetch/i.test(err.message)) {
                throw new Error('Unable to reach the API server at ' + this.baseUrl + '. Start the backend first.');
            }
            throw err;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SRMApi;
}