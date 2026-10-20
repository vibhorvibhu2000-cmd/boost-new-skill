# PENDING-INPUT — RFT-039 (Tweaker recruitment)

**Aapka jawab:** same form rakho — bas **track alag** (alag-alag form nahi). ✅ Ye ban chuka hai.

**Ab sirf VALUE bhar rahi hai** → `site\src\data.js` → `recruitmentTracks[0]`

| Field | Value abhi |
|---|---|
| `url` (Tweaker channel/job-board link) | `''` — 👈 link daalein |
| `seats` | `10` |
| `tagline` | "Skill-based hiring — jo skill hai, wo kaam milega." |
| `desc` | "Tweaker wale applicants ke liye alag track…" |

**Ban chuka hua:**
- `/recruitment` par card `track-card-tweaker`
- Same form (Naam / Email / WhatsApp / Position / Track / Message) — koi extra form nahi
- Read-only "Recruitment Track" field = `Tweaker`
- Firebase `applications` me `track: "tweaker"` save → aapko pata chalega kaun Tweaker se aaya
- Link daalte hi "Channel kholein →" button apne aap active ho jayega
