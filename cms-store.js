/**
 * Rifat Uddin Executive Portfolio — Central CMS Data Store & Sync Engine
 * Manages Posts, Projects, Clients, and Live Metrics.
 * Synchronizes with localStorage and dispatches live update events.
 */

const DEFAULT_CMS_DATA = {
  metrics: {
    exp_val: "10+",
    merchants_val: "500+",
    uptime_val: "99.9%",
    automation_val: "100%"
  },
  posts: [
    {
      id: "post-1",
      title_bn: "সহজ কারবার আর্কিটেকচার: খুচরা বাণিজ্যের আধুনিক ক্লাউড রূপান্তর",
      title_en: "SohozKarbar Architecture: Modern Cloud Transformation for Retail",
      category: "Tech & Architecture",
      date: "নভেম্বর ২০২৬",
      date_en: "Nov 2026",
      read_time: "৫ মিনিট পাঠ",
      read_time_en: "5 min read",
      badge: "Featured Insight",
      excerpt_bn: "অফলাইন-ফার্স্ট পিওএস সিঙ্ক্রোনাইজেশন, লাইটওয়েট এসকিউএল ক্যাশিং এবং কোনো ল্যাগ ছাড়াই ইনস্ট্যান্ট থার্মাল প্রিন্টিং নিশ্চিত করার টেকনিক্যাল ফ্রেমওয়ার্ক।",
      image: "./demo-pos-app.jpg",
      excerpt_en: "A technical architectural breakdown of offline-first POS sync, lightweight SQLite caching, and zero-latency thermal receipt generation.",
      content_bn: "বাংলাদেশের খুচরা বিক্রেতা ও এসএমই মার্চেন্টদের জন্য ইন্টারনেট সংযোগের অস্থিরতা একটি বড় চ্যালেঞ্জ। SohozKarbar ERP-তে আমরা এমন এক ডাবল-এন্ট্রি সিঙ্কিং মেকানিজম তৈরি করেছি যা ইন্টারনেট না থাকলেও লোকাল ক্যাশে তাৎক্ষণিক ট্রানজ্যাকশন সম্পন্ন করে এবং সংযোগ পাওয়ার সাথে সাথেই ক্লাউড সার্ভারে ডাটা রিকনসাইল করে নেয়।",
      content_en: "Internet latency and intermittent connectivity pose significant hurdles for grassroots retail merchants. In SohozKarbar ERP, we engineered an innovative double-entry local caching sync mechanism that logs instant sales locally and reconciles data with the cloud server seamlessly upon reconnecting.",
      link: "#"
    },
    {
      id: "post-2",
      title_bn: "আন্তর্জাতিক টেক্সটাইল ট্রেডিং ও মাল্টি-কারেন্সি অ্যাকাউন্টস গভর্নেন্স",
      title_en: "Global Textile Trading & Multi-Currency Accounting Governance",
      category: "Corporate Finance",
      date: "অক্টোবর ২০২৬",
      date_en: "Oct 2026",
      read_time: "৪ মিনিট পাঠ",
      read_time_en: "4 min read",
      badge: "Executive Note",
      excerpt_bn: "সংযুক্ত আরব আমিরাত (UAE) ও বাংলাদেশের বাণিজ্যে জেনারেল লেজার, কারেন্সি ফ্ল্যাকচুয়েশন এবং ব্যাংক রিকনসিলিয়েশনের বাস্তব অপারেশনাল অভিজ্ঞতা।",
      image: "./rifat-executive-dubai.jpg",
      excerpt_en: "Operational governance managing General Ledgers (GL), currency fluctuations, and automated bank reconciliations across UAE and Bangladesh trade corridors.",
      content_bn: "টেক্সটাইল বাণিজ্যে একাধিক মুদ্রায় (AED, USD, BDT) লেনদেন সমন্বয় করা অত্যন্ত জটিল। প্রতিটি শিপমেন্ট ও এলসি-র বিপরীতে ট্রায়াল ব্যালেন্সের নিখুঁত মিল রাখা এবং রিয়েল-টাইম ক্যাশ ফ্লো অডিট পরিচালনা করাই আমাদের ফাইন্যান্সিয়াল সফলতার মূল ভিত্তি।",
      content_en: "Reconciling multi-currency transactions across AED, USD, and BDT requires stringent financial governance. Maintaining accurate trial balances against each shipment and LC while managing real-time cash flow audits forms the bedrock of sustainable enterprise trade.",
      link: "#"
    },
    {
      id: "post-3",
      title_bn: "হেডলেস ব্রাউজার অটোমেশন দিয়ে সোশ্যাল মিডিয়া গ্রোথ স্কেলিং",
      title_en: "Scaling Autonomous Social Media Growth with Headless Automation",
      category: "Automation & AI",
      date: "সেপ্টেম্বর ২০২৬",
      date_en: "Sep 2026",
      read_time: "৪ মিনিট পাঠ",
      read_time_en: "4 min read",
      badge: "Automation Study",
      excerpt_bn: "পাপেটিয়ার ও নোড.জেএস চালিত ব্যাকগ্রাউন্ড রোবট কীভাবে কোনো স্ক্রিন লোড ছাড়াই সোশ্যাল অডিয়েন্স এনগেজমেন্ট পরিচালনা করে।",
      image: "./demo-inventory-app.jpg",
      excerpt_en: "How Node.js & Puppeteer-powered background headless bots run 24/7 social media publishing, target group interaction, and audience reach without UI overhead.",
      content_bn: "ম্যানুয়াল মার্কেটিংয়ে প্রচুর সময় ও মানবসম্পদের অপচয় ঘটে। আমরা এমন একটি ব্যাকগ্রাউন্ড গ্রোথ ইঞ্জিন তৈরি করেছি যা ১০০% হেডলেস অবস্থায় স্বয়ংক্রিয়ভাবে অডিয়েন্স ট্র্যাকিং, কনটেন্ট রিলিজ এবং স্মার্ট এনগেজমেন্ট সম্পূর্ণ সুরক্ষিতভাবে সম্পন্ন করে।",
      content_en: "Manual social outreach consumes immense human bandwidth. Our headless automation engine executes background audience targeting, content distribution, and intelligent interaction cycles 24/7 without opening a single visible window on the screen.",
      link: "#"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title_bn: "SohozKarbar ERP ফ্ল্যাগশিপ ইকোসিস্টেম",
      title_en: "SohozKarbar ERP Flagship Ecosystem",
      entity: "Sohoz Karbar Tech Solutions",
      category: "Cloud ERP & POS",
      badge: "Flagship Product",
      desc_bn: "মার্চেন্টদের সুপারফাস্ট পিওএস ক্যাশ/ক্রেডিট বিলিং, লাইভ স্টক আপডেট, কাস্টমার বাকি খাতা এবং স্বয়ংক্রিয় এসএমএস রিমাইন্ডার সমৃদ্ধ অল-ইন-ওয়ান বিজনেস প্ল্যাটফর্ম।",
      desc_en: "All-in-one business software delivering ultra-fast POS billing, real-time inventory ledger, customer credit tracking, and automated SMS alerts.",
      tech: ["Node.js", "Vanilla ES6", "WebGL", "SQLite", "Thermal Print API"],
      live_url: "https://www.sohozkarbar.pro.bd"
    },
    {
      id: "proj-2",
      title_bn: "ক্লাউড সোশ্যাল গ্রোথ ও অটোমেশন ইঞ্জিন",
      title_en: "Cloud Social Growth & Marketing Autopilot",
      entity: "Marketing Agent Lab",
      category: "Headless RPA",
      badge: "Active System",
      desc_bn: "ফেসবুক ও ইনস্টাগ্রামের টার্গেট কমিউনিটিতে স্বয়ংক্রিয় পোস্ট পাবলিশিং, স্মার্ট এনগেজমেন্ট এবং লিড জেনারেশনের ১০০% হেডলেস রোবোটিক প্রসেস।",
      desc_en: "100% headless robotic process automation executing auto-publishing, community engagement, and lead generation across Facebook and Instagram.",
      tech: ["Node.js", "Puppeteer", "Headless Chrome", "Telegram API"],
      live_url: "https://github.com/itzzrifat"
    },
    {
      id: "proj-3",
      title_bn: "মাল্টি-কারেন্সি করপোরেট লেজারডেস্ক (GL)",
      title_en: "Multi-Currency Corporate LedgerDesk (GL)",
      entity: "Family Tex Fabrics Fzco",
      category: "Corporate Finance",
      badge: "Enterprise Suite",
      desc_bn: "আন্তর্জাতিক টেক্সটাইল বাণিজ্যে মাল্টি-কারেন্সি অ্যাকাউন্টস, ডাবল-এন্ট্রি বুককিপিং, ট্রায়াল ব্যালেন্স ও ব্যাংক রিকনসিলিয়েশন প্ল্যাটফর্ম।",
      desc_en: "Enterprise multi-currency double-entry accounting engine handling trial balance reconciliations, banking statements, and trade compliance across UAE/BD.",
      tech: ["Accounting GL", "Financial Auditing", "Multi-Currency", "Excel Macro"],
      live_url: "https://www.sohozkarbar.pro.bd/rifat-uddin.html"
    },
    {
      id: "proj-4",
      title_bn: "ক্লাউড বায়োমেট্রিক ও অ্যাটেনডেন্স সিস্টেম",
      title_en: "Smart Cloud Attendance & Biometric Gateway",
      entity: "Family Tex & Sohoz Karbar",
      category: "Workforce HR",
      badge: "Production Live",
      desc_bn: "২০০+ কর্মীর দৈনিক উপস্থিতি, শিফট রোস্টার, ওভারটাইম হিসাব এবং ব্লু-গ্রিন ডেপ্লয়মেন্ট আর্কিটেকচারে ক্লাউড-স্কেল এইচআর গভর্নেন্স।",
      desc_en: "Enterprise workforce HR management tracking daily biometric punch logs, shift rosters, and digital salary generation with Blue-Green architecture.",
      tech: ["Python", "Node.js", "Blue-Green CI", "REST API"],
      live_url: "https://familytex-attendance.surge.sh"
    }
  ],
  clients: [
    {
      id: "client-1",
      name_bn: "ফ্যামিলি টেক্স ফেব্রিক্স এফজেডসিও",
      name_en: "Family Tex Fabrics Fzco",
      type_bn: "আন্তর্জাতিক টেক্সটাইল প্রস্তুতকারক ও ট্রেডিং",
      type_en: "International Textile Manufacturer & Trading",
      location: "দুবাই, সংযুক্ত আরব আমিরাত (UAE)",
      tag: "Corporate Partner",
      quote_bn: "রিফাত উদ্দিনের ফাইন্যান্সিয়াল দূরদর্শিতা ও মাল্টি-কারেন্সি লেজার সিস্টেম আমাদের আন্তর্জাতিক ট্রেডিংয়ের হিসাব-নিকাশে শতভাগ স্বচ্ছতা এনে দিয়েছে।",
      quote_en: "Rifat Uddin's financial acumen and multi-currency ledger architecture brought flawless accounting clarity to our global textile operations."
    },
    {
      id: "client-2",
      name_bn: "আল-মদিনা ফ্যাশন ও রিটেইল মল",
      name_en: "Al-Madina Fashion & Retail Superstore",
      type_bn: "গার্মেন্টস ও ফেব্রিক্স রিটেইল চেইন",
      type_en: "Garments & Fabric Retail Chain",
      location: "ঢাকা ও চট্টগ্রাম, বাংলাদেশ",
      tag: "ERP Client",
      quote_bn: "SohozKarbar ERP ব্যবহারের পর থেকে দোকানে কাস্টমারদের ক্যাশ বা বাকির হিসাব রাখা পানির মতো সহজ হয়ে গেছে। এক ক্লিকেই থার্মাল স্লিপ প্রিন্ট হয়।",
      quote_en: "Ever since adopting SohozKarbar ERP, tracking customer credit and instant sales has become effortless. Thermal receipt prints in less than a second."
    },
    {
      id: "client-3",
      name_bn: "নবীনগর পাইকারি মার্চেন্ট সমবায়",
      name_en: "Nabinagar Wholesale Merchant Syndicate",
      type_bn: "পাইকারি পরিবেশক ও সাপ্লাই হাব",
      type_en: "Wholesale Distribution & Supply Hub",
      location: "নবীনগর, ব্রাহ্মণবাড়িয়া",
      tag: "Supply Chain",
      quote_bn: "আমাদের মাল্টি-ওয়্যারহাউজ স্টক ট্র্যাকিং এবং কাস্টমার বাকি খাতার স্বয়ংক্রিয় এসএমএস রিমাইন্ডার আমাদের কালেকশন দ্বিগুণেরও বেশি বৃদ্ধি করেছে।",
      quote_en: "Multi-warehouse stock auditing and automated customer credit SMS reminders boosted our debt collection speed by more than 2x."
    },
    {
      id: "client-4",
      name_bn: "মেঘনা ফেব্রিক্স ও টেক্সটাইল ট্রেডার্স",
      name_en: "Meghna Fabrics & Textile Traders",
      type_bn: "ফেব্রিক ডিস্ট্রিবিউশন ও হোলসেল এজেন্সি",
      type_en: "Fabric Distribution & Wholesale Agency",
      location: "নরসিংদী ও তেজগাঁও, ঢাকা",
      tag: "Active Merchant",
      quote_bn: "সহজ কারবারের ইনভেন্টরি অ্যালার্টের কারণে কখনো স্টকে ঘাটতি হয় না। রিফাত ভাই নিজেই আমাদের পুরো সেটআপ ডিজাইন করে দিয়েছেন।",
      quote_en: "Thanks to SohozKarbar's low-stock alerts, we never face stockouts. Rifat bhai personally engineered our entire workflow setup."
    }
  ]
};

const CMS_STORAGE_KEY = 'rifat_portfolio_cms_v1';

class PortfolioCMSStore {
  constructor() {
    this.data = this.loadData();
    this.listeners = [];

    // Listen for storage changes from other tabs (e.g. Admin -> Main site)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === CMS_STORAGE_KEY) {
          this.data = this.loadData();
          this.notify();
        }
      });
    }
  }

  loadData() {
    if (typeof window === 'undefined') return DEFAULT_CMS_DATA;
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all required collections exist
        return {
          metrics: { ...DEFAULT_CMS_DATA.metrics, ...(parsed.metrics || {}) },
          posts: Array.isArray(parsed.posts) ? parsed.posts : DEFAULT_CMS_DATA.posts,
          projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_CMS_DATA.projects,
          clients: Array.isArray(parsed.clients) ? parsed.clients : DEFAULT_CMS_DATA.clients
        };
      }
    } catch (e) {
      console.warn('Failed to parse CMS data from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
  }

  saveData(newData) {
    this.data = newData;
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(this.data));
      this.notify();
      return true;
    } catch (e) {
      console.error('Failed to save CMS data to localStorage:', e);
      return false;
    }
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.data); } catch (e) { console.error(e); }
    });
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  resetToDefaults() {
    const copy = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
    this.saveData(copy);
    return copy;
  }

  // --- CRUD for Posts ---
  getPosts() { return this.data.posts || []; }
  savePost(post) {
    const posts = [...this.getPosts()];
    if (!post.id) post.id = 'post-' + Date.now();
    const idx = posts.findIndex(p => p.id === post.id);
    if (idx >= 0) posts[idx] = post;
    else posts.unshift(post);
    this.saveData({ ...this.data, posts });
    return post;
  }
  deletePost(id) {
    const posts = this.getPosts().filter(p => p.id !== id);
    this.saveData({ ...this.data, posts });
  }

  // --- CRUD for Projects ---
  getProjects() { return this.data.projects || []; }
  saveProject(project) {
    const projects = [...this.getProjects()];
    if (!project.id) project.id = 'proj-' + Date.now();
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx >= 0) projects[idx] = project;
    else projects.unshift(project);
    this.saveData({ ...this.data, projects });
    return project;
  }
  deleteProject(id) {
    const projects = this.getProjects().filter(p => p.id !== id);
    this.saveData({ ...this.data, projects });
  }

  // --- CRUD for Clients ---
  getClients() { return this.data.clients || []; }
  saveClient(client) {
    const clients = [...this.getClients()];
    if (!client.id) client.id = 'client-' + Date.now();
    const idx = clients.findIndex(c => c.id === client.id);
    if (idx >= 0) clients[idx] = client;
    else clients.unshift(client);
    this.saveData({ ...this.data, clients });
    return client;
  }
  deleteClient(id) {
    const clients = this.getClients().filter(c => c.id !== id);
    this.saveData({ ...this.data, clients });
  }

  // --- Metrics ---
  getMetrics() { return this.data.metrics || DEFAULT_CMS_DATA.metrics; }
  saveMetrics(metrics) {
    this.saveData({ ...this.data, metrics: { ...this.getMetrics(), ...metrics } });
  }
}

// Global instance
const cmsStore = new PortfolioCMSStore();
if (typeof window !== 'undefined') {
  window.cmsStore = cmsStore;
}
