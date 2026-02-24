/**
 * Volleyball Module — SportsGenV4
 * Full-featured: Standings, Schedule, Results, Lineup
 */

import { DB } from '../core/db.js';
import { SmartParser } from '../utils/smartParser.js';
import { AssetRegistry } from '../core/AssetRegistry.js';

export const Volleyball = {
    PRESET_LEAGUES: [
        'PROLIGA',
        'LIVOLI DIVISI UTAMA',
        'LIVOLI DIVISI 1',
        'KAPOLRI CUP',
        'VNL',
        'AVC CHALLENGE CUP',
        'AVC CLUB CHAMPIONSHIP',
        'ASIAN GAMES',
        'SEA GAMES',
        'KOVO CUP',
        'V.LEAGUE (JAPAN)',
        'SUPERLEGA (ITALY)',
        'PLUSLIGA (POLAND)'
    ],

    ROWS_PER_PAGE: 8,
    RESULTS_PER_PAGE: 2,

    THEMES: {
        'blue': { name: '🔵 Proliga Blue', header: 'bg-gradient-to-r from-blue-800 to-blue-600 text-white', odd: 'bg-slate-800/95', even: 'bg-slate-700/95', border: 'border-blue-500/30', accent: 'text-blue-400', pts: 'text-yellow-400' },
        'dark': { name: '⚫ Midnight Black', header: 'bg-gray-900 border-b-2 border-gray-700 text-white', odd: 'bg-gray-900/90', even: 'bg-gray-800/90', border: 'border-gray-700', accent: 'text-gray-400', pts: 'text-white' },
        'green': { name: '🟢 Court Green', header: 'bg-gradient-to-r from-green-800 to-emerald-600 text-white', odd: 'bg-green-900/90', even: 'bg-emerald-900/90', border: 'border-green-500/30', accent: 'text-green-300', pts: 'text-white' },
        'pink': { name: '🌸 V-League Pink', header: 'bg-gradient-to-r from-pink-800 to-rose-600 text-white', odd: 'bg-slate-900/95', even: 'bg-slate-800/95', border: 'border-pink-500/30', accent: 'text-pink-300', pts: 'text-pink-200' },
        'orange': { name: '🟠 Sunset Orange', header: 'bg-gradient-to-r from-orange-800 to-amber-600 text-white', odd: 'bg-orange-900/90', even: 'bg-amber-900/90', border: 'border-orange-500/30', accent: 'text-orange-300', pts: 'text-white' },
        'purple': { name: '🟣 Galaxy Purple', header: 'bg-gradient-to-r from-purple-900 to-fuchsia-700 text-white', odd: 'bg-purple-900/90', even: 'bg-fuchsia-900/90', border: 'border-purple-500/30', accent: 'text-purple-300', pts: 'text-white' },
        'red': { name: '🔴 Volcano Red', header: 'bg-gradient-to-r from-red-900 to-rose-700 text-white', odd: 'bg-red-900/90', even: 'bg-rose-900/90', border: 'border-red-500/30', accent: 'text-red-300', pts: 'text-white' },
        'silver': { name: '⚪ Luxury Silver', header: 'bg-gradient-to-r from-gray-800 to-gray-500 text-white', odd: 'bg-gray-800/95', even: 'bg-gray-700/95', border: 'border-gray-400/30', accent: 'text-gray-300', pts: 'text-white' }
    },

    CSS_THEMES: [
        { key: 'none', label: '🌙 Gelap', bg: 'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
        { key: 'glass', label: '🧊 Glass', bg: 'linear-gradient(135deg, #1e2238, #111827)' },
        { key: 'neon', label: '⚡ Neon', bg: '#0d001a' },
        { key: 'broadcast', label: '📺 Siaran', bg: 'linear-gradient(180deg, #001340 0%, #002280 30%, #003090 60%, #001340 100%)' },
        { key: 'minimal', label: '📓 Minimalis', bg: '#f0f0f0' },
        { key: 'retro', label: '📼 Retro', bg: 'linear-gradient(180deg, #1a0011, #2d1b2e)' },
        { key: 'vibrant', label: '🌈 Vibrant', bg: 'linear-gradient(180deg, #0d0f1e, #131426)' }
    ],

    TEMPLATES: {
        standings: JSON.stringify({ sport: "volleyball", mode: "standings", title: "PROLIGA 2026", standings: [{ pos: 1, name: "Jakarta LavAni", mp: 10, w: 9, l: 1, sets: "28:8", pts: 26, form: ["W", "W", "W", "W", "L"] }, { pos: 2, name: "Bhayangkara", mp: 10, w: 8, l: 2, sets: "25:10", pts: 23, form: ["W", "W", "L", "W", "W"] }] }, null, 2),
        schedule: JSON.stringify({ sport: "volleyball", mode: "schedule", title: "PROLIGA 2026", matches: [{ date: "SABTU, 10 MEI 2026", time: "14:00", home: "Kudus Sukun Badak", away: "Jakarta Garuda", venue: "GOR Ken Arok", channel: "MOJI TV" }] }, null, 2),
        results: JSON.stringify({ sport: "volleyball", mode: "results", title: "PROLIGA 2026", matches: [{ date: "JUMAT, 9 MEI 2026", home: "Jakarta LavAni", away: "Jakarta STIN BIN", homeScore: 3, awayScore: 1, setScores: "25-23, 20-25, 25-21, 25-19", venue: "GOR Ken Arok" }] }, null, 2),
        lineup: JSON.stringify({ sport: "volleyball", mode: "lineup", title: "STARTING LINEUP", matches: [{ date: "SABTU, 10 MEI 2026", time: "14:00", home: "Jakarta LavAni", away: "Jakarta Garuda", homeLineup: [{ name: "Boy Arnez", no: 3, pos: "OH" }, { name: "Dio Zulfikri", no: 15, pos: "S" }, { name: "Fahri S", no: 10, pos: "OH" }, { name: "M Malizi", no: 8, pos: "MB" }, { name: "Rivan", no: 12, pos: "OP" }, { name: "Prasojo", no: 6, pos: "MB" }], awayLineup: [{ name: "Alfin D", no: 4, pos: "OH" }, { name: "Nizar", no: 8, pos: "S" }, { name: "Agil", no: 11, pos: "OP" }, { name: "Yuda", no: 9, pos: "MB" }, { name: "Rendy", no: 17, pos: "OH" }, { name: "Cep Indra", no: 3, pos: "MB" }] }] }, null, 2)
    },

    data: {
        currentView: 'standings', // standings, schedule, results, lineup
        title: 'PROLIGA 2026',
        week: 'PEKAN 1',
        season: '2026',
        category: 'putra', // putra/putri
        standingsDate: new Date().toISOString().split('T')[0],

        // Settings
        theme: 'blue',
        cardTheme: 'none',
        bgImage: '',
        bgOpacity: 0.6,
        animation: 'anim-slide',
        animDuration: 0.8,
        animStagger: 0.1,
        animLoop: false,
        animLoopInterval: 5,
        standingsPage: 0,
        resultsPage: 0,
        loopTimer: null,
        scheduleCardStyle: 'broadcast',

        leagueLogo: '',
        channelLogo: '', // For Watermark
        topScorers: [],
        savedBackgrounds: {},

        // Core Data
        standings: [
            { pos: 1, name: "Jakarta LavAni", mp: 10, w: 9, l: 1, sets: "28:8", pts: 26, form: ["W", "W", "W", "W", "L"], logo: '' },
            { pos: 2, name: "Jakarta Bhayangkara", mp: 10, w: 8, l: 2, sets: "25:10", pts: 23, form: ["W", "W", "L", "W", "W"], logo: '' },
            { pos: 3, name: "Jakarta STIN BIN", mp: 10, w: 7, l: 3, sets: "22:14", pts: 20, form: ["L", "W", "W", "L", "W"], logo: '' },
            { pos: 4, name: "Palembang BSB", mp: 10, w: 5, l: 5, sets: "18:18", pts: 15, form: ["W", "L", "L", "W", "L"], logo: '' }
        ],
        schedule: [
            {
                date: "SABTU, 10 MEI 2026",
                matches: [
                    { time: "14:00", home: "Kudus Sukun Badak", away: "Jakarta Garuda", venue: "GOR Ken Arok", channel: "MOJI TV", homeLogo: '', awayLogo: '' }
                ]
            }
        ],
        results: [
            {
                date: "JUMAT, 9 MEI 2026",
                matches: [
                    { time: "16:00", home: "Jakarta LavAni", away: "Jakarta STIN BIN", homeScore: 3, awayScore: 1, setScores: "25-23, 20-25, 25-21, 25-19", venue: "GOR Ken Arok", homeLogo: '', awayLogo: '' }
                ]
            }
        ],
        homeLineup: [],
        awayLineup: []
    },

    async mount() {
        console.log("[VolleyballModule] Mounting...");
        window.VolleyballModule = this;
        window.CurrentSportModule = this; // Global reference for shared UI events

        await this._loadSavedBgs();

        // Hydrate default logos
        this.data.leagueLogo = AssetRegistry.getLeagueBadge('volleyball', this.data.title) || '';
        const chs = AssetRegistry.getChannelLogos();
        this.data.channelLogo = chs.length ? chs[0].url : '';
        await this._autoAssignLogos(this.data.standings);

        this.startPageLoop();
        this.renderControls();
        this.renderView();
    },

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
                const totalPages = Math.ceil(total / (this.RESULTS_PER_PAGE || 2));
                if (totalPages > 1) {
                    this.data.resultsPage = (this.data.resultsPage + 1) % totalPages;
                }
            }
            this.renderView();
        }, (this.data.animLoopInterval || 5) * 1000);
    },

    stopPageLoop() {
        if (this.data.loopTimer) {
            clearInterval(this.data.loopTimer);
            this.data.loopTimer = null;
        }
    },

    setMode(m) {
        this.data.currentView = m;
        this.renderControls();
        this.renderView();
    },

    setCategory(cat) {
        this.data.category = cat;
        this.renderControls();
        this.renderView();
    },

    async _loadSavedBgs() {
        this.data.savedBackgrounds = await DB.getAllBackgrounds();
    },

    LOGO_ALIASES: {
        'lavani': 'lavani',
        'jakarta lavani': 'lavani',
        'lavani allo bank': 'lavani',
        'lavani navy': 'lavani',
        'bhayangkara': 'bhayangkara',
        'jakarta bhayangkara': 'bhayangkara',
        'bhayangkara precision': 'bhayangkara',
        'stin bin': 'stin bin',
        'jakarta stin bin': 'stin bin',
        'garuda': 'garuda putra',
        'garuda putra': 'garuda putra',
        'jakarta garuda': 'garuda putra',
        'samator': 'samator',
        'surabaya samator': 'samator',
        'bin samator': 'samator',
        'falcons': 'falcons',
        'jakarta falcons': 'falcons',
        'electrick': 'jakarta elektrik pln',
        'elektrik': 'jakarta elektrik pln',
        'pln': 'jakarta elektrik pln',
        'petrokimia': 'gresik petrokimia',
        'pupuk indonesia': 'gresik petrokimia',
        'bank bjb': 'bandung bjb tandamata',
        'tandamata': 'bandung bjb tandamata',
        'popsivo': 'jakarta popsivo polwan',
        'polwan': 'jakarta popsivo polwan',
        'pertamina': 'jakarta pertamina enduro',
        'enduro': 'jakarta pertamina enduro',
        'fastron': 'jakarta pertamina enduro',
    },

    async _autoAssignLogos(teamArray) {
        await AssetRegistry.init();

        const allLogos = [];
        const leagues = AssetRegistry.getLeagues('volleyball');
        for (const league of leagues) {
            allLogos.push(...AssetRegistry.getLogos('volleyball', league.key));
        }
        if (!allLogos.length) { console.warn('[Volleyball-AutoLogo] No logos in AssetRegistry'); return; }

        const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');

        for (const t of teamArray) {
            if (t.logo) continue;
            const rawName = t.name.toLowerCase().trim();
            const target = norm(t.name);

            // Tier 0: alias map
            const aliasKey = Object.keys(this.LOGO_ALIASES).find(k => rawName.includes(k) || k.includes(rawName));
            const aliasTarget = aliasKey ? norm(this.LOGO_ALIASES[aliasKey]) : null;
            const searchTarget = aliasTarget || target;

            // Tier 1: exact match
            let match = allLogos.find(l => norm(l.name) === searchTarget);

            // Tier 2: partial match
            if (!match) match = allLogos.find(l => searchTarget.includes(norm(l.name)) || norm(l.name).includes(searchTarget));

            if (match) {
                t.logo = match.url;
                console.log(`[Volleyball-AutoLogo] ${t.name} => ${match.url}`);
            }
        }
    },

    renderControls() {
        const container = document.getElementById('dynamic-controls');
        if (!container) return;
        const t = this.data;

        const topScorersHtml = (t.topScorers || []).map((p, i) => `
            <div class="grid grid-cols-7 gap-1 mb-1 items-center bg-gray-800 p-1 rounded">
                <input type="text" placeholder="Nama" value="${p.name}" class="col-span-3 bg-gray-900 border border-gray-600 rounded px-1 text-[10px] text-white" oninput="window.VolleyballModule.updateTopScorer(${i}, 'name', this.value)">
                <input type="text" placeholder="Tim" value="${p.team}" class="col-span-2 bg-gray-900 border border-gray-600 rounded px-1 text-[10px] text-white" oninput="window.VolleyballModule.updateTopScorer(${i}, 'team', this.value)">
                <input type="number" placeholder="Pts" value="${p.points}" class="col-span-1 bg-gray-900 border border-gray-600 rounded px-1 text-[10px] text-white text-center" oninput="window.VolleyballModule.updateTopScorer(${i}, 'points', this.value)">
                <button onclick="window.VolleyballModule.removeTopScorer(${i})" class="col-span-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px]"><i class="fas fa-times"></i></button>
            </div>
        `).join('') + `
            <button onclick="window.VolleyballModule.addTopScorer()" class="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] py-1 rounded mt-1 font-bold">
                <i class="fas fa-plus"></i> Tambah Top Scorer
            </button>
        `;

        container.innerHTML = `
            <!-- Mode Tabs -->
            <div class="mb-3 border-b border-gray-600 pb-2">
                <div class="flex bg-gray-900 rounded p-0.5 gap-0.5">
                    ${['standings', 'schedule', 'results', 'lineup'].map(m => `
                        <button onclick="window.VolleyballModule.setMode('${m}')"
                            class="${t.currentView === m ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'} flex-1 py-1 rounded text-[10px] font-bold transition">
                            ${m === 'standings' ? 'Klasemen' : m === 'schedule' ? 'Jadwal' : m === 'results' ? 'Hasil' : 'Lineup'}
                        </button>`).join('')}
                </div>
            </div>

            <!-- Smart Paste Area -->
            <div class="bg-gray-800 p-2 rounded border border-gray-600 mb-3 shadow">
                <div class="flex justify-between items-center mb-1">
                    <label class="text-[10px] text-green-400 font-bold block"><i class="fas fa-magic"></i> SMART PASTE (VOLI)</label>
                </div>
                <textarea id="sidebar-paste-input" rows="3"
                    class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[10px] text-white font-mono mb-1 custom-scrollbar"
                    placeholder="Paste text / JSON di sini..."></textarea>
                <div class="flex gap-1 mb-2">
                    <span class="text-[9px] text-gray-400 self-center">Template:</span>
                    <button onclick="document.getElementById('sidebar-paste-input').value = window.VolleyballModule.TEMPLATES.standings" class="text-[9px] bg-gray-700 hover:bg-gray-600 px-1 py-0.5 rounded">Klasemen</button>
                    <button onclick="document.getElementById('sidebar-paste-input').value = window.VolleyballModule.TEMPLATES.schedule" class="text-[9px] bg-gray-700 hover:bg-gray-600 px-1 py-0.5 rounded">Jadwal</button>
                    <button onclick="document.getElementById('sidebar-paste-input').value = window.VolleyballModule.TEMPLATES.results" class="text-[9px] bg-gray-700 hover:bg-gray-600 px-1 py-0.5 rounded">Hasil</button>
                    <button onclick="document.getElementById('sidebar-paste-input').value = window.VolleyballModule.TEMPLATES.lineup" class="text-[9px] bg-gray-700 hover:bg-gray-600 px-1 py-0.5 rounded">Lineup</button>
                </div>
                <button onclick="window.VolleyballModule.applySmartPaste()" class="w-full bg-green-600 hover:bg-green-500 text-white py-1.5 rounded text-[10px] font-bold shadow">
                    PROSES DATA
                </button>
            </div>

            <!-- Contextual Controls -->
            <div id="mode-specific-controls" class="space-y-3">
                <!-- GENERAL SETTINGS (Always visible except Lineup) -->
                <div class="space-y-2 ${t.currentView === 'lineup' ? 'hidden' : ''}">
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-[10px] text-gray-400 mb-0.5">Title / Liga</label>
                            <select id="inpTitle" onchange="window.VolleyballModule.updateData(event)"
                                class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[11px] text-white uppercase font-bold outline-none">
                                ${this.PRESET_LEAGUES.map(l => `<option ${t.title === l ? 'selected' : ''} value="${l}">${l}</option>`).join('')}
                                ${!this.PRESET_LEAGUES.includes(t.title) ? `<option selected value="${t.title}">${t.title}</option>` : ''}
                                <option value="_custom">+ Edit Manual...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] text-gray-400 mb-0.5">Kategori / Gender</label>
                            <div class="flex bg-gray-900 border border-gray-500 rounded overflow-hidden">
                                <button onclick="window.VolleyballModule.setCategory('putra')" class="flex-1 py-1 text-[10px] font-bold ${t.category === 'putra' ? 'bg-blue-600 text-white' : 'text-gray-400'}">PUTRA</button>
                                <button onclick="window.VolleyballModule.setCategory('putri')" class="flex-1 py-1 text-[10px] font-bold ${t.category === 'putri' ? 'bg-pink-600 text-white' : 'text-gray-400'}">PUTRI</button>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-[10px] text-gray-400 mb-0.5">Week/Pekan</label>
                            <input type="text" id="inpWeek" value="${t.week}" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[11px] text-white" oninput="window.VolleyballModule.updateData(event)">
                        </div>
                        <div>
                            <label class="block text-[10px] text-gray-400 mb-0.5">Musim</label>
                            <input type="text" id="inpSeason" value="${t.season}" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[11px] text-white" oninput="window.VolleyballModule.updateData(event)">
                        </div>
                    </div>
                </div>

                <!-- STANDINGS CONTROLS -->
                ${t.currentView === 'standings' ? `
                    <!-- Top Scorers Configuration -->
                    <div class="border-t border-gray-600 pt-2">
                        <label class="block text-[10px] text-yellow-400 font-bold mb-1"><i class="fas fa-star"></i> TOP SCORERS</label>
                        ${topScorersHtml}
                    </div>
                ` : ''}

                <!-- SCHEDULE/RESULTS CONTROLS -->
                ${(t.currentView === 'schedule' || t.currentView === 'results') ? `
                    <div class="border-t border-gray-600 pt-2">
                        <label class="block text-[10px] text-gray-400 mb-0.5">Card Style (Jadwal/Hasil)</label>
                        <select id="inpScheduleStyle" onchange="window.VolleyballModule.updateData(event)" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[11px] text-white">
                            <option value="broadcast" ${t.scheduleCardStyle === 'broadcast' ? 'selected' : ''}>Broadcast (Pita & Ribbon)</option>
                            <option value="glass" ${t.scheduleCardStyle === 'glass' ? 'selected' : ''}>Glassmorphism Transparan</option>
                            <option value="gradient" ${t.scheduleCardStyle === 'gradient' ? 'selected' : ''}>Gradient Modern</option>
                            <option value="neon" ${t.scheduleCardStyle === 'neon' ? 'selected' : ''}>Neon Cyberpunk</option>
                            <option value="minimal" ${t.scheduleCardStyle === 'minimal' ? 'selected' : ''}>Minimalist Bersih</option>
                            <option value="dark" ${t.scheduleCardStyle === 'dark' ? 'selected' : ''}>Dark Mode Klasik</option>
                            <option value="tournament" ${t.scheduleCardStyle === 'tournament' ? 'selected' : ''}>Tournament Ribbon (New)</option>
                        </select>
                    </div>
                ` : ''}

                <!-- VISUAL & ANIMATION (All Views) -->
                <div class="border-t border-gray-600 pt-2 grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-[10px] text-gray-400 mb-0.5">Warna Table (Tema)</label>
                        <select id="inpTheme" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[10px] text-white" onchange="window.VolleyballModule.updateData(event)">
                            ${Object.keys(this.THEMES).map(k => `<option value="${k}" ${t.theme === k ? 'selected' : ''}>${this.THEMES[k].name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] text-gray-400 mb-0.5">Animasi Masuk</label>
                        <select id="inpAnim" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[10px] text-white" onchange="window.VolleyballModule.updateData(event)">
                            <option value="anim-slide" ${t.animation === 'anim-slide' ? 'selected' : ''}>Slide Right</option>
                            <option value="anim-slide-up" ${t.animation === 'anim-slide-up' ? 'selected' : ''}>Slide Up</option>
                            <option value="anim-fadeup" ${t.animation === 'anim-fadeup' ? 'selected' : ''}>Fade Up</option>
                            <option value="anim-zoom" ${t.animation === 'anim-zoom' ? 'selected' : ''}>Zoom In</option>
                            <option value="anim-flip" ${t.animation === 'anim-flip' ? 'selected' : ''}>Flip In</option>
                            <option value="anim-slide-left" ${t.animation === 'anim-slide-left' ? 'selected' : ''}>Slide Left</option>
                            <option value="anim-bounce" ${t.animation === 'anim-bounce' ? 'selected' : ''}>Bounce</option>
                            <option value="anim-roll" ${t.animation === 'anim-roll' ? 'selected' : ''}>Roll In</option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-1 items-start">
                        <label class="block text-[10px] text-gray-400 mb-0.5">Speed & Stagger Animasi</label>
                        <div class="flex items-center gap-2">
                            <input type="number" id="inpAnimDur" value="${t.animDuration}" step="0.1" min="0.1" max="2" class="w-12 bg-gray-900 border border-gray-500 rounded px-1 text-[10px] text-white text-center" onchange="window.VolleyballModule.updateData(event)" title="Duration (s)">
                            <span class="text-[9px] text-gray-500">s</span>
                            <input type="number" id="inpAnimStag" value="${t.animStagger}" step="0.05" min="0" max="1" class="w-12 bg-gray-900 border border-gray-500 rounded px-1 text-[10px] text-white text-center" onchange="window.VolleyballModule.updateData(event)" title="Stagger/Delay">
                            <span class="text-[9px] text-gray-500">stg</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-[10px] text-gray-400 mb-0.5">Opasitas Background</label>
                        <input type="range" id="inpBgOpacity" min="0" max="1" step="0.05" value="${t.bgOpacity}" class="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500" oninput="window.VolleyballModule.updateData(event)">
                    </div>
                    <div class="flex flex-col gap-1 items-start">
                        <label class="block text-[10px] text-gray-400 mb-0.5">Auto Loop (Ganti Hal.)</label>
                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="chkAnimLoop" ${t.animLoop ? 'checked' : ''} onchange="window.VolleyballModule.updateData(event)" class="accent-blue-500">
                            <input type="number" id="inpLoopInterval" value="${t.animLoopInterval}" class="w-12 bg-gray-900 border border-gray-600 rounded px-1 text-[10px] text-white text-center" onchange="window.VolleyballModule.updateData(event)"> 
                            <span class="text-[9px] text-gray-500">detik</span>
                        </div>
                    </div>
                </div>

                <!-- Background & Theme Selection (Dropdowns) -->
                <div class="border-t border-gray-600 pt-2 grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-[10px] text-gray-400 mb-0.5">Background Image</label>
                        <select id="inpBgImage" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[10px] text-white" onchange="window.VolleyballModule.updateData(event)">
                            <option value="">None / Polos</option>
                            ${AssetRegistry.getBackgrounds('volleyball').map(bg => {
            const filename = bg.url.split('/').pop();
            return `<option value="${bg.url}" ${t.bgImage === bg.url ? 'selected' : ''}>${filename}</option>`;
        }).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] text-gray-400 mb-0.5">Preset Tema Visual</label>
                        <select id="inpCardTheme" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[10px] text-white" onchange="window.VolleyballModule.updateData(event)">
                            ${this.CSS_THEMES.map(th => `<option value="${th.key}" ${t.cardTheme === th.key ? 'selected' : ''}>${th.label}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;
    },

    setStaticBg(url) {
        this.data.bgImage = url;
        this.renderControls(); // refresh thumbnail highlight
        this.renderView();
    },

    updateData(e) {
        const { id, value, type, checked } = e.target;
        if (id === 'inpTitle') {
            if (value === '_custom') {
                const custom = prompt('Masukkan Judul Liga Manual:');
                if (custom) this.data.title = custom.toUpperCase();
                this.renderControls();
            } else {
                this.data.title = value;
            }
            // Auto-load league badge from static assets
            const badgeUrl = AssetRegistry.getLeagueBadge('volleyball', this.data.title);
            if (badgeUrl) {
                this.data.leagueLogo = badgeUrl;
                this.renderControls();
            }
        }
        else if (id === 'inpWeek') this.data.week = value;
        else if (id === 'inpSeason') this.data.season = value;
        else if (id === 'inpTheme') this.data.theme = value;
        else if (id === 'inpAnim') this.data.animation = value;
        else if (id === 'inpAnimDur') this.data.animDuration = parseFloat(value);
        else if (id === 'inpAnimStag') this.data.animStagger = parseFloat(value);
        else if (id === 'inpScheduleStyle') this.data.scheduleCardStyle = value;
        else if (id === 'inpBgOpacity') this.data.bgOpacity = parseFloat(value);
        else if (id === 'inpBgImage') this.data.bgImage = value;
        else if (id === 'inpCardTheme') this.applyCardTheme(value);
        else if (id === 'chkAnimLoop') {
            this.data.animLoop = checked;
            if (checked) this.startPageLoop();
            else this.stopPageLoop();
            this.renderControls(); // sync input visibility
        }
        else if (id === 'inpLoopInterval') {
            this.data.animLoopInterval = parseInt(value);
            if (this.data.animLoop) { this.stopPageLoop(); this.startPageLoop(); }
        }
        this.renderView();
    },

    applyCardTheme(key) {
        this.data.cardTheme = key;
        const c = document.getElementById('preview-container');
        if (c) {
            [...c.classList].filter(cl => cl.startsWith('theme-')).forEach(cl => c.classList.remove(cl));
            if (key !== 'none') c.classList.add(`theme-${key}`);
        }
        this.renderControls();
        this.renderView();
    },

    addTopScorer() {
        if (!this.data.topScorers) this.data.topScorers = [];
        this.data.topScorers.push({ name: '', team: '', points: 0 });
        this.renderControls();
        this.renderView();
    },

    removeTopScorer(index) {
        if (this.data.topScorers) {
            this.data.topScorers.splice(index, 1);
            this.renderControls();
            this.renderView();
        }
    },

    updateTopScorer(index, field, value) {
        if (this.data.topScorers && this.data.topScorers[index]) {
            this.data.topScorers[index][field] = value;
            this.renderView();
        }
    },

    async applySmartPaste() {
        const raw = document.getElementById('sidebar-paste-input').value;
        if (!raw) return;
        const logos = await DB.getAllLogos() || {};
        const result = SmartParser.parse(raw, { sport: 'volleyball', logos });
        if (!result.success) { alert(`❌ ${result.message}`); return; }

        const { schema } = result;
        if (schema.title) {
            this.data.title = schema.title;
            const badgeUrl = AssetRegistry.getLeagueBadge('volleyball', schema.title);
            if (badgeUrl) this.data.leagueLogo = badgeUrl;
        }
        if (schema.mode) this.data.currentView = schema.mode;
        if (schema.matches && schema.matches.length) {
            if (schema.mode === 'schedule') this.data.schedule = schema.matches;
            if (schema.mode === 'results') this.data.results = schema.matches;
        }
        if (schema.standings && schema.standings.length) {
            this.data.standings = schema.standings;
            await this._autoAssignLogos(this.data.standings);
        }
        if (schema.homeLineup) {
            this.data.homeLineup = schema.homeLineup;
            this.data.awayLineup = schema.awayLineup || [];
        }

        this.renderControls();
        this.renderView();
    },

    renderView() {
        const t = this.data;
        const theme = this.THEMES[t.theme] || this.THEMES['blue'];

        // Apply theme background (if CSS theme selected)
        const bgEl = document.getElementById('render-bg');
        const bgImgEl = document.getElementById('render-bg-image');
        if (bgEl && bgImgEl) {
            const themeDef = this.CSS_THEMES.find(th => th.key === (t.cardTheme || 'none'));

            // Background Clarity Fix: If an image is selected, don't show the theme's background 
            // gradient. This prevents color bleeding that causes the "buram" (hazy) effect.
            if (t.bgImage) {
                bgEl.style.background = '#000'; // Pure black backdrop for maximum image clarity
            } else if (themeDef && t.cardTheme && t.cardTheme !== 'none') {
                bgEl.style.background = themeDef.bg;
            } else {
                bgEl.style.background = 'linear-gradient(to bottom, #1e3a8a, #172554)'; // Default Blue
            }

            bgImgEl.style.opacity = t.bgOpacity;
            if (t.bgImage) {
                const encodedBg = t.bgImage.startsWith('data:')
                    ? t.bgImage
                    : t.bgImage.split('/').map(seg => encodeURIComponent(seg)).join('/');
                bgImgEl.style.backgroundImage = `url("${encodedBg}")`;
                bgImgEl.style.backgroundSize = 'cover';
                bgImgEl.style.backgroundPosition = 'center';
                bgImgEl.style.display = 'block';
                bgImgEl.style.mixBlendMode = 'normal'; // Fix clarity: no blending with theme colors
            } else {
                bgImgEl.style.display = 'none';
                bgImgEl.style.mixBlendMode = 'overlay'; // Back to default for themes
            }
        }

        // Render Global Header
        this._renderHeader();

        // Render specific view
        const view = document.getElementById('render-view');
        if (!view) return;

        if (t.currentView === 'standings') this._renderStandings(view, theme);
        else if (t.currentView === 'schedule') this._renderSchedule(view, theme);
        else if (t.currentView === 'results') this._renderResults(view, theme);
        else if (t.currentView === 'lineup') this._renderLineup(view, theme);

        // Render Footer
        this._renderFooter();
        this.startPageLoop();
    },

    _renderFooter() {
        const t = this.data;
        const footer = document.getElementById('render-footer');
        if (!footer) return;

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
                    <img src="assets/channel/logos/logo djafarsport.png" class="h-12 w-12 object-contain rounded-full" onerror="this.style.display='none'">
                    <span class="font-oswald text-[30px] font-black text-yellow-400 tracking-wide">djafarSport</span>
                </div>

                <!-- Running ticker — duplicated for seamless loop -->
                <div class="flex-1 overflow-hidden">
                    <span class="ticker-inner font-roboto text-[28px] text-white">
                        Like & subscribe channel &nbsp;<strong class="text-yellow-400">djafarSport</strong>&nbsp; untuk mendapatkan update olahraga terbaru &nbsp;✨&nbsp;&nbsp;•&nbsp;&nbsp;
                        Like & subscribe channel &nbsp;<strong class="text-yellow-400">djafarSport</strong>&nbsp; untuk mendapatkan update olahraga terbaru &nbsp;✨&nbsp;&nbsp;•&nbsp;&nbsp;
                    </span>
                </div>
            </div>`;
    },

    _renderHeader() {
        const header = document.getElementById('render-header');
        if (!header) return;
        const t = this.data;

        let titlePrefix = t.currentView === 'standings' ? 'Klasemen ' : t.currentView === 'schedule' ? 'Jadwal ' : t.currentView === 'results' ? 'Hasil ' : 'Lineup ';

        const scorers = t.topScorers || [];
        const hasScorers = scorers.length > 0 && t.currentView === 'standings'; // Usually only in standings
        const leagueLogoEncoded = t.leagueLogo || '';
        const catColor = t.category === 'putri' ? 'bg-pink-600' : 'bg-blue-600';

        header.innerHTML = `
            <div class="flex gap-4 w-full items-stretch px-8 pt-8">
                <!-- LEFT: League Info Glass Card -->
                <div class="flex-1 flex items-center gap-5 px-8 py-6 rounded-3xl"
                    style="background:rgba(255,255,255,0.08);backdrop-filter:blur(18px);border:1.5px solid rgba(255,255,255,0.15);box-shadow:0 8px 32px rgba(0,0,0,0.4);">
                    ${leagueLogoEncoded ? `<img src="${leagueLogoEncoded}" class="h-28 w-28 object-contain drop-shadow-2xl flex-shrink-0">` : ''}
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                             <span class="${catColor} text-white px-4 py-1 text-sm font-bold rounded-full uppercase tracking-wider shadow-lg border border-white/20">
                                 ${t.category || 'UMUM'}
                             </span>
                             <span class="text-white text-sm font-oswald tracking-widest bg-white/10 px-4 py-1 rounded-full border border-white/10 shadow-lg">${t.season}</span>
                        </div>
                        <h1 class="font-oswald font-black text-white leading-none drop-shadow-lg tracking-wide uppercase flex flex-col justify-center animate-breathe">
                            <span class="text-[28px] text-yellow-400 mb-1 tracking-normal drop-shadow-md">${titlePrefix}</span>
                            <span class="text-[54px]">${t.title}</span>
                        </h1>
                        <div class="flex items-center gap-3 mt-2">
                            <span class="text-[32px] font-bold text-yellow-400 font-roboto drop-shadow">${t.week}</span>
                        </div>
                    </div>
                </div>

                ${hasScorers ? `
                <!-- RIGHT: Top Scorer Glass Card -->
                <div class="w-[420px] flex-shrink-0 px-6 py-5 rounded-3xl"
                    style="background:rgba(255,255,255,0.07);backdrop-filter:blur(18px);border:1.5px solid rgba(255,255,255,0.13);box-shadow:0 8px 32px rgba(0,0,0,0.4);">
                    <div class="flex items-center gap-2 mb-4 border-b border-white/15 pb-3 justify-end">
                        <h4 class="font-oswald text-lg text-yellow-400 font-bold tracking-widest uppercase">TOP SCORERS</h4>
                        <i class="fas fa-crown text-yellow-400"></i>
                    </div>
                    <div class="space-y-3">
                    ${scorers.slice(0, 5).map((s, idx) => {
            const rankColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600', 'text-white/70', 'text-white/70'];
            return `
                        <div class="flex items-center justify-end gap-3 group">
                            <div class="flex flex-col items-end">
                                <span class="text-white font-bold font-oswald truncate text-right drop-shadow-md text-2xl">${s.name}</span>
                                <span class="text-sm text-gray-300 uppercase tracking-wider font-semibold truncate text-right">${s.team}</span>
                            </div>
                            <span class="font-oswald text-[32px] font-black ${rankColors[idx] || 'text-white/50'}">${s.points}</span>
                        </div>`;
        }).join('')}
                    </div>
                </div>` : ''}
            </div>`;
    },

    _renderStandings(view, theme) {
        const t = this.data;
        const animClass = t.animation || 'anim-slide-up';
        const animDuration = t.animDuration || 0.8;
        const animStagger = t.animStagger || 0.1;
        const rpp = this.ROWS_PER_PAGE;

        // Pagination
        const totalPages = Math.ceil(t.standings.length / rpp);
        const curPage = Math.min(t.standingsPage ?? 0, Math.max(0, totalPages - 1));
        const pageRows = t.standings.slice(curPage * rpp, (curPage + 1) * rpp);

        // Page dot indicators
        const dots = totalPages > 1 ? Array.from({ length: totalPages }, (_, i) =>
            `<div onclick="window.VolleyballModule.goToPage(${i})"
                class="cursor-pointer w-5 h-5 rounded-full border-2 transition-all ${i === curPage ? 'bg-white border-white scale-125' : 'bg-transparent border-white/40 hover:border-white/70'}"></div>`
        ).join('') : '';

        view.innerHTML = `
            <div class="px-4 pb-8 w-full h-full flex flex-col items-center justify-start pt-2 relative">
                <table class="w-full max-w-[1000px] text-white border-separate border-spacing-0 shadow-2xl rounded-xl overflow-hidden self-center mx-auto table-fixed mb-6">
                    <thead>
                        <tr class="${theme.header} text-2xl uppercase tracking-wider">
                            <th class="py-4 px-2 text-center w-20 border-r ${theme.border}">#</th>
                            <th class="py-4 px-6 text-left border-r ${theme.border}">TIM</th>
                            <th class="py-4 px-2 text-center w-20 border-r ${theme.border}">MP</th>
                            <th class="py-4 px-2 text-center w-20 border-r ${theme.border}">W</th>
                            <th class="py-4 px-2 text-center w-20 border-r ${theme.border}">L</th>
                            <th class="py-4 px-2 text-center w-36 border-r ${theme.border}">SETS</th>
                            <th class="py-4 px-2 text-center font-bold w-28 border-r ${theme.border}">PTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pageRows.map((team, idx) => {
            const i = (curPage * rpp) + idx;
            const rowClass = i % 2 === 0 ? theme.even : theme.odd;
            const isRedZone = i >= 4;
            const borderClass = isRedZone ? 'border-l-4 border-l-red-600' : '';
            const delay = idx * animStagger;

            return `
                            <tr class="${rowClass} ${borderClass} text-3xl transition duration-200 group hover:brightness-110 ${animClass}" style="animation-duration: ${animDuration}s; animation-delay: ${delay}s; animation-fill-mode: both;">
                                <td class="py-4 text-center font-bold border-r ${theme.border} relative align-middle">
                                    ${i < 4 ? `<div class="absolute left-0 top-0 bottom-0 w-3 ${i === 0 ? 'bg-yellow-400' : 'bg-green-500'}"></div>` : `<div class="absolute left-0 top-0 bottom-0 w-3 bg-red-600"></div>`}
                                    ${team.pos}
                                </td>
                                <td class="py-3 px-6 border-r ${theme.border} align-middle">
                                    <div class="flex items-center gap-4 mb-2">
                                         <div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-2xl text-white/40 shadow-inner shrink-0 leading-none overflow-hidden">
                                            ${team.logo ? `<img src="${team.logo}" class="w-full h-full object-contain">` : `<i class="fas fa-shield-alt"></i>`}
                                        </div>
                                        <span class="line-clamp-2 leading-tight tracking-tight drop-shadow-sm text-3xl font-bold">${team.name.replace(/ W$/i, '')}</span>
                                    </div>
                                    <div class="flex items-center gap-2 mt-1 opacity-90 pl-[72px]">
                                        <span class="text-xs text-white/50 mr-1 tracking-widest font-bold">FORM:</span>
                                        ${(team.form || []).slice(0, 5).map(f => {
                let color = 'bg-gray-600';
                if (f === 'W') color = 'bg-green-600';
                else if (f === 'L') color = 'bg-red-600';
                return `<span class="${color} w-8 h-8 flex items-center justify-center text-sm font-bold rounded text-white shadow ring-1 ring-white/10">${f}</span>`;
            }).join('')}
                                    </div>
                                </td>
                                <td class="py-4 text-center font-mono text-white/90 border-r ${theme.border} align-middle text-3xl font-bold">${team.mp || 0}</td>
                                <td class="py-4 text-center font-mono text-green-400 font-bold border-r ${theme.border} align-middle text-3xl">${team.w || 0}</td>
                                <td class="py-4 text-center font-mono text-red-400 font-bold border-r ${theme.border} align-middle text-3xl">${team.l || 0}</td>
                                <td class="py-4 text-center text-white/90 border-r ${theme.border} align-middle text-3xl font-bold tracking-wide">${team.sets || '0:0'}</td>
                                <td class="py-4 text-center font-black ${theme.pts} text-5xl drop-shadow-md border-r ${theme.border} align-middle">${team.pts || 0}</td>
                            </tr>`;
        }).join('')}
                    </tbody>
                </table>
                <div class="w-full max-w-[1000px] flex items-stretch justify-between gap-4">
                    <!-- FOOTER LEGEND (Left) -->
                    <div class="flex-1 bg-black/40 rounded-lg p-5 border border-white/10 backdrop-blur-sm flex flex-col justify-center gap-3">
                        <div class="flex items-center gap-8 text-xl text-white/90 mb-1 font-bold">
                            <div class="flex items-center gap-3"><div class="w-5 h-5 bg-green-500 rounded-sm"></div> <span class="uppercase tracking-wider">Final Four</span></div>
                            <div class="flex items-center gap-3"><div class="w-5 h-5 bg-red-600 rounded-sm"></div> <span class="uppercase tracking-wider">Degradasi / Out</span></div>
                        </div>
                         <div class="grid grid-cols-5 items-center gap-4 text-xl text-white/90 font-bold uppercase tracking-wide">
                            <span>MP: Main</span>
                            <span>W: Menang</span>
                            <span>L: Kalah</span>
                            <span>SETS: Set</span>
                            <span>PTS: Poin</span>
                        </div>
                    </div>
                    
                    ${dots ? `<div class="flex items-center gap-3 px-8 bg-black/40 rounded-lg border border-white/10 backdrop-blur-sm">${dots}</div>` : ''}
                </div>
            </div>
        `;
    },

    goToPage(idx) {
        this.data.standingsPage = idx;
        this.data.resultsPage = idx;
        this.renderView();
    },

    _renderSchedule(view, themeObj) {
        const t = this.data;
        const theme = this.THEMES[t.theme] || this.THEMES['blue'];
        if (!t.schedule || !t.schedule.length) {
            view.innerHTML = `<div class="h-full flex flex-col items-center justify-center opacity-40">
                <i class="fas fa-calendar-alt text-[120px] mb-6"></i>
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
            if (!url) return '<div class="w-[80px] h-[80px] rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center border-2 border-white/20"><i class="fas fa-volleyball-ball text-white/40 text-[40px]"></i></div>';
            const encoded = url.startsWith('data:') ? url : url.split('/').map(s => encodeURIComponent(s)).join('/');
            return `<img src="${encoded}" class="w-[80px] h-[80px] object-contain flex-shrink-0" onerror="this.style.display='none'">`;
        };

        view.innerHTML = Object.entries(grouped).map(([date, matches]) => `
            <div class="mb-8 text-center pt-10">
                <div class="inline-block ${theme.header} px-8 py-3 rounded-xl text-[28px] font-oswald font-black uppercase mb-6 tracking-wide shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-white/20">${date}</div>
                ${matches.map((m, i) => {
            let cardClasses = '';
            let innerHtml = '';

            const timeInfo = m.time ? `<div class="bg-black/60 text-white px-5 py-2 rounded-md font-roboto text-[26px] font-bold tracking-wider">${m.time}</div>` : '';
            const venueInfo = m.venue ? `<p class="text-[26px] text-gray-300 flex items-center gap-2"><i class="fas fa-location-arrow text-yellow-400"></i>${m.venue}</p>` : '';
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
                                <div class="absolute inset-0 bg-gradient-to-b from-[#e0e0e0] to-[#b0b0b0]" style="clip-path: polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%); shadow-[0_10px_20px_rgba(0,0,0,0.5)]"></div>
                                <div class="absolute inset-1 bg-gradient-to-b from-white to-[#d0d0d0]" style="clip-path: polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%);"></div>
                                <div class="absolute inset-y-0 left-0 w-1/2 flex items-center justify-end pl-[140px] pr-[100px] gap-4">
                                    <span class="text-[36px] font-black font-oswald text-[#2c3e50] uppercase tracking-wider drop-shadow-sm leading-[1.1] text-right">${m.home}</span>
                                </div>
                                <div class="absolute inset-y-0 right-0 w-1/2 flex items-center justify-start pr-[140px] pl-[100px] gap-4">
                                    <span class="text-[36px] font-black font-oswald text-[#2c3e50] uppercase tracking-wider drop-shadow-sm leading-[1.1] text-left">${m.away}</span>
                                </div>
                                <div class="absolute z-10 w-[90px] h-[90px] rounded-full bg-gradient-to-b from-[#2980b9] to-[#2c3e50] border-[4px] border-white shadow-lg flex items-center justify-center">
                                    <span class="text-white font-black text-[38px] font-oswald">VS</span>
                                </div>
                                <div class="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-[120px] h-[120px] rounded-full bg-white shadow-xl p-2 flex items-center justify-center border-2 border-gray-200">${renderLogo(m.homeLogo).replace('w-[80px]', 'w-full').replace('h-[80px]', 'h-full')}</div>
                                <div class="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-[120px] h-[120px] rounded-full bg-white shadow-xl p-2 flex items-center justify-center border-2 border-gray-200">${renderLogo(m.awayLogo).replace('w-[80px]', 'w-full').replace('h-[80px]', 'h-full')}</div>
                            </div>
                            <div class="relative w-[75%] mx-auto h-[60px] -mt-5 z-0 flex items-center justify-center">
                                <div class="absolute inset-0 bg-gradient-to-b from-[#2c3e50] to-[#1a252f]" style="clip-path: polygon(3% 0, 97% 0, 100% 100%, 0 100%);"></div>
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
                cardClasses = 'bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border border-blue-500/30 shadow-lg';
                innerHtml = `
                            <div class="flex items-center justify-between gap-6 px-4">
                                <div class="flex-1 flex items-center justify-end gap-5">
                                    <span class="text-[40px] font-bold font-oswald text-right uppercase text-blue-100">${m.home}</span>
                                    ${renderLogo(m.homeLogo)}
                                </div>
                                <div class="flex flex-col items-center w-[160px] bg-black/30 py-3 px-2 rounded-2xl border border-white/5">
                                    <div class="text-blue-300 font-bold text-[34px] mb-1">VS</div>
                                    ${timeInfo}
                                </div>
                                <div class="flex-1 flex items-center justify-start gap-5">
                                    ${renderLogo(m.awayLogo)}
                                    <span class="text-[40px] font-bold font-oswald uppercase text-blue-100">${m.away}</span>
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
            } else { // dark
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
        if (!t.results || !t.results.length) {
            view.innerHTML = `<div class="h-full flex flex-col items-center justify-center opacity-40">
                <i class="fas fa-trophy text-[120px] mb-6"></i>
                <p class="text-[48px] font-bold uppercase">Hasil Kosong</p>
                <p class="text-[32px] mt-2">Gunakan ✨ Magic Paste</p>
            </div>`; return;
        }

        const renderLogo = (url) => {
            if (!url) return '<div class="w-[80px] h-[80px] rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center border-2 border-white/20"><i class="fas fa-volleyball-ball text-white/40 text-[40px]"></i></div>';
            const encoded = url.startsWith('data:') ? url : url.split('/').map(s => encodeURIComponent(s)).join('/');
            return `<img src="${encoded}" class="w-[80px] h-[80px] object-contain flex-shrink-0" onerror="this.style.display='none'">`;
        };

        const rpp = this.RESULTS_PER_PAGE || 2;
        const totalPages = Math.ceil(t.results.length / rpp);
        const curPage = Math.min(t.resultsPage ?? 0, Math.max(0, totalPages - 1));
        const pageResults = t.results.slice(curPage * rpp, (curPage + 1) * rpp);

        const dots = totalPages > 1 ? Array.from({ length: totalPages }, (_, i) =>
            `<div onclick="window.VolleyballModule.goToPage(${i})"
                class="cursor-pointer w-5 h-5 rounded-full border-2 transition-all ${i === curPage ? 'bg-white border-white scale-125' : 'bg-transparent border-white/40 hover:border-white/70'}"></div>`
        ).join('') : '';

        view.innerHTML = `<div class="mb-8 space-y-6 pt-10 px-4 flex flex-col items-center">
            ${pageResults.map((m, i) => {
            let cardClasses = 'bg-black/40 backdrop-blur-xl border-t border-b border-white/20 shadow-2xl py-8 px-5 relative overflow-hidden rounded-2xl w-full max-w-[1000px] mb-4';

            const scoreBox = `<div class="flex items-center justify-center gap-6 mt-2 relative z-10 w-full mb-6 max-w-[500px] mx-auto">
                    <span class="text-[72px] font-black font-oswald text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">${m.homeScore ?? 0}</span>
                    <span class="text-[48px] text-gray-400 font-black italic shadow-inner px-4 bg-black/60 rounded-lg">-</span>
                    <span class="text-[72px] font-black font-oswald text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">${m.awayScore ?? 0}</span>
                </div>`;

            // Volleyball specific: Set Scores rendering mapping array of sets or string.
            // Support for strings like "25-23, 19-25, 25-22"
            let setScoresHtml = '';
            if (m.setScores) {
                const sets = typeof m.setScores === 'string' ? m.setScores.split(',').map(s => s.trim()).filter(Boolean) : m.setScores;
                if (sets.length > 0) {
                    setScoresHtml = `
                       <div class="flex items-center justify-center gap-4 flex-wrap mt-2 mb-4 relative z-10">
                           ${sets.map(set => `
                               <div class="bg-blue-900/60 border border-blue-400/50 text-blue-100 px-5 py-2 rounded shadow-lg text-[22px] font-bold tracking-widest font-oswald">
                                   ${set}
                               </div>
                           `).join('')}
                       </div>
                   `;
                }
            }

            const dateInfo = m.date ? `<p class="text-[28px] font-bold text-white text-center mt-2 drop-shadow-lg tracking-widest uppercase opacity-90"><i class="far fa-calendar-alt text-yellow-400 mr-3"></i>${m.date}</p>` : '';

            return `
                <div class="rounded-3xl ${cardClasses} ${t.animation}" style="animation-delay:${(i * t.animStagger).toFixed(2)}s; --anim-dur:${t.animDuration}s">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div class="flex items-center justify-between gap-6 w-full relative z-10">
                        <div class="flex-1 flex flex-col items-center justify-center">
                            ${renderLogo(m.homeLogo)}
                            <span class="text-[42px] font-black font-oswald text-center uppercase tracking-wide drop-shadow-md text-white mt-4 leading-[1.1]">${m.home}</span>
                        </div>
                        
                        <div class="w-[30%] flex flex-col items-center justify-center">
                            <span class="bg-red-600 text-white font-oswald text-[22px] font-black px-6 py-1 rounded-sm uppercase tracking-[0.2em] shadow-lg mb-2 transform -skew-x-[15deg]">FULL SET</span>
                            ${scoreBox}
                        </div>
                        
                        <div class="flex-1 flex flex-col items-center justify-center">
                            ${renderLogo(m.awayLogo)}
                            <span class="text-[42px] font-black font-oswald text-center uppercase tracking-wide drop-shadow-md text-white mt-4 leading-[1.1]">${m.away}</span>
                        </div>
                    </div>
                    
                    ${setScoresHtml}
                    ${dateInfo}

                    <!-- Stats / Form if needed -->
                    ${(m.venue || m.channel) ? `
                        <div class="mt-4 pt-4 border-t border-white/10 flex justify-center items-center gap-8 relative z-10 w-full max-w-[80%] mx-auto">
                           ${m.venue ? `<span class="text-[24px] text-gray-300"><i class="fas fa-map-marker-alt text-yellow-400 mr-2"></i>${m.venue}</span>` : ''}
                           ${(m.venue && m.channel) ? `<span class="text-[24px] text-gray-600">|</span>` : ''}
                           ${m.channel ? `<span class="text-[24px] text-gray-300"><i class="fas fa-tv text-blue-400 mr-2"></i>${m.channel}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('')}
            ${dots ? `<div class="flex items-center gap-3 px-8 bg-black/40 rounded-lg border border-white/10 backdrop-blur-sm h-16 self-center">${dots}</div>` : ''}
        </div>`;
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

        const m = t.results[0]; // Focuses on single match
        const dateInfo = m.date || m.time ? `<div class="mt-8 mb-4 text-center"><span class="bg-black/80 text-gray-300 px-5 py-2 text-[20px] font-bold tracking-[0.2em] rounded-full border border-gray-600 shadow-md">${m.date} ${m.time ? '• ' + m.time : ''} ${m.venue ? '• ' + m.venue : ''}</span></div>` : '';

        // Auto Arrange Volleyball (6 players per side: 3 front, 3 back)
        const applyFormation = (lineup, isHome) => {
            if (!lineup) return;
            // 6 standard positions: Setters/OH/MB etc mapped generically
            const positions = [
                { x: 25, y: 15 }, // Back Left
                { x: 50, y: 15 }, // Back Center
                { x: 75, y: 15 }, // Back Right
                { x: 25, y: 35 }, // Front Left
                { x: 50, y: 35 }, // Front Center
                { x: 75, y: 35 }, // Front Right
                { x: 80, y: 5 }   // Libero / Extra
            ];

            lineup.forEach((p, i) => {
                if (p.x !== undefined && p.y !== undefined) return;
                let pos = positions[i] || { x: 50 + (i * 2), y: 50 + (i * 2) };
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
                     onmousedown="window.VolleyballModule.onPlayerDragStart(event, '${teamStr}', ${index})"
                     ontouchstart="window.VolleyballModule.onPlayerDragStart(event, '${teamStr}', ${index})">
                    
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
            <div class="w-full h-full flex flex-col bg-gradient-to-b from-black/80 to-transparent p-4 pt-10">
                <!-- Header Custom -->
                <div class="flex items-center justify-center gap-4 mb-4 relative z-10 px-8">
                    ${t.leagueLogo ? `<img src="${t.leagueLogo}" class="h-[60px] object-contain drop-shadow-[0_5px_15px_rgba(255,255,255,0.4)]">` : ''}
                    <div class="flex flex-col text-center">
                        <span class="text-[14px] font-bold text-yellow-400 tracking-[0.3em] uppercase drop-shadow-md">STARTING LINEUP</span>
                        <h1 class="font-oswald text-[32px] font-black text-white uppercase leading-none drop-shadow-lg tracking-wide">${t.title || 'VOLLEYBALL MATCH'}</h1>
                    </div>
                </div>

                <!-- Matchup Card -->
                <div class="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg relative z-10 mx-6 mb-4">
                    <div class="flex justify-between items-center px-4">
                        <div class="flex-1 flex items-center justify-start gap-4">
                            <div class="w-[70px] h-[70px] rounded-full bg-blue-900/40 border-[3px] border-blue-400 p-1 flex items-center justify-center shadow-md">
                                ${m.homeLogo ? `<img src="${m.homeLogo}" class="w-full h-full object-contain drop-shadow-md">` : `<div class="w-full h-full bg-white/20 rounded-full"></div>`}
                            </div>
                            <span class="font-oswald font-black text-[28px] text-white uppercase drop-shadow-md text-left">${m.home}</span>
                        </div>
                        <div class="mx-4 relative flex-shrink-0">
                            <div class="w-12 h-12 bg-black/80 rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] relative z-20">
                                <span class="text-[18px] font-black font-oswald text-yellow-500 italic drop-shadow-md">VS</span>
                            </div>
                        </div>
                        <div class="flex-1 flex items-center justify-end gap-4">
                            <span class="font-oswald font-black text-[28px] text-white uppercase drop-shadow-md text-right">${m.away}</span>
                            <div class="w-[70px] h-[70px] rounded-full bg-red-900/40 border-[3px] border-red-400 p-1 flex items-center justify-center shadow-md">
                                ${m.awayLogo ? `<img src="${m.awayLogo}" class="w-full h-full object-contain drop-shadow-md">` : `<div class="w-full h-full bg-white/20 rounded-full"></div>`}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Volleyball Court -->
                <div class="flex-1 w-full mx-auto max-h-[850px] relative mt-2 mb-8 px-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                    <div id="lineup-pitch" class="w-full h-full rounded-2xl relative border-[4px] border-white/80 overflow-hidden shadow-2xl bg-orange-400">
                        <div class="absolute inset-0 bg-orange-500 opacity-30"></div>
                        <!-- Court Lines -->
                        <!-- Center Line -->
                        <div class="absolute top-[50%] left-0 w-full h-[4px] bg-white -mt-[2px] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                        <!-- Attack Lines -->
                        <div class="absolute top-[33.3%] left-0 w-full h-[3px] bg-white/70 -mt-[1px]"></div>
                        <div class="absolute top-[66.6%] left-0 w-full h-[3px] bg-white/70 -mt-[1px]"></div>

                        <!-- Inner Bounds margin -->
                        <div class="absolute inset-[5%] border-[3px] border-white pointer-events-none"></div>

                        <!-- Players -->
                        ${homePlayers}
                        ${awayPlayers}
                    </div>
                </div>
            </div>
        `;
    },
};
