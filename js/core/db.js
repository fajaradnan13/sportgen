/**
 * Database Module v4 — SportsGenV4
 * IndexedDB: logos, settings, backgrounds, leagues, assets, presets, history
 */

const DB_NAME = 'SportsGenV4DB';
const DB_VERSION = 1;

export const DB = {
    db: null,

    init() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                ['logos', 'settings', 'backgrounds', 'leagues', 'assets', 'presets', 'history']
                    .forEach(store => {
                        if (!db.objectStoreNames.contains(store)) {
                            const cfg = store === 'history'
                                ? { keyPath: 'id', autoIncrement: true }
                                : store === 'assets' ? { keyPath: 'key' }
                                    : { keyPath: store === 'logos' ? 'name' : store === 'settings' ? 'key' : store === 'backgrounds' ? 'id' : 'name' };
                            db.createObjectStore(store, cfg);
                        }
                    });
            };
            req.onsuccess = (e) => { this.db = e.target.result; resolve(); };
            req.onerror = (e) => reject(e.target.error);
        });
    },

    async _put(store, data) {
        if (!this.db) await this.init();
        return new Promise((res, rej) => {
            const tx = this.db.transaction([store], 'readwrite');
            const req = tx.objectStore(store).put(data);
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });
    },

    async _get(store, key) {
        if (!this.db) await this.init();
        return new Promise((res, rej) => {
            const tx = this.db.transaction([store], 'readonly');
            const req = tx.objectStore(store).get(key);
            req.onsuccess = () => res(req.result || null);
            req.onerror = () => rej(req.error);
        });
    },

    async _getAll(store) {
        if (!this.db) await this.init();
        return new Promise((res, rej) => {
            const tx = this.db.transaction([store], 'readonly');
            const req = tx.objectStore(store).getAll();
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });
    },

    async _delete(store, key) {
        if (!this.db) await this.init();
        return new Promise((res, rej) => {
            const tx = this.db.transaction([store], 'readwrite');
            const req = tx.objectStore(store).delete(key);
            req.onsuccess = () => res();
            req.onerror = () => rej(req.error);
        });
    },

    // --- LOGOS ---
    async saveLogo(name, base64) { return this._put('logos', { name, image: base64 }); },
    async getAllLogos() {
        const items = await this._getAll('logos');
        return Object.fromEntries(items.map(i => [i.name, i.image]));
    },

    // --- SETTINGS ---
    async saveSetting(key, value) { return this._put('settings', { key, value }); },
    async getSetting(key) { const r = await this._get('settings', key); return r?.value ?? null; },

    // --- BACKGROUNDS ---
    async saveBackground(id, base64) { return this._put('backgrounds', { id, image: base64 }); },
    async getAllBackgrounds() {
        const items = await this._getAll('backgrounds');
        return Object.fromEntries(items.map(i => [i.id, i.image]));
    },

    // --- LEAGUE PROFILES ---
    async saveLeagueProfile(name, data) { return this._put('leagues', { name, ...data }); },
    async getLeagueProfile(name) { return this._get('leagues', name); },
    async getAllLeagueProfiles() { return this._getAll('leagues'); },

    // --- ASSETS (sport-aware) key = `${sport}_${type}_${name}` ---
    async saveAsset(sport, type, name, base64) {
        return this._put('assets', { key: `${sport}_${type}_${name}`, sport, type, name, image: base64 });
    },
    async getAsset(sport, type, name) {
        const r = await this._get('assets', `${sport}_${type}_${name}`);
        return r?.image ?? null;
    },
    async getAssetsByType(sport, type) {
        const all = await this._getAll('assets');
        return all.filter(a => a.sport === sport && a.type === type)
            .reduce((acc, a) => { acc[a.name] = a.image; return acc; }, {});
    },
    async deleteAsset(sport, type, name) { return this._delete('assets', `${sport}_${type}_${name}`); },

    // --- PRESETS ---
    async savePreset(name, config) { return this._put('presets', { name, ...config, updatedAt: Date.now() }); },
    async getAllPresets() { return this._getAll('presets'); },
    async deletePreset(name) { return this._delete('presets', name); },

    // --- HISTORY (last 10) ---
    async saveHistory(snapshot) {
        snapshot.createdAt = Date.now();
        await this._put('history', snapshot);
        const all = await this._getAll('history');
        if (all.length > 10) {
            const sorted = all.sort((a, b) => a.createdAt - b.createdAt);
            for (const item of sorted.slice(0, sorted.length - 10))
                await this._delete('history', item.id);
        }
    },
    async getAllHistory() {
        const items = await this._getAll('history');
        return items.sort((a, b) => b.createdAt - a.createdAt);
    }
};
