/**
 * SmartParser v2 — SportsGenV4
 * Parses: JSON (direct) or raw text (Flashscore/Google copy-paste)
 * Universal output schema for all sports.
 */

export const SmartParser = {

    parse(rawInput, options = {}) {
        if (!rawInput?.trim()) return { success: false, message: 'Input kosong!' };
        const trimmed = rawInput.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) return this.parseJSON(trimmed, options);
        return this.parseRawText(trimmed, options);
    },

    parseJSON(str, options = {}) {
        try {
            const parsed = JSON.parse(str);
            if (Array.isArray(parsed)) {
                const isStandings = parsed[0] && 'pts' in parsed[0];
                return {
                    success: true, schema: isStandings
                        ? this._normalizeStandings(parsed, options)
                        : this._normalizeSchedule(parsed, options)
                };
            }

            if (parsed.match && typeof parsed.match === 'object') {
                const m = parsed.match;
                const s = parsed.statistics || {};

                const statsArray = [];
                if (s.ball_possession) statsArray.push({ name: 'Possession', home: s.ball_possession.home, away: s.ball_possession.away });
                if (s.total_shots) statsArray.push({ name: 'Shots', home: s.total_shots.home, away: s.total_shots.away });
                if (s.shots_on_target) statsArray.push({ name: 'On Target', home: s.shots_on_target.home, away: s.shots_on_target.away });
                if (s.corner_kicks) statsArray.push({ name: 'Corner Kicks', home: s.corner_kicks.home, away: s.corner_kicks.away });
                if (s.yellow_cards) statsArray.push({ name: 'Yellow Cards', home: s.yellow_cards.home, away: s.yellow_cards.away, isCard: true });
                if (s.red_cards) statsArray.push({ name: 'Red Cards', home: s.red_cards.home, away: s.red_cards.away, isCard: true });
                // Dynamic keys fallback
                for (const key in s) {
                    if (!['ball_possession', 'total_shots', 'shots_on_target', 'corner_kicks', 'yellow_cards', 'red_cards'].includes(key)) {
                        const val = s[key];
                        if (val && typeof val.home !== 'undefined' && typeof val.away !== 'undefined') {
                            const name = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            statsArray.push({ name: name, home: val.home, away: val.away, isCard: key.toLowerCase().includes('card') });
                        }
                    }
                }

                const parseScorers = (scorersArr) => {
                    if (!Array.isArray(scorersArr)) return '';
                    return scorersArr.map(sc => typeof sc === 'string' ? "⚽ " + sc : '').filter(Boolean).join('\\n');
                };

                return {
                    success: true, schema: {
                        sport: options.sport || 'football',
                        mode: 'results',
                        title: parsed.title || options.title || 'Detail Pertandingan',
                        matches: [{
                            date: m.date || '',
                            time: m.time || '',
                            home: m.home_team?.name || '',
                            away: m.away_team?.name || '',
                            venue: m.venue || '',
                            homeScore: m.home_team?.score ?? null,
                            awayScore: m.away_team?.score ?? null,
                            homeScorers: parseScorers(m.home_team?.scorers),
                            awayScorers: parseScorers(m.away_team?.scorers),
                            stats: statsArray,
                            homeLineup: [],
                            awayLineup: []
                        }],
                        standings: [],
                        topScorers: []
                    }
                };
            }

            return {
                success: true, schema: {
                    sport: parsed.sport || options.sport || 'football',
                    mode: parsed.mode || options.mode || 'schedule',
                    title: parsed.title || options.title || '',
                    matches: (parsed.matches || []).map(m => this._normalizeMatch(m)),
                    standings: (parsed.standings || []).map(s => this._normalizeStandingRow(s)),
                    topScorers: parsed.topScorers || [],
                }
            };
        } catch (e) {
            return { success: false, message: `JSON tidak valid: ${e.message}` };
        }
    },

    parseRawText(text, options = {}) {
        const standings = this._parseStandingsText(text, options);
        if (standings.success) return standings;
        const schedule = this._parseScheduleText(text, options);
        if (schedule.success) return schedule;
        return { success: false, message: 'Format tidak dikenali. Coba paste JSON atau seluruh tabel klasemen.' };
    },

    _parseStandingsText(text, options = {}) {
        // Strip "5 Terakhir" W/D/L form symbols (Google adds these as W W D L W or ✓ ✗ icons)
        // They appear as single chars or short tokens after the 8 numbers — we just cap at 8 nums
        // Also strip Google header labels and zone legends
        let clean = text
            .replace(/\b(5 Terakhir|5Terakhir|Terakhir)\b/gi, '')
            .replace(/\b(Liga Champions|Europa League|Conference League|Promosi|Degradasi|Play-?off)\b/gi, '')
            .replace(/\b(Musim|Klub|Klasemen)\b/gi, '')
            .replace(/[✓✗✔✘WDLwdl–—]{1,2}(?=[\s\n]|$)/g, '') // strip form icons
            .replace(/\t/g, '\n');                               // tabs → newlines

        const lines = clean.split(/\n/).map(l => l.trim()).filter(Boolean);
        const data = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // Try tab/space-separated single-line row: "1  Persib Bandung  20  15  2  3  31  11  20  47"
            const singleLine = line.match(/^(\d{1,2})\s+(.+?)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)/);
            if (singleLine) {
                data.push({
                    pos: parseInt(singleLine[1]), name: singleLine[2].trim(),
                    mp: +singleLine[3], w: +singleLine[4], d: +singleLine[5], l: +singleLine[6],
                    gf: +singleLine[7], ga: +singleLine[8], gd: +singleLine[9], pts: +singleLine[10], logo: ''
                });
                i++; continue;
            }

            // Multi-line mode: rank on own line, then name, then 8 numbers
            let rank = null, name = null, start = -1;
            if (/^[0-9]{1,2}$/.test(line) && i + 1 < lines.length && this._isName(lines[i + 1])) {
                rank = line; name = lines[i + 1]; start = i + 2;
            } else if (this._isName(line)) {
                name = line; start = i + 1;
            }

            if (name) {
                const nums = [];
                let off = 0;
                // Collect exactly 8 numbers (T M S K GM GK SG Poin) — stop at 8, ignore "5 Terakhir"
                while (start + off < lines.length && nums.length < 8 && /^-?[0-9]+$/.test(lines[start + off]))
                    nums.push(parseInt(lines[start + off++]));

                if (nums.length >= 8) {
                    // Google format: T(0) M(1) S(2) K(3) GM(4) GK(5) SG(6) Poin(7)
                    data.push({
                        pos: parseInt(rank) || (data.length + 1), name,
                        mp: nums[0], w: nums[1], d: nums[2], l: nums[3],
                        gf: nums[4], ga: nums[5], gd: nums[6], pts: nums[7], logo: ''
                    });
                    i = start + off; continue;
                } else if (nums.length === 7) {
                    // Fallback: 7 nums (no SG column), derive gd
                    data.push({
                        pos: parseInt(rank) || (data.length + 1), name,
                        mp: nums[0], w: nums[1], d: nums[2], l: nums[3],
                        gf: nums[4], ga: nums[5], gd: nums[4] - nums[5], pts: nums[6], logo: ''
                    });
                    i = start + off; continue;
                }
            }
            i++;
        }

        if (data.length < 2) return { success: false };
        return {
            success: true, schema: {
                sport: options.sport || 'football', mode: 'standings',
                title: options.title || '', standings: data, matches: []
            }
        };
    },

    _parseScheduleText(text, options = {}) {
        const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
        const matches = [];
        const vsRe = /^(.+?)\s+(?:vs\.?|VS|v)\s+(.+?)(?:\s+(\d{1,2}:\d{2}))?$/i;
        const dateRe = /^(?:Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu|Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i;
        let curDate = '', curTime = '';
        for (const line of lines) {
            if (dateRe.test(line)) { curDate = line; continue; }
            if (/^\d{1,2}:\d{2}$/.test(line)) { curTime = line; continue; }
            const m = line.match(vsRe);
            if (m) matches.push({
                date: curDate, time: m[3] || curTime,
                home: m[1].trim(), away: m[2].trim(), venue: '', channel: ''
            });
        }
        if (!matches.length) return { success: false };
        return {
            success: true, schema: {
                sport: options.sport || 'football', mode: 'schedule',
                title: options.title || '', matches, standings: []
            }
        };
    },

    _normalizeStandings(arr, opts = {}) {
        return {
            sport: opts.sport || 'football', mode: 'standings', title: opts.title || '',
            standings: arr.map((r, i) => this._normalizeStandingRow(r, i)), matches: []
        };
    },
    _normalizeSchedule(arr, opts = {}) {
        return {
            sport: opts.sport || 'football', mode: 'schedule', title: opts.title || '',
            matches: arr.map(m => this._normalizeMatch(m)), standings: []
        };
    },
    _normalizeStandingRow(r, idx = 0) {
        return {
            pos: r.pos ?? r.rank ?? (idx + 1), name: r.name ?? r.team ?? '',
            mp: r.mp ?? r.played ?? r.matches ?? 0, w: r.w ?? r.won ?? 0, d: r.d ?? r.drawn ?? 0, l: r.l ?? r.lost ?? 0,
            gf: r.gf ?? r.goalsFor ?? 0, ga: r.ga ?? r.goalsAgainst ?? 0,
            gd: r.gd ?? ((r.gf ?? 0) - (r.ga ?? 0)), pts: r.pts ?? r.points ?? 0, logo: r.logo ?? '',
            sets: r.sets ?? '0:0', form: r.form ?? []
        };
    },
    _normalizeMatch(m) {
        let hScorers = m.homeScorers ?? '';
        let aScorers = m.awayScorers ?? '';
        if (m.scorers && typeof m.scorers === 'object') {
            if (Array.isArray(m.scorers.home)) hScorers = m.scorers.home.map(s => typeof s === 'string' ? "⚽ " + s : '').filter(Boolean).join('\\n');
            if (Array.isArray(m.scorers.away)) aScorers = m.scorers.away.map(s => typeof s === 'string' ? "⚽ " + s : '').filter(Boolean).join('\\n');
        }

        return {
            date: m.date ?? '', time: m.time ?? '', home: m.home ?? m.homeTeam ?? '',
            away: m.away ?? m.awayTeam ?? '', venue: m.venue ?? m.stadium ?? '',
            channel: m.channel ?? m.tv ?? '', homeScore: m.homeScore ?? null, awayScore: m.awayScore ?? null,
            setScores: m.setScores ?? m.sets ?? '',
            homeScorers: hScorers, awayScorers: aScorers,
            stats: m.stats ?? [], homeLineup: m.homeLineup ?? [], awayLineup: m.awayLineup ?? []
        };
    },
    _isName(s) { return !/^[0-9]+$/.test(s) && s.length > 2 && s.length < 60; },

    getTemplate(mode) {
        const t = {
            standings: {
                sport: 'football', mode: 'standings', title: 'Liga Contoh', standings: [
                    { pos: 1, name: 'Tim A', mp: 10, w: 7, d: 2, l: 1, gf: 20, ga: 8, gd: 12, pts: 23 },
                    { pos: 2, name: 'Tim B', mp: 10, w: 6, d: 3, l: 1, gf: 18, ga: 10, gd: 8, pts: 21 }]
            },
            schedule: {
                sport: 'football', mode: 'schedule', title: 'Liga Contoh', matches: [
                    { date: 'Sabtu, 22 Feb 2026', time: '19:00', home: 'Tim A', away: 'Tim B', venue: 'Stadion X', channel: 'TV1' }]
            },
            results: {
                sport: 'football', mode: 'results', title: 'HASIL BRI SUPER LEAGUE', matches: [
                    {
                        date: 'Sabtu, 21 Februari 2026', time: '20:30', home: 'Madura United', away: 'Arema',
                        homeScore: 2, awayScore: 2, venue: 'Stadion Gelora Madura Ratu Pamelingan',
                        homeScorers: "⚽ Junior Brandão 45+1'\n⚽ Mendonca 88'",
                        awayScorers: "⚽ Dalberto 47'\n⚽ Joel Vinicius 51'",
                        stats: [
                            { name: 'Possession', home: 54, away: 46 },
                            { name: 'Shots', home: 26, away: 12 },
                            { name: 'On Target', home: 11, away: 4 },
                            { name: 'Corner Kicks', home: 11, away: 6 },
                            { name: 'Yellow Cards', home: 1, away: 3, isCard: true }
                        ]
                    }
                ]
            },
            lineup: {
                sport: 'football', mode: 'lineup', title: 'LINEUP PERTANDINGAN', matches: [
                    {
                        home: 'Persib', away: 'Persija', venue: 'Stadion Gelora Bandung Lautan Api', time: '15:30',
                        homeLineup: [
                            { name: 'Kevin', no: 1, pos: 'GK' }, { name: 'Nick', no: 2, pos: 'CB' }, { name: 'Marc', no: 10, pos: 'CM' }
                        ],
                        awayLineup: [
                            { name: 'Andritany', no: 26, pos: 'GK' }, { name: 'Ondrej', no: 15, pos: 'CB' }, { name: 'Ryo', no: 7, pos: 'CM' }
                        ]
                    }
                ]
            }
        };
        return JSON.stringify(t[mode] || t.schedule, null, 2);
    }
};
