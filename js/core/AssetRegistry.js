/**
 * AssetRegistry — SportsGenV4
 * Loads assets/manifest.json at startup and provides URL helpers.
 * Works on Cloudflare Pages (static, no server-side dir listing needed).
 *
 * Usage:
 *   import { AssetRegistry } from './AssetRegistry.js';
 *   await AssetRegistry.init();
 *   const logos = AssetRegistry.getLogos('football', 'liga1-indonesia');
 *   // => [{ name: 'persib', url: 'assets/football/logos/liga1-indonesia/persib.png' }, ...]
 */

export const AssetRegistry = {
    _manifest: null,
    _base: 'assets/',

    /** Load manifest once at app startup */
    async init() {
        if (this._manifest) return this._manifest;
        try {
            const res = await fetch('assets/manifest.json');
            if (!res.ok) throw new Error('manifest.json not found');
            this._manifest = await res.json();
            console.log('[AssetRegistry] Loaded manifest:', this._manifest);
        } catch (e) {
            console.warn('[AssetRegistry] Could not load manifest:', e.message);
            this._manifest = {};
        }
        return this._manifest;
    },

    /**
     * Get list of logo files for a sport + league.
     * @param {string} sport - 'football' | 'volleyball'
     * @param {string} league - e.g. 'liga1-indonesia'
     * @returns {{ name: string, url: string }[]}
     */
    getLogos(sport, league) {
        const section = this._manifest?.[sport]?.logos?.[league];
        if (!section) return [];
        return (section.files || []).map(f => ({
            name: f.replace(/\.[^.]+$/, ''),   // strip extension
            url: section.path + f,
            full: f,
        }));
    },

    /**
     * Get all league groups for a sport.
     * @param {string} sport - 'football' | 'volleyball'
     * @returns {{ key: string, label: string, path: string }[]}
     */
    getLeagues(sport) {
        const logos = this._manifest?.[sport]?.logos;
        if (!logos) return [];
        return Object.entries(logos).map(([key, v]) => ({
            key,
            label: v.label || key,
            path: v.path,
            count: (v.files || []).length,
        }));
    },

    /**
     * Get background images for a sport.
     * @param {string} sport - 'football' | 'volleyball'
     * @returns {{ name: string, url: string }[]}
     */
    getBackgrounds(sport) {
        const bg = this._manifest?.[sport]?.backgrounds;
        if (!bg) return [];
        return (bg.files || []).map(f => ({
            name: f.replace(/\.[^.]+$/, ''),
            url: bg.path + f,
            full: f,
        }));
    },

    /**
     * Get channel/watermark logos.
     * @returns {{ name: string, url: string }[]}
     */
    getChannelLogos() {
        const ch = this._manifest?.channel?.logos;
        if (!ch) return [];
        return (ch.files || []).map(f => ({
            name: f.replace(/\.[^.]+$/, ''),
            url: ch.path + f,
            full: f,
        }));
    },

    /**
     * Helper: find a club logo URL by name (fuzzy match within a league).
     * Returns the url string or null if not found.
     */
    findClubLogo(sport, league, clubName) {
        const logos = this.getLogos(sport, league);
        const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const target = norm(clubName);
        const match = logos.find(l => norm(l.name).includes(target) || target.includes(norm(l.name)));
        return match ? match.url : null;
    },

    /**
     * Get league badge URL by league display name.
     * Uses leagueBadgeMap in manifest.json [sport].league-badges.
     * @param {string} sport - 'football' | 'volleyball'
     * @param {string} leagueTitle - e.g. 'BRI SUPER LEAGUE'
     * @returns {string|null} URL or null if not found/empty
     */
    getLeagueBadge(sport, leagueTitle) {
        const badgeSection = this._manifest?.[sport]?.['league-badges'];
        if (!badgeSection) return null;
        const map = badgeSection.leagueBadgeMap || {};
        // Try exact match first, then case-insensitive
        const key = Object.keys(map).find(k =>
            k === leagueTitle || k.toLowerCase() === leagueTitle.toLowerCase()
        );
        if (!key || !map[key]) return null;
        return badgeSection.path + map[key];
    },

    /**
     * Update manifest in-memory when you add files (dev helper).
     * Call this after adding files: AssetRegistry.addFile('football', 'logos', 'liga1-indonesia', 'persib.png')
     */
    addFile(sport, section, league, filename) {
        if (!this._manifest[sport]) return;
        const node = league
            ? this._manifest[sport]?.[section]?.[league]
            : this._manifest[sport]?.[section];
        if (!node) return;
        if (!node.files) node.files = [];
        if (!node.files.includes(filename)) node.files.push(filename);
        console.log(`[AssetRegistry] Registered: ${sport}/${section}/${league || ''}/${filename}`);
    },
};
