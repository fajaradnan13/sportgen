/**
 * Asset Loader — SportsGenV4
 * Upload, store, retrieve logos/backgrounds via IndexedDB
 */

import { DB } from './db.js';

export const AssetLoader = {

    async upload(file, sport, type, name) {
        return new Promise((resolve, reject) => {
            if (!file) return reject(new Error('No file'));
            const reader = new FileReader();
            reader.onload = async (e) => {
                await DB.saveAsset(sport, type, name, e.target.result);
                resolve({ name, base64: e.target.result });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    async batchUpload(fileList, sport, type, onProgress = null) {
        const results = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const name = file.name.replace(/\.[^.]+$/, '');
            try {
                results.push({ success: true, ...(await this.upload(file, sport, type, name)) });
            } catch (e) {
                results.push({ success: false, name, error: e.message });
            }
            if (onProgress) onProgress(i + 1, fileList.length);
        }
        return results;
    },

    async get(sport, type, name) { return DB.getAsset(sport, type, name); },
    async getAll(sport, type) { return DB.getAssetsByType(sport, type); },
    async delete(sport, type, name) { return DB.deleteAsset(sport, type, name); },

    async renderGallery(containerId, { sport, type, onSelect, onDelete }) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const assets = await this.getAll(sport, type);
        const entries = Object.entries(assets);

        if (!entries.length) {
            container.innerHTML = `<p class="text-gray-500 text-[10px] text-center py-2">Belum ada asset.</p>`;
            return;
        }

        container.innerHTML = `<div class="grid grid-cols-4 gap-1 mt-1">
            ${entries.map(([name, src]) => `
                <div class="relative group rounded border border-gray-700 bg-gray-800 p-1 cursor-pointer text-center"
                    title="${name}" onclick="window.__assetPick?.('${sport}','${type}','${name}')">
                    <img src="${src}" class="w-full aspect-square object-contain rounded">
                    <p class="text-[7px] text-gray-400 truncate">${name}</p>
                    <button onclick="event.stopPropagation();window.__assetDel?.('${sport}','${type}','${name}')"
                        class="absolute top-0 right-0 hidden group-hover:block bg-red-600 text-white rounded text-[8px] px-1">✕</button>
                </div>`).join('')}
        </div>`;

        window.__assetPick = (s, t, n) => onSelect?.(s, t, n, assets[n]);
        window.__assetDel = async (s, t, n) => {
            await this.delete(s, t, n);
            await this.renderGallery(containerId, { sport, type, onSelect, onDelete });
            onDelete?.(s, t, n);
        };
    }
};
