// Every fact here comes from Fadhel's CVs (job-hunt/applications/toolkit/pools.py)
// or from the two projects linked below. Don't add skills or claims that aren't there.

export const PROFILE = {
  name: "Fadhel Fuhad",
  fullName: "Muhammed Fadhel Fuhad",
  title: "Senior Frontend Developer",
  stack: "React · Vue 3 · React Native · TypeScript",
  intro:
    "I build production web and mobile apps with React, Vue 3, Nuxt 3 and React Native, and I bring hands-on IT infrastructure experience across Microsoft 365, Azure and networking. Based in Manama, Bahrain.",
  email: "fuad.fadhel97@gmail.com",
  phone: "+973 3625 0240",
  phoneHref: "tel:+97336250240",
  location: "Manama, Bahrain",
  linkedin: "https://linkedin.com/in/fadhel-fuhad",
  github: "https://github.com/fadhelfuhad",
  cv: "/Muhammed_Fadhel_Fuhad_CV.pdf",
  photo: "/photo.jpg",
};

export const STATS = [
  { value: "5+", label: "Years experience" },
  { value: "4", label: "Companies" },
  { value: "4", label: "Websites shipped" },
];

export const STORY = [
  "I studied Information Systems at the University of Bahrain and started in IT, as an intern at Euro Motors, where I replaced a paper-based approval process with an automated requisition system built on SharePoint, Power Automate and PowerApps.",
  "At Pavilion Renewables I did both sides of the job: I ran the Microsoft 365 tenant, servers and network, and I built the company's web presence, delivering 4 websites from planning to launch and React features across its platforms.",
  "Since 2023 I've been a Senior Frontend Developer at Parcel, where I've architected production apps in React, Vue 3, Nuxt 3 and React Native Expo, led the redesign of the core dashboards, and rebuilt the mobile app from scratch. I use Cursor AI and Claude AI day to day, which cut our average feature delivery time by 25%.",
];

export const FACTS = [
  { icon: "user", label: "Name", value: "Muhammed Fadhel Fuhad" },
  { icon: "mail", label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
  { icon: "phone", label: "Phone", value: PROFILE.phone, href: PROFILE.phoneHref },
  { icon: "pin", label: "Location", value: PROFILE.location },
  { icon: "globe", label: "Languages", value: "English (fluent), Arabic (spoken)" },
  { icon: "badge", label: "Status", value: "Transferable work visa · Available immediately" },
] as const;

export type IconName =
  | "code" | "phone-app" | "palette" | "database" | "wrench" | "server"
  | "user" | "mail" | "phone" | "pin" | "globe" | "badge";

export const SKILLS: { icon: IconName; title: string; blurb: string; items: string[] }[] = [
  {
    icon: "code",
    title: "Frontend Development",
    blurb: "Production web apps and dashboards with modern React and Vue.",
    items: ["React JS", "Next.js", "Vue 3", "Nuxt 3", "TypeScript", "JavaScript (ES6+)", "Vue Router", "VeeValidate"],
  },
  {
    icon: "phone-app",
    title: "Mobile",
    blurb: "Cross-platform apps shipped to production with React Native.",
    items: ["React Native (Expo)", "Expo Router", "NativeWind", "React Navigation", "i18n / react-i18next", "Luxon", "PDF generation"],
  },
  {
    icon: "palette",
    title: "Styling & UI",
    blurb: "Accessible, reusable component systems from Figma to code.",
    items: ["Tailwind CSS v3/v4", "Shadcn/UI", "Radix Vue", "Reka UI", "MaterialUI", "Framer Motion", "Figma"],
  },
  {
    icon: "database",
    title: "State, Data & APIs",
    blurb: "Server and client state, forms, auth and real-time features.",
    items: ["TanStack Query", "Zustand", "Redux Toolkit", "Pinia", "React Hook Form", "Zod", "REST APIs", "Socket.IO", "Node.js", "Firebase", "JWT"],
  },
  {
    icon: "wrench",
    title: "Tooling & AI",
    blurb: "A tidy Git workflow and AI-assisted development.",
    items: ["Git", "Vite", "pnpm", "ESLint", "Prettier", "Biome", "Husky", "Cursor AI", "Claude AI"],
  },
  {
    icon: "server",
    title: "IT Infrastructure",
    blurb: "Microsoft 365, Azure and networks, backed by a CCNA.",
    items: ["Microsoft 365", "Azure AD / Entra ID", "Azure VMs & VNets", "Windows Server", "Linux", "TCP/IP, DNS, DHCP, VPN", "Hyper-V / VMware", "Power Automate", "PowerApps", "SharePoint"],
  },
];

export const EXPERIENCE = [
  {
    role: "Senior Frontend Developer",
    company: "Parcel Information Technology",
    period: "Apr 2023 – Present",
    place: "Burhama, Manama",
    points: [
      "Architected and shipped multiple production applications across React JS, Vue 3, Nuxt 3 and React Native Expo, including a B2B SaaS web platform, a customer-facing Nuxt portal and a cross-platform mobile delivery app.",
      "Led the complete redesign of the core company dashboards with Vue 3, TanStack Query and Tailwind CSS, directing the frontend team.",
      "Rebuilt the company mobile app from scratch in React Native Expo with NativeWind, Zustand and Expo Router, and delivered it to production.",
      "Cut average feature delivery time by 25% by bringing Cursor AI and Claude AI into the workflow; added real-time features with Socket.IO and multi-language support for a multi-market rollout.",
    ],
  },
  {
    role: "Software Developer",
    company: "The Design Hammock",
    period: "Jan 2023 – May 2023",
    place: "South Africa · Part-time",
    points: [
      "Built and shipped a B2B application with a React JS frontend integrated against custom backend APIs.",
      "Translated business requirements into clean, maintainable TypeScript in a fast-paced agency team.",
    ],
  },
  {
    role: "Software & Web Developer · IT Infrastructure",
    company: "Pavilion Renewables",
    period: "Aug 2021 – Mar 2023",
    place: "Bahrain Bay, Manama",
    points: [
      "Developed and delivered 4 company websites from planning to launch with WordPress and Elementor Pro: the first in 27 days, the rest in under a week each.",
      "Built frontend features across company web platforms with React JS and integrated custom APIs for live data.",
      "Managed the Microsoft 365 tenant (Exchange Online, SharePoint, Teams, OneDrive) and Azure AD / Entra ID, including conditional access, MFA and SSO.",
      "Administered Windows Server and Linux, virtual machines, firewalls and the LAN/WAN, VPN and VoIP network.",
    ],
  },
  {
    role: "IT Intern",
    company: "Euro Motors",
    period: "Jun 2020 – Sep 2020",
    place: "Sitra, Manama",
    points: [
      "Built an automated requisition approval system with SharePoint, Power Automate and PowerApps, replacing the manual authorisation process company-wide.",
      "Supported end users with hardware, software and connectivity issues, and managed IT inventory and vendor scheduling.",
    ],
  },
];

export const PROJECTS = [
  {
    title: "Job Hunt",
    kind: "Personal project",
    image: "/projects/jobhunt.jpg",
    description:
      "A private command centre for a job search. It turns CSV trackers, tailored CVs and cover letters into a calm workflow: one role at a time, follow-up nudges, daily goals and streaks, and plain-language search like “frontend in Dubai I haven't applied to”. Protected by a custom sign-in with signed session cookies.",
    tags: ["React 19", "TypeScript", "Vite", "Vercel Middleware", "Python"],
    link: "https://fadhel-jobhunt.vercel.app/#today",
    note: "Private · sign-in required",
  },
  {
    title: "Timezone W.L.L Inventory",
    kind: "Client project",
    image: "/projects/timezone.jpg",
    description:
      "A full-stack inventory system for a premium watch retailer in Bahrain. It tracks stock and profit margins, reads scanned inventory sheets and camera photos with OCR, and provides financial analytics, with role-based access and a full audit trail.",
    tags: ["React", "NestJS", "Prisma", "PostgreSQL", "MUI", "TanStack Query", "OCR"],
    link: "https://timezone-wll.vercel.app/dashboard",
    note: "Staff sign-in required",
  },
  {
    title: "Mobile Delivery App",
    kind: "Work at Parcel",
    art: "mobile",
    description:
      "Rebuilt the company's cross-platform delivery app from scratch and shipped it to production with full platform guideline compliance, alongside real-time features and multi-language support for a multi-market rollout.",
    tags: ["React Native", "Expo Router", "NativeWind", "Zustand", "Socket.IO", "i18n"],
  },
  {
    title: "Core Dashboards Redesign",
    kind: "Work at Parcel",
    art: "dashboard",
    description:
      "Led the complete redesign of the company's core dashboards, directing the frontend team and improving user task completion rates.",
    tags: ["Vue 3", "TanStack Query", "Tailwind CSS", "TypeScript"],
  },
] as const;

export const EDUCATION = [
  {
    title: "Bachelor of Information Systems",
    school: "University of Bahrain",
    period: "2015 – 2021",
    detail: "Graduated in 2021.",
  },
  {
    title: "Cisco Certified Network Associate (CCNA)",
    school: "Aptech Institute, Zinj",
    period: "2021",
    detail: "Professional networking certification.",
  },
];

export const ACHIEVEMENTS = [
  { icon: "trophy", title: "1st Place, Injaz Bahrain Innovation Camp", detail: "Winner of the Business Plan category.", year: "2019" },
  { icon: "flag", title: "Formula 1 Bahrain Grand Prix", detail: "Supervised operational teams at Bahrain International Circuit under the Royal Court, Crown Prince division.", year: "2018, 2019, 2021" },
  { icon: "spark", title: "Injaz Insurathon", detail: "Participant.", year: "2019" },
  { icon: "cloud", title: "AWS technical seminars", detail: "Active participant in Amazon Web Services technical seminars.", year: "" },
] as const;

export const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];
