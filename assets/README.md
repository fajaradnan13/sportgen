# SportsGenV4 — Assets

Static assets untuk deployment di **Cloudflare Pages**.

---

## Struktur Folder

```
assets/
├── manifest.json          ← Update tiap kali tambah file!
├── football/
│   ├── logos/
│   │   ├── liga1-indonesia/    ← Logo klub Liga 1 (BRI Super League)
│   │   ├── liga2-indonesia/
│   │   ├── champions-league/
│   │   ├── premier-league/
│   │   ├── la-liga/
│   │   ├── bundesliga/
│   │   ├── serie-a/
│   │   ├── ligue-1/
│   │   ├── eredivisie/
│   │   ├── piala-presiden/
│   │   ├── piala-indonesia/
│   │   ├── asean-championship/
│   │   └── afc-champions/
│   ├── league-badges/          ← Logo/badge kompetisi (bukan klub)
│   └── backgrounds/            ← Background foto/grafis sepak bola
├── volleyball/
│   ├── logos/
│   │   ├── proliga/
│   │   ├── world-championship/
│   │   └── sea-games/
│   └── backgrounds/
├── channel/
│   └── logos/                  ← Logo stasiun TV / channel (watermark)
└── misc/                       ← Asset lain-lain
```

---

## Konvensi Penamaan File

| Tipe | Format | Contoh |
|------|--------|--------|
| Logo klub | `nama-klub.png` | `persib-bandung.png` |
| Logo liga | `nama-liga.png` | `liga1-indonesia.png` |
| Background | `nama-deskriptif.jpg` | `stadium-night.jpg` |
| Channel logo | `nama-channel.png` | `indosiar.png` |

**Tips:**
- Gunakan huruf **kecil semua**, pisah dengan `-`
- Format: **PNG** (logo, transparan), **JPG/WEBP** (background)
- Ukuran logo: min **200x200px**, PNG transparan
- Ukuran background: **1080x1920px** (portrait) atau **1920x1080px** (landscape)

---

## Cara Tambah Asset Baru

### 1. Tambah file ke folder yang sesuai
```
assets/football/logos/liga1-indonesia/persib-bandung.png
```

### 2. Update `manifest.json`
Buka `assets/manifest.json`, cari section yang sesuai, tambahkan nama file ke array `files`:
```json
"liga1-indonesia": {
  "label": "Liga 1 Indonesia (BRI Super League)",
  "path": "assets/football/logos/liga1-indonesia/",
  "files": [
    "persib-bandung.png",
    "persija-jakarta.png"
  ]
}
```

### 3. Deploy ke Cloudflare Pages
File statis akan otomatis tersedia di URL:
```
https://your-site.pages.dev/assets/football/logos/liga1-indonesia/persib-bandung.png
```

---

## Menggunakan AssetRegistry di Kode

```javascript
import { AssetRegistry } from './js/core/AssetRegistry.js';

// Init sekali saat startup
await AssetRegistry.init();

// Ambil semua logo Liga 1
const logos = AssetRegistry.getLogos('football', 'liga1-indonesia');
// => [{ name: 'persib-bandung', url: 'assets/football/logos/liga1-indonesia/persib-bandung.png' }]

// Cari logo klub berdasarkan nama
const url = AssetRegistry.findClubLogo('football', 'liga1-indonesia', 'Persib');
// => 'assets/football/logos/liga1-indonesia/persib-bandung.png'

// Background
const bgs = AssetRegistry.getBackgrounds('football');

// Channel logos (watermark)
const channels = AssetRegistry.getChannelLogos();
```
