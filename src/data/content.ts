// Centralized AYAA content — sourced from the official content document.
// Kept in one place so pages stay consistent and content is easy to update.
//
// NOTE: Icon fields are stored as STRING NAMES (not React components) so the
// same shape can travel through Firestore. Components look up the actual icon
// via src/utils/iconMap.ts.

export const ORG = {
  name: 'Atse Yohannes Alumni Association',
  short: 'AYAA',
  founded: 'January 11, 2003',
  location: 'Mekelle, Tigray',
  emails: ['abrahachem@hotmail.com', 'weyni38@hotmail.com'],
  social: {
    facebook: 'https://facebook.com/',
    twitter: 'https://twitter.com/',
    linkedin: 'https://linkedin.com/',
    youtube: 'https://youtube.com/',
  },
};

export const HERO: {
  eyebrow: string;
  headline: string;
  subtext: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  backgroundImage?: string;
} = {
  eyebrow: 'Atse Yohannes Alumni Association',
  headline: 'Empowering Education at Atse Yohannes School',
  subtext:
    'A global alumni network supporting students through education, infrastructure, and opportunity.',
  primaryCta: { label: 'Donate Now', href: '/donate' },
  secondaryCta: { label: 'Join the Network', href: '/get-involved' },
};

// Values intentionally placeholder ("—") until AYAA confirms current totals.
// Update the value strings here (or via the admin Settings editor) once
// accurate fundraising and equipment numbers are available.
export const IMPACT_METRICS = [
  { value: '—', label: 'USD Raised in Campaigns', suffix: '' },
  { value: '—', label: 'Birr for Library Media Center', suffix: '' },
  { value: '—', label: 'Computers Funded', suffix: '' },
];

export interface Program {
  icon: string;
  title: string;
  description: string;
}

export const PROGRAMS: Program[] = [
  {
    icon: 'GraduationCap',
    title: 'Scholarships & Student Support',
    description:
      'Working toward providing scholarships and graduate support programs for students at Atse Yohannes School.',
  },
  {
    icon: 'FlaskConical',
    title: 'STEM Program Support',
    description:
      'Funding science and technology initiatives, competitions, and innovation programs that prepare students for the future.',
  },
  {
    icon: 'BookOpen',
    title: 'Library & Learning Resources',
    description:
      'Building a Library Media Center providing books, digital resources, and research tools for students.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Infrastructure & Safety',
    description:
      'Renovating fences, building bathrooms for female students, and improving the school environment.',
  },
  {
    icon: 'Users2',
    title: 'Alumni Engagement',
    description:
      'Connecting alumni across the United States, Mekelle, and Addis Ababa through chapters and reunions.',
  },
  {
    icon: 'HeartHandshake',
    title: 'Community Mobilization',
    description:
      'Mobilizing technical, financial, and material support from supporters worldwide.',
  },
];

export interface ProjectSeed {
  slug: string;
  title: string;
  status: string;
  image: string;
  // Optional narrative shown above "The Problem". Use it to give context that
  // helps readers feel the meaning of a project (e.g. why female restrooms
  // mattered, the history of the fence, etc.). Pulled from the previous
  // AYAA site / client narrative.
  story?: string;
  problem: string;
  action: string;
  impact: string[];
  // Optional external campaign link (e.g. GoFundMe). When present, the
  // Projects page renders a CTA pointing here instead of /donate.
  externalLink?: { label: string; href: string };
}

export const PROJECTS: ProjectSeed[] = [
  {
    slug: 'girls-restrooms',
    title: 'Construction of Restrooms for Female Students',
    status: 'Completed',
    // Photo placeholder — original showed an unrelated library image. AYAA
    // will provide before/after photos of the restroom project to swap in.
    image: '/c97036e47ccc734f9baabc10f64ff5f4.jpg',
    story:
      'For years, female students at Atse Yohannes School had no dedicated restroom facilities — a daily indignity that affected attendance, comfort, and the message the school sent to its girls. AYAA prioritized this project after hearing from students and teachers, and constructed proper restrooms so female students could focus on learning without that barrier.',
    problem:
      'The school had no bathroom facilities for female students, creating serious challenges and affecting attendance.',
    action: 'AYAA constructed dedicated bathrooms for female students.',
    impact: [
      'Improved student comfort and dignity',
      'Reduced dropout risk',
      'Encouraged school attendance',
    ],
  },
  {
    slug: 'school-fence',
    title: 'School Fence Renovation',
    status: 'Completed',
    // Before/after photos pending from AYAA.
    image: '/Hero-Image.jpg',
    story:
      'The old perimeter fence had fallen into disrepair — animals wandered onto school grounds, the campus looked neglected, and security was a real concern. AYAA funded a full renovation so students learn in a safer, cleaner space the community can take pride in.',
    problem:
      'The old fence was damaged, allowing animals into the school and affecting safety and cleanliness.',
    action: 'AYAA renovated the school fence.',
    impact: [
      'Improved security',
      'Protected school environment',
      'Enhanced school appearance',
    ],
  },
  {
    slug: 'stem-program',
    title: 'STEM Program Support',
    status: 'Ongoing',
    image: '/646105fc688125e35c9eb7fd3ae258f5.jpg',
    problem:
      'Students needed exposure to science and technology to develop modern problem-solving skills.',
    action: 'AYAA funded science and technology initiatives and competitions.',
    impact: [
      'Encouraged innovation',
      'Improved problem-solving skills',
      'Supported student development in STEM',
    ],
  },
  {
    slug: 'library-media-center',
    title: 'Library Media Center (LMC)',
    status: 'Building Completed — Equipment Ongoing',
    image: '/68f2ee741ffb2feedf27a150f6a1542f.jpg',
    problem:
      'Students lacked access to a centralized space for books, digital resources, and research tools.',
    action:
      'AYAA constructed a Library Media Center; ongoing work includes equipment and technology setup.',
    impact: [
      'Access to books and digital resources',
      'Exposure to technology',
      'Preparation for higher education',
    ],
  },
  {
    slug: 'one-person-one-laptop',
    title: '"One Person, One Laptop" Initiative',
    status: 'Active Campaign',
    image: '/76cc76007473d3e13bcd7aa065799865.jpg',
    problem:
      'Students need digital access to participate in modern education and global knowledge.',
    action:
      'AYAA launched a fundraising campaign to equip computer labs and improve digital access.',
    impact: ['$10,100 raised', '20 computers funded', 'Computer labs equipped'],
  },
  {
    slug: 'mental-health',
    title: 'Mental Health Project',
    status: 'Active Campaign',
    // Image placeholder until AYAA provides a representative photo.
    image: '/e7d28338f9e99d0af4aaf9b86c14e5da.jpg',
    // Short description and GoFundMe link to be supplied by AYAA — placeholder
    // copy is intentionally generic so it can be safely shown until updated.
    story:
      'Coming soon — full project description provided by AYAA, including the goals of the Mental Health initiative and how supporters can contribute.',
    problem:
      'Students at Atse Yohannes School face mental health challenges that affect learning, attendance, and well-being, with very limited support available.',
    action:
      'AYAA is launching a Mental Health initiative to bring counseling, awareness, and support resources to students. Detailed program description to be added.',
    impact: [
      'Improved student well-being',
      'Stronger support for at-risk students',
      'Reduced stigma around mental health',
    ],
    externalLink: {
      label: 'Support on GoFundMe',
      // TODO: replace with real GoFundMe URL once AYAA provides it.
      href: '#',
    },
  },
];

export const STORY = {
  eyebrow: 'Impact Story',
  title: 'Restoring Dignity for Female Students',
  body: `The construction of bathrooms for female students significantly improved their school experience, addressing a long-standing issue that affected attendance and well-being.`,
  attribution: 'AYAA Project Report',
  image: '/Hero-Image.jpg',
};

export const HOW_WE_WORK = [
  {
    step: '01',
    title: 'Identify School Needs',
    description:
      'We work directly with school leadership to understand the most pressing infrastructure, academic, and student welfare needs.',
  },
  {
    step: '02',
    title: 'Mobilize Alumni & Donors',
    description:
      'We connect a global network of alumni, parents, and supporters to fund and back each initiative.',
  },
  {
    step: '03',
    title: 'Fund and Implement Projects',
    description:
      'We deliver projects on the ground in Mekelle through trusted partners and local committees.',
  },
  {
    step: '04',
    title: 'Sustain Long-term Improvement',
    description:
      'Every project is designed to compound — building infrastructure, programs, and culture that last.',
  },
];

export const LEADERSHIP = [
  {
    name: 'Memhir Aebeyo Abraha',
    role: 'President',
    initials: 'MA',
  },
  {
    name: 'Dr. Habte Woldu',
    role: 'Vice President',
    initials: 'HW',
  },
  {
    name: 'Hidaet Alene',
    role: 'Secretary',
    initials: 'HA',
  },
  {
    name: 'Aregay Desta',
    role: 'Treasurer',
    initials: 'AD',
  },
  { name: 'Daniel Hadera', role: 'Board Member', initials: 'DH' },
  { name: 'Gessese Gebreselasse', role: 'Board Member', initials: 'GG' },
  { name: 'Zenebe Gebre', role: 'Board Member', initials: 'ZG' },
  { name: 'Ashenafi Desta', role: 'Board Member', initials: 'AsD' },
];

// Photos pending — AYAA will provide updated headshots; in the meantime we
// render initials avatars to match the leadership grid.
export const ADVISORS = [
  { name: 'Asfawossen Mokonnen', role: 'Advisor', initials: 'AM' },
  { name: 'Zewdi Germai', role: 'Advisor', initials: 'ZG' },
  { name: 'Alemnesh Hagos', role: 'Advisor', initials: 'AH' },
  { name: 'Dr. Aregay Germay', role: 'Advisor', initials: 'AG' },
  { name: 'Dr. Hailemaryam Selassie', role: 'Advisor', initials: 'HS' },
];

// Posthumous remembrance — pictures pending a higher-quality source.
export const IN_MEMORIAM = [
  { name: 'Gebre Hadera', role: 'In Loving Memory', initials: 'GH' },
  { name: 'Fessehaye Hagos', role: 'In Loving Memory', initials: 'FH' },
];

export const COMMITTEES = [
  'Mentorship Committee',
  'Audit Committee',
  'Scholarships Committee',
  'Projects Committee',
  'Communications Committee',
];

export const CHAPTERS = [
  { name: 'AYAA United States', cities: ['Washington DC', 'Dallas', 'Seattle'] },
  { name: 'AYAA Mekelle', cities: ['Mekelle, Tigray'] },
  { name: 'AYAA Addis Ababa', cities: ['Addis Ababa'] },
];

export const NEWS = [
  {
    slug: 'lmc-funded',
    date: '2025-10-12',
    category: 'Fundraising',
    title: 'AYAA Raises Over 8 Million Birr for Library Media Center',
    excerpt:
      'Through global alumni contributions, AYAA has raised more than 8 million birr to complete the Library Media Center building.',
    image: '/7611f57b888ba7419a3a6abcfb44a486.jpg',
  },
  {
    slug: 'memorial-day-reunion',
    date: '2025-05-25',
    category: 'Event',
    title: 'Memorial Day Weekend Reunion Brings Alumni Together',
    excerpt:
      'AYAA hosted its annual Memorial Day Weekend reunion in the U.S., connecting alumni and raising support for ongoing projects.',
    image: '/f249a1bcaf8003267d8e314ad15be36c.jpg',
  },
  {
    slug: 'one-person-one-laptop',
    date: '2025-03-08',
    category: 'Campaign',
    title: '"One Person, One Laptop" Reaches 20 Computers Funded',
    excerpt:
      'The "One Person, One Laptop" initiative has equipped the school computer lab with 20 funded computers.',
    image: '/4a415d2b61d216f8b3eb4d6873e26b50.jpg',
  },
];

export const EVENTS = [
  {
    slug: 'memorial-day-2026',
    date: '2026-05-23',
    title: 'Memorial Day Weekend Reunion 2026',
    location: 'Washington, DC, USA',
    description:
      'Our flagship annual reunion — connect with alumni, hear updates from school leadership, and contribute to ongoing projects.',
    type: 'Reunion',
  },
  {
    slug: 'memorial-day-2027',
    date: '2027-05-29',
    title: 'Memorial Day Weekend Reunion 2027',
    location: 'TBA, USA',
    description:
      'Save the date for next year’s flagship reunion. Location and full program will be announced as planning progresses.',
    type: 'Reunion',
  },
  {
    slug: 'mekelle-visit-2026',
    date: '2026-08-15',
    title: 'Mekelle Chapter Annual Visit',
    location: 'Mekelle, Tigray',
    description:
      'A delegation visit to the school for project reviews, student events, and community engagement.',
    type: 'Visit',
  },
  {
    slug: 'fundraiser-gala',
    date: '2026-11-10',
    title: 'AYAA Fundraising Gala',
    location: 'Dallas, TX, USA',
    description:
      'A formal evening to celebrate alumni and raise funds for the Library Media Center technology rollout.',
    type: 'Fundraiser',
  },
];

export const RESOURCES = [
  {
    category: 'Books & Study Guides',
    items: [
      { title: 'Grade 12 Mathematics Workbook', type: 'PDF' },
      { title: 'Physics Reference Notes', type: 'PDF' },
      { title: 'University Entrance Prep Guide', type: 'PDF' },
    ],
  },
  {
    category: 'Scholarships',
    items: [
      { title: 'AYAA Merit Scholarship Application', type: 'Form' },
      { title: 'External Scholarship Directory', type: 'Link' },
      { title: 'Financial Aid Guidance', type: 'PDF' },
    ],
  },
  {
    category: 'External Learning Links',
    items: [
      { title: 'Khan Academy', type: 'Link' },
      { title: 'MIT OpenCourseWare', type: 'Link' },
      { title: 'Coursera Free Courses', type: 'Link' },
    ],
  },
];

export const DONATION_TIERS = [
  {
    amount: 25,
    label: 'Supporter',
    impact: 'Provides one student with school supplies for a month.',
  },
  {
    amount: 100,
    label: 'Patron',
    impact: 'Funds STEM lab consumables for a full classroom.',
    featured: true,
  },
  {
    amount: 500,
    label: 'Partner',
    impact: 'Sponsors a Library Media Center workstation, fully equipped.',
  },
  {
    amount: 1000,
    label: 'Champion',
    impact: 'Funds a full computer for the “One Person, One Laptop” campaign.',
  },
];

export interface Value {
  icon: string;
  title: string;
  body: string;
}

export const VALUES: Value[] = [
  {
    icon: 'Target',
    title: 'Mission',
    body: 'To connect alumni with their school and mobilize technical, financial, and material support to improve education at Atse Yohannes School.',
  },
  {
    icon: 'Sparkles',
    title: 'Vision',
    body: 'To promote meaningful and sustainable change that supports long-term educational development.',
  },
  {
    icon: 'HeartHandshake',
    title: 'Who We Are',
    body: 'A non-profit, non-governmental, and non-partisan organization connecting alumni, parents, and friends of the school.',
  },
];

export const OUR_STORY = `Atse Yohannes Alumni Association (AYAA) was established on January 11, 2003, by a group of alumni who recognized the growing challenges faced by their former school. Over time, student enrollment increased significantly while resources and funding per student declined. Despite these challenges, students and teachers continued their work under difficult conditions. AYAA was created to provide a structured way for alumni and supporters to contribute toward improving the school's learning environment and opportunities.`;

// Gallery shown on the homepage. Sized for ~12–18 items so three marquee
// rows have enough variety. Each item carries an alt (used as caption in the
// lightbox), an optional tag pill, and an optional width (narrow/normal/wide).
export interface GalleryDoc {
  eyebrow: string;
  headline: string;
  accent: string;
  subtext: string;
  items: Array<{
    src: string;
    alt: string;
    tag?: string;
    width?: 'narrow' | 'normal' | 'wide';
  }>;
}

export const GALLERY: GalleryDoc = {
  eyebrow: 'Visual Stories',
  headline: 'Moments That Make',
  accent: 'AYAA',
  subtext:
    'A collective archive of reunions, classrooms, fundraisers, and the people behind every milestone — captured in motion.',
  items: [
    { src: '/0a1bac7e0501e2f2e22a75edf85d970e.jpg', alt: 'Alumni gathering at Atse Yohannes School', tag: 'Community', width: 'wide' },
    { src: '/f249a1bcaf8003267d8e314ad15be36c.jpg', alt: 'Memorial Day 5K Run participants', tag: 'Fundraiser', width: 'normal' },
    { src: '/646105fc688125e35c9eb7fd3ae258f5.jpg', alt: 'AYAA leadership address at school event', tag: 'Leadership', width: 'normal' },
    { src: '/68f2ee741ffb2feedf27a150f6a1542f.jpg', alt: 'Library Media Center under construction', tag: 'Project', width: 'wide' },
    { src: '/38f9f4701653c2ba8bd7f936f1ef4d46.jpg', alt: 'Family at the Memorial Day Run', tag: 'Reunion', width: 'normal' },
    { src: '/f3a668989c3161e440ffaccdc2e6da0f.jpg', alt: 'Alumni applauding at school event', tag: 'Community', width: 'normal' },
    { src: '/0d924c001691b32627d0774c49800d5d.jpg', alt: 'Students in the classroom', tag: 'Education', width: 'wide' },
    { src: '/2e595e1316ac68a639018427a63548ff.jpg', alt: 'School building exterior', tag: 'Campus', width: 'normal' },
    { src: '/4085c6dd600ad91ee27cdcd5155cb905.jpg', alt: 'Alumni reunion photograph', tag: 'Reunion', width: 'normal' },
    { src: '/63b490524bb814c71d6350e6eb124c24.jpg', alt: 'Community fundraiser highlights', tag: 'Fundraiser', width: 'wide' },
    { src: '/87db41893fa5b6a01db3496dcd01eb45.jpg', alt: 'Group portrait from a school visit', tag: 'Visit', width: 'normal' },
    { src: '/a355a371ac73c1b6b23ba867aec6ae33.jpg', alt: 'Volunteers preparing for the event', tag: 'Volunteers', width: 'normal' },
    { src: '/c97036e47ccc734f9baabc10f64ff5f4.jpg', alt: 'Project handover celebration', tag: 'Project', width: 'wide' },
    { src: '/e7d28338f9e99d0af4aaf9b86c14e5da.jpg', alt: 'Student smiling during program', tag: 'Students', width: 'normal' },
    { src: '/ed89e7f94d28c0ec6f956571176da0a8.jpg', alt: 'Alumni speaking at the podium', tag: 'Leadership', width: 'normal' },
  ],
};
