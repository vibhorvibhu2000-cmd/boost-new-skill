import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-030 — Page coverage: har page DIRECTLY visit karke verify
// Requirement: "Har requirement page me jo detail add ki hai use review
//               karne ke liye mujhse poochhe" — har page direct URL se khulna
//               chahiye, koi bhi page missing ya broken na ho.
// ===========================================================================

const PAGES = [
  { route: '/', testid: 'home-page', name: 'Home' },
  { route: '/courses', testid: 'all-courses', name: 'Courses' },
  { route: '/news', testid: 'news-page', name: 'News' },
  { route: '/login', testid: 'login-card', name: 'Login' },
  { route: '/signup', testid: 'signup-card', name: 'Signup' },
  { route: '/recruitment', testid: 'recruitment-page', name: 'Recruitment' },
  { route: '/questions', testid: 'questions-page', name: 'Questions' },
  { route: '/contact', testid: 'contact-page', name: 'Contact' },
]

test.describe('RFT-030 · Page coverage (direct URL)', () => {
  for (const p of PAGES) {
    test(`${p.name} page opens directly at #${p.route}`, async ({ page }) => {
      await page.goto(`/#${p.route}`)
      await expect(page.getByTestId(p.testid)).toBeVisible()
      await expect(page.getByTestId('navbar')).toBeVisible()
      await expect(page.getByTestId('footer')).toBeVisible()
      await expect(page).toHaveTitle(/Boost New Skill/i)
    })
  }

  test('unknown route redirects to home', async ({ page }) => {
    await page.goto('/#/kuch-bhi-jo-hai-nahi')
    await expect(page.getByTestId('home-page')).toBeVisible()
  })

  test('protected /profile redirects to login when not signed in', async ({ page }) => {
    await page.goto('/#/profile')
    await expect(page).toHaveURL(/#\/login/)
    await expect(page.getByTestId('profile-card')).toHaveCount(0)
  })

  test('protected /profile opens when signed in', async ({ page }) => {
    const stamp = Date.now()
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('Profile User')
    await page.getByTestId('signup-email').fill(`prof${stamp}@example.com`)
    await page.getByTestId('signup-whatsapp').fill('9876543210')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()
    await expect(page).toHaveURL(/#\/profile/)

    await page.goto('/#/profile')
    await expect(page.getByTestId('profile-card')).toBeVisible()
    await expect(page.getByTestId('profile-avatar')).toBeVisible()
  })

  test('every nav link points to a working route', async ({ page }) => {
    await page.goto('/')
    const links = await page.locator('.nav-left a[href^="#/"]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href')),
    )
    expect(links.length).toBeGreaterThanOrEqual(6)
    for (const href of links) {
      await page.goto(`/${href}`)
      // Har page ka apna root element hota hai:
      //   Home -> <main>, baaki -> .page, Login/Signup -> .auth-wrap
      await expect(
        page.locator('main, .page, .auth-wrap').first(),
        `Route ${href} ka content render nahi hua`,
      ).toBeVisible()
    }
  })
})
