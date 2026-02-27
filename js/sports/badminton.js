/**
 * Badminton Module — SportsGenV4
 * Specialized for: Jadwal & Hasil (Focus Tim Indonesia)
 */

import { DB } from '../core/db.js';
import { SmartParser } from '../utils/smartParser.js';
import { AssetRegistry } from '../core/AssetRegistry.js';

export const Badminton = {
    PRESET_LEAGUES: [
        'INDONESIA OPEN 2026',
        'INDONESIA MASTERS 2026',
        'ALL ENGLAND 2026',
        'WORLD CHAMPIONSHIPS 2026',
        'THOMAS & UBER CUP 2026',
        'SUDIRMAN CUP 2026',
        'BWF WORLD TOUR FINALS 2026'
    ],

    RESULTS_PER_PAGE: 4,

    THEMES: {
        'red': { name: '🔴 Indonesia Red', header: 'bg-gradient-to-r from-red-700 to-red-600 text-white', odd: 'bg-slate-800/95', even: 'bg-slate-700/95', border: 'border-red-500/30', accent: 'text-red-400' },
        'blue': { name: '🔵 BWF Blue', header: 'bg-gradient-to-r from-blue-800 to-blue-600 text-white', odd: 'bg-slate-800/95', even: 'bg-slate-700/95', border: 'border-blue-500/30', accent: 'text-blue-400' },
        'dark': { name: '⚫ Emerald Night', header: 'bg-gray-900 border-b-2 border-emerald-700 text-white', odd: 'bg-gray-900/90', even: 'bg-gray-800/90', border: 'border-gray-700', accent: 'text-emerald-400' },
        'gold': { name: '🏆 Golden Trophy', header: 'bg-gradient-to-r from-yellow-700 to-yellow-500 text-white', odd: 'bg-yellow-950/90', even: 'bg-yellow-900/90', border: 'border-yellow-500/30', accent: 'text-yellow-300' },
        'purple': { name: '🟣 Ultra Purple', header: 'bg-gradient-to-r from-purple-800 to-fuchsia-600 text-white', odd: 'bg-purple-900/90', even: 'bg-fuchsia-900/90', border: 'border-purple-500/30', accent: 'text-purple-300' },
        'neon': { name: '⚡ Neon Cyber', header: 'bg-black border-b border-cyan-500 text-cyan-400', odd: 'bg-cyan-950/20', even: 'bg-blue-950/20', border: 'border-cyan-500/40', accent: 'text-cyan-300' }
    },

    CSS_THEMES: [
        { key: 'none', label: '🌙 Gelap', bg: 'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
        { key: 'glass', label: '🧊 Glass', bg: 'linear-gradient(135deg, #1e2238, #111827)' },
        { key: 'neon', label: '⚡ Neon', bg: '#0d001a' },
        { key: 'broadcast', label: '📺 Siaran', bg: 'linear-gradient(180deg, #001340 0%, #002280 30%, #003090 60%, #001340 100%)' },
        { key: 'luxury', label: '💎 Luxury', bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
        { key: 'carbon', label: '🎬 Carbon', bg: 'radial-gradient(circle at center, #2c3e50, #000000)' }
    ],

    TEMPLATES: {
        schedule: JSON.stringify({ sport: "badminton", mode: "schedule", title: "INDONESIA OPEN 2026", matches: [{ date: "RABU, 14 JUNI 2026", time: "10:00", category: "MS", home: "Jonatan Christie (INA)", away: "Viktor Axelsen (DEN)", venue: "Istora Senayan", channel: "MNCTV", isIndonesia: true }, { date: "RABU, 14 JUNI 2026", time: "11:30", category: "MD", home: "Fajar/Rian (INA)", away: "Liang/Wang (CHN)", venue: "Istora Senayan", isIndonesia: true }] }, null, 2),
        results: JSON.stringify({ sport: "badminton", mode: "results", title: "INDONESIA OPEN 2026", matches: [{ date: "SELASA, 13 JUNI 2026", category: "WS", home: "Gregoria Mariska (INA)", away: "Akane Yamaguchi (JPN)", homeScore: 2, awayScore: 1, setScores: "21-18, 15-21, 21-19", isIndonesia: true }] }, null, 2),
    },

    data: {
        currentView: 'schedule', // schedule, results
        title: 'INDONESIA OPEN 2026',
        week: 'BABAK 32 BESAR',
        season: '2026',
        category: 'UMUM',

        // Settings
        theme: 'red',
        cardTheme: 'none',
        bgImage: '',
        bgOpacity: 0.6,
        animation: 'anim-slide',
        animDuration: 0.8,
        animStagger: 0.1,
        animLoop: false,
        animLoopInterval: 5,
        resultsPage: 0,
        schedulePage: 0,
        loopTimer: null,
        onlyIndonesia: false,

        leagueLogo: '',
        savedBackgrounds: {},
        savedCompetitionLogos: {},

        // Core Data
        schedule: [],
        results: []
    },

    async mount() {
        console.log("[BadmintonModule] Mounting...");
        window.BadmintonModule = this;
        window.CurrentSportModule = this;
        window.addEventListener('magic-paste', (e) => this.applyMagicPaste(e.detail.input));

        await DB.init();
        await this._loadSavedAssets();

        // Load some default data if empty
        if (!this.data.schedule.length && !this.data.results.length) {
            const t = JSON.parse(this.TEMPLATES.schedule);
            this.data.schedule = t.matches;
            this.data.title = t.title;
        }

        this.startPageLoop();
        this.renderControls();
        this.renderView();
    },

    async _loadSavedAssets() {
        this.data.savedBackgrounds = await DB.getAllBackgrounds();
        // Assume logos are also there
    },

    startPageLoop() {
        this.stopPageLoop();
        if (!this.data.animLoop) return;
        this.data.loopTimer = setInterval(() => {
            const matchData = this._getFilteredData();
            const totalPages = Math.ceil(matchData.length / 3); // 3 per page

            if (totalPages > 1) {
                if (this.data.currentView === 'schedule') {
                    this.data.schedulePage = (this.data.schedulePage + 1) % totalPages;
                } else {
                    this.data.resultsPage = (this.data.resultsPage + 1) % totalPages;
                }
                this.renderView();
            }
        }, (this.data.animLoopInterval || 5) * 1000);
    },

    stopPageLoop() {
        if (this.data.loopTimer) {
            clearInterval(this.data.loopTimer);
            this.data.loopTimer = null;
        }
    },

    _getFilteredData() {
        const t = this.data;
        let matchData = t.currentView === 'results' ? t.results : t.schedule;
        if (t.onlyIndonesia) {
            matchData = matchData.filter(m => m.isIndonesia);
        }
        return matchData;
    },

    renderControls() {
        const container = document.getElementById('dynamic-controls');
        if (!container) return;
        const t = this.data;

        container.innerHTML = `
            <!-- Mode Tabs -->
            <div class="mb-3 border-b border-gray-600 pb-2">
                <div class="flex bg-gray-900 rounded p-0.5 gap-0.5">
                    ${['schedule', 'results'].map(m => `
                        <button onclick="window.BadmintonModule.setMode('${m}')"
                            class="${t.currentView === m ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'} flex-1 py-1 rounded text-[10px] font-bold transition text-nowrap">
                            ${m === 'schedule' ? 'Jadwal' : 'Hasil'}
                        </button>`).join('')}
                </div>
            </div>

            <!-- Smart Paste Area -->
            <div class="bg-gray-800 p-2 rounded border border-gray-600 mb-3 shadow">
                <div class="flex justify-between items-center mb-1">
                    <label class="text-[10px] text-red-400 font-bold block"><i class="fas fa-magic"></i> SMART PASTE (BADMINTON)</label>
                </div>
                <textarea id="sidebar-paste-input" rows="3"
                    class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[10px] text-white font-mono mb-1 custom-scrollbar"
                    placeholder="Paste JSON jadwal/hasil..."></textarea>
                <div class="flex gap-1 mb-2">
                    <span class="text-[9px] text-gray-400 self-center">Template:</span>
                    <button onclick="document.getElementById('sidebar-paste-input').value = window.BadmintonModule.TEMPLATES.schedule" class="text-[9px] bg-gray-700 hover:bg-gray-600 px-1 py-0.5 rounded">Jadwal</button>
                    <button onclick="document.getElementById('sidebar-paste-input').value = window.BadmintonModule.TEMPLATES.results" class="text-[9px] bg-gray-700 hover:bg-gray-600 px-1 py-0.5 rounded">Hasil</button>
                </div>
                <button onclick="window.BadmintonModule.applySmartPaste()" class="w-full bg-red-600 hover:bg-red-500 text-white py-1.5 rounded text-[10px] font-bold shadow">
                    PROSES DATA
                </button>
            </div>

            <div class="space-y-3">
                <!-- GENERAL SETTINGS -->
                <div>
                    <label class="block text-[10px] text-gray-400 mb-0.5">Tournament Title</label>
                    <input type="text" id="inpTitle" value="${t.title}" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[11px] text-white uppercase font-bold outline-none" oninput="window.BadmintonModule.updateData(event)">
                </div>
                
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-[10px] text-gray-400 mb-0.5">Pekan / Babak</label>
                        <input type="text" id="inpWeek" value="${t.week}" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[11px] text-white" oninput="window.BadmintonModule.updateData(event)">
                    </div>
                    <div>
                        <label class="block text-[10px] text-gray-400 mb-0.5">Musim</label>
                        <input type="text" id="inpSeason" value="${t.season}" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[11px] text-white" oninput="window.BadmintonModule.updateData(event)">
                    </div>
                </div>

                <!-- FILTER: Indonesia -->
            <div class="bg-red-950/30 border border-red-500/20 p-2 rounded">
                <div class="flex items-center justify-between mb-2">
                    <label class="text-[10px] text-red-300 font-bold"><i class="fas fa-flag-checkered mr-1"></i> FOKUS INDONESIA</label>
                    <input type="checkbox" id="chkOnlyINA" ${t.onlyIndonesia ? 'checked' : ''} onchange="window.BadmintonModule.updateToggle(event)" class="accent-red-500">
                </div>
                <div class="flex items-center justify-between">
                     <label class="text-[10px] text-blue-400 font-bold">ANIMASI & LOOP</label>
                     <input type="checkbox" id="chkAnimLoop" ${t.animLoop ? 'checked' : ''} onchange="window.BadmintonModule.updateToggle(event)" class="accent-blue-500">
                </div>
                <div class="grid grid-cols-2 gap-2 mt-2">
                    <select id="inpAnimation" class="bg-gray-800 text-[9px] rounded px-1 py-1 border border-gray-600 text-white" onchange="window.BadmintonModule.updateData(event)">
                        <option value="anim-slide-up" ${t.animation === 'anim-slide-up' ? 'selected' : ''}>Slide Up</option>
                        <option value="anim-fade-in" ${t.animation === 'anim-fade-in' ? 'selected' : ''}>Fade In</option>
                        <option value="anim-zoom-in" ${t.animation === 'anim-zoom-in' ? 'selected' : ''}>Zoom In</option>
                    </select>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] text-gray-500">Int:</span>
                        <input type="number" id="inpAnimLoopInterval" value="${t.animLoopInterval}" class="w-full bg-gray-800 text-[9px] px-1 py-1 border border-gray-600 text-white" oninput="window.BadmintonModule.updateData(event)">
                    </div>
                </div>
            </div>

            <!-- VISUALS -->
            <div class="border-t border-gray-700 pt-2 grid grid-cols-2 gap-2">
                <div>
                    <label class="block text-[10px] text-gray-400 mb-0.5">Warna Tema</label>
                    <select id="inpTheme" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[10px] text-white" onchange="window.BadmintonModule.updateData(event)">
                        ${Object.keys(this.THEMES).map(k => `<option value="${k}" ${t.theme === k ? 'selected' : ''}>${this.THEMES[k].name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] text-gray-400 mb-0.5">Bg Canvas</label>
                    <select id="inpCardTheme" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[10px] text-white" onchange="window.BadmintonModule.updateData(event)">
                        ${this.CSS_THEMES.map(c => `<option value="${c.key}" ${t.cardTheme === c.key ? 'selected' : ''}>${c.label}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="space-y-2">
                <div>
                    <div class="flex justify-between mb-0.5">
                        <label class="block text-[10px] text-gray-400">Background Image</label>
                        <span class="text-[9px] text-gray-500">${Math.round(t.bgOpacity * 100)}%</span>
                    </div>
                    <select id="inpBgImage" class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-[10px] text-white outline-none font-bold" onchange="window.BadmintonModule.updateData(event)">
                         <option value="">None / Gradient</option>
                        <optgroup label="Upload Kustom">
                            ${Object.keys(t.savedBackgrounds || {}).map(id => `
                                <option value="db:${id}" ${t.bgImage === 'db:' + id ? 'selected' : ''}>Kustom ${id.replace('bg_', '')}</option>
                            `).join('')}
                        </optgroup>
                    </select>
                    <input type="range" id="inpBgOpacity" min="0" max="1" step="0.1" value="${t.bgOpacity}" 
                        class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500 mt-2"
                        oninput="window.BadmintonModule.updateData(event)">
                     <div class="mt-1 flex gap-1">
                        <button onclick="document.getElementById('inpBgFileBadminton').click()" class="flex-1 bg-gray-600 text-white text-[9px] py-1 rounded">Upload BG</button>
                        <input id="inpBgFileBadminton" type="file" accept="image/*" class="hidden" onchange="window.BadmintonModule.handleBgUpload(this)">
                        
                        <button onclick="document.getElementById('inpLogoFileBadminton').click()" class="flex-1 bg-blue-600 text-white text-[9px] py-1 rounded">Upload Logo</button>
                        <input id="inpLogoFileBadminton" type="file" accept="image/*" class="hidden" onchange="window.BadmintonModule.handleLogoUpload(this)">
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Spacer to fix scroll clipping -->
        <div class="h-32 w-full"></div>
        `;
    },

    setMode(m) {
        this.data.currentView = m;
        this.renderControls();
        this.renderView();
    },

    updateData(e) {
        const { id, value } = e.target;
        if (id === 'inpTitle') this.data.title = value;
        else if (id === 'inpWeek') this.data.week = value;
        else if (id === 'inpSeason') this.data.season = value;
        else if (id === 'inpTheme') this.data.theme = value;
        else if (id === 'inpCardTheme') this.data.cardTheme = value;
        else if (id === 'inpAnimation') this.data.animation = value;
        else if (id === 'inpAnimLoopInterval') {
            this.data.animLoopInterval = parseInt(value) || 5;
            this.startPageLoop();
        }
        else if (id === 'inpBgImage') {
            this.data.bgImage = value;
            this.renderControls();
        }
        else if (id === 'inpBgOpacity') {
            this.data.bgOpacity = parseFloat(value);
        }
        this.renderView();
    },

    updateToggle(e) {
        const { id, checked } = e.target;
        if (id === 'chkOnlyINA') this.data.onlyIndonesia = checked;
        else if (id === 'chkAnimLoop') {
            this.data.animLoop = checked;
            this.startPageLoop();
        }
        this.renderView();
    },

    async handleBgUpload(input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const id = 'bg_' + Date.now().toString();
            await DB.saveBackground(id, e.target.result);
            await this._loadSavedAssets();
            this.data.bgImage = 'db:' + id;
            this.renderControls();
            this.renderView();
        };
        reader.readAsDataURL(file);
    },

    async handleLogoUpload(input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const id = 'logo_' + Date.now().toString();
            await DB.saveBackground(id, e.target.result); // Save in same store for binary
            await this._loadSavedAssets();
            this.data.leagueLogo = 'db:' + id;
            this.renderControls();
            this.renderView();
        };
        reader.readAsDataURL(file);
    },

    async applySmartPaste() {
        const raw = document.getElementById('sidebar-paste-input').value;
        if (!raw) return;
        const result = SmartParser.parse(raw, { sport: 'badminton', mode: this.data.currentView });
        if (!result.success) { alert(`❌ Parse Error: ${result.message}`); return; }

        if (result.schema.title) this.data.title = result.schema.title;
        if (result.schema.mode === 'results') {
            this.data.results = result.schema.matches;
            this.data.currentView = 'results';
        } else {
            this.data.schedule = result.schema.matches;
            this.data.currentView = 'schedule';
        }
        this.renderControls();
        this.renderView();
    },

    renderView() {
        const t = this.data;
        const theme = this.THEMES[t.theme] || this.THEMES['red'];

        // Background resolve
        const bgEl = document.getElementById('render-bg');
        const bgImgEl = document.getElementById('render-bg-image');
        if (bgEl && bgImgEl) {
            const cssTheme = this.CSS_THEMES.find(c => c.key === t.cardTheme) || this.CSS_THEMES[0];

            if (t.bgImage) {
                bgEl.style.background = '#000'; // Pure black backdrop for clarity
            } else {
                bgEl.style.background = cssTheme.bg;
            }

            if (t.bgImage) {
                let bgUrl = t.bgImage;
                if (bgUrl.startsWith('db:')) {
                    const id = bgUrl.replace('db:', '');
                    bgUrl = (t.savedBackgrounds && t.savedBackgrounds[id]) ? t.savedBackgrounds[id] : '';
                }
                bgImgEl.style.backgroundImage = `url("${bgUrl}")`;
                bgImgEl.style.display = 'block';
                bgImgEl.style.opacity = t.bgOpacity;
                bgImgEl.style.mixBlendMode = 'normal';
            } else {
                bgImgEl.style.display = 'none';
                bgImgEl.style.mixBlendMode = 'overlay';
            }
        }

        this._renderHeader();

        const view = document.getElementById('render-view');
        if (!view) return;

        const isResult = t.currentView === 'results';
        const matchData = this._getFilteredData();
        const pageIdx = isResult ? t.resultsPage : t.schedulePage;
        const pageData = matchData.slice(pageIdx * 3, (pageIdx + 1) * 3); // 3 per page

        if (!matchData.length) {
            view.innerHTML = `<div class="h-full flex items-center justify-center text-white/30 text-5xl italic font-oswald uppercase tracking-widest">Tidak ada data ${isResult ? 'hasil' : 'jadwal'}</div>`;
            return;
        }

        view.innerHTML = `
            <div class="px-10 flex flex-col gap-6 pt-4">
                ${pageData.map((m, idx) => this._renderMatchCard(m, isResult, idx)).join('')}
            </div>
        `;

        this._renderFooter();
    },

    _renderMatchCard(m, isResult, idx) {
        const t = this.data;
        const theme = this.THEMES[t.theme] || this.THEMES['red'];
        const delay = idx * (t.animStagger || 0.1);
        const anim = t.animation || 'anim-slide-up';
        const isINA = m.isIndonesia;

        // Visual for INA vs non-INA
        let cardStyle = '';
        const inaSuffix = isINA ? 'border-left: 12px solid #ef4444; box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);' : 'border-left: 8px solid rgba(255,255,255,0.2);';

        // Base theme style
        if (t.theme === 'neon') {
            cardStyle = `background: rgba(0,0,0,0.7); border-bottom: 2px solid rgba(34, 211, 238, 0.3); ${isINA ? 'border-left: 12px solid #ef4444;' : 'border-left: 8px solid #22d3ee;'}`;
        } else if (t.theme === 'gold') {
            cardStyle = `background: linear-gradient(135deg, rgba(80, 60, 0, 0.7) 0%, rgba(0, 0, 0, 0.8) 100%); ${isINA ? 'border-left: 12px solid #ef4444;' : 'border-left: 8px solid #fbbf24;'}`;
        } else if (t.theme === 'dark') {
            cardStyle = `background: rgba(15, 23, 42, 0.9); ${isINA ? 'border-left: 12px solid #ef4444;' : 'border-left: 8px solid #10b981;'}`;
        } else if (t.theme === 'purple') {
            cardStyle = `background: linear-gradient(135deg, rgba(88, 28, 135, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%); ${isINA ? 'border-left: 12px solid #ef4444;' : 'border-left: 8px solid #d946ef;'}`;
        } else if (t.theme === 'blue') {
            cardStyle = `background: linear-gradient(135deg, rgba(30, 58, 138, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%); ${isINA ? 'border-left: 12px solid #ef4444;' : 'border-left: 8px solid #3b82f6;'}`;
        } else {
            // RED theme or default
            cardStyle = isINA
                ? 'background: linear-gradient(135deg, rgba(185, 28, 28, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%); border-left: 12px solid #ef4444; box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);'
                : 'background: rgba(255,255,255,0.05); border-left: 8px solid rgba(255,255,255,0.2);';
        }

        return `
            <div class="w-full rounded-[30px] p-6 flex flex-col gap-3 relative overflow-hidden backdrop-blur-xl border border-white/10 ${anim}"
                style="${cardStyle} animation-delay: ${delay}s; animation-fill-mode: both;">
                
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <span class="bg-white text-black text-xl font-black px-3 py-1 rounded-lg font-oswald shadow-lg">${m.category || '🏸'}</span>
                        <span class="text-white/80 text-xl font-bold tracking-widest uppercase font-roboto drop-shadow">${m.date} ${m.time ? '• ' + m.time : ''}</span>
                    </div>
                    ${isINA ? `
                        <div class="bg-red-600 text-white px-5 py-1 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">
                            <span class="text-lg font-black tracking-tighter">🇮🇩 TEAM INDONESIA</span>
                        </div>
                    ` : ''}
                </div>

                <div class="flex items-center justify-between mt-1">
                    <div class="flex-1 flex flex-col justify-center items-start">
                        <span class="text-[44px] font-black text-white leading-tight drop-shadow-2xl font-oswald uppercase ${isINA && m.home.includes('INA') ? 'text-yellow-400' : ''}">${m.home}</span>
                    </div>

                    <div class="w-40 flex flex-col items-center">
                        ${isResult ? `
                            <div class="flex items-center gap-4 bg-black/50 px-6 py-2 rounded-2xl border border-white/20 shadow-2xl">
                                <span class="text-6xl font-black text-white font-oswald drop-shadow-lg">${m.homeScore ?? '-'}</span>
                                <span class="text-4xl text-yellow-400 font-bold">:</span>
                                <span class="text-6xl font-black text-white font-oswald drop-shadow-lg">${m.awayScore ?? '-'}</span>
                            </div>
                        ` : `
                            <div class="bg-white/10 px-5 py-2 rounded-xl text-xl text-white font-black uppercase tracking-[0.2em] italic border border-white/5">VS</div>
                        `}
                    </div>

                    <div class="flex-1 flex flex-col justify-center items-end">
                        <span class="text-[44px] font-black text-white text-right leading-tight drop-shadow-2xl font-oswald uppercase ${isINA && m.away.includes('INA') ? 'text-yellow-400' : ''}">${m.away}</span>
                    </div>
                </div>

                ${m.setScores ? `
                    <div class="mt-2 flex justify-center items-center gap-5 bg-white/5 py-2 rounded-xl border border-white/10">
                        <span class="text-white/40 text-lg font-black uppercase tracking-[0.3em] font-oswald">Details:</span>
                        <span class="text-3xl font-black text-yellow-400 tracking-[0.15em] font-mono drop-shadow-md">${m.setScores}</span>
                    </div>
                ` : ''}
                
                <div class="mt-2 text-white/50 text-xl flex items-center justify-center gap-8 font-medium italic">
                    ${m.venue ? `<span class="flex items-center gap-2"><i class="fas fa-location-dot text-red-500/50"></i> ${m.venue}</span>` : ''}
                    ${m.channel ? `<span class="flex items-center gap-2"><i class="fas fa-tv text-blue-400/50"></i> ${m.channel}</span>` : ''}
                </div>
            </div>
        `;
    },

    _renderHeader() {
        const header = document.getElementById('render-header');
        if (!header) return;
        const t = this.data;
        const theme = this.THEMES[t.theme] || this.THEMES['red'];

        // Resolve logo
        let logoUrl = t.leagueLogo;
        if (logoUrl && logoUrl.startsWith('db:')) {
            const id = logoUrl.replace('db:', '');
            logoUrl = (t.savedBackgrounds && t.savedBackgrounds[id]) ? t.savedBackgrounds[id] : '';
        }

        header.innerHTML = `
            <div class="flex gap-4 w-full items-stretch px-8 pt-6 animate-fadeup">
                <div class="flex-1 flex items-center gap-6 px-10 py-6 rounded-[40px] backdrop-blur-3xl border-2 shadow-2xl ${t.theme === 'neon' ? 'border-cyan-500/50 bg-black/40' : (t.theme === 'gold' ? 'border-yellow-500/50 bg-yellow-950/20' : 'border-white/20 bg-white/10')}"
                    style="box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                    
                    <div class="group relative cursor-pointer" onclick="document.getElementById('inpLogoFileBadminton').click()">
                        <div class="w-24 h-24 ${theme.header.split(' ')[0]} rounded-[24px] flex items-center justify-center shadow-2xl overflow-hidden border border-white/20">
                            ${logoUrl ? `<img src="${logoUrl}" class="w-full h-full object-contain">` : `<span class="text-5xl">🏸</span>`}
                        </div>
                        <div class="absolute inset-0 bg-black/60 rounded-[24px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fas fa-camera text-white text-xl"></i>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center gap-4 mb-2">
                             <span class="${theme.header} px-5 py-1.5 text-xl font-black rounded-full uppercase tracking-widest shadow-lg border border-white/20">
                                 BADMINTON
                             </span>
                             <span class="text-white text-xl font-oswald tracking-widest bg-white/10 px-5 py-1.5 rounded-full border border-white/10 shadow-lg font-bold">${t.season}</span>
                        </div>
                        <h1 class="font-oswald font-black text-white leading-[1] drop-shadow-2xl tracking-tighter uppercase flex flex-col">
                            <span class="text-[28px] ${theme.accent} mb-1 tracking-normal drop-shadow-md font-bold">${t.currentView === 'schedule' ? 'Jadwal Pertandingan' : 'Hasil Pertandingan'}</span>
                            <span class="text-[52px]">${t.title}</span>
                        </h1>
                        <div class="mt-2 flex items-center gap-4">
                            <span class="text-[32px] font-black text-white font-roboto drop-shadow tracking-[0.1em] bg-red-600/60 px-6 py-1 rounded-2xl border border-white/10">${t.week}</span>
                        </div>
                    </div>
                </div>
            </div>`;
    },

    _renderFooter() {
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
                    animation: ticker-scroll 40s linear infinite;
                    font-weight: 800;
                }
            </style>
            <div class="w-full flex flex-col gap-2">
                <!-- Ticker -->
                <div class="w-full overflow-hidden bg-black/40 backdrop-blur-md py-2 border-y border-white/10 flex items-center gap-6">
                    <div class="flex-shrink-0 flex items-center gap-3 px-6 border-r border-yellow-500/50">
                        <img src="assets/channel/logos/logo djafarsport.png" class="h-10 w-10 object-contain rounded-full" onerror="this.style.display='none'">
                        <span class="font-oswald text-2xl font-black text-yellow-400 tracking-wide">djafarSport</span>
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <span class="ticker-inner font-roboto text-2xl text-white/80">
                            Terus dukung perjuangan tim Indonesia &nbsp;🇮🇩&nbsp;&nbsp; Like & subscribe channel &nbsp;<strong class="text-yellow-400">djafarSport</strong>&nbsp; untuk update terbaru &nbsp;🔥&nbsp;&nbsp;•&nbsp;&nbsp;
                            Terus dukung perjuangan tim Indonesia &nbsp;🇮🇩&nbsp;&nbsp; Like & subscribe channel &nbsp;<strong class="text-yellow-400">djafarSport</strong>&nbsp; untuk update terbaru &nbsp;🔥&nbsp;&nbsp;•&nbsp;&nbsp;
                        </span>
                    </div>
                </div>

                <div class="w-full flex items-center justify-between px-10 pb-4">
                    <div class="flex items-center gap-4 opacity-70">
                        <span class="font-oswald text-[28px] font-black text-white/40 tracking-tighter">#ShortsGenBadminton</span>
                    </div>
                    <div class="text-right">
                         <span class="font-roboto text-[24px] text-white/30 font-bold uppercase tracking-[0.2em]">Live on MNCTV / iNews</span>
                    </div>
                </div>
            </div>`;
    },
};
