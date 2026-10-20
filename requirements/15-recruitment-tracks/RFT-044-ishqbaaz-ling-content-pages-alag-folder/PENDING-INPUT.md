# PENDING-INPUT — RFT-044 (Ishqbaaz Ling content pages)

**Aapka jawab:** 4 alag pages (Ling, Kochka, Kochhani, Gautam) + contributors. ✅ Ye ban chuka hai.

**Sirf value bhar rahi hai** → `site\src\data.js` → `ishqbaazLingPages`

| Page | `url` | Abhi |
|---|---|---|
| Ling | 0 | `''` — 👈 link daalein |
| Kochka | 1 | `''` |
| Kochhani | 2 | `''` |
| Gautam | 3 | `''` |
| **Aur jitne bhi pages hon** | nayi line | `{ id: 'naam', name: 'Naam', icon: '📣', url: 'https://…' }` — website par apne aap card ban jayega |

**Track ke liye:** `recruitmentTracks[3].url` (Ishqbaaz Ling channel link)

**Ban chuka hua:**
- `/social-media` par `ling-pages-grid` — har page ka apna card + link slot
- `/recruitment` par `track-card-ishqbaaz-ling` (20 seats)
- Apply → form me track auto-fill, Firebase me `track: "ishqbaaz-ling"` save
