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

export const IMPACT_METRICS = [
  { value: '10,100+', label: 'USD Raised in Campaigns', suffix: '' },
  { value: '8M+', label: 'Birr for Library Media Center', suffix: '' },
  { value: '20', label: 'Computers Funded', suffix: '' },
  { value: '4+', label: 'Major Infrastructure Projects', suffix: '' },
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

export const PROJECTS = [
  {
    slug: 'girls-bathroom',
    title: 'Girls Bathroom Project',
    status: 'Completed',
    image: '/2e595e1316ac68a639018427a63548ff.jpg',
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
    image: '/Hero-Image.jpg',
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
];

export const COMMITTEES = [
  'Mentorship Committee',
  'Audit Committee',
  'Scholarships Committee',
  'Projects Committee',
  'Communications Committee',
];

export const CHAPTERS = [
  { name: 'United States', cities: ['Washington DC', 'Dallas', 'Seattle'] },
  { name: 'Mekelle, Tigray', cities: ['Mekelle Chapter'] },
  { name: 'Addis Ababa', cities: ['Addis Ababa Chapter'] },
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
