# PENDING-INPUT — RFT-040 (Ishqbaaz Telegram recruitment)

**Track alag, form same.** ✅ Ye ban chuka hai.

**Sirf value bhar rahi hai** → `site\src\data.js` → `recruitmentTracks[1]`

| Field | Value abhi |
|---|---|
| `url` (Telegram invite link, `https://t.me/...`) | `''` — 👈 link daalein |
| `seats` | `15` |
| `tagline` | "Telegram group se direct apply — bina form ke." |

**Ban chuka hua:**
- Card `track-card-ishqbaaz-telegram` (platform = Telegram)
- Apply → form me `Ishqbaaz Telegram`, read-only Track field bhar jata hai
- Firebase me `track: "ishqbaaz-telegram"` save
- Link daalte hi "Channel kholein →" active ho jayega
- Same Telegram link `socialChannels[2].url` me daalein to `/social-media` page par bhi dikhega
