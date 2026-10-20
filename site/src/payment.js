// ---------------------------------------------------------------------------
// Payment configuration
// ---------------------------------------------------------------------------
// 1) UPI QR CODE — abhi ke liye BEST (koi account nahi chahiye, ₹0 charges)
//    Apna real UPI ID neeche daalo. QR auto-generate ho jayega.
//
//    Apni UPI ID kaise pata karein?
//      PhonePe/Paytm/GPay -> Profile -> UPI ID (jaise 9876543210@ybl)
//
// 2) RAZORPAY — jab merchant account ban jaye, sirf ye 2 value daalo:
//      key:  rzp_live_xxxxxxxx  (ya rzp_test_... for testing)
//      Jab key doge, "Pay via Razorpay" button live ho jayega.
//      Console: https://dashboard.razorpay.com  -> Settings -> API Keys
// ---------------------------------------------------------------------------

export const paymentConfig = {
  // 👉 YAHAN APNI UPI ID DALEIN
  upiId: 'boostnewskill@ybl', // <-- CHANGE THIS to your real UPI ID
  upiName: 'Boost New Skill',

  // 👉 Jab Razorpay account ban jaye to yahan key daalein (empty = hidden)
  razorpayKey: '', // e.g. 'rzp_test_1234567890'

  // Support / confirmation contact
  whatsapp: '919876543210', // payment screenshot bhejne ke liye (change it)
  email: 'boostnewskill@gmail.com',
}

// UPI deep-link — isi se QR code banta hai
export function buildUpiLink({ amount, note }) {
  const p = new URLSearchParams({
    pa: paymentConfig.upiId,
    pn: paymentConfig.upiName,
    am: Number(amount).toFixed(2),
    cu: 'INR',
  })
  if (note) p.set('tn', note)
  return `upi://pay?${p.toString()}`
}

export const paymentMethods = [
  {
    id: 'upi',
    label: 'UPI QR Code',
    icon: '📱',
    desc: 'Koi bhi UPI app se scan karein (GPay / PhonePe / Paytm)',
    available: true,
    recommended: true,
  },
  {
    id: 'razorpay',
    label: 'Card / Netbanking',
    icon: '💳',
    desc: 'Razorpay via — card, netbanking, EMI',
    // Selectable hamesha — andar ka pay button key ke bina disabled rahega
    available: true,
    recommended: false,
  },
  {
    id: 'manual',
    label: 'Screenshot bhejein',
    icon: '📸',
    desc: 'Pay karke screenshot WhatsApp par bhejein — hum manually verify karenge',
    available: true,
    recommended: false,
  },
]
