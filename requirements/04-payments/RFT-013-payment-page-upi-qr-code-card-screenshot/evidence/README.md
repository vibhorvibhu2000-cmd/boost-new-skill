# Evidence — RFT-013 Payment page — UPI QR Code (+ Card + Screenshot)

Is folder me is requirement ka **proof** rakha jaata hai:

| Folder | Kya hai |
|---|---|
| `video/` | Playwright ka recorded video (webm) + mp4 (WhatsApp/email ke liye) |
| `screenshots/` | Har step ka screenshot (png) |
| `TEST-REPORT.md` | Auto-generated test report (pass/fail per test case) |
| `EVALUATION.md` | Manual evaluation — quality, risks, scorecard |

**Evidence refresh karna hai?**

```bash
cd site
npm.cmd run test                      # poora suite (video + screenshot)
node organize-artifacts.mjs          # artifacts ko requirement folders me copy
```
