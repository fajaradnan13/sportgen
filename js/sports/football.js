/**
 * Football Module — SportsGenV4
 * Full-featured: Standings, Schedule, Results
 * With: Magic Paste, Theme Selector, Asset Management
 */

import { DB } from '../core/db.js';
import { SmartParser } from '../utils/smartParser.js';
import { AssetRegistry } from '../core/AssetRegistry.js';

export const Football = {

    LEAGUES: [
        'BRI SUPER LEAGUE',
        'Liga 1 Indonesia',
        'Liga 2 Indonesia',
        'Premier League',
        'La Liga',
        'UEFA Champions League',
        'Bundesliga',
        'Serie A',
        'Ligue 1',
        'Eredivisie',
        'AFC Champions League',
        'ASEAN Championship',
        'Piala Presiden',
        'Piala Indonesia',
        'TIMNAS INDONESIA',
    ],

    THEMES: {
        'yellow': { name: '⭐ Yellow', header: 'bg-yellow-500 text-black', odd: 'bg-slate-800/90', even: 'bg-slate-700/90', accent: 'text-yellow-400' },
        'blue': { name: '🔵 Blue', header: 'bg-blue-600 text-white', odd: 'bg-slate-900/90', even: 'bg-slate-800/90', accent: 'text-blue-400' },
        'red': { name: '🔴 Red', header: 'bg-red-700 text-white', odd: 'bg-red-950/90', even: 'bg-red-900/90', accent: 'text-red-400' },
        'green': { name: '🟢 Green', header: 'bg-green-600 text-white', odd: 'bg-green-950/90', even: 'bg-green-900/90', accent: 'text-green-400' },
        'purple': { name: '🟣 Purple', header: 'bg-purple-700 text-white', odd: 'bg-purple-950/90', even: 'bg-purple-900/90', accent: 'text-purple-300' },
        'dark': { name: '⚫ Dark', header: 'bg-gray-900 text-white', odd: 'bg-black/80', even: 'bg-gray-900/80', accent: 'text-gray-400' },
        'orange': { name: '🟠 Orange', header: 'bg-orange-500 text-white', odd: 'bg-orange-950/90', even: 'bg-orange-900/90', accent: 'text-orange-400' },
        'teal': { name: '🩱 Teal', header: 'bg-teal-600 text-white', odd: 'bg-teal-950/90', even: 'bg-teal-900/90', accent: 'text-teal-400' },
        'pink': { name: '🌸 Pink', header: 'bg-pink-600 text-white', odd: 'bg-pink-950/90', even: 'bg-pink-900/90', accent: 'text-pink-400' },
        'indigo': { name: '🌠 Indigo', header: 'bg-indigo-600 text-white', odd: 'bg-indigo-950/90', even: 'bg-indigo-900/90', accent: 'text-indigo-400' },
        'emerald': { name: '💎 Emerald', header: 'bg-emerald-600 text-white', odd: 'bg-emerald-950/90', even: 'bg-emerald-900/90', accent: 'text-emerald-400' },
        'slate': { name: '📓 Slate', header: 'bg-slate-700 text-white', odd: 'bg-slate-900/90', even: 'bg-slate-800/90', accent: 'text-slate-300' },
    },

    CSS_THEMES: [
        {
            key: 'none',
            label: '🌙 Gelap',
            bg: 'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            text: '#fff',
            swatchBg: 'linear-gradient(135deg,#0f2027,#2c5364)'
        },
        {
            key: 'field',
            label: '⚽ Lapangan',
            // Alternating dark/light green stripes (stadium grass) + dark overlay
            bg: `repeating-linear-gradient(
                    0deg,
                    rgba(0,60,0,0.55) 0px, rgba(0,60,0,0.55) 120px,
                    rgba(0,90,10,0.55) 120px, rgba(0,90,10,0.55) 240px
                 ),
                 linear-gradient(170deg, #021a04 0%, #063d0c 50%, #021a04 100%)`,
            text: '#a3f7a3',
            swatchBg: 'linear-gradient(135deg,#021a04,#0d5c15)'
        },
        {
            key: 'stadium',
            label: '🏟 Stadion',
            // Night stadium: dark top → glowing green pitch bottom
            bg: `radial-gradient(ellipse 80% 40% at 50% 100%, rgba(16,180,50,0.35) 0%, transparent 70%),
                 radial-gradient(ellipse 60% 30% at 20% 80%, rgba(255,200,0,0.12) 0%, transparent 60%),
                 radial-gradient(ellipse 60% 30% at 80% 80%, rgba(255,200,0,0.12) 0%, transparent 60%),
                 linear-gradient(180deg, #050810 0%, #0a1420 55%, #0d2010 100%)`,
            text: '#fff',
            swatchBg: 'linear-gradient(135deg,#050810,#0d2010)'
        },
        {
            key: 'fire',
            label: '🔥 Api',
            bg: `radial-gradient(ellipse 70% 50% at 50% 110%, rgba(255,80,0,0.6) 0%, transparent 70%),
                 linear-gradient(170deg, #0d0000 0%, #2a0800 40%, #5e1100 70%, #1a0000 100%)`,
            text: '#ffb347',
            swatchBg: 'linear-gradient(135deg,#2a0800,#5e1100)'
        },
        {
            key: 'galaxy',
            label: '🌌 Galaxy',
            bg: `radial-gradient(ellipse 60% 40% at 30% 30%, rgba(120,0,255,0.35) 0%, transparent 60%),
                 radial-gradient(ellipse 50% 40% at 80% 70%, rgba(0,100,255,0.3) 0%, transparent 60%),
                 radial-gradient(ellipse 30% 25% at 60% 50%, rgba(200,0,200,0.2) 0%, transparent 50%),
                 linear-gradient(160deg, #04001a 0%, #0a0030 50%, #010020 100%)`,
            text: '#c4b5fd',
            swatchBg: 'linear-gradient(135deg,#04001a,#0a0030)'
        },
        {
            key: 'gold',
            label: '🏆 Gold',
            bg: `radial-gradient(ellipse 80% 30% at 50% -10%, rgba(255,215,0,0.25) 0%, transparent 60%),
                 linear-gradient(170deg, #0a0800 0%, #1a1200 40%, #100d00 100%)`,
            text: '#ffd700',
            swatchBg: 'linear-gradient(135deg,#1a1200,#0a0800)'
        },
        {
            key: 'aurora',
            label: '🌿 Aurora',
            bg: `radial-gradient(ellipse 70% 60% at 20% 30%, rgba(0,200,150,0.3) 0%, transparent 60%),
                 radial-gradient(ellipse 60% 50% at 80% 70%, rgba(0,120,255,0.25) 0%, transparent 60%),
                 radial-gradient(ellipse 50% 40% at 50% 50%, rgba(100,0,200,0.2) 0%, transparent 55%),
                 linear-gradient(160deg, #000d10 0%, #00131c 50%, #000810 100%)`,
            text: '#6ee7b7',
            swatchBg: 'linear-gradient(135deg,#000d10,#00131c)'
        },
        {
            key: 'broadcast',
            label: '📺 Siaran',
            bg: `linear-gradient(180deg, #001340 0%, #002280 30%, #003090 60%, #001340 100%)`,
            text: '#ffcb00',
            swatchBg: 'linear-gradient(135deg,#001340,#003090)'
        },
        {
            key: 'ocean',
            label: '🌊 Laut',
            bg: `radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,180,230,0.25) 0%, transparent 60%),
                 linear-gradient(170deg, #000c1a 0%, #001f3f 45%, #003355 100%)`,
            text: '#67e8f9',
            swatchBg: 'linear-gradient(135deg,#000c1a,#003355)'
        },
        {
            key: 'red',
            label: '🔴 Merah',
            bg: `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,0,50,0.35) 0%, transparent 65%),
                 linear-gradient(170deg, #0d0000 0%, #200010 40%, #2d0010 100%)`,
            text: '#fca5a5',
            swatchBg: 'linear-gradient(135deg,#200010,#2d0010)'
        },
        {
            key: 'batik',
            label: '🌺 Batik',
            bg: `radial-gradient(ellipse 60% 40% at 20% 20%, rgba(180,100,0,0.35) 0%, transparent 55%),
                 radial-gradient(ellipse 60% 40% at 80% 80%, rgba(120,0,80,0.35) 0%, transparent 55%),
                 linear-gradient(135deg, #0d0800 0%, #1a0d00 50%, #120008 100%)`,
            text: '#fbbf24',
            swatchBg: 'linear-gradient(135deg,#1a0d00,#120008)'
        },
        {
            key: 'sakura',
            label: '🌸 Sakura',
            bg: `radial-gradient(ellipse 80% 50% at 60% 0%, rgba(255,130,160,0.3) 0%, transparent 65%),
                 radial-gradient(ellipse 50% 40% at 10% 90%, rgba(200,80,130,0.2) 0%, transparent 60%),
                 linear-gradient(160deg, #0d0008 0%, #1a0012 50%, #0d0008 100%)`,
            text: '#fbcfe8',
            swatchBg: 'linear-gradient(135deg,#0d0008,#1a0012)'
        },
        {
            key: 'neon',
            label: '💚 Neon',
            bg: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,120,0.15) 0%, transparent 70%),
                 linear-gradient(160deg, #000a04 0%, #001a08 50%, #000a04 100%)`,
            text: '#4ade80',
            swatchBg: 'linear-gradient(135deg,#000a04,#001a08)'
        },
        {
            key: 'sunset',
            label: '🌇 Senja',
            bg: `linear-gradient(170deg, #0a0010 0%, #1a0530 25%, #3d0a0a 55%, #7c2020 80%, #c45c00 100%)`,
            text: '#fde68a',
            swatchBg: 'linear-gradient(135deg,#1a0530,#c45c00)'
        },
        {
            key: 'military',
            label: '🪖 Militer',
            bg: `repeating-linear-gradient(
                     45deg,
                     rgba(40,50,20,0.7) 0px, rgba(40,50,20,0.7) 30px,
                     rgba(55,65,28,0.7) 30px, rgba(55,65,28,0.7) 60px
                 ),
                 linear-gradient(160deg, #0a0d04 0%, #151c06 100%)`,
            text: '#bef264',
            swatchBg: 'linear-gradient(135deg,#0a0d04,#151c06)'
        },
        {
            key: 'maroon',
            label: '🍷 Maroon',
            bg: `radial-gradient(ellipse 70% 40% at 50% 0%, rgba(180,0,60,0.3) 0%, transparent 65%),
                 linear-gradient(170deg, #060004 0%, #190010 45%, #280018 100%)`,
            text: '#f9a8d4',
            swatchBg: 'linear-gradient(135deg,#190010,#280018)'
        },
        {
            key: 'sky',
            label: '☁️ Biru Langit',
            bg: `linear-gradient(170deg, #001030 0%, #002060 35%, #003a8c 65%, #001030 100%)`,
            text: '#bae6fd',
            swatchBg: 'linear-gradient(135deg,#001030,#003a8c)'
        },
    ],

    ROWS_PER_PAGE: 12,
    RESULTS_PER_PAGE: 2,

    data: {
        currentView: 'standings',
        title: 'BRI SUPER LEAGUE',
        season: '2024/2025',
        week: 'PEKAN 20',
        leagueLogo: '',
        theme: 'yellow',
        cardTheme: 'none',
        animation: 'anim-slide',
        animDuration: 0.6,
        animStagger: 0.1,
        animLoop: false,
        animLoopInterval: 5,
        bgImage: '',
        bgOpacity: 0.6,
        channelLogo: '',
        standingsPage: 0,
        resultsPage: 0,
        zoneTop: 4,
        zoneEuropa: 2,
        zoneBottom: 3,
        topScorers: [],
        standingsDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        standings: [
            { pos: 1, name: 'PERSIB', mp: 20, w: 15, d: 3, l: 2, gf: 45, ga: 15, gd: 30, pts: 48, logo: '' },
            { pos: 2, name: 'PERSIJA', mp: 20, w: 14, d: 4, l: 2, gf: 40, ga: 20, gd: 20, pts: 46, logo: '' },
            { pos: 3, name: 'PSM MAKASSAR', mp: 20, w: 12, d: 5, l: 3, gf: 35, ga: 15, gd: 20, pts: 41, logo: '' },
            { pos: 4, name: 'BORNEO FC', mp: 20, w: 10, d: 8, l: 2, gf: 30, ga: 15, gd: 15, pts: 38, logo: '' },
            { pos: 5, name: 'BALI UNITED', mp: 20, w: 10, d: 5, l: 5, gf: 28, ga: 20, gd: 8, pts: 35, logo: '' },
        ],
        schedule: [],
        results: [],
        savedBackgrounds: {},
        loopTimer: null,
    },

    // ============================================================
    async mount() {
        window.FootballModule = this;
        window.CurrentSportModule = this;

        await DB.init();
        await this._loadSavedBgs();

        this.renderControls();
        this.renderView();

        // Init AssetRegistry (loads manifest.json once)
        AssetRegistry.init().then(() => {
            console.log('[Football] AssetRegistry ready');
        });
        window.addEventListener('magic-paste', (e) => this.applyMagicPaste(e.detail.input));
    },

    // ============================================================
    // PAGE LOOP (auto-advance standings pages)
    // ============================================================
    startPageLoop() {
        this.stopPageLoop();
        if (!this.data.animLoop) return;
        this.data.loopTimer = setInterval(() => {
            if (this.data.currentView === 'standings') {
                const total = this.data.standings.length;
                const totalPages = Math.ceil(total / this.ROWS_PER_PAGE);
                if (totalPages > 1) {
                    this.data.standingsPage = (this.data.standingsPage + 1) % totalPages;
                }
            } else if (this.data.currentView === 'results') {
                const total = this.data.results.length;
                const totalPages = Math.ceil(total / this.RESULTS_PER_PAGE);
                if (totalPages > 1) {
                    this.data.resultsPage = (this.data.resultsPage + 1) % totalPages;
                }
            }
            this.renderView();
        }, (this.data.animLoopInterval || 5) * 1000);
    },

    stopPageLoop() {
        if (this.data.loopTimer) { clearInterval(this.data.loopTimer); this.data.loopTimer = null; }
    },

    // ============================================================
    // LOGO AUTO-ASSIGN
    // ============================================================
    /**
     * For each standing row, try to find a matching logo from AssetRegistry.
     * Searches all available leagues for the sport. Preserves manually set logos.
     */
    // Common team name aliases → logo file stem (without extension)
    LOGO_ALIASES: {
        'wolves': 'wolverhampton',
        'wolverhampton wanderers': 'wolverhampton',
        'man united': 'manchester united',
        'man utd': 'manchester united',
        'manchester utd': 'manchester united',
        'man city': 'manchester city',
        'spurs': 'tottenham',
        'tottenham hotspur': 'tottenham',
        'west ham': 'westham',
        'west ham united': 'westham',
        'brighton': 'brighton-hove-albion',
        'brighton & hove albion': 'brighton-hove-albion',
        'nottingham forest': 'nottingham-forest',
        'nott\'m forest': 'nottingham-forest',
        'newcastle united': 'newcastle',
        'crystal palace': 'crystal palace',
        'aston villa': 'aston villa',
        // Liga 1 aliases
        'bhayangkara': 'fc bhayangkara',
        'psbs': 'psbs biak',
        'psbs biak numfor': 'psbs biak',
        // New Champions/La Liga Aliases
        'bodo glimt': 'bodo glimt',
        'bodø/glimt': 'bodo glimt',
        'villarreal': 'villareal',
        'villa real': 'villareal',
        'alaves': 'alaves',
        'deportivo alaves': 'alaves',
        'd. alaves': 'alaves',
    },

    async _autoAssignLogos(standings) {
        await AssetRegistry.init();

        const allLogos = [];
        const leagues = AssetRegistry.getLeagues('football');
        for (const league of leagues) {
            allLogos.push(...AssetRegistry.getLogos('football', league.key));
        }
        if (!allLogos.length) { console.warn('[AutoLogo] No logos in AssetRegistry'); return; }

        const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '');

        for (const row of standings) {
            if (row.logo) continue;
            const rawName = row.name.toLowerCase().trim();
            const target = norm(row.name);

            // Tier 0: alias map (handles nicknames like "Wolves", "Man Utd")
            const aliasKey = Object.keys(this.LOGO_ALIASES).find(k => rawName === k);
            const aliasTarget = aliasKey ? norm(this.LOGO_ALIASES[aliasKey]) : null;
            const searchTarget = aliasTarget || target;

            // Tier 1: exact match
            let match = allLogos.find(l => norm(l.name) === searchTarget);

            // Tier 2: logo name is a prefix of team name
            if (!match) match = allLogos.find(l => searchTarget.startsWith(norm(l.name)));

            // Tier 3: closest length partial match
            if (!match) {
                const candidates = allLogos.filter(l => {
                    const n = norm(l.name);
                    return n.includes(searchTarget) || searchTarget.includes(n);
                });
                if (candidates.length) {
                    match = candidates.reduce((best, l) =>
                        Math.abs(norm(l.name).length - searchTarget.length) <
                            Math.abs(norm(best.name).length - searchTarget.length) ? l : best
                    );
                }
            }

            if (match) {
                row.logo = match.url;
                console.log(`[AutoLogo] ${row.name} => ${match.url}`);
            } else {
                console.log(`[AutoLogo] No match for: ${row.name}`);
            }
        }
    },

    // ============================================================
    // MAGIC PASTE
    // ============================================================
    async applyMagicPaste(rawInput) {
        const logos = await DB.getAllLogos();
        const result = SmartParser.parse(rawInput, {
            sport: 'football',
            mode: this.data.currentView,
            logos
        });

        if (!result.success) { alert(`❌ Gagal parse:\n${result.message}`); return; }

        const { schema } = result;
        if (schema.title) this.data.title = schema.title;

        if (schema.standings?.length) {
            this.data.standings = schema.standings.map(r => ({
                ...r, gf: r.gf ?? 0, ga: r.ga ?? 0,
                g: r.g || `${r.gf ?? 0}:${r.ga ?? 0}`
            }));
            await this._autoAssignLogos(this.data.standings);
        }

        // Top scorers from JSON
        if (schema.topScorers?.length) {
            this.data.topScorers = schema.topScorers;
            // Auto-assign club logo for each scorer
            await this._autoAssignLogos(
                this.data.topScorers.map(s => ({ name: s.club || s.name, logo: s.logo || '' }))
                    .filter(s => !s.logo)
            );
            // Copy back logos
            await AssetRegistry.init();
            const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const allLogos = [];
            for (const league of AssetRegistry.getLeagues('football')) {
                allLogos.push(...AssetRegistry.getLogos('football', league.key));
            }
            this.data.topScorers.forEach(scorer => {
                if (!scorer.logo && scorer.club) {
                    const target = norm(scorer.club);
                    const alias = Object.keys(this.LOGO_ALIASES).find(k => norm(k) === target);
                    const searchTarget = alias ? norm(this.LOGO_ALIASES[alias]) : target;
                    const match = allLogos.find(l => norm(l.name) === searchTarget)
                        || allLogos.find(l => searchTarget.startsWith(norm(l.name)))
                        || allLogos.find(l => norm(l.name).includes(searchTarget) || searchTarget.includes(norm(l.name)));
                    if (match) scorer.logo = match.url;
                }
            });
        }

        if (schema.matches?.length) {
            const isResults = schema.mode === 'results' || schema.matches.some(m => m.homeScore !== null);
            const isLineup = schema.mode === 'lineup';
            let targetArray = schema.matches.map(m => ({
                ...m,
                homeLogo: '', awayLogo: '',
                homeScore: m.homeScore ?? '-', awayScore: m.awayScore ?? '-',
                time: m.time || '', date: m.date || '', venue: m.venue || '', channel: m.channel || '',
                homeScorers: m.homeScorers || '', awayScorers: m.awayScorers || '',
                stats: m.stats || [],
                homeLineup: m.homeLineup || [], awayLineup: m.awayLineup || []
            }));

            // Auto-assign logos for matches
            const homeTeams = targetArray.map(m => ({ name: m.home, logo: '' }));
            const awayTeams = targetArray.map(m => ({ name: m.away, logo: '' }));
            await this._autoAssignLogos(homeTeams);
            await this._autoAssignLogos(awayTeams);

            targetArray.forEach((m, i) => {
                m.homeLogo = homeTeams[i].logo;
                m.awayLogo = awayTeams[i].logo;
            });

            if (isResults) {
                this.data.results = targetArray;
            } else if (isLineup) {
                // we can safely reuse the results array to hold lineups, as they share the same 'single match' emphasis UI container
                this.data.results = targetArray;
            } else {
                this.data.schedule = targetArray;
            }
        }

        const mode = schema.mode || (schema.standings?.length ? 'standings' : 'schedule');
        this.setMode(mode);
    },

    // ============================================================
    // THEME
    // ============================================================
    applyTheme(key) {
        this.data.cardTheme = key;

        // Apply CSS class to preview container
        const c = document.getElementById('preview-container');
        if (!c) return;
        [...c.classList].filter(cl => cl.startsWith('theme-')).forEach(cl => c.classList.remove(cl));
        if (key && key !== 'none') c.classList.add(`theme-${key}`);

        // Also update the background div to match theme color
        const bgEl = document.getElementById('render-bg');
        if (bgEl) {
            const themeDef = this.CSS_THEMES.find(t => t.key === key);
            if (themeDef && key !== 'none') {
                bgEl.style.background = themeDef.bg;
            } else {
                // Reset to default gradient
                bgEl.style.background = 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)';
            }
        }

        this._syncThemeSwatches(key);
        this.renderView();
    },

    _syncThemeSwatches(active) {
        document.querySelectorAll('.theme-swatch').forEach(el => {
            const isActive = el.dataset.key === active;
            el.classList.toggle('ring-2', isActive);
            el.classList.toggle('ring-white', isActive);
            el.classList.toggle('scale-110', isActive);
        });
    },

    // ============================================================
    // SET MODE
    // ============================================================
    setMode(mode) {
        this.data.currentView = mode;
        this.renderControls();
        this.renderView();
    },

    // ============================================================
    // CONTROLS (SIDEBAR)
    // ============================================================
    renderControls() {
        const container = document.getElementById('dynamic-controls');
        const t = this.data;
        container.innerHTML = `
            <!-- Mode Tabs -->
            <div class="mb-3 border-b border-gray-600 pb-2">
                <div class="flex bg-gray-900 rounded p-0.5 gap-0.5">
                    ${['standings', 'schedule', 'results', 'lineup'].map(m => `
                        <button onclick="window.FootballModule.setMode('${m}')"
                            class="${t.currentView === m ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'} flex-1 py-1 rounded text-[10px] font-bold transition">
                            ${m === 'standings' ? 'Klasemen' : m === 'schedule' ? 'Jadwal' : m === 'results' ? 'Hasil' : 'Lineup'}
                        </button>`).join('')}
                </div>
            </div>

            <!-- General Settings -->
            <div class="bg-gray-700/60 p-3 rounded mb-3 border border-gray-600 space-y-2">
                <h3 class="text-[10px] font-bold text-blue-400 uppercase"><i class="fas fa-cog mr-1"></i> Pengaturan Umum</h3>

                <div>
                    <label class="block text-[9px] text-gray-400 mb-0.5">Judul Liga</label>
                    <select id="inpTitle" onchange="window.FootballModule.updateData(event)"
                        class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white font-bold uppercase outline-none">
                        ${this.LEAGUES.map(l => `<option ${t.title === l ? 'selected' : ''} value="${l}">${l}</option>`).join('')}
                        ${!this.LEAGUES.includes(t.title) ? `<option selected value="${t.title}">${t.title}</option>` : ''}
                        <option value="_custom">+ Edit Manual...</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-[9px] text-gray-400 mb-0.5">Pekan</label>
                        <input id="inpWeek" value="${t.week}" oninput="window.FootballModule.updateData(event)"
                            class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white">
                    </div>
                    <div>
                        <label class="block text-[9px] text-gray-400 mb-0.5">Musim</label>
                        <input id="inpSeason" value="${t.season}" oninput="window.FootballModule.updateData(event)"
                            class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white">
                    </div>
                </div>

                <!-- Tanggal -->
                <div class="${t.currentView !== 'standings' ? 'hidden' : ''}">
                    <label class="block text-[9px] text-gray-400 mb-0.5">📅 Tanggal Klasemen</label>
                    <input type="date" id="inpStandingsDate" value="${t.standingsDate}"
                        oninput="window.FootballModule.updateData(event)"
                        class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white">
                </div>

                <!-- League Logo -->
                <div>
                    <label class="block text-[9px] text-gray-400 mb-0.5">Logo Liga</label>
                    <div class="flex items-center gap-2">
                        <button onclick="document.getElementById('inpLeagueLogo').click()"
                            class="flex-1 bg-purple-700 hover:bg-purple-600 text-white text-[9px] py-1 rounded">
                            <i class="fas fa-upload mr-1"></i>${t.leagueLogo ? 'Ganti' : 'Upload'}
                        </button>
                        ${t.leagueLogo ? `<img src="${t.leagueLogo}" class="h-8 w-8 object-contain rounded"><button onclick="window.FootballModule.data.leagueLogo='';window.FootballModule.renderControls();window.FootballModule.renderView()" class="text-red-400 text-xs">✕</button>` : ''}
                    </div>
                    <input id="inpLeagueLogo" type="file" accept="image/*" class="hidden" onchange="window.FootballModule.handleLogoUpload(this,'league')">
                </div>

                <!-- BG: Dropdown + Upload -->
                <div>
                    <label class="block text-[9px] text-gray-400 mb-0.5">Background Image</label>
                    <!-- Static backgrounds dropdown -->
                    <select id="inpBgSelect" onchange="window.FootballModule.onBgSelect(event)"
                        class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white mb-1">
                        <option value="">-- Tidak ada --</option>
                        <optgroup label="Aset Bawaan">
                            ${AssetRegistry.getBackgrounds('football').map(bg =>
            `<option value="${bg.url}" ${t.bgImage === bg.url ? 'selected' : ''}>${bg.name}</option>`
        ).join('')}
                        </optgroup>
                        ${Object.keys(t.savedBackgrounds || {}).length > 0 ? `
                        <optgroup label="Upload Kustom">
                            ${Object.keys(t.savedBackgrounds).map(id => `
                                <option value="db:${id}" ${t.bgImage === 'db:' + id ? 'selected' : ''}>Kustom ${id}</option>
                            `).join('')}
                        </optgroup>` : ''}
                    </select>
                    <!-- Opacity slider -->
                    <input type="range" id="inpBgOpacity" min="0" max="1" step="0.05" value="${t.bgOpacity}"
                        oninput="window.FootballModule.updateData(event);window.FootballModule.renderView()"
                        class="w-full accent-blue-500 h-1 mb-1">
                    <!-- Upload custom -->
                    <div class="flex gap-1">
                        <button onclick="document.getElementById('inpBgFile').click()"
                            class="flex-1 bg-gray-600 hover:bg-gray-500 text-white text-[9px] py-1 rounded">
                            <i class="fas fa-upload mr-1"></i>Upload BG Baru</button>
                        ${t.bgImage.startsWith('db:') ? `
                        <button onclick="window.FootballModule.deleteBg('${t.bgImage.replace('db:', '')}')"
                            class="bg-red-800/60 hover:bg-red-700/60 text-red-300 px-2 rounded text-[9px]">✕</button>
                        ` : `
                        <button onclick="window.FootballModule.setStaticBg('');window.FootballModule.renderControls()"
                            class="bg-gray-600 hover:bg-gray-500 text-red-400 text-[9px] px-2 rounded">✕</button>
                        `}
                    </div>
                    <input id="inpBgFile" type="file" accept="image/*" class="hidden" onchange="window.FootballModule.handleBgUpload(this)">
                </div>

                <!-- Color Theme -->
                <div>
                    <label class="block text-[9px] text-gray-400 mb-0.5">Tema Warna</label>
                    <select id="inpTheme" onchange="window.FootballModule.updateData(event)"
                        class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white uppercase font-bold">
                        ${Object.entries(this.THEMES).map(([k, v]) => `<option value="${k}" ${t.theme === k ? 'selected' : ''}>${v.name}</option>`).join('')}
                    </select>
                </div>

                <!-- Channel Logo -->
                <div>
                    <label class="block text-[9px] text-gray-400 mb-0.5">Logo Channel (Watermark)</label>
                    <div class="flex items-center gap-2">
                        <button onclick="document.getElementById('inpChannelLogo').click()"
                            class="flex-1 bg-gray-600 hover:bg-gray-500 text-white text-[9px] py-1 rounded">
                            <i class="fas fa-upload mr-1"></i>${t.channelLogo ? 'Ganti' : 'Upload'}
                        </button>
                        ${t.channelLogo ? `<img src="${t.channelLogo}" class="h-6 object-contain"><button onclick="window.FootballModule.data.channelLogo='';window.FootballModule.renderControls();window.FootballModule.renderView()" class="text-red-400 text-xs">✕</button>` : ''}
                    </div>
                    <input id="inpChannelLogo" type="file" accept="image/*" class="hidden" onchange="window.FootballModule.handleLogoUpload(this,'channel')">
                </div>
            </div>

            <!-- CSS Theme Grid -->
            <!-- Visual Theme Dropdown -->
            <div class="mb-3">
                <h3 class="text-[10px] font-bold text-purple-400 uppercase mb-1"><i class="fas fa-palette mr-1"></i> Visual Theme</h3>
                <select id="inpCssTheme" onchange="window.FootballModule.applyTheme(this.value)"
                    class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white">
                    ${this.CSS_THEMES.map(th =>
            `<option value="${th.key}" ${(t.cardTheme || 'none') === th.key ? 'selected' : ''}>${th.label}</option>`
        ).join('')}
                </select>
            </div>

            <!-- Animation -->
            <div class="bg-gray-700/60 p-3 rounded mb-3 border border-gray-600 space-y-2">
                <h3 class="text-[10px] font-bold text-green-400 uppercase"><i class="fas fa-film mr-1"></i> Animasi</h3>
                <select id="inpAnim" onchange="window.FootballModule.updateData(event)"
                    class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white">
                    ${['anim-slide', 'anim-slide-left', 'anim-slide-up', 'anim-fadeup', 'anim-zoom', 'anim-flip', 'anim-bounce', 'anim-roll', 'anim-blur', 'anim-wipe', 'anim-bounce-drop', 'anim-split', 'anim-reveal']
                .map(a => `<option value="${a}" ${t.animation === a ? 'selected' : ''}>${a.replace('anim-', '').replace(/-/g, ' ')}</option>`).join('')}
                </select>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-[9px] text-gray-400 mb-0.5">Durasi (s)</label>
                        <input type="number" id="inpAnimDuration" value="${t.animDuration}" step="0.1" min="0.1" max="3"
                            oninput="window.FootballModule.updateData(event)"
                            class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white">
                    </div>
                    <div>
                        <label class="block text-[9px] text-gray-400 mb-0.5">Stagger (s)</label>
                        <input type="number" id="inpAnimStagger" value="${t.animStagger}" step="0.05" min="0" max="0.5"
                            oninput="window.FootballModule.updateData(event)"
                            class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white">
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <label class="flex items-center gap-2 text-xs text-gray-300 cursor-pointer flex-shrink-0">
                        <input type="checkbox" id="chkAnimLoop" ${t.animLoop ? 'checked' : ''}
                            onchange="window.FootballModule.updateData(event)" class="accent-blue-500">
                        Auto Loop
                    </label>
                    <div class="flex items-center gap-1 flex-1">
                        <label class="text-[9px] text-gray-400 flex-shrink-0">⏱ Detik/hal:</label>
                        <input type="number" id="inpLoopInterval" value="${t.animLoopInterval || 5}" min="2" max="60" step="1"
                            oninput="window.FootballModule.updateData(event)"
                            class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white text-center">
                    </div>
                </div>
            </div>

            <!-- Zone Colors -->
            <div class="bg-gray-700/60 p-3 rounded mb-3 border border-gray-600 space-y-2 ${t.currentView !== 'standings' ? 'hidden' : ''}">
                <h3 class="text-[10px] font-bold text-yellow-400 uppercase"><i class="fas fa-layer-group mr-1"></i> Zona Warna</h3>
                <div class="grid grid-cols-3 gap-1">
                    <div>
                        <label class="block text-[8px] text-blue-400 mb-0.5">🔵 Teratas</label>
                        <input type="number" id="inpZoneTop" min="0" max="20" value="${t.zoneTop}"
                            oninput="window.FootballModule.updateData(event)"
                            class="w-full bg-gray-900 border border-blue-600/50 rounded px-2 py-1 text-xs text-white text-center">
                    </div>
                    <div>
                        <label class="block text-[8px] text-orange-400 mb-0.5">🟠 Playoff</label>
                        <input type="number" id="inpZoneEuropa" min="0" max="10" value="${t.zoneEuropa}"
                            oninput="window.FootballModule.updateData(event)"
                            class="w-full bg-gray-900 border border-orange-600/50 rounded px-2 py-1 text-xs text-white text-center">
                    </div>
                    <div>
                        <label class="block text-[8px] text-red-400 mb-0.5">🔴 Degradasi</label>
                        <input type="number" id="inpZoneBottom" min="0" max="10" value="${t.zoneBottom}"
                            oninput="window.FootballModule.updateData(event)"
                            class="w-full bg-gray-900 border border-red-600/50 rounded px-2 py-1 text-xs text-white text-center">
                    </div>
                </div>
                <p class="text-[8px] text-gray-500">0 = zona dinonaktifkan</p>
            </div>
            <div class="bg-gray-900 border border-purple-600/50 rounded-xl mb-3 overflow-hidden">
                <!-- Header / Toggle -->
                <button onclick="document.getElementById('smart-paste-body').classList.toggle('hidden');this.querySelector('i').classList.toggle('fa-chevron-down');this.querySelector('i').classList.toggle('fa-chevron-up')"
                    class="w-full flex items-center justify-between px-3 py-2 text-left bg-purple-900/30 hover:bg-purple-900/50 transition">
                    <span class="text-[10px] font-bold text-purple-300 uppercase tracking-wide"><i class="fas fa-magic mr-2"></i> Smart Paste</span>
                    <i class="fas fa-chevron-down text-gray-400 text-[9px]"></i>
                </button>
                <div id="smart-paste-body" class="p-3 space-y-2">
                    <!-- Template Quick-fill -->
                    <div class="flex gap-1 flex-wrap">
                        <span class="text-[8px] text-gray-500 self-center">Template:</span>
                        <button onclick="window.FootballModule.fillPasteTemplate('standings')"
                            class="text-[8px] bg-yellow-700/60 hover:bg-yellow-600/60 text-yellow-200 px-1.5 py-0.5 rounded">Klasemen</button>
                        <button onclick="window.FootballModule.fillPasteTemplate('schedule')"
                            class="text-[8px] bg-blue-700/60 hover:bg-blue-600/60 text-blue-200 px-1.5 py-0.5 rounded">Jadwal</button>
                        <button onclick="window.FootballModule.fillPasteTemplate('results')"
                            class="text-[8px] bg-green-700/60 hover:bg-green-600/60 text-green-200 px-1.5 py-0.5 rounded">Hasil</button>
                        <button onclick="window.FootballModule.fillPasteTemplate('lineup')"
                            class="text-[8px] bg-purple-700/60 hover:bg-purple-600/60 text-purple-200 px-1.5 py-0.5 rounded">Lineup</button>
                    </div>
                    <!-- Textarea -->
                    <textarea id="sidebar-paste-input" rows="7"
                        class="w-full bg-black/60 border border-gray-700 rounded-lg text-[9px] text-white font-mono p-2 resize-none focus:outline-none focus:border-purple-500 placeholder-gray-600"
                        placeholder="Paste JSON atau teks klasemen/lineup di sini...&#10;&#10;Contoh:&#10;{&quot;sport&quot;:&quot;football&quot;,&quot;mode&quot;:&quot;lineup&quot;,...}"></textarea>
                    <!-- Actions -->
                    <div class="flex gap-2">
                        <button onclick="document.getElementById('sidebar-paste-input').value=''"
                            class="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-[9px] rounded">Hapus</button>
                        <button onclick="window.FootballModule._applySidebarPaste()"
                            class="flex-1 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[9px] font-bold rounded transition shadow">
                            <i class="fas fa-bolt mr-1"></i> Apply!
                        </button>
                    </div>
                    <p class="text-[8px] text-gray-500">Paste JSON langsung atau copy-paste teks dari Google/Flashscore. Auto-detect format.</p>

                    <!-- Format JSON Reference (collapsible) -->
                    <div class="border border-gray-700 rounded-lg overflow-hidden">
                        <button onclick="this.nextElementSibling.classList.toggle('hidden');this.querySelector('span').textContent=this.nextElementSibling.classList.contains('hidden')?'▶ Format JSON':'▼ Format JSON'"
                            class="w-full flex items-center gap-2 px-2 py-1.5 bg-gray-800 hover:bg-gray-700 text-left transition">
                            <span class="text-[9px] font-bold text-green-400">▶ Format JSON</span>
                            <span class="ml-auto text-[8px] text-gray-500">Referensi</span>
                        </button>
                        <div class="hidden relative">
                            <button onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent.trim()).then(()=>{this.textContent='✓ Copied!';setTimeout(()=>this.textContent='📋 Copy',1500)})"
                                class="absolute top-1 right-1 text-[8px] bg-green-700 hover:bg-green-600 text-white px-1.5 py-0.5 rounded z-10">📋 Copy</button>
                            <pre class="text-[8px] text-green-300 font-mono bg-black/70 p-2 overflow-x-auto whitespace-pre leading-relaxed select-all">{
  "sport": "football",
  "mode": "standings",
  "title": "ENGLISH PREMIER LEAGUE",
  "topScorers": [
    { "rank": 1, "name": "Erling Haaland",
      "club": "Manchester City", "goals": 24 },
    { "rank": 2, "name": "Cole Palmer",
      "club": "Chelsea", "goals": 20 },
    { "rank": 3, "name": "Mohamed Salah",
      "club": "Liverpool", "goals": 18 }
  ],
  "standings": [
    { "pos": 1, "name": "Arsenal",
      "mp": 27, "w": 17, "d": 7, "l": 3,
      "gf": 52, "ga": 20, "gd": 32, "pts": 58 },
    { "pos": 2, "name": "Man City", ... }
  ]
}</pre>
                        </div>
                    </div>
                </div>
            <!-- Mode-specific content -->
            <div id="mode-specific-controls"></div>
            
            <!-- Mobile Spacer to fix scroll clipping -->
            <div class="h-32 w-full"></div>
        `;

        // Render mode-specific controls
        this._renderModeControls();

        // Init active theme swatches
        this._syncThemeSwatches(this.data.cardTheme || 'none');
    },

    _renderModeControls() {
        const container = document.getElementById('mode-specific-controls');
        if (!container) return;
        const t = this.data;

        if (t.currentView === 'standings') {
            // Simple info panel — editting via Smart Paste only
            container.innerHTML = `
                <div class="bg-gray-700/60 p-3 rounded border border-gray-600 text-center">
                    <div class="text-purple-400 text-[28px] mb-1"><i class="fas fa-table text-purple-400"></i></div>
                    <p class="text-[10px] text-white font-bold">${t.standings.length} Tim loaded</p>
                    <p class="text-[8px] text-gray-400 mt-1 mb-3">Gunakan ✨ Smart Paste untuk input atau ganti data klasemen</p>
                    <button onclick="window.FootballModule.data.standings=[];window.FootballModule.renderControls();window.FootballModule.renderView()"
                        class="text-[8px] bg-red-800/60 hover:bg-red-700/60 text-red-300 px-3 py-1 rounded border border-red-700/40">
                        <i class="fas fa-trash mr-1"></i> Reset Data
                    </button>
                </div>`;
        } else if (t.currentView === 'schedule' || t.currentView === 'results') {
            let matchesHtml = '';
            if (t.currentView === 'schedule') {
                matchesHtml = `
                <div class="bg-gray-700/60 p-3 rounded border border-gray-600">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-[10px] font-bold text-blue-400 uppercase">📅 Jadwal</h3>
                        <button onclick="window.FootballModule.addMatch()"
                            class="bg-blue-600 hover:bg-blue-500 text-white text-[9px] px-2 py-0.5 rounded">+ Pertandingan</button>
                    </div>
                    ${t.schedule.length === 0 ? `<p class="text-gray-500 text-[9px] text-center">Gunakan ✨ Magic Paste untuk input data.</p>` :
                        t.schedule.map((m, i) => `
                        <div class="bg-gray-900/60 rounded p-2 mb-2 text-[9px]">
                            <div class="flex gap-1 mb-1">
                                <input value="${m.date}" placeholder="Tanggal"
                                    oninput="window.FootballModule.updateMatch(${i},'date',this.value)"
                                    class="flex-1 bg-gray-800 border border-gray-600 rounded px-1 py-0.5 text-white">
                                <input value="${m.time}" placeholder="Waktu"
                                    oninput="window.FootballModule.updateMatch(${i},'time',this.value)"
                                    class="w-16 bg-gray-800 border border-gray-600 rounded px-1 py-0.5 text-white">
                            </div>
                            <div class="flex gap-1">
                                <input value="${m.home}" placeholder="Tim Kandang"
                                    oninput="window.FootballModule.updateMatch(${i},'home',this.value)"
                                    class="flex-1 bg-gray-800 border border-gray-600 rounded px-1 py-0.5 text-white">
                                <span class="text-gray-500 self-center">vs</span>
                                <input value="${m.away}" placeholder="Tim Tamu"
                                    oninput="window.FootballModule.updateMatch(${i},'away',this.value)"
                                    class="flex-1 bg-gray-800 border border-gray-600 rounded px-1 py-0.5 text-white">
                                <button onclick="window.FootballModule.removeMatch(${i})"
                                    class="text-red-500 text-xs px-1">✕</button>
                            </div>
                        </div>`).join('')}
                </div>`;
            }

            container.innerHTML = `
                <div class="bg-gray-700/60 p-3 rounded border border-gray-600 mb-3">
                    <h3 class="text-[10px] font-bold text-pink-400 uppercase mb-1"><i class="fas fa-layer-group mr-1"></i> Tema Kartu ${t.currentView === 'results' ? 'Hasil' : 'Jadwal'}</h3>
                    <select id="inpScheduleStyle" onchange="window.FootballModule.updateData(event)"
                        class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-xs text-white">
                        ${['classic', 'dark', 'glass', 'gradient', 'broadcast', 'minimal', 'neon', 'tournament', 'hexagon', 'elegant', 'gaming', 'v3'].map(s =>
                `<option value="${s}" ${t.scheduleCardStyle === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
            ).join('')}
                    </select>
                </div>
                ${matchesHtml}`;
        } else if (t.currentView === 'lineup') {
            container.innerHTML = `
                <div class="bg-gray-700/60 p-3 rounded border border-gray-600 mb-3 text-center">
                    <div class="text-green-400 text-[28px] mb-1"><i class="fas fa-hand-pointer text-green-400"></i></div>
                    <p class="text-[10px] text-white font-bold">Interactive Lineup Builder</p>
                    <p class="text-[9px] text-gray-400 mt-1 mb-3">Tarik / Geser (Drag Drop) posisi pemain langsung di atas lapangan virtual pada layar preview.</p>
                    <hr class="border-gray-600 my-2">
                    <div class="flex gap-2 justify-center mt-2">
                         <div class="flex-1 text-left">
                             <label class="text-[9px] text-gray-400 font-bold mb-1 block">🏠 Formasi Home</label>
                             <select onchange="window.FootballModule.applyFormationPreset('home', this.value)" class="w-full bg-gray-900 border border-gray-500 rounded px-1 py-1 text-[10px] text-white">
                                  <option value="">Pilih</option>
                                  <option value="4-4-2">4-4-2</option>
                                  <option value="4-3-3">4-3-3</option>
                                  <option value="3-5-2">3-5-2</option>
                                  <option value="4-2-3-1">4-2-3-1</option>
                             </select>
                         </div>
                         <div class="flex-1 text-left">
                             <label class="text-[9px] text-gray-400 font-bold mb-1 block">✈️ Formasi Away</label>
                             <select onchange="window.FootballModule.applyFormationPreset('away', this.value)" class="w-full bg-gray-900 border border-gray-500 rounded px-1 py-1 text-[10px] text-white">
                                  <option value="">Pilih</option>
                                  <option value="4-4-2">4-4-2</option>
                                  <option value="4-3-3">4-3-3</option>
                                  <option value="3-5-2">3-5-2</option>
                                  <option value="4-2-3-1">4-2-3-1</option>
                             </select>
                         </div>
                    </div>
                </div>`;
        }
    },

    // ============================================================
    // DATA MUTATIONS
    // ============================================================
    _applySidebarPaste() {
        const textarea = document.getElementById('sidebar-paste-input');
        if (!textarea) return;
        const input = textarea.value.trim();
        if (!input) { alert('Textarea kosong! Paste JSON atau teks dulu.'); return; }
        this.applyMagicPaste(input);
    },

    fillPasteTemplate(mode) {
        const TEMPLATES = {
            standings: `{"sport":"football","mode":"standings","title":"BRI SUPER LEAGUE","standings":[
  {"pos":1,"name":"Persib",    "mp":20,"w":14,"d":4,"l":2,"gf":42,"ga":18,"gd":24,"pts":46},
  {"pos":2,"name":"Persija",   "mp":20,"w":13,"d":3,"l":4,"gf":38,"ga":22,"gd":16,"pts":42},
  {"pos":3,"name":"Bali United","mp":20,"w":11,"d":5,"l":4,"gf":35,"ga":25,"gd":10,"pts":38},
  {"pos":4,"name":"Arema",     "mp":20,"w":10,"d":4,"l":6,"gf":30,"ga":28,"gd":2, "pts":34}
]}`,
            schedule: `{"sport":"football","mode":"schedule","title":"BRI SUPER LEAGUE","matches":[
  {"date":"Sabtu, 22 Feb 2026","time":"19:00","home":"Persija","away":"Persib",  "venue":"GBK",       "channel":"Indosiar"},
  {"date":"Sabtu, 22 Feb 2026","time":"15:30","home":"Arema",  "away":"Bali United","venue":"Kanjuruhan","channel":"RCTI"},
  {"date":"Minggu, 23 Feb 2026","time":"20:00","home":"PSM",    "away":"Borneo FC","venue":"PSM Arena", "channel":"TV One"}
]}`,
            results: `{"sport":"football","mode":"results","title":"Hasil Pekan 20","matches":[
  {"date":"Sab 15 Feb","home":"Persib","away":"Persija",   "homeScore":2,"awayScore":1},
  {"date":"Sab 15 Feb","home":"Arema", "away":"Bali United","homeScore":0,"awayScore":3},
  {"date":"Min 16 Feb","home":"PSM",   "away":"Borneo FC",  "homeScore":1,"awayScore":1}
]}`,
            lineup: `{"sport":"football","mode":"lineup","title":"STARTING XI","matches":[
  {
    "date":"Senin, 24 Feb 2026","time":"19:00","venue":"Stadion Utama GBK","home":"Persib","away":"Persija",
    "homeLineup":[
      {"name":"Kevin","no":1,"pos":"GK"}, {"name":"Henhen","no":12,"pos":"RB"}, {"name":"Kuipers","no":2,"pos":"CB"}, {"name":"Gustavo","no":4,"pos":"CB"}, {"name":"Rezaldi","no":56,"pos":"LB"},
      {"name":"Klok","no":23,"pos":"CM"}, {"name":"Dedi K","no":11,"pos":"CDM"}, {"name":"Irianto","no":53,"pos":"CM"},
      {"name":"Ciro","no":77,"pos":"RW"}, {"name":"David","no":19,"pos":"ST"}, {"name":"Beckham","no":7,"pos":"LW"}
    ],
    "awayLineup":[
      {"name":"Andritany","no":26,"pos":"GK"}, {"name":"Rio F","no":2,"pos":"RB"}, {"name":"Kudela","no":17,"pos":"CB"}, {"name":"Rizky R","no":74,"pos":"CB"}, {"name":"Firza","no":11,"pos":"LB"},
      {"name":"Gajos","no":10,"pos":"CM"}, {"name":"Hanif","no":19,"pos":"CDM"}, {"name":"Maciej","no":8,"pos":"CM"},
      {"name":"Ryo","no":7,"pos":"RW"}, {"name":"Gustavo","no":70,"pos":"ST"}, {"name":"Simic","no":9,"pos":"LW"}
    ]
  }
]}`
        };
        const ta = document.getElementById('sidebar-paste-input');
        if (ta) { ta.value = TEMPLATES[mode] || ''; ta.focus(); }
    },
    updateData(e) {
        const { id, value, type, checked } = e.target;
        if (id === 'inpTitle') {
            if (value === '_custom') {
                const v = prompt('Nama Liga:');
                if (v) this.data.title = v;
            } else {
                this.data.title = value;
            }
            // Auto-load league badge from static assets
            const badgeUrl = AssetRegistry.getLeagueBadge('football', this.data.title);
            if (badgeUrl) {
                this.data.leagueLogo = badgeUrl;
                this.renderControls(); // refresh logo preview in sidebar
            }
        }
        else if (id === 'inpWeek') this.data.week = value;
        else if (id === 'inpSeason') this.data.season = value;
        else if (id === 'inpTheme') this.data.theme = value;
        else if (id === 'inpAnim') this.data.animation = value;
        else if (id === 'inpAnimDuration') this.data.animDuration = parseFloat(value);
        else if (id === 'inpAnimStagger') this.data.animStagger = parseFloat(value);
        else if (id === 'chkAnimLoop') {
            this.data.animLoop = checked;
            if (checked) this.startPageLoop();
            else this.stopPageLoop();
        }
        else if (id === 'inpZoneTop') this.data.zoneTop = parseInt(value) || 0;
        else if (id === 'inpZoneEuropa') this.data.zoneEuropa = parseInt(value) || 0;
        else if (id === 'inpZoneBottom') this.data.zoneBottom = parseInt(value) || 0;
        else if (id === 'inpStandingsDate') this.data.standingsDate = value;
        else if (id === 'inpLoopInterval') {
            this.data.animLoopInterval = Math.max(2, parseInt(value) || 5);
            if (this.data.animLoop) { this.stopPageLoop(); this.startPageLoop(); }
        }
        else if (id === 'inpScheduleStyle') this.data.scheduleCardStyle = value;
        else if (id === 'inpBgOpacity') this.data.bgOpacity = parseFloat(value);
        this.renderView();
    },

    updateStanding(i, field, value) {
        this.data.standings[i][field] = isNaN(value) ? value : parseFloat(value) || value;
        this.renderView();
    },

    addStandingRow() {
        const pos = this.data.standings.length + 1;
        this.data.standings.push({ pos, name: 'Tim Baru', mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, logo: '' });
        this.renderControls();
        this.renderView();
    },

    removeStandingRow(i) {
        this.data.standings.splice(i, 1);
        this.data.standings.forEach((r, i) => r.pos = i + 1);
        this.renderControls();
        this.renderView();
    },

    async updateMatch(i, field, value) {
        this.data.schedule[i][field] = value;
        if (field === 'home' || field === 'away') {
            const teamObj = { name: value, logo: '' };
            await this._autoAssignLogos([teamObj]);
            this.data.schedule[i][field + 'Logo'] = teamObj.logo;
        }
        this.renderView();
    },

    addMatch() {
        this.data.schedule.push({ date: '', time: '', home: '', away: '', homeLogo: '', awayLogo: '', venue: '', channel: '' });
        this.renderControls();
        this.renderView();
    },

    removeMatch(i) {
        this.data.schedule.splice(i, 1);
        this.renderControls();
        this.renderView();
    },

    onBgSelect(e) {
        const url = e.target.value;
        this.setStaticBg(url); // empty string = clear, otherwise load static URL
    },

    setStaticBg(url) {
        this.data.bgImage = url;
        this.renderControls(); // refresh thumbnail highlight
        this.renderView();
    },

    handleLogoUpload(input, type) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (type === 'league') this.data.leagueLogo = e.target.result;
            if (type === 'channel') this.data.channelLogo = e.target.result;
            this.renderControls();
            this.renderView();
        };
        reader.readAsDataURL(file);
    },

    async handleBgUpload(input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const id = Date.now().toString();
            await DB.saveBackground(id, e.target.result);
            await this._loadSavedBgs();
            this.data.bgImage = 'db:' + id;
            this.renderControls();
            this.renderView();
        };
        reader.readAsDataURL(file);
    },

    async deleteBg(id) {
        if (!confirm('Hapus background ini?')) return;
        await DB._delete('backgrounds', id);
        await this._loadSavedBgs();
        if (this.data.bgImage === 'db:' + id) this.data.bgImage = '';
        this.renderControls();
        this.renderView();
    },

    async _loadSavedBgs() {
        this.data.savedBackgrounds = await DB.getAllBackgrounds();
    },

    // ============================================================
    // RENDER VIEW (PREVIEW — 1080×1920)
    // ============================================================
    renderView() {
        const t = this.data;
        const theme = this.THEMES[t.theme] || this.THEMES['yellow'];

        // Background image layer
        const bgEl = document.getElementById('render-bg');
        const bgImgEl = document.getElementById('render-bg-image');
        if (bgEl && bgImgEl) {
            // Apply CSS theme background
            const themeDef = this.CSS_THEMES.find(th => th.key === (t.cardTheme || 'none'));
            if (themeDef && t.cardTheme && t.cardTheme !== 'none') {
                bgEl.style.background = themeDef.bg;
            } else {
                bgEl.style.background = 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)';
            }
            // User-uploaded BG image on top
            bgImgEl.style.opacity = t.bgOpacity;
            if (t.bgImage) {
                let bgUrl = t.bgImage;
                if (bgUrl.startsWith('db:')) {
                    const id = bgUrl.replace('db:', '');
                    bgUrl = (t.savedBackgrounds && t.savedBackgrounds[id]) ? t.savedBackgrounds[id] : '';
                }
                const encodedBg = bgUrl.startsWith('data:')
                    ? bgUrl
                    : bgUrl.split('/').map(seg => encodeURIComponent(seg)).join('/');
                bgImgEl.style.backgroundImage = `url("${encodedBg}")`;
                bgImgEl.style.backgroundSize = 'cover';
                bgImgEl.style.backgroundPosition = 'center';
                bgImgEl.style.display = 'block';
            }
            else { bgImgEl.style.backgroundImage = ''; bgImgEl.style.display = 'none'; }
        }

        // Header
        const header = document.getElementById('render-header');
        if (header) {
            const scorers = t.topScorers || [];
            const hasScorers = scorers.length > 0;
            const leagueLogoEncoded = t.leagueLogo
                ? (t.leagueLogo.startsWith('data:') ? t.leagueLogo : t.leagueLogo.split('/').map(s => encodeURIComponent(s)).join('/'))
                : '';

            let titlePrefix = '';
            if (t.currentView === 'standings') titlePrefix = 'Klasemen Sementara ';
            else if (t.currentView === 'schedule') titlePrefix = 'Jadwal Pertandingan ';
            else if (t.currentView === 'results') titlePrefix = 'Hasil Pertandingan ';

            header.innerHTML = `
                <div class="flex gap-4 w-full items-stretch">
                    <!-- LEFT: League Info Glass Card -->
                    <div class="flex-1 flex items-center gap-5 px-8 py-6 rounded-3xl"
                        style="background:rgba(255,255,255,0.08);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1.5px solid rgba(255,255,255,0.15);box-shadow:0 8px 32px rgba(0,0,0,0.4);">
                        ${leagueLogoEncoded ? `<img src="${leagueLogoEncoded}" class="h-28 w-28 object-contain drop-shadow-2xl flex-shrink-0">` : ''}
                        <div>
                            <h1 class="font-oswald font-black text-white leading-none drop-shadow-lg tracking-wide uppercase flex flex-col justify-center animate-breathe">
                                ${titlePrefix ? `<span class="text-[28px] text-yellow-400 mb-1 tracking-normal drop-shadow-md">${titlePrefix}</span>` : ''}
                                <span class="text-[54px]">${t.title}</span>
                            </h1>
                            <div class="flex items-center gap-3 mt-2">
                                <span class="text-[32px] font-bold text-yellow-400 font-roboto drop-shadow">${t.week}</span>
                                <span class="text-[32px] text-white/50">·</span>
                                <span class="text-[32px] font-semibold text-white/70 font-roboto">${t.season}</span>
                            </div>
                            ${t.standingsDate ? (() => {
                    const d = new Date(t.standingsDate + 'T00:00:00');
                    const opts = { day: 'numeric', month: 'long', year: 'numeric' };
                    const pretty = d.toLocaleDateString('id-ID', opts);
                    return `<div class="flex items-center gap-2 mt-1">
                                    <span class="text-[22px] text-white/50">📅</span>
                                    <span class="text-[24px] text-white/60 font-roboto">Per ${pretty}</span>
                                </div>`;
                })() : ''}
                        </div>
                    </div>

                    ${hasScorers ? `
                    <!-- RIGHT: Top Scorer Glass Card -->
                    <div class="w-[420px] flex-shrink-0 px-6 py-5 rounded-3xl"
                        style="background:rgba(255,255,255,0.07);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1.5px solid rgba(255,255,255,0.13);box-shadow:0 8px 32px rgba(0,0,0,0.4);">
                        <div class="flex items-center gap-2 mb-4 border-b border-white/15 pb-3">
                            <span class="text-[28px]">⚽</span>
                            <span class="font-oswald text-[30px] font-bold text-white uppercase tracking-wider">Top Scorer</span>
                        </div>
                        <div class="space-y-3">
                        ${scorers.slice(0, 5).map((s, idx) => {
                    const clubLogoSrc = s.logo
                        ? (s.logo.startsWith('data:') ? s.logo : s.logo.split('/').map(x => encodeURIComponent(x)).join('/'))
                        : '';
                    const rankColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600', 'text-white/70', 'text-white/70'];
                    return `
                            <div class="flex items-center gap-3">
                                <span class="font-oswald text-[28px] font-black ${rankColors[idx] || 'text-white/50'} w-8 text-center">${idx + 1}</span>
                                ${clubLogoSrc ? `<img src="${clubLogoSrc}" class="w-10 h-10 object-contain rounded-full flex-shrink-0">` : '<div class="w-10 h-10 rounded-full bg-white/10 flex-shrink-0"></div>'}
                                <div class="flex-1 min-w-0">
                                    <div class="font-oswald text-[26px] font-bold text-white leading-none truncate">${s.name}</div>
                                    <div class="text-[18px] text-white/50 font-roboto truncate">${s.club || ''}</div>
                                </div>
                                <div class="text-right flex-shrink-0">
                                    <div class="font-oswald text-[32px] font-black text-yellow-400 leading-none">${s.goals}</div>
                                    <div class="text-[16px] text-white/40">gol</div>
                                </div>
                            </div>`;
                }).join('')}
                        </div>
                    </div>` : ''}
                </div>`;
        }

        // Main View
        const view = document.getElementById('render-view');
        if (!view) return;

        if (t.currentView === 'standings') {
            this._renderStandings(view, theme);
        } else if (t.currentView === 'schedule') {
            this._renderSchedule(view, theme);
        } else if (t.currentView === 'results') {
            this._renderResults(view, theme);
        } else if (t.currentView === 'lineup') {
            this._renderLineup(view, theme);
        }

        // Footer ticker
        const footer = document.getElementById('render-footer');
        if (footer) {
            footer.innerHTML = `
                <style>
                    @keyframes ticker-scroll {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .ticker-inner {
                        display: inline-flex;
                        white-space: nowrap;
                        animation: ticker-scroll 38s linear infinite;
                        font-weight: 800;
                    }
                </style>
                <div class="w-full overflow-hidden relative flex items-center gap-6">
                    <!-- Channel badge -->
                    <div class="flex-shrink-0 flex items-center gap-3 pr-4 border-r-2 border-yellow-500">
                        <img src="assets/channel/logos/logo%20djafarsport.png" class="h-12 w-12 object-contain rounded-full" onerror="this.style.display='none'">
                        <span class="font-oswald text-[30px] font-black text-yellow-400 tracking-wide">djafarSport</span>
                    </div>
                    <!-- Running ticker — duplicated for seamless loop -->
                    <div class="flex-1 overflow-hidden">
                        <span class="ticker-inner font-roboto text-[28px] text-white">
                            Like &amp; subscribe channel &nbsp;<strong class="text-yellow-400">djafarSport</strong>&nbsp; untuk mendapatkan update olahraga terbaru &nbsp;✨&nbsp;&nbsp;•&nbsp;&nbsp;
                            Like &amp; subscribe channel &nbsp;<strong class="text-yellow-400">djafarSport</strong>&nbsp; untuk mendapatkan update olahraga terbaru &nbsp;✨&nbsp;&nbsp;•&nbsp;&nbsp;
                        </span>
                    </div>
                </div>`;
        }
        const wm = document.getElementById('channel-watermark');
        if (wm) {
            wm.style.display = t.channelLogo ? 'block' : 'none';
            wm.innerHTML = t.channelLogo ? `<img src="${t.channelLogo}" class="h-[120px] object-contain opacity-80">` : '';
        }
    },

    _renderStandings(view, theme) {
        const t = this.data;
        const rowAnim = t.animation;
        const dur = t.animDuration;
        const stagger = t.animStagger;
        const rpp = this.ROWS_PER_PAGE;

        // Pagination
        const totalPages = Math.ceil(t.standings.length / rpp);
        const curPage = Math.min(t.standingsPage ?? 0, Math.max(0, totalPages - 1));
        const pageRows = t.standings.slice(curPage * rpp, (curPage + 1) * rpp);
        const gridCols = '48px minmax(0,1fr) repeat(7,48px) 64px';

        // Page dot indicators
        const dots = totalPages > 1 ? Array.from({ length: totalPages }, (_, i) =>
            `<div onclick="window.FootballModule.goToPage(${i})"
                class="cursor-pointer w-5 h-5 rounded-full border-2 transition-all ${i === curPage ? 'bg-white border-white scale-125' : 'bg-transparent border-white/40 hover:border-white/70'}"></div>`
        ).join('') : '';

        view.innerHTML = `
            <style>.sg-grid{display:grid;grid-template-columns:${gridCols};gap:6px;align-items:center;}</style>
            <div class="sg-grid ${theme.header} px-5 py-4 rounded-t-2xl mb-2">
                <span class="text-[32px] font-bold font-oswald text-center">#</span>
                <span class="text-[32px] font-bold font-oswald pl-2">Klub</span>
                <span class="text-[26px] font-bold text-center opacity-80">T</span>
                <span class="text-[26px] font-bold text-center opacity-80">M</span>
                <span class="text-[26px] font-bold text-center opacity-80">S</span>
                <span class="text-[26px] font-bold text-center opacity-80">K</span>
                <span class="text-[26px] font-bold text-center opacity-80">GM</span>
                <span class="text-[26px] font-bold text-center opacity-80">GK</span>
                <span class="text-[26px] font-bold text-center opacity-80">SG</span>
                <span class="text-[32px] font-bold text-center">Poin</span>
            </div>
            <div class="space-y-2">
            ${pageRows.map((row, i) => {
            // Determine zone for this row (use absolute position, not page-relative)
            const absPos = (curPage * rpp) + i + 1; // 1-based absolute rank
            const total = t.standings.length;
            const zTop = t.zoneTop || 0;
            const zEur = t.zoneEuropa || 0;
            const zBot = t.zoneBottom || 0;
            let zoneBorder = '';
            let zoneBg = '';
            if (zTop > 0 && absPos <= zTop) {
                zoneBorder = 'border-l-[6px] border-l-blue-500';
                zoneBg = 'bg-blue-500/10';
            } else if (zEur > 0 && absPos <= zTop + zEur) {
                zoneBorder = 'border-l-[6px] border-l-orange-400';
                zoneBg = 'bg-orange-400/10';
            } else if (zBot > 0 && absPos > total - zBot) {
                zoneBorder = 'border-l-[6px] border-l-red-500';
                zoneBg = 'bg-red-500/10';
            }
            return `
                <div class="card-row sg-grid px-5 py-4 rounded-xl ${i % 2 === 0 ? theme.odd : theme.even} ${zoneBorder} ${rowAnim}"
                    style="animation-delay:${(i * stagger).toFixed(2)}s; --anim-dur:${dur}s">
                    <span class="text-[42px] font-black font-oswald text-center ${theme.accent}">${row.pos}</span>
                    <div class="flex items-center gap-3 pl-2 overflow-hidden">
                        ${(() => {
                    if (!row.logo) return '<div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-[18px] font-bold flex-shrink-0">' + row.name.charAt(0) + '</div>';
                    // Encode URL segments to handle spaces in filenames
                    const encodedSrc = row.logo.startsWith('data:')
                        ? row.logo
                        : row.logo.split('/').map(s => encodeURIComponent(s)).join('/');
                    return '<img src="' + encodedSrc + '" class="w-14 h-14 object-contain flex-shrink-0" onerror="this.style.display=\'none\'">';
                })()}
                        <span class="text-[34px] font-bold font-oswald uppercase truncate">${row.name}</span>
                    </div>
                    <span class="text-[30px] text-center font-roboto">${row.mp}</span>
                    <span class="text-[30px] text-center font-roboto text-green-400">${row.w}</span>
                    <span class="text-[30px] text-center font-roboto text-yellow-400">${row.d}</span>
                    <span class="text-[30px] text-center font-roboto text-red-400">${row.l}</span>
                    <span class="text-[26px] text-center font-roboto">${row.gf ?? 0}</span>
                    <span class="text-[26px] text-center font-roboto">${row.ga ?? 0}</span>
                    <span class="text-[26px] text-center font-roboto ${(row.gd ?? 0) > 0 ? 'text-green-300' : (row.gd ?? 0) < 0 ? 'text-red-300' : ''}">${(row.gd ?? 0) > 0 ? '+' : ''}${row.gd ?? 0}</span>
                    <span class="text-[42px] font-black text-center ${theme.accent} font-oswald">${row.pts}</span>
                </div>`;
        }).join('')}
            </div>
            ${totalPages > 1 ? `
            <div class="mt-6 flex items-center justify-between px-4">
                <button onclick="window.FootballModule.goToPage(${curPage - 1})" ${curPage === 0 ? 'disabled' : ''}
                    class="bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white text-[28px] font-bold px-6 py-3 rounded-full transition">&#x2039; Prev</button>
                <div class="flex flex-col items-center gap-2">
                    <div class="flex gap-3">${dots}</div>
                    <span class="text-[24px] text-white/60 font-roboto">Hal ${curPage + 1} / ${totalPages}</span>
                </div>
                <button onclick="window.FootballModule.goToPage(${curPage + 1})" ${curPage >= totalPages - 1 ? 'disabled' : ''}
                    class="bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white text-[28px] font-bold px-6 py-3 rounded-full transition">Next &#x203a;</button>
            </div>` : ''}`;

        if (t.animLoop && totalPages > 1) this.startPageLoop();
    },

    goToPage(page) {
        const total = Math.ceil(this.data.standings.length / this.ROWS_PER_PAGE);
        this.data.standingsPage = Math.max(0, Math.min(page, total - 1));
        this.stopPageLoop();
        this.renderView();
        if (this.data.animLoop) this.startPageLoop();
    },

    _renderSchedule(view, themeObj) {
        const t = this.data;
        const theme = this.THEMES[t.theme] || this.THEMES['yellow'];
        if (!t.schedule.length) {
            view.innerHTML = `<div class="h-full flex flex-col items-center justify-center opacity-40">
                <i class="fas fa-calendar text-[120px] mb-6"></i>
                <p class="text-[48px] font-bold uppercase">Jadwal Kosong</p>
                <p class="text-[32px] mt-2">Gunakan ✨ Magic Paste</p>
            </div>`; return;
        }

        const style = t.scheduleCardStyle || 'broadcast';

        // Group by date
        const grouped = {};
        t.schedule.forEach(m => {
            const key = m.date || 'Tanpa Tanggal';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(m);
        });

        const renderLogo = (url) => {
            if (!url) return '<div class="w-[80px] h-[80px] rounded-full bg-white/10 flex-shrink-0"></div>';
            const encoded = url.startsWith('data:') ? url : url.split('/').map(s => encodeURIComponent(s)).join('/');
            return `<img src="${encoded}" class="w-[80px] h-[80px] object-contain flex-shrink-0" onerror="this.style.display='none'">`;
        };

        view.innerHTML = Object.entries(grouped).map(([date, matches]) => `
            <div class="mb-8 text-center">
                <div class="inline-block ${theme.header} px-6 py-2 rounded-lg text-[28px] font-oswald font-black uppercase mb-4 tracking-wide shadow-lg border-2 border-white/20">${date}</div>
                ${matches.map((m, i) => {
            let cardClasses = '';
            let innerHtml = '';

            const timeInfo = m.time ? `<div class="bg-black/60 text-white px-5 py-2 rounded-md font-roboto text-[26px] font-bold tracking-wider">${m.time}</div>` : '';
            const venueInfo = m.venue ? `<p class="text-[26px] text-gray-300 flex items-center gap-2"><i class="fas fa-map-marker-alt text-yellow-400"></i>${m.venue}</p>` : '';
            const channelInfo = m.channel ? `<p class="text-[26px] text-gray-300 flex items-center gap-2"><i class="fas fa-tv text-blue-400"></i>${m.channel}</p>` : '';
            const extraInfo = (venueInfo || channelInfo) ? `<div class="mt-4 pt-3 border-t border-white/10 flex justify-center gap-8">${venueInfo}${channelInfo}</div>` : '';

            if (style === 'broadcast') {
                cardClasses = 'bg-gradient-to-r from-blue-900/90 via-blue-800/90 to-blue-900/90 border-l-8 border-yellow-400 shadow-[0_8px_32px_rgba(0,0,0,0.5)]';
                innerHtml = `
                            <div class="flex items-center justify-between gap-6 px-4">
                                <div class="flex-1 flex items-center justify-end gap-5">
                                    <span class="text-[44px] font-black font-oswald text-right uppercase tracking-wide drop-shadow-md text-white">${m.home}</span>
                                    ${renderLogo(m.homeLogo)}
                                </div>
                                <div class="flex flex-col items-center w-[180px]">
                                    <div class="bg-yellow-400 text-black font-black text-[32px] italic px-6 py-1.5 rounded-sm shadow-md rotate-[-3deg] transform -translate-y-2 mb-3">VS</div>
                                    ${timeInfo}
                                </div>
                                <div class="flex-1 flex items-center justify-start gap-5">
                                    ${renderLogo(m.awayLogo)}
                                    <span class="text-[44px] font-black font-oswald uppercase tracking-wide drop-shadow-md text-white">${m.away}</span>
                                </div>
                            </div>
                            ${extraInfo}
                        `;
            } else if (style === 'tournament') {
                cardClasses = 'bg-transparent p-0 mb-8 !overflow-visible';
                innerHtml = `
                            <div class="relative w-[104%] -mx-[2%] h-[140px] flex items-center justify-center">
                                <!-- Base Ribbon Shape -->
                                <div class="absolute inset-0 bg-gradient-to-b from-[#e0e0e0] to-[#b0b0b0]" 
                                     style="clip-path: polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%); shadow-[0_10px_20px_rgba(0,0,0,0.5)]"></div>
                                
                                <!-- Inner Ribbon Shadow/Border -->
                                <div class="absolute inset-1 bg-gradient-to-b from-white to-[#d0d0d0]" 
                                     style="clip-path: polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%);"></div>

                                <!-- Left Team -->
                                <div class="absolute inset-y-0 left-0 w-1/2 flex items-center justify-end pl-[140px] pr-[100px] gap-4">
                                    <span class="text-[36px] font-black font-oswald text-[#2c3e50] uppercase tracking-wider drop-shadow-sm leading-[1.1] text-right">${m.home}</span>
                                </div>
                                <!-- Right Team -->
                                <div class="absolute inset-y-0 right-0 w-1/2 flex items-center justify-start pr-[140px] pl-[100px] gap-4">
                                    <span class="text-[36px] font-black font-oswald text-[#2c3e50] uppercase tracking-wider drop-shadow-sm leading-[1.1] text-left">${m.away}</span>
                                </div>

                                <!-- Center VS Circle -->
                                <div class="absolute z-10 w-[90px] h-[90px] rounded-full bg-gradient-to-b from-[#e74c3c] to-[#c0392b] border-[4px] border-white shadow-lg flex items-center justify-center">
                                    <span class="text-white font-black text-[38px] font-oswald">VS</span>
                                </div>

                                <!-- Logos (Floating outside slightly) -->
                                <div class="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-[120px] h-[120px] rounded-full bg-white shadow-xl p-2 flex items-center justify-center border-2 border-gray-200">${renderLogo(m.homeLogo).replace('w-[80px]', 'w-full').replace('h-[80px]', 'h-full ')}</div>
                                <div class="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-[120px] h-[120px] rounded-full bg-white shadow-xl p-2 flex items-center justify-center border-2 border-gray-200">${renderLogo(m.awayLogo).replace('w-[80px]', 'w-full').replace('h-[80px]', 'h-full ')}</div>
                            </div>
                            
                            <!-- Bottom Info Ribbon -->
                            <div class="relative w-[75%] mx-auto h-[60px] -mt-5 z-0 flex items-center justify-center">
                                <div class="absolute inset-0 bg-gradient-to-b from-[#8a2a2a] to-[#5c1c1c]" 
                                     style="clip-path: polygon(3% 0, 97% 0, 100% 100%, 0 100%);"></div>
                                <div class="relative z-10 text-white font-bold font-roboto text-[22px] tracking-wide text-center pt-2">
                                    ${m.time ? `Pukul ${m.time} WIB` : ''}${m.time && m.venue ? ' &nbsp;|&nbsp; ' : ''}${m.venue ? m.venue : ''}${(!m.time && !m.venue && m.channel) ? m.channel : (m.channel ? ' &nbsp;-&nbsp; ' + m.channel : '')}
                                </div>
                            </div>
                        `;
            } else if (style === 'glass') {
                cardClasses = 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl';
                innerHtml = `
                            <div class="flex items-center justify-between gap-6 px-4">
                                <div class="flex-1 flex items-center justify-end gap-5">
                                    <span class="text-[42px] font-bold font-oswald text-right uppercase drop-shadow-lg text-white">${m.home}</span>
                                    ${renderLogo(m.homeLogo)}
                                </div>
                                <div class="flex flex-col items-center w-[160px]">
                                    <div class="text-white/60 font-black text-[40px] font-oswald mb-2">VS</div>
                                    ${timeInfo}
                                </div>
                                <div class="flex-1 flex items-center justify-start gap-5">
                                    ${renderLogo(m.awayLogo)}
                                    <span class="text-[42px] font-bold font-oswald uppercase drop-shadow-lg text-white">${m.away}</span>
                                </div>
                            </div>
                            ${extraInfo}
                        `;
            } else if (style === 'gradient') {
                cardClasses = 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border border-purple-500/30 shadow-lg';
                innerHtml = `
                            <div class="flex items-center justify-between gap-6 px-4">
                                <div class="flex-1 flex items-center justify-end gap-5">
                                    <span class="text-[40px] font-bold font-oswald text-right uppercase text-purple-100">${m.home}</span>
                                    ${renderLogo(m.homeLogo)}
                                </div>
                                <div class="flex flex-col items-center w-[160px] bg-black/30 py-3 px-2 rounded-2xl border border-white/5">
                                    <div class="text-purple-300 font-bold text-[34px] mb-1">VS</div>
                                    ${timeInfo}
                                </div>
                                <div class="flex-1 flex items-center justify-start gap-5">
                                    ${renderLogo(m.awayLogo)}
                                    <span class="text-[40px] font-bold font-oswald uppercase text-purple-100">${m.away}</span>
                                </div>
                            </div>
                            ${extraInfo}
                        `;
            } else if (style === 'dark') {
                cardClasses = 'bg-gray-900 border border-gray-700 shadow-lg';
                innerHtml = `
                            <div class="flex items-center justify-between gap-6 px-4">
                                <div class="flex-1 flex items-center justify-end gap-5">
                                    <span class="text-[40px] font-bold font-oswald text-right uppercase text-gray-200">${m.home}</span>
                                    ${renderLogo(m.homeLogo)}
                                </div>
                                <div class="flex flex-col items-center w-[160px]">
                                    <div class="text-gray-500 font-bold text-[36px] mb-2">VS</div>
                                    ${timeInfo}
                                </div>
                                <div class="flex-1 flex items-center justify-start gap-5">
                                    ${renderLogo(m.awayLogo)}
                                    <span class="text-[40px] font-bold font-oswald uppercase text-gray-200">${m.away}</span>
                                </div>
                            </div>
                            ${extraInfo}
                        `;
            } else if (style === 'neon') {
                cardClasses = 'bg-black border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
                innerHtml = `
                            <div class="flex items-center justify-between gap-6 px-4">
                                <div class="flex-1 flex items-center justify-end gap-5">
                                    <span class="text-[42px] font-bold font-oswald text-right uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">${m.home}</span>
                                    ${renderLogo(m.homeLogo)}
                                </div>
                                <div class="flex flex-col items-center w-[160px]">
                                    <div class="text-green-400 font-black text-[42px] font-oswald italic mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">VS</div>
                                    <div class="text-white border border-green-500/50 px-4 py-1.5 rounded font-mono text-[28px] shadow-[inset_0_0_10px_rgba(34,197,94,0.2)]">${m.time || '--:--'}</div>
                                </div>
                                <div class="flex-1 flex items-center justify-start gap-5">
                                    ${renderLogo(m.awayLogo)}
                                    <span class="text-[42px] font-bold font-oswald uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">${m.away}</span>
                                </div>
                            </div>
                            ${extraInfo}
                        `;
            } else if (style === 'minimal') {
                cardClasses = 'bg-transparent border-b border-white/20 pb-4 mb-6 rounded-none';
                innerHtml = `
                            <div class="flex items-center justify-between gap-6 px-4">
                                <div class="flex-1 flex flex-col items-end">
                                    <span class="text-[38px] font-normal font-oswald text-right uppercase tracking-wider text-white">${m.home}</span>
                                </div>
                                <div class="flex flex-col items-center w-[120px]">
                                    ${m.time ? `<div class="text-white font-bold text-[32px] tracking-widest">${m.time}</div>` : ''}
                                </div>
                                <div class="flex-1 flex flex-col items-start">
                                    <span class="text-[38px] font-normal font-oswald uppercase tracking-wider text-white">${m.away}</span>
                                </div>
                            </div>
                            ${extraInfo}
                        `;
            } else if (style === 'hexagon') {
                cardClasses = 'bg-gray-900 border-2 border-yellow-500/30 p-0 mb-8 relative !overflow-visible shadow-[0_0_20px_rgba(0,0,0,0.5)]';
                innerHtml = `
                            <div class="absolute inset-0 bg-black/40" style="clip-path: polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)"></div>
                            <div class="flex items-center justify-between gap-6 px-4 py-6 relative z-10 w-full">
                                <div class="flex-1 flex items-center justify-end gap-5 pl-8">
                                    <span class="text-[40px] font-bold font-oswald text-right uppercase text-white tracking-widest">${m.home}</span>
                                    ${renderLogo(m.homeLogo)}
                                </div>
                                <div class="flex flex-col items-center w-[180px] relative">
                                    <!-- Hexagon VS -->
                                    <div class="relative w-[80px] h-[90px] bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(234,179,8,0.4)] z-20" style="clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)">
                                        <span class="text-black font-black text-[34px] font-oswald mt-1">VS</span>
                                    </div>
                                    ${timeInfo}
                                </div>
                                <div class="flex-1 flex items-center justify-start gap-5 pr-8">
                                    ${renderLogo(m.awayLogo)}
                                    <span class="text-[40px] font-bold font-oswald uppercase text-white tracking-widest">${m.away}</span>
                                </div>
                            </div>
                            ${extraInfo}
                        `;
            } else if (style === 'elegant') {
                cardClasses = 'bg-transparent border-t border-b border-white/30 p-0 mb-8 rounded-none';
                innerHtml = `
                            <div class="flex items-center justify-between gap-8 py-8 px-2">
                                <div class="flex-1 flex flex-col items-center">
                                    ${renderLogo(m.homeLogo).replace('w-[80px]', 'w-[100px]').replace('h-[80px]', 'h-[100px] mb-4')}
                                    <span class="text-[36px] font-light font-oswald text-center uppercase tracking-[0.2em] text-white">${m.home}</span>
                                </div>
                                <div class="flex flex-col items-center px-8 border-l border-r border-white/20">
                                    <span class="text-[28px] text-yellow-500 font-serif italic mb-2">versus</span>
                                    ${timeInfo}
                                    ${m.date ? `<span class="mt-3 text-[20px] tracking-widest text-gray-300 uppercase">${m.date}</span>` : ''}
                                </div>
                                <div class="flex-1 flex flex-col items-center">
                                    ${renderLogo(m.awayLogo).replace('w-[80px]', 'w-[100px]').replace('h-[80px]', 'h-[100px] mb-4')}
                                    <span class="text-[36px] font-light font-oswald text-center uppercase tracking-[0.2em] text-white">${m.away}</span>
                                </div>
                            </div>
                            ${extraInfo}
                        `;
            } else if (style === 'gaming') {
                cardClasses = 'bg-gradient-to-r from-red-900/80 via-black to-blue-900/80 border-b-4 border-red-500 shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-0 mb-8 skew-x-[-5deg]';
                innerHtml = `
                            <div class="skew-x-[5deg] flex items-center justify-between gap-6 px-6 py-5">
                                <div class="flex-1 flex items-center justify-end gap-6 bg-gradient-to-r from-transparent to-red-600/20 py-3 pr-6 rounded-r-3xl border-r-2 border-red-500/50">
                                    <span class="text-[46px] font-black font-oswald text-right uppercase text-white drop-shadow-[2px_2px_0_theme(colors.red.600)] italic">${m.home}</span>
                                    ${renderLogo(m.homeLogo)}
                                </div>
                                <div class="flex flex-col items-center w-[160px]">
                                    <div class="px-6 py-2 bg-black border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-3 transform -skew-x-[10deg]">
                                        <span class="text-white font-black text-[30px] font-oswald italic">VS</span>
                                    </div>
                                    ${timeInfo}
                                </div>
                                <div class="flex-1 flex items-center justify-start gap-6 bg-gradient-to-l from-transparent to-blue-600/20 py-3 pl-6 rounded-l-3xl border-l-2 border-blue-500/50">
                                    ${renderLogo(m.awayLogo)}
                                    <span class="text-[46px] font-black font-oswald uppercase text-white drop-shadow-[2px_2px_0_theme(colors.blue.600)] italic">${m.away}</span>
                                </div>
                            </div>
                            ${extraInfo}
                        `;
            } else if (style === 'v3') {
                cardClasses = 'bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-2xl mb-4 text-center';
                innerHtml = `
                            <div class="text-center mb-3">
                                <span class="bg-black/80 text-white px-4 py-1.5 text-[22px] font-bold tracking-widest rounded border border-white/30 drop-shadow-md">${m.date || 'PERTANDINGAN'}</span>
                            </div>
                            <div class="flex items-center justify-between mb-2 px-2">
                                <div class="flex-1 flex flex-col items-center text-center">
                                    <div class="w-[140px] h-[140px] mx-auto rounded-full bg-blue-900/40 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-white mb-2 flex items-center justify-center overflow-hidden p-2">
                                        ${renderLogo(m.homeLogo).replace('w-[80px]', 'w-full').replace('h-[80px]', 'h-full ')}
                                    </div>
                                    <h2 class="font-oswald font-bold text-[36px] leading-tight uppercase truncate w-[220px] drop-shadow-lg text-white mx-auto">${m.home}</h2>
                                </div>
                                <div class="mx-2 flex flex-col items-center justify-center gap-2">
                                    ${m.time ? `<div class="text-[58px] font-oswald font-black text-yellow-400 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">${m.time}</div>` : `<div class="text-[50px] font-oswald font-black text-yellow-400 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">VS</div>`}
                                    <div class="text-gray-300 font-bold text-[28px] px-5 py-1.5 border-2 border-white/20 rounded-full bg-black/60 shadow-inner">VS</div>
                                </div>
                                <div class="flex-1 flex flex-col items-center text-center">
                                    <div class="w-[140px] h-[140px] mx-auto rounded-full bg-red-900/40 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-white mb-2 flex items-center justify-center overflow-hidden p-2">
                                        ${renderLogo(m.awayLogo).replace('w-[80px]', 'w-full').replace('h-[80px]', 'h-full ')}
                                    </div>
                                    <h2 class="font-oswald font-bold text-[36px] leading-tight uppercase truncate w-[220px] drop-shadow-lg text-white mx-auto">${m.away}</h2>
                                </div>
                            </div>
                            ${extraInfo}
                        `;
            } else { // Classic
                cardClasses = `${theme.odd} shadow-sm`;
                innerHtml = `
                            <div class="flex items-center justify-between gap-4">
                                <span class="flex-1 text-[38px] font-bold font-oswald text-right uppercase">${m.home}</span>
                                <div class="flex flex-col items-center mx-4">
                                    <span class="bg-yellow-500 text-black font-bold text-[38px] px-5 py-2 rounded-lg">VS</span>
                                    ${m.time ? `<span class="text-[32px] text-gray-300 mt-2">${m.time}</span>` : ''}
                                </div>
                                <span class="flex-1 text-[38px] font-bold font-oswald uppercase">${m.away}</span>
                            </div>
                            ${extraInfo}
                        `;
            }

            return `
                    <div class="card-row rounded-3xl p-5 mb-8 ${cardClasses} ${t.animation}"
                        style="animation-delay:${(i * t.animStagger).toFixed(2)}s; --anim-dur:${t.animDuration}s">
                        ${innerHtml}
                    </div>`;

        }).join('')}
            </div>`).join('');
    },

    _renderResults(view, themeObj) {
        const t = this.data;
        const theme = this.THEMES[t.theme] || this.THEMES['yellow'];
        if (!t.results.length) {
            view.innerHTML = `<div class="h-full flex flex-col items-center justify-center opacity-40">
                <i class="fas fa-futbol text-[120px] mb-6"></i>
                <p class="text-[48px] font-bold uppercase">Hasil Kosong</p>
                <p class="text-[32px] mt-2">Gunakan ✨ Magic Paste</p>
            </div>`; return;
        }

        const style = t.scheduleCardStyle || 'broadcast';

        const renderLogo = (url) => {
            if (!url) return '<div class="w-[80px] h-[80px] rounded-full bg-white/10 flex-shrink-0"></div>';
            const encoded = url.startsWith('data:') ? url : url.split('/').map(s => encodeURIComponent(s)).join('/');
            return `<img src="${encoded}" class="w-[80px] h-[80px] object-contain flex-shrink-0" onerror="this.style.display='none'">`;
        };

        view.innerHTML = `<div class="mb-8 space-y-4">
            ${t.results.slice((t.resultsPage || 0) * this.RESULTS_PER_PAGE, ((t.resultsPage || 0) + 1) * this.RESULTS_PER_PAGE).map((m, idx) => {
            const i = ((t.resultsPage || 0) * this.RESULTS_PER_PAGE) + idx;
            let cardClasses = '';
            let innerHtml = '';

            const scoreBox = `<div class="flex items-center gap-3 bg-black/50 rounded-xl px-5 py-2 shadow-inner border border-white/10">
                    <span class="text-[54px] font-black font-oswald text-white leading-none">${m.homeScore}</span>
                    <span class="text-[38px] text-gray-400 font-bold">-</span>
                    <span class="text-[54px] font-black font-oswald text-white leading-none">${m.awayScore}</span>
                </div>`;

            const dateInfo = m.date ? `<p class="text-[32px] font-bold text-white text-center mt-6 drop-shadow-lg"><i class="fas fa-calendar-alt text-yellow-400 mr-2"></i>${m.date}</p>` : '';

            let scorersHtml = '';
            if (m.homeScorers || m.awayScorers) {
                const hsLines = (m.homeScorers || '').split('\\n').filter(Boolean);
                const asLines = (m.awayScorers || '').split('\\n').filter(Boolean);

                const renderPills = (lines) => lines.map(l => `<div class="bg-white/95 backdrop-blur-md text-gray-900 border border-gray-200 font-extrabold text-[26px] px-6 py-2.5 rounded-full mb-3 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 w-full max-w-[340px] truncate"><span class="truncate">${l}</span></div>`).join('');

                scorersHtml = `
                    <div class="flex justify-between gap-4 mt-6 px-4 w-full relative z-10">
                        <div class="flex-1 flex flex-col items-center">${renderPills(hsLines)}</div>
                        <div class="w-[80px]"></div> <!-- gap for center -->
                        <div class="flex-1 flex flex-col items-center">${renderPills(asLines)}</div>
                    </div>
                `;
            }

            let statsHtml = '';
            if (m.stats && m.stats.length > 0) {
                statsHtml = `
                    <div class="bg-slate-900/60 backdrop-blur rounded-lg p-6 border border-white/10 mt-8 mx-auto w-[98%] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <h3 class="text-center text-[22px] font-bold text-white tracking-[0.3em] font-oswald uppercase mb-8 pb-2">MATCH STATS</h3>
                        <div class="space-y-6">
                            ${m.stats.map(s => {
                    const hVal = parseFloat(s.home) || 0;
                    const aVal = parseFloat(s.away) || 0;
                    const total = hVal + aVal;
                    const homePct = total === 0 ? 50 : Math.round((hVal / total) * 100);
                    const awayPct = total === 0 ? 50 : Math.round((aVal / total) * 100);

                    if (s.isCard || s.name.toLowerCase().includes('card')) {
                        const isRed = s.name.toLowerCase().includes('red');
                        const cardColorClass = isRed ? 'bg-red-600' : 'bg-yellow-400';
                        return `
                                        <div class="flex justify-between items-center text-white mt-12 px-2 border-t border-white/10 pt-8">
                                             <div class="flex flex-col items-center">
                                                <div class="w-10 h-12 ${cardColorClass} rounded-sm shadow-md mb-2"></div>
                                                <span class="font-bold text-[28px] font-oswald text-white">${s.home}</span>
                                                <span class="text-[14px] text-green-400 font-bold uppercase tracking-widest">${s.name.replace(/s$/i, '')}</span>
                                             </div>
                                             <div class="flex flex-col items-center">
                                                <div class="w-10 h-12 ${cardColorClass} rounded-sm shadow-md mb-2"></div>
                                                <span class="font-bold text-[28px] font-oswald text-white">${s.away}</span>
                                                <span class="text-[14px] text-green-400 font-bold uppercase tracking-widest">${s.name.replace(/s$/i, '')}</span>
                                             </div>
                                        </div>`;
                    }

                    const isPossession = s.name.toLowerCase().includes('possession');
                    const homeStr = isPossession ? `${s.home}<span class="text-[20px] ml-0.5">%</span>` : s.home;
                    const awayStr = isPossession ? `${s.away}<span class="text-[20px] ml-0.5">%</span>` : s.away;

                    return `
                                    <div class="mb-5 px-2">
                                        <div class="flex justify-between items-end mb-2">
                                            <span class="text-[40px] font-black font-oswald ${hVal >= aVal ? 'text-white' : 'text-gray-400'} leading-none">${homeStr}</span>
                                            <span class="text-[16px] font-bold text-green-400 uppercase tracking-[0.2em] mb-1">${s.name}</span>
                                            <span class="text-[40px] font-black font-oswald ${aVal >= hVal ? 'text-white' : 'text-gray-400'} leading-none">${awayStr}</span>
                                        </div>
                                        <div class="flex w-full h-5 rounded-sm overflow-hidden mb-1 shadow-inner bg-gray-800">
                                            <div class="bg-blue-600 h-full transition-all duration-1000" style="width: ${homePct}%;"></div>
                                            <div class="bg-red-600 h-full transition-all duration-1000 border-l border-white/20" style="width: ${awayPct}%;"></div>
                                        </div>
                                    </div>`;
                }).join('')}
                        </div>
                    </div>
                `;
            }

            if (style === 'broadcast') {
                cardClasses = 'bg-gradient-to-r from-blue-900/90 via-blue-800/90 to-blue-900/90 border-l-8 border-green-500 shadow-[0_8px_32px_rgba(0,0,0,0.5)]';
                innerHtml = `
                        <div class="flex items-center justify-between gap-6 px-4">
                            <div class="flex-1 flex items-center justify-end gap-5">
                                <span class="text-[44px] font-black font-oswald text-right uppercase tracking-wide drop-shadow-md text-white">${m.home}</span>
                                ${renderLogo(m.homeLogo)}
                            </div>
                            <div class="flex flex-col items-center min-w-[180px]">
                                ${scoreBox}
                            </div>
                            <div class="flex-1 flex items-center justify-start gap-5">
                                ${renderLogo(m.awayLogo)}
                                <span class="text-[44px] font-black font-oswald uppercase tracking-wide drop-shadow-md text-white">${m.away}</span>
                            </div>
                        </div>
                        ${dateInfo}
                    `;
            } else if (style === 'tournament') {
                cardClasses = 'bg-transparent p-0 mb-8 !overflow-visible';
                innerHtml = `
                            <div class="relative w-[104%] -mx-[2%] h-[140px] flex items-center justify-center">
                                <!-- Base Ribbon Shape -->
                                <div class="absolute inset-0 bg-gradient-to-b from-[#e0e0e0] to-[#b0b0b0]" 
                                     style="clip-path: polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%); shadow-[0_10px_20px_rgba(0,0,0,0.5)]"></div>
                                
                                <div class="absolute inset-1 bg-gradient-to-b from-white to-[#d0d0d0]" 
                                     style="clip-path: polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%);"></div>

                                <!-- Left Team -->
                                <div class="absolute inset-y-0 left-0 w-1/2 flex items-center justify-end pl-[140px] pr-[120px] gap-4">
                                    <span class="text-[36px] font-black font-oswald text-[#2c3e50] uppercase tracking-wider drop-shadow-sm leading-[1.1] text-right">${m.home}</span>
                                </div>
                                <!-- Right Team -->
                                <div class="absolute inset-y-0 right-0 w-1/2 flex items-center justify-start pr-[140px] pl-[120px] gap-4">
                                    <span class="text-[36px] font-black font-oswald text-[#2c3e50] uppercase tracking-wider drop-shadow-sm leading-[1.1] text-left">${m.away}</span>
                                </div>

                                <!-- Center Score Box -->
                                <div class="absolute z-10 px-5 py-2 bg-gradient-to-b from-[#e74c3c] to-[#c0392b] border-[3px] border-white shadow-lg flex items-center justify-center gap-3 rounded-xl">
                                    <span class="text-white font-black text-[42px] font-oswald leading-none">${m.homeScore}</span>
                                    <span class="text-white/60 font-bold text-[32px] leading-none">-</span>
                                    <span class="text-white font-black text-[42px] font-oswald leading-none">${m.awayScore}</span>
                                </div>

                                <!-- Logos -->
                                <div class="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-[120px] h-[120px] rounded-full bg-white shadow-xl p-1.5 border-2 border-gray-200">
                                    <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                                        ${renderLogo(m.homeLogo).replace('w-[80px]', 'w-full').replace('h-[80px]', 'h-full ')}
                                    </div>
                                </div>
                                <div class="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-[120px] h-[120px] rounded-full bg-white shadow-xl p-1.5 border-2 border-gray-200">
                                    <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                                        ${renderLogo(m.awayLogo).replace('w-[80px]', 'w-full').replace('h-[80px]', 'h-full ')}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Bottom Info Ribbon -->
                            ${m.date ? `<div class="relative w-[60%] mx-auto h-[50px] -mt-5 z-0 flex items-center justify-center">
                                <div class="absolute inset-0 bg-gradient-to-b from-[#8a2a2a] to-[#5c1c1c]" style="clip-path: polygon(5% 0, 95% 0, 100% 100%, 0 100%);"></div>
                                <div class="relative z-10 text-white font-bold font-roboto text-[22px] tracking-wide text-center pt-2">${m.date}</div>
                            </div>` : ''}
                        `;
            } else if (style === 'glass') {
                cardClasses = 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl';
                innerHtml = `
                        <div class="flex items-center justify-between gap-6 px-4">
                            <div class="flex-1 flex items-center justify-end gap-5">
                                <span class="text-[42px] font-bold font-oswald text-right uppercase drop-shadow-lg text-white">${m.home}</span>
                                ${renderLogo(m.homeLogo)}
                            </div>
                            <div class="flex flex-col items-center min-w-[160px]">
                                ${scoreBox}
                            </div>
                            <div class="flex-1 flex items-center justify-start gap-5">
                                ${renderLogo(m.awayLogo)}
                                <span class="text-[42px] font-bold font-oswald uppercase drop-shadow-lg text-white">${m.away}</span>
                            </div>
                        </div>
                        ${dateInfo}
                    `;
            } else if (style === 'gradient') {
                cardClasses = 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border border-purple-500/30 shadow-lg';
                innerHtml = `
                        <div class="flex items-center justify-between gap-6 px-4">
                            <div class="flex-1 flex items-center justify-end gap-5">
                                <span class="text-[40px] font-bold font-oswald text-right uppercase text-purple-100">${m.home}</span>
                                ${renderLogo(m.homeLogo)}
                            </div>
                            <div class="flex flex-col items-center min-w-[160px] bg-black/30 p-2 rounded-2xl border border-white/5">
                                ${scoreBox}
                            </div>
                            <div class="flex-1 flex items-center justify-start gap-5">
                                ${renderLogo(m.awayLogo)}
                                <span class="text-[40px] font-bold font-oswald uppercase text-purple-100">${m.away}</span>
                            </div>
                        </div>
                        ${dateInfo}
                    `;
            } else if (style === 'neon') {
                cardClasses = 'bg-black border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
                innerHtml = `
                        <div class="flex items-center justify-between gap-6 px-4">
                            <div class="flex-1 flex items-center justify-end gap-5">
                                <span class="text-[42px] font-bold font-oswald text-right uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">${m.home}</span>
                                ${renderLogo(m.homeLogo)}
                            </div>
                            <div class="flex flex-col items-center min-w-[160px]">
                                <div class="flex items-center gap-3 bg-black rounded-lg px-4 py-2 border border-green-500/50 shadow-[inset_0_0_15px_rgba(34,197,94,0.2)]">
                                    <span class="text-[50px] font-black text-green-400 font-mono shadow-green-500 drop-shadow">${m.homeScore}</span>
                                    <span class="text-[34px] text-green-600 font-bold">-</span>
                                    <span class="text-[50px] font-black text-green-400 font-mono shadow-green-500 drop-shadow">${m.awayScore}</span>
                                </div>
                            </div>
                            <div class="flex-1 flex items-center justify-start gap-5">
                                ${renderLogo(m.awayLogo)}
                                <span class="text-[42px] font-bold font-oswald uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">${m.away}</span>
                            </div>
                        </div>
                        ${dateInfo}
                    `;
            } else if (style === 'dark') {
                cardClasses = 'bg-gray-900 border border-gray-700 shadow-lg';
                innerHtml = `
                        <div class="flex items-center justify-between gap-6 px-4">
                            <div class="flex-1 flex items-center justify-end gap-5">
                                <span class="text-[40px] font-bold font-oswald text-right uppercase text-gray-200">${m.home}</span>
                                ${renderLogo(m.homeLogo)}
                            </div>
                            <div class="flex flex-col items-center min-w-[160px]">
                                ${scoreBox}
                            </div>
                            <div class="flex-1 flex items-center justify-start gap-5">
                                ${renderLogo(m.awayLogo)}
                                <span class="text-[40px] font-bold font-oswald uppercase text-gray-200">${m.away}</span>
                            </div>
                        </div>
                        ${dateInfo}
                    `;
            } else if (style === 'minimal') {
                cardClasses = 'bg-transparent border-b border-white/20 pb-4 rounded-none';
                innerHtml = `
                        <div class="flex items-center justify-between gap-6 px-4">
                            <div class="flex-1 flex flex-col items-end">
                                <span class="text-[38px] font-normal font-oswald text-right uppercase tracking-wider text-white">${m.home}</span>
                            </div>
                            <div class="flex flex-col items-center min-w-[120px]">
                                <div class="text-[48px] font-black font-oswald text-white tracking-widest">${m.homeScore} <span class="text-white/40 text-[36px] mx-1">-</span> ${m.awayScore}</div>
                            </div>
                            <div class="flex-1 flex flex-col items-start">
                                <span class="text-[38px] font-normal font-oswald uppercase tracking-wider text-white">${m.away}</span>
                            </div>
                        </div>
                        ${dateInfo}
                    `;
            } else if (style === 'hexagon') {
                cardClasses = 'bg-gray-900 border-2 border-green-500/30 p-0 mb-8 relative !overflow-visible shadow-[0_0_20px_rgba(0,0,0,0.5)]';
                innerHtml = `
                        <div class="absolute inset-0 bg-black/40" style="clip-path: polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)"></div>
                        <div class="flex items-center justify-between gap-6 px-4 py-6 relative z-10 w-full">
                            <div class="flex-1 flex items-center justify-end gap-5 pl-8">
                                <span class="text-[40px] font-bold font-oswald text-right uppercase text-white tracking-widest">${m.home}</span>
                                ${renderLogo(m.homeLogo)}
                            </div>
                            <div class="flex flex-col items-center w-[200px] relative">
                                <!-- Hexagon Score -->
                                <div class="relative w-[140px] h-[90px] bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] z-20" style="clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)">
                                    <span class="text-black font-black text-[46px] font-oswald mt-1 px-4">${m.homeScore} <span class="text-black/50 text-[36px] mx-1">-</span> ${m.awayScore}</span>
                                </div>
                            </div>
                            <div class="flex-1 flex items-center justify-start gap-5 pr-8">
                                ${renderLogo(m.awayLogo)}
                                <span class="text-[40px] font-bold font-oswald uppercase text-white tracking-widest">${m.away}</span>
                            </div>
                        </div>
                        ${dateInfo}
                    `;
            } else if (style === 'elegant') {
                cardClasses = 'bg-transparent border-t border-b border-white/30 p-0 mb-8 rounded-none';
                innerHtml = `
                    <div class="flex items-center justify-between gap-8 py-8 px-2">
                        <div class="flex-1 flex flex-col items-center">
                            ${renderLogo(m.homeLogo).replace('w-[80px]', 'w-[100px]').replace('h-[80px]', 'h-[100px] mb-4')}
                            <span class="text-[36px] font-light font-oswald text-center uppercase tracking-[0.2em] text-white">${m.home}</span>
                        </div>
                        <div class="flex flex-col items-center px-8 border-l border-r border-white/20 min-w-[200px]">
                            <span class="text-[64px] font-black font-serif text-white leading-none">${m.homeScore} <span class="text-[42px] text-gray-500 mx-2">-</span> ${m.awayScore}</span>
                            ${m.date ? `<span class="mt-4 text-[20px] tracking-widest text-gray-400 uppercase">${m.date}</span>` : ''}
                        </div>
                        <div class="flex-1 flex flex-col items-center">
                            ${renderLogo(m.awayLogo).replace('w-[80px]', 'w-[100px]').replace('h-[80px]', 'h-[100px] mb-4')}
                            <span class="text-[36px] font-light font-oswald text-center uppercase tracking-[0.2em] text-white">${m.away}</span>
                        </div>
                    </div>
                `;
            } else if (style === 'gaming') {
                cardClasses = 'bg-gradient-to-r from-red-900/80 via-black to-blue-900/80 border-b-4 border-emerald-500 shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-0 mb-8 skew-x-[-5deg]';
                innerHtml = `
                    <div class="skew-x-[5deg] flex items-center justify-between gap-6 px-6 py-5">
                        <div class="flex-1 flex items-center justify-end gap-6 bg-gradient-to-r from-transparent to-red-600/20 py-3 pr-6 rounded-r-3xl border-r-2 border-red-500/50">
                            <span class="text-[46px] font-black font-oswald text-right uppercase text-white drop-shadow-[2px_2px_0_theme(colors.red.600)] italic">${m.home}</span>
                            ${renderLogo(m.homeLogo)}
                        </div>
                        <div class="flex flex-col items-center w-[200px]">
                            <div class="px-8 py-2 bg-black border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] transform -skew-x-[10deg]">
                                <span class="text-white font-black text-[50px] font-oswald italic leading-none">${m.homeScore} <span class="text-emerald-500 mx-2">-</span> ${m.awayScore}</span>
                            </div>
                            ${m.date ? `<p class="text-[20px] text-gray-400 font-bold tracking-widest mt-4 uppercase skew-x-[10deg]">${m.date}</p>` : ''}
                        </div>
                        <div class="flex-1 flex items-center justify-start gap-6 bg-gradient-to-l from-transparent to-blue-600/20 py-3 pl-6 rounded-l-3xl border-l-2 border-blue-500/50">
                            ${renderLogo(m.awayLogo)}
                            <span class="text-[46px] font-black font-oswald uppercase text-white drop-shadow-[2px_2px_0_theme(colors.blue.600)] italic">${m.away}</span>
                        </div>
                    </div>
                `;
            } else if (style === 'v3') {
                cardClasses = 'bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-2xl text-center mb-6';

                innerHtml = `
                        <div class="text-center mb-4 mt-2">
                            <span class="bg-slate-900/80 backdrop-blur-md text-gray-200 px-6 py-2 text-[20px] font-bold tracking-widest rounded-full border border-white/10 drop-shadow-md pb-[6px]">FINISHED</span>
                        </div>
                        <div class="flex items-center justify-between mb-2 px-2 relative z-20">
                            <div class="flex-1 flex flex-col items-center text-center">
                                <div class="w-[150px] h-[150px] mx-auto rounded-full bg-blue-900/60 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-white mb-2 flex items-center justify-center overflow-hidden p-2">
                                    ${renderLogo(m.homeLogo).replace('w-[80px]', 'w-full').replace('h-[80px]', 'h-full ')}
                                </div>
                                <h2 class="font-oswald font-black text-[36px] leading-tight uppercase truncate w-[260px] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-white mx-auto mt-2">${m.home}</h2>
                            </div>
                            <div class="mx-2 flex items-center justify-center gap-4">
                                <div class="text-[110px] font-oswald font-black text-white drop-shadow-[0_5px_8px_rgba(0,0,0,0.8)] leading-none">${m.homeScore}</div>
                                <div class="text-gray-300 font-bold text-[60px] mx-1 leading-none">-</div>
                                <div class="text-[110px] font-oswald font-black text-white drop-shadow-[0_5px_8px_rgba(0,0,0,0.8)] leading-none">${m.awayScore}</div>
                            </div>
                            <div class="flex-1 flex flex-col items-center text-center">
                                <div class="w-[150px] h-[150px] mx-auto rounded-full bg-teal-900/60 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-white mb-2 flex items-center justify-center overflow-hidden p-2">
                                    ${renderLogo(m.awayLogo).replace('w-[80px]', 'w-full').replace('h-[80px]', 'h-full ')}
                                </div>
                                <h2 class="font-oswald font-black text-[36px] leading-tight uppercase truncate w-[260px] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-white mx-auto mt-2">${m.away}</h2>
                            </div>
                        </div>
                        ${dateInfo}
                    `;
            } else { // Classic
                cardClasses = `${theme.odd} shadow-sm`;
                innerHtml = `
                        <div class="flex items-center justify-center gap-6 px-4">
                            <span class="flex-1 text-[42px] font-black font-oswald text-right uppercase">${m.home}</span>
                            <div class="flex items-center gap-3 bg-black/40 rounded-xl px-6 py-3">
                                <span class="text-[64px] font-black text-white">${m.homeScore}</span>
                                <span class="text-[48px] text-gray-400">-</span>
                                <span class="text-[64px] font-black text-white">${m.awayScore}</span>
                            </div>
                            <span class="flex-1 text-[42px] font-black font-oswald uppercase">${m.away}</span>
                        </div>
                        ${dateInfo}
                    `;
            }

            innerHtml += `\n${scorersHtml}\n${statsHtml}`;

            return `
                <div class="card-row rounded-3xl p-5 mb-8 ${cardClasses} ${t.animation}"
                    style="animation-delay:${(i * t.animStagger).toFixed(2)}s; --anim-dur:${t.animDuration}s">
                    ${innerHtml}
                </div>`;
        }).join('')}
        </div>`;

        // Pagination Indicator (Prominent Text)
        const totalPages = Math.ceil(t.results.length / this.RESULTS_PER_PAGE);
        if (totalPages > 1) {
            const currentPage = (t.resultsPage || 0) + 1;
            const indicatorHtml = `
                <div class="flex justify-center mt-2 mb-4">
                    <div class="bg-black/80 backdrop-blur-md border border-white/20 text-white font-oswald font-bold px-6 py-2 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center gap-3">
                        <span class="text-yellow-400 text-[18px] tracking-widest uppercase">PAGE</span>
                        <div class="flex items-center gap-1 text-[24px]">
                            <span class="text-white">${currentPage}</span>
                            <span class="text-gray-500 text-[20px] mx-1">/</span>
                            <span class="text-gray-400">${totalPages}</span>
                        </div>
                    </div>
                </div>`;
            view.innerHTML += indicatorHtml;
        }
    },

    onPlayerDragStart(e, team, index) {
        e.preventDefault();
        const t = this.data;
        const isTouch = e.type === 'touchstart';

        const playerList = team === 'home' ? t.results[0].homeLineup : t.results[0].awayLineup;
        if (!playerList) return;
        const player = playerList[index];

        const pitchEl = document.getElementById('lineup-pitch');
        if (!pitchEl) return;
        const rect = pitchEl.getBoundingClientRect();

        const el = document.getElementById(`player-${team}-${index}`);
        if (el) el.classList.add('scale-125', 'z-[100]', 'shadow-2xl', 'opacity-90');

        const onMove = (moveEvent) => {
            const clientX = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const clientY = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;

            let pctX = ((clientX - rect.left) / rect.width) * 100;
            let pctY = ((clientY - rect.top) / rect.height) * 100;

            pctX = Math.max(0, Math.min(100, pctX));
            pctY = Math.max(0, Math.min(100, pctY));

            player.x = pctX;
            player.y = pctY;

            if (el) {
                el.style.left = `${pctX}%`;
                el.style.top = `${pctY}%`;
            }
        };

        const onEnd = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
            if (el) el.classList.remove('scale-125', 'z-[100]', 'shadow-2xl', 'opacity-90');
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    },

    _renderLineup(view, theme) {
        const t = this.data;
        if (!t.results || t.results.length === 0) {
            view.innerHTML = `<div class="p-8 text-center text-gray-500 bg-black/40 rounded-2xl border border-white/10 mt-10">
                <i class="fas fa-users text-[40px] mb-3 opacity-50"></i><br>
                Belum ada data Lineup.<br>Paste data JSON Lineup di Smart Paste.
            </div>`;
            return;
        }

        const m = t.results[0]; // Lineup usually focuses on a single match at a time
        const dateInfo = m.date || m.time ? `<div class="mt-8 mb-4 text-center"><span class="bg-black/80 text-gray-300 px-5 py-2 text-[20px] font-bold tracking-[0.2em] rounded-full border border-gray-600 shadow-md">${m.date} ${m.time ? '• ' + m.time : ''} ${m.venue ? '• ' + m.venue : ''}</span></div>` : '';

        // Auto Arrange (4-4-2 fallback if coords are missing)
        const applyFormation = (lineup, isHome) => {
            if (!lineup) return;
            const positions = [
                [{ x: 50, y: 8 }], // GK
                [{ x: 20, y: 20 }, { x: 40, y: 20 }, { x: 60, y: 20 }, { x: 80, y: 20 }], // DEF
                [{ x: 20, y: 32 }, { x: 40, y: 32 }, { x: 60, y: 32 }, { x: 80, y: 32 }], // MID
                [{ x: 35, y: 43 }, { x: 65, y: 43 }] // FWD
            ];
            let flatPos = positions.flat();

            lineup.forEach((p, i) => {
                if (p.x !== undefined && p.y !== undefined) return;
                let pos = flatPos[i] || { x: 50 + (i * 2), y: 50 + (i * 2) };
                p.x = pos.x;
                p.y = isHome ? pos.y : (100 - pos.y);
            });
        };
        applyFormation(m.homeLineup, true);
        applyFormation(m.awayLineup, false);

        const renderPlayerNode = (p, index, isHome) => {
            const teamStr = isHome ? 'home' : 'away';
            const colorClass = isHome ? 'bg-blue-800 border-blue-400' : 'bg-red-800 border-red-400';
            const avatarHtml = `
                <div id="player-${teamStr}-${index}" 
                     class="absolute w-[80px] h-fit -ml-[40px] -mt-[40px] flex flex-col items-center cursor-move transition-transform duration-75 select-none"
                     style="left: ${p.x}%; top: ${p.y}%;"
                     onmousedown="window.FootballModule.onPlayerDragStart(event, '${teamStr}', ${index})"
                     ontouchstart="window.FootballModule.onPlayerDragStart(event, '${teamStr}', ${index})">
                    
                    <div class="w-12 h-12 rounded-full ${colorClass} border-[3px] shadow-[0_4px_10px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md bg-opacity-90">
                        <span class="font-oswald font-black text-white text-[22px] leading-none drop-shadow-md z-10">${p.no || '-'}</span>
                    </div>

                    <div class="mt-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded shadow-lg border border-white/60 whitespace-nowrap min-w-[70px] text-center">
                        <p class="font-oswald font-bold text-gray-900 text-[16px] leading-[1.1] truncate">${p.name || ''}</p>
                        ${p.pos ? `<p class="text-[10px] font-bold ${isHome ? 'text-blue-700' : 'text-red-700'} uppercase tracking-widest leading-none mt-0.5">${p.pos}</p>` : ''}
                    </div>
                </div>
            `;
            return avatarHtml;
        };

        const homePlayers = (m.homeLineup || []).map((p, i) => renderPlayerNode(p, i, true)).join('');
        const awayPlayers = (m.awayLineup || []).map((p, i) => renderPlayerNode(p, i, false)).join('');

        view.innerHTML = `
            <div class="w-full h-full flex flex-col bg-gradient-to-b from-black/80 to-transparent">
                <!-- Header Custom -->
                <div class="flex items-center justify-center gap-4 mb-2 relative z-10 px-8">
                    ${t.leagueLogo ? `<img src="${t.leagueLogo}" class="h-[60px] object-contain drop-shadow-[0_5px_15px_rgba(255,255,255,0.4)]">` : ''}
                    <div class="flex flex-col text-center">
                        <span class="text-[14px] font-bold text-yellow-400 tracking-[0.3em] uppercase drop-shadow-md">STARTING XI</span>
                        <h1 class="font-oswald text-[32px] font-black text-white uppercase leading-none drop-shadow-lg tracking-wide">${t.title || 'LINEUP MATCH'}</h1>
                    </div>
                </div>

                <!-- Matchup Card -->
                <div class="bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg relative z-10 mx-6 mb-2">
                    <div class="flex justify-between items-center px-2">
                        <div class="flex-1 flex items-center justify-start gap-3">
                            <div class="w-[60px] h-[60px] rounded-full bg-blue-900/40 border-[3px] border-blue-400 p-1 flex items-center justify-center shadow-md">
                                ${m.homeLogo ? `<img src="${m.homeLogo}" class="w-full h-full object-contain drop-shadow-md">` : `<div class="w-full h-full bg-white/20 rounded-full"></div>`}
                            </div>
                            <span class="font-oswald font-black text-[26px] text-white uppercase drop-shadow-md text-left leading-none w-min">${m.home}</span>
                        </div>
                        <div class="mx-2 relative flex-shrink-0">
                            <div class="w-10 h-10 bg-black/80 rounded-full border border-white/20 flex items-center justify-center rotate-12 shadow-md relative z-20">
                                <span class="text-[16px] font-black font-oswald text-yellow-500 italic drop-shadow-md leading-none">VS</span>
                            </div>
                        </div>
                        <div class="flex-1 flex items-center justify-end gap-3">
                            <span class="font-oswald font-black text-[26px] text-white uppercase drop-shadow-md text-right leading-none w-min">${m.away}</span>
                            <div class="w-[60px] h-[60px] rounded-full bg-red-900/40 border-[3px] border-red-500 p-1 flex items-center justify-center shadow-md">
                                ${m.awayLogo ? `<img src="${m.awayLogo}" class="w-full h-full object-contain drop-shadow-md">` : `<div class="w-full h-full bg-white/20 rounded-full"></div>`}
                            </div>
                        </div>
                    </div>
                </div>
                
                ${m.date || m.time ? `<div class="mb-2 text-center"><span class="bg-black/80 text-gray-300 px-4 py-1 text-[16px] font-bold tracking-[0.2em] rounded-full border border-gray-600 shadow-md">${m.date} ${m.time ? '• ' + m.time : ''} ${m.venue ? '• ' + m.venue : ''}</span></div>` : ''}

                <!-- Virtual Pitch -->
                <div id="lineup-pitch" class="relative flex-1 w-[96%] max-w-[980px] mb-2 mx-auto overflow-hidden rounded-2xl border-[3px] border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.8)]" 
                     style="background: repeating-linear-gradient(0deg, #176B26, #176B26 6%, #155e20 6%, #155e20 12%);">
                    
                    <!-- SVG Pitch Markings -->
                    <svg class="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 150" preserveAspectRatio="none">
                        <!-- Outer border line -->
                        <rect x="2" y="2" width="96" height="146" fill="none" stroke="white" stroke-width="0.5" />
                        <!-- Center Line -->
                        <line x1="2" y1="75" x2="98" y2="75" stroke="white" stroke-width="0.5" />
                        <!-- Center Circle -->
                        <circle cx="50" cy="75" r="10" fill="none" stroke="white" stroke-width="0.5" />
                        <circle cx="50" cy="75" r="1" fill="white" />
                        <!-- Home Penalty Area -->
                        <rect x="20" y="2" width="60" height="25" fill="none" stroke="white" stroke-width="0.5" />
                        <!-- Home Goal Area -->
                        <rect x="35" y="2" width="30" height="9" fill="none" stroke="white" stroke-width="0.5" />
                        <!-- Home Penalty Spot -->
                        <circle cx="50" cy="18" r="1" fill="white" />
                        <path d="M 38 27 Q 50 35 62 27" fill="none" stroke="white" stroke-width="0.5" />
                        <!-- Away Penalty Area -->
                        <rect x="20" y="123" width="60" height="25" fill="none" stroke="white" stroke-width="0.5" />
                        <!-- Away Goal Area -->
                        <rect x="35" y="139" width="30" height="9" fill="none" stroke="white" stroke-width="0.5" />
                        <!-- Away Penalty Spot -->
                        <circle cx="50" cy="132" r="1" fill="white" />
                        <path d="M 38 123 Q 50 115 62 123" fill="none" stroke="white" stroke-width="0.5" />
                        <!-- Corner Arcs -->
                        <path d="M 2 5 A 3 3 0 0 0 5 2" fill="none" stroke="white" stroke-width="0.5" />
                        <path d="M 98 5 A 3 3 0 0 1 95 2" fill="none" stroke="white" stroke-width="0.5" />
                        <path d="M 2 145 A 3 3 0 0 1 5 148" fill="none" stroke="white" stroke-width="0.5" />
                        <path d="M 98 145 A 3 3 0 0 0 95 148" fill="none" stroke="white" stroke-width="0.5" />
                    </svg>

                    <!-- Draggable Player Nodes -->
                    ${homePlayers}
                    ${awayPlayers}
                </div>
            </div>
        `;
    },

    applyFormationPreset(team, formName) {
        if (!formName) return;
        const t = this.data;
        if (!t.results || t.results.length === 0) return;
        const lineup = team === 'home' ? t.results[0].homeLineup : t.results[0].awayLineup;
        if (!lineup) return;

        let positions = [];
        if (formName === '4-4-2') {
            positions = [[{ x: 50, y: 8 }], [{ x: 20, y: 20 }, { x: 40, y: 20 }, { x: 60, y: 20 }, { x: 80, y: 20 }], [{ x: 20, y: 33 }, { x: 40, y: 33 }, { x: 60, y: 33 }, { x: 80, y: 33 }], [{ x: 35, y: 43 }, { x: 65, y: 43 }]];
        } else if (formName === '4-3-3') {
            positions = [[{ x: 50, y: 8 }], [{ x: 20, y: 20 }, { x: 40, y: 20 }, { x: 60, y: 20 }, { x: 80, y: 20 }], [{ x: 25, y: 32 }, { x: 50, y: 29 }, { x: 75, y: 32 }], [{ x: 25, y: 43 }, { x: 50, y: 41 }, { x: 75, y: 43 }]];
        } else if (formName === '3-5-2') {
            positions = [[{ x: 50, y: 8 }], [{ x: 30, y: 20 }, { x: 50, y: 20 }, { x: 70, y: 20 }], [{ x: 15, y: 33 }, { x: 35, y: 29 }, { x: 50, y: 35 }, { x: 65, y: 29 }, { x: 85, y: 33 }], [{ x: 35, y: 43 }, { x: 65, y: 43 }]];
        } else if (formName === '4-2-3-1') {
            positions = [[{ x: 50, y: 8 }], [{ x: 20, y: 20 }, { x: 40, y: 20 }, { x: 60, y: 20 }, { x: 80, y: 20 }], [{ x: 35, y: 30 }, { x: 65, y: 30 }], [{ x: 25, y: 38 }, { x: 50, y: 39 }, { x: 75, y: 38 }], [{ x: 50, y: 45 }]];
        }

        const flatPos = positions.flat();
        lineup.forEach((p, i) => {
            let pos = flatPos[i] || { x: 50 + (i * 2), y: 50 + (i * 2) };
            p.x = pos.x;
            p.y = team === 'home' ? pos.y : (100 - pos.y);
        });

        this.renderView();
    }
};
