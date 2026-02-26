/**
 * App Controller — SportsGenV4
 * Manages sport module switching and global events
 */

import { Football } from '../sports/football.js';
import { Volleyball } from '../sports/volleyball.js';
import { Badminton } from '../sports/badminton.js';

export const App = {
    currentSport: null,
    modules: {},

    async init() {
        // Lazy-init modules to avoid immediate mount
        this.modules = {
            football: Football,
            volleyball: Volleyball,
            badminton: Badminton,
        };

        // Sport Tab clicks
        document.querySelectorAll('.sport-tab').forEach(btn => {
            btn.addEventListener('click', () => this.switchSport(btn));
        });

        // Default sport from URL or fallback
        const urlSport = new URLSearchParams(location.search).get('sport') || 'football';
        const tab = document.querySelector(`[data-sport="${urlSport}"]`)
            || document.querySelector('.sport-tab');
        if (tab) this.switchSport(tab);
    },

    switchSport(btn) {
        document.querySelectorAll('.sport-tab').forEach(b => {
            b.classList.remove('bg-yellow-400', 'text-black', 'font-bold');
            b.classList.add('text-gray-400');
        });
        btn.classList.add('bg-yellow-400', 'text-black', 'font-bold');
        btn.classList.remove('text-gray-400');

        const sportName = btn.dataset.sport;
        const mod = this.modules[sportName];

        if (mod) {
            this.currentSport = mod;
            window.CurrentSportModule = mod;
            mod.mount();
        } else {
            document.getElementById('dynamic-controls').innerHTML =
                `<p class="text-gray-500 p-4 text-center">Modul <b>${sportName}</b> belum tersedia.</p>`;
            document.getElementById('render-view').innerHTML = '';
        }

        // Sync URL
        const url = new URL(location.href);
        url.searchParams.set('sport', sportName);
        history.replaceState({}, '', url);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
