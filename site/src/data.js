// Shared data for Boost New Skill (Hindi + English)

export const courses = [
  {
    id: 'ai-basics',
    icon: '🤖',
    tag: 'AI Based',
    title: 'AI Fundamentals — Zero se Hero',
    desc: 'AI kya hai, kaise kaam karta hai — bilkul basics se. ChatGPT, prompt writing aur AI tools practical tarike se seekhein.',
    price: '₹99',
    oldPrice: '₹999',
    duration: '4 weeks',
    level: 'Beginner',
  },
  {
    id: 'digital-marketing',
    icon: '📈',
    tag: 'Rozgar',
    title: 'Digital Marketing Master',
    desc: 'SEO, social media ads, aur online dhandha badhana. Ghar baithe client lekar kamayein.',
    price: '₹149',
    oldPrice: '₹1499',
    duration: '6 weeks',
    level: 'Beginner',
  },
  {
    id: 'content-writing',
    icon: '✍️',
    tag: 'Freelance',
    title: 'Content Writing & AI Content',
    desc: 'Blog, script aur social posts likhna. AI ke saath milakar tezi se content banayein aur bechein.',
    price: '₹99',
    oldPrice: '₹999',
    duration: '3 weeks',
    level: 'Beginner',
  },
  {
    id: 'personality-dev',
    icon: '🌟',
    tag: 'Personality',
    title: 'Personality Development',
    desc: 'Confidence, English bolna, interview aur personality me sudhaar — apne aap ko banayein best version.',
    price: '₹79',
    oldPrice: '₹799',
    duration: '4 weeks',
    level: 'All levels',
  },
  {
    id: 'defence-prep',
    icon: '🪖',
    tag: 'Defence',
    title: 'Defence Exam Preparation',
    desc: 'NDA, Army, Navy aur Airforce ki taiyari — sample papers, GK, aur guidance ke saath.',
    price: '₹199',
    oldPrice: '₹1999',
    duration: '8 weeks',
    level: 'Intermediate',
  },
  {
    id: 'computer-basics',
    icon: '💻',
    tag: 'Basic',
    title: 'Computer & Internet Basics',
    desc: 'Typing, MS Office, email, aur internet safety — shikshit hone ki pehli seedi, bilkul basic se.',
    price: 'Free',
    oldPrice: '₹499',
    duration: '2 weeks',
    level: 'Zero level',
  },
]

export const pricingPlans = [
  {
    name: 'Free Plan',
    price: '₹0',
    per: '/hamesha',
    featured: false,
    tag: '',
    features: [
      'Computer & Internet Basics course',
      'Selected free video lectures',
      'Community support (WhatsApp)',
      '1 profile',
      'Basic study material',
    ],
    cta: 'Free Join',
    href: '#/signup',
  },
  {
    name: 'Pro Learner',
    price: '₹299',
    per: '/month',
    featured: true,
    tag: 'Most Popular ⭐',
    features: [
      'Sabhi courses ka access',
      'Live classes + recordings',
      'PDF study material',
      'Certificate of completion',
      'Priority doubt solving',
      'Placement guidance',
    ],
    cta: 'Start Pro',
    href: '#/signup',
  },
  {
    name: 'Institution',
    price: '₹1,999',
    per: '/month',
    featured: false,
    tag: '',
    features: [
      '50+ student seats',
      'Custom courses',
      'Dedicated mentor',
      'Analytics dashboard',
      'Email + phone support',
    ],
    cta: 'Contact Us',
    href: '#contact',
  },
]

export const testimonials = [
  {
    stars: '★★★★★',
    quote:
      'Maine 2 mahine me digital marketing seekha aur pehla client mil gaya. Hindi me samjhaya gaya isliye bahut aasan laga.',
    name: 'Priya Sharma',
    role: 'Student, Jaipur',
  },
  {
    stars: '★★★★★',
    quote:
      'Gaon se hoon, English kamzor thi. Personality Development course ne confidence poora badha diya. Ab interview me dar nahi lagta.',
    name: 'Rahul Kumar',
    role: 'Job Seeker, Bihar',
  },
  {
    stars: '★★★★☆',
    quote:
      'Defence preparation ke liye join kiya. Mock tests aur guidance se meri taiyari bahut strong hui. Shukriya! 🙏',
    name: 'Amit Singh',
    role: 'Defence Aspirant',
  },
]

// News — World / International / National / Burning topics
// NOTE: Ye sample/placeholder news hai. Live news ke liye news API (jaise
// NewsAPI, GNews) "src/api/news.js" me add kar sakte hain.
export const newsCategories = [
  { id: 'all', label: 'All News', cls: '' },
  { id: 'world', label: 'World News', cls: 'cat-world' },
  { id: 'international', label: 'International', cls: 'cat-international' },
  { id: 'national', label: 'National', cls: 'cat-national' },
  { id: 'burning', label: 'Burning Topic', cls: 'cat-burning' },
]

export const news = [
  {
    id: 1,
    category: 'burning',
    title: 'AI aur Rozgar: Naye zamane me kaam badal raha hai',
    desc: 'AI ke aane se naye jobs ban rahe hain. Seekhne walo ke liye ye sabse bada mauka hai — jaldi update rahiye.',
    time: '2 ghante pehle',
  },
  {
    id: 2,
    category: 'national',
    title: 'Skill India Mission se crore-yuvaon ko rozgar',
    desc: 'Sarkar ki skill development yojana se desh bhar me youth ko training aur rozgar mil raha hai.',
    time: '4 ghante pehle',
  },
  {
    id: 3,
    category: 'world',
    title: 'Duniya bhar me online learning ka tezi se vikas',
    desc: 'Online courses ka market tezi se badh raha hai. Hindi content ki maang sabse zyada badh rahi hai.',
    time: '6 ghante pehle',
  },
  {
    id: 4,
    category: 'international',
    title: 'India-US tech partnership se naye avsar',
    desc: 'Dono deshon ke beech technology aur skill sharing badhne se Indian students ko fayda hoga.',
    time: '8 ghante pehle',
  },
  {
    id: 5,
    category: 'national',
    title: 'Rural internet: Gaon tak pahunch raha hai digital Bharat',
    desc: 'Broadband aur mobile internet se gaon ke bachchon ke liye online education aasan ho gayi hai.',
    time: '10 ghante pehle',
  },
  {
    id: 6,
    category: 'burning',
    title: 'Youth me skills ki kami: Kya karein?',
    desc: 'Rozgar ke liye zaroori skills ki kami hai — coding, marketing aur communication skills ab sabse zaroori.',
    time: '12 ghante pehle',
  },
]

export const stats = [
  { num: '10K+', label: 'Active Students' },
  { num: '50+', label: 'Courses' },
  { num: '100%', label: 'Hindi Support' },
  { num: '4.8★', label: 'Student Rating' },
]

// ---------------------------------------------------------------------------
// SITE CONTACT (RFT-038) — EK number, SAB channels par
// Sirf yahan number daalein — WhatsApp button, footer, social page,
// recruitment — sab apne aap update ho jayenge.
// Format: 10 digits, bina + aur bina 0 (example: 9876543210)
// ---------------------------------------------------------------------------
export const siteContact = {
  whatsapp: '', // 👈 apna number yahan daalein
  email: 'boostnewskill@gmail.com',
}

// ---------------------------------------------------------------------------
// SOCIAL MEDIA CHANNELS (RFT-038)
// NOTE: `url` khali hai — aap apne asli links bhar dein.
// Site/src/data.js me sirf yahi file edit karni hai, baaki sab auto-update.
// WhatsApp ka link apne aap ban jayega (siteContact.whatsapp se).
// ---------------------------------------------------------------------------
export const socialChannels = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@boostnewskill',
    icon: '📸',
    color: '#E1306C',
    desc: 'Daily reels, course updates aur success stories — yahan sabse pehle aata hai.',
    url: '',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Boost New Skill',
    icon: '👍',
    color: '#1877F2',
    desc: 'Group discussions, live sessions aur rozgar ke updates.',
    url: '',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    handle: 'Boost New Skill Group',
    icon: '✈️',
    color: '#229ED9',
    desc: 'Job alerts, notes aur quick support — sabse fast yahan milta hai.',
    url: '',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: 'Boost New Skill',
    icon: '▶️',
    color: '#FF0000',
    desc: 'Free classes, tutorials aur full course recordings.',
    url: 'http://www.youtube.com/@boostNewSkill',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: 'Support number',
    icon: '💬',
    color: '#25D366',
    desc: 'Seedha baat karein — doubt solving aur course support. Ek hi number, sab jagah.',
    url: siteContact.whatsapp ? `https://wa.me/91${siteContact.whatsapp}` : '',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Boost New Skill',
    icon: '💼',
    color: '#0A66C2',
    desc: 'Placement updates aur professional network.',
    url: '',
  },
]

// ---------------------------------------------------------------------------
// RECRUITMENT TRACKS (RFT-039 … RFT-041)
// Har track ka apna alag recruitment flow — website par alag card + button.
// `url` khali hai — aap apne channel ka link bhar dein.
// ---------------------------------------------------------------------------
export const recruitmentTracks = [
  {
    id: 'tweaker',
    name: 'Tweaker',
    platform: 'Tweaker',
    icon: '🛠️',
    tagline: 'Skill-based hiring — jo skill hai, wo kaam milega.',
    desc: 'Tweaker wale applicants ke liye alag track. Yahan sirf wo log apply karenge jo apna kaam online dikha sakte hain.',
    seats: 10,
    url: '',
  },
  {
    id: 'ishqbaaz-telegram',
    name: 'Ishqbaaz Telegram',
    platform: 'Telegram',
    icon: '✈️',
    tagline: 'Telegram group se direct apply — bina form ke.',
    desc: 'Ishqbaaz Telegram group me roz job alert aati hai. Is track ka form bhar kar aap seedha group me shortlist hote hain.',
    seats: 15,
    url: '',
  },
  {
    id: 'ishqbaat-facebook',
    name: 'Ishqbaat Facebook',
    platform: 'Facebook',
    icon: '👍',
    tagline: 'Facebook group se community members recruit.',
    desc: 'Ishqbaat Facebook community ke liye alag track. Group members ko mentor, content aur support roles milte hain.',
    seats: 10,
    url: '',
  },
  {
    id: 'ishqbaaz-ling',
    name: 'Ishqbaaz Ling',
    platform: 'Ling pages',
    icon: '📣',
    tagline: 'Ling / Kochka / Kochhani / Gautam — content contributors.',
    desc: 'Ishqbaaz ke content pages (Ling, Kochka, Kochhani, Gautam …) ke liye contributor track — jo video/script la sake, uska yahan registration.',
    seats: 20,
    url: '',
  },
]

// Ishqbaaz Ling ke content pages — har page ka apna link (RFT-044)
export const ishqbaazLingPages = [
  { id: 'ling', name: 'Ling', icon: '📣', url: '' },
  { id: 'kochka', name: 'Kochka', icon: '🔥', url: '' },
  { id: 'kochhani', name: 'Kochhani', icon: '📖', url: '' },
  { id: 'gautam', name: 'Gautam', icon: '🎬', url: '' },
]

