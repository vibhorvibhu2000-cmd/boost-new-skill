# RFT-031 — Playwright CLI + OpenCode skill install

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Tooling |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `13-tooling/RFT-031-playwright-cli-opencode-skill-install/requirement.md` |
| **Evidence folder** | `13-tooling/RFT-031-playwright-cli-opencode-skill-install/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Playwright CLI aur skill install bhi karna hai.

---

## ✅ Answer / Kya banaya

**Playwright CLI 1.64.1 — GLOBAL install** (`npm.cmd install -g playwright @playwright/test`).
Ab `playwright.cmd` kisi bhi folder se chalega:
`codegen` (selector generator) · `open` (headed browser) · `screenshot` · `pdf` · `show-report` · `show-trace` · `install`

**OpenCode skill — 2 jagah install:**
| Path | Scope |
|---|---|
| `~/.config/opencode/skill/playwright-cli/` | 🌐 **global** — har project me available |
| `<project>/.opencode/skills/playwright-cli/` | project-scoped |

**SKILL.md** me: saare commands, RFT convention, live-site testing, aur **10 gotchas** (jo asli me time bachate hain — jaise `--reporter=line` se JSON reporter skip ho jaata hai, parallel sessions ka `outputDir` collision, mobile emulated click ka `force: true`).

**Helper script** `scripts/pw.mjs` — `node <skill>/scripts/pw.mjs <cmd>`
  `test` · `shot` · `codegen` · `open` · `pdf` · `report` · `trace` · `install`
  + `bns <build|dev|preview|test|evidence|capture|deploy>` (Boost New Skill shortcuts).

**Skill automatically available hai** — koi bhi Playwright task me model isko load kar leta hai.

---

## 🧪 Verification (Kaise check kiya)

- `playwright.cmd --version` → 1.64.1 (global, PATH me)
- `where.exe playwright` → `C:\Users\HP\AppData\Roaming\npm\playwright.cmd`
- Global skill installed: `~/.config/opencode/skill/playwright-cli/`
- Project skill installed: `.opencode/skills/playwright-cli/`
- System me "New skills are available: playwright-cli" aaya
- Helper script chalta hai (help output verify kiya)

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `13-tooling/RFT-031-playwright-cli-opencode-skill-install/evidence/video/` (webm + mp4) |
| Screenshots | `13-tooling/RFT-031-playwright-cli-opencode-skill-install/evidence/screenshots/` |
| Test report | `13-tooling/RFT-031-playwright-cli-opencode-skill-install/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `13-tooling/RFT-031-playwright-cli-opencode-skill-install/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `.opencode/skills/playwright-cli/SKILL.md`
- `.opencode/skills/playwright-cli/scripts/pw.mjs`
- `site/package.json (playwright devDependency)`

---
