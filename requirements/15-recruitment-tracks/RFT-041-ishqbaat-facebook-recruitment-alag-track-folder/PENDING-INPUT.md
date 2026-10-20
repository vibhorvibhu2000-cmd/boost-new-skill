# PENDING-INPUT — RFT-041 (Ishqbaat Facebook recruitment)

**Track alag, form same.** ✅ Ye ban chuka hai.

**Sirf value bhar rahi hai** → `site\src\data.js` → `recruitmentTracks[2]`

| Field | Value abhi |
|---|---|
| `url` (Facebook group/page link) | `''` — 👈 link daalein |
| `seats` | `10` |
| `tagline` | "Facebook group se community members recruit." |

**Ban chuka hua:**
- Card `track-card-ishqbaat-facebook` (platform = Facebook)
- Apply → form me `Ishqbaat Facebook`, read-only Track field bhar jata hai
- Firebase me `track: "ishqbaat-facebook"` save
- Link daalte hi "Channel kholein →" active ho jayega
- Same Facebook link `socialChannels[1].url` me daalein to `/social-media` page par bhi dikhega
