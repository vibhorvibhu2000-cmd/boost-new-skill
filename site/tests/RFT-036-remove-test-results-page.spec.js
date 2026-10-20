import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-036 — Test Results (Verification) page hatao + navbar/footer cleanup
//
//  Requirement: "Recorded cached video / cached result wala page hata do.
//                Navbar me Login se pehle jo Test Results link hai wo bhi
//                hata do, aur recruitment (Jobs) nav bhi hata do.
//
//  Verify:
//   1. /#/verification route ab exist nahi karta — home par redirect
//   2. Page kahin bhi render nahi hota (verification-page testid gone)
//   3. Navbar me "Test Results" link nahi hai
//   4. Navbar me "Jobs" (Recruitment) link nahi hai
//   5. Footer me "Test Results & Demo" link nahi hai
//   6. Baaqi nav links (Home/Courses/News/Q&A/Donate/Contact) safe hain
// ===========================================================================

const NAV_LINKS = ['Home', 'Courses', 'News', 'Q&A', 'Donate', 'Contact']

test.describe('RFT-036 · Test Results page removed', () => {
  test('/verification route redirect ho kar home par aata hai', async ({ page }) => {
    await page.goto('/#/verification')
    await expect(page.getByTestId('home-page')).toBeVisible()
    await expect(page.getByTestId('verification-page')).toHaveCount(0)
  })

  test('verification page kahin bhi render nahi hota', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('verification-page')).toHaveCount(0)
    await expect(page.getByText(/Recorded Test Videos/i)).toHaveCount(0)
  })

  test('navbar me "Test Results" link nahi hai', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByTestId('navbar')
    await expect(nav.getByRole('link', { name: /Test Results/i })).toHaveCount(0)
  })

  test('navbar me "Jobs" (Recruitment) link nahi hai', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByTestId('navbar')
    await expect(nav.getByRole('link', { name: /Jobs/i })).toHaveCount(0)
  })

  test('footer me "Test Results & Demo" link nahi hai', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByTestId('footer')
    await expect(footer.getByRole('link', { name: /Test Results/i })).toHaveCount(0)
  })

  test('baaki nav links safe hain', async ({ page }) => {
    await page.goto('/')
    // Mobile me nav links hamburger menu ke andar hote hain — pehle menu kholo
    const toggle = page.getByTestId('nav-toggle')
    if (await toggle.isVisible()) {
      await toggle.click({ force: true })
      await page.waitForTimeout(400)
    }
    const nav = page.getByTestId('navbar')
    for (const name of NAV_LINKS) {
      await expect(nav.getByRole('link', { name: new RegExp(`^${name}$`, 'i') })).toHaveCount(1)
    }
  })

  test('navbar me login / free join buttons safe hain', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByTestId('navbar')
    await expect(nav.getByRole('link', { name: /^Login$/ })).toBeVisible()
    await expect(nav.getByRole('link', { name: /^Free Join$/ })).toBeVisible()
  })
})
