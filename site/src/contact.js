// ---------------------------------------------------------------------------
// Contact details config
// ---------------------------------------------------------------------------
// 👉 APNI DETAILS YAHAN DAALEIN — poori website me ek hi jagah se update hoti hain.
//
// Contact page par ye values dikhti hain, aur WhatsApp float button bhi
// isi UPI/WhatsApp number par chalta hai.
//
// ⚠️ Details confirm hone ke baad, REQ-026 ka "Answer" section update kar dena.
// ---------------------------------------------------------------------------

export const contactConfig = {
  // ---- Aapki basic details ----
  name: 'Boost New Skill',
  owner: 'Kusum', // Aapka naam
  tagline: 'Gaon aur shehar ke har bachche ke liye saste online courses',

  // ---- WhatsApp (click-to-chat + float button) ----
  whatsapp: '919876543210', // 👈 apna WhatsApp number (with country code, no +)
  whatsappDisplay: '+91 98765 43210', // jo dikhega

  // ---- Email ----
  email: 'boostnewskill@gmail.com',

  // ---- Location ----
  city: 'Jaipur, Rajasthan',
  addressLine: 'Jaipur, Rajasthan, India',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Jaipur+Rajasthan',

  // ---- Full address (RFT-033 · Contact Detail ke 3-column layout ke liye) ----
  // 👉 APNI DETAILS YAHAN DAALEIN — District / PIN / State zaroori hain.
  address: {
    line1: 'Boost New Skill, Shop No. 12, Main Market Road',
    line2: 'Near Bus Stand, Gandhi Nagar',
    district: 'Jaipur',      // 👈 apna District
    pin: '302001',           // 👈 apna 6-digit PIN code
    state: 'Rajasthan',      // 👈 apna State
  },

  // ---- Google Map embed (RFT-033) ----
  // 👉 Yahan apna Google Maps ka embed URL daalein.
  //    Maps → apni location → Share → Embed a map → "COPY HTML" → `src="..."` wala link.
  //    Filhaal keyless format use ho raha hai (API key ki zaroorat nahi).
  mapEmbedUrl:
    'https://www.google.com/maps?q=Jaipur%2C%20Rajasthan&hl=en&z=14&output=embed',

  // ---- Working hours ----
  hours: 'Mon – Sat: 9:00 AM – 8:00 PM',
  hoursHi: 'सोम – शनि: सुबह 9:00 – रात 8:00',

  // ---- Social links ----
  social: {
    youtube: 'http://www.youtube.com/@boostNewSkill', // 👈 apna YouTube channel
    whatsapp: 'https://wa.me/919876543210',
    linkedin: 'https://www.linkedin.com/',
    instagram: 'https://www.instagram.com/',
  },

  // ---- Response time ----
  replyTime: '24 ghante ke andar',
}

// WhatsApp click-to-chat link
export function waLink(message = '') {
  const msg = encodeURIComponent(
    message || `Hi ${contactConfig.name}! 🙏 Mujhe aapse baat karni hai.`,
  )
  return `https://wa.me/${contactConfig.whatsapp}?text=${msg}`
}
