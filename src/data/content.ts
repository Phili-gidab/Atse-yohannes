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
  // Mailing address for check donations — taken from legacy AYAA site.
  mailingAddress: 'AYAA, PO Box 2434, Tucker, GA 30085',
  social: {
    facebook: 'https://www.facebook.com/share/1DEHPyPDrQ/',
    tiktok: 'https://www.tiktok.com/@atseyohannesalum',
  },
  // PayPal donation config — mirrors the hosted form from the legacy site
  // (www.atseyohannes.org). Update `business` when AYAA migrates to a
  // dedicated PayPal business account.
  paypal: {
    business: 'adesta85@hotmail.com',
    itemName: 'ATSE YOHANNES ALUMNI ASSOCIATION',
    currency: 'USD',
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

// Full AYAA bylaws (last revised May 24, 2008). Sourced from the legacy
// website (www.atseyohannes.org/by-laws.html). Rendered as accordions on the
// About page so the page stays scannable.
export interface BylawArticle {
  number: string;
  title: string;
  sections: { heading?: string; body: string }[];
}

export const BYLAWS: BylawArticle[] = [
  {
    number: 'I',
    title: 'Name and Offices',
    sections: [
      {
        heading: 'Section 1 — Name',
        body:
          'The name of the association shall be the Atse Yohannes Alumni Association (AYAA), henceforth referred to as the "Association". AYAA is a non-political, non-governmental, non-profit and non-religious organization. The organization qualifies as a 501(c)(3) charitable entity under federal tax law, making contributions tax-deductible.',
      },
      {
        heading: 'Section 2 — Principal Office',
        body:
          'The principal office is located in Atlanta, Georgia, United States of America. The registered office required by Georgia law may or may not be the same location.',
      },
    ],
  },
  {
    number: 'II',
    title: 'Membership',
    sections: [
      {
        body:
          'The organization maintains a membership structure including former students of Atse Yohannes School, family members, and interested supporters committed to advancing the association\'s mission.',
      },
    ],
  },
  {
    number: 'III',
    title: 'General Assembly',
    sections: [
      {
        heading: 'Section 1 — Meetings of the General Assembly',
        body:
          'Annual meetings occur once a year on the Saturday of Memorial Day weekend at a suitable place and time that is determined by the Board Members of the Association. Meeting purposes include annual reports, project approval, bylaw amendments, board elections, honors, and future planning announcements. Attendance is open to all, but voting privileges are restricted to members in good standing. The President chairs meetings, or the Vice President if unavailable. The time and location of the next General Assembly meeting should be announced at least six months prior to the meeting. The agenda, time and place of the General Assembly must be posted on AYAA Web site at least 45 days before the meeting.',
      },
      {
        heading: 'Section 2 — Rights and Responsibilities',
        body:
          'Members must support the mission and follow association rules. Members are required to pay membership dues set by the Board and ratified by members at the General Assembly meeting. Currently, the regular membership dues is $100.00 per member per year and $50.00 for students. Each member shall be entitled to one vote on each matter submitted to a vote of the members. Members can cast their vote only in person at the time of the General Assembly. Invoices are sent after June 1 (fiscal year start) and are payable by May.',
      },
      {
        heading: 'Section 3 — Removal of Members',
        body:
          'Any member may be expelled from AYAA by a majority affirmative vote of all the Board Members for any or all of the following violations: a member who does not pay membership dues in a timely manner; a member\'s disruptive behavior undermines the welfare of the association; a member misappropriates Association\'s funds.',
      },
      {
        heading: 'Section 4 — Reinstatement of Membership',
        body:
          'A person whose membership has been terminated pursuant to Article III Section 3 can apply for reinstatement provided he/she pays overdue fees and other problems are addressed. The decision to grant reinstatement will be made by a majority vote of all the Board Members.',
      },
    ],
  },
  {
    number: 'IV',
    title: 'Governing Board',
    sections: [
      {
        heading: 'Section 1 — General Powers',
        body:
          'Governance of the Association will be held by Board Members, elected at the Annual Meeting from members of the association in good standing. The Board manages the association and its responsibilities include: adoption of a Mission Statement; establishing the goals and objectives of the Association including a description of the services to be provided; establishing organizational structure and functional relationships; establishment of financial management policies, including a system to insure accountability for Association resources, approval of an annual project budget and spending priorities, long-range planning; and approval of all major contracts, loans or any other legally binding arrangements; creating standing rules, procedures, and guidelines as needed. The Board cannot disobey the orders of the General Assembly or act outside its prescribed duties and authorities given by these Bylaws.',
      },
      {
        heading: 'Section 2 — Number and Term of Office',
        body:
          'The number of Board Members shall be thirteen, and their consecutive term of office shall not exceed six years. New Board Members shall be nominated and duly elected by the General Assembly every three years. The nominees who receive the majority of the votes cast shall be declared as the new Board Members. Departed Board Members shall be eligible for re-election after an interval of three years.',
      },
      {
        heading: 'Section 3 — Conflict of Interest',
        body:
          'No individual Board Member, or the Board as a whole, may benefit directly or indirectly from the disbursal of the Association funds. Each Board member upon accepting a seat on the Board agrees to carefully guard against any conflict of interest that might develop between his/her personal interest and that of the Association. No member of the Board may be compensated for his/her services except when Board Members authorized such expenses incurred by member of the Board in carrying out the business of the Association.',
      },
      {
        heading: 'Section 4 — Vacancies',
        body:
          'A vacancy occurring in the Board for unexpired term may be filled by a majority vote of those present, at any board meeting where quorum is present. However, an increase in the authorized number of Board Members shall be filled only by election at the Annual Meeting, or at a special meeting of the Association members called for that purpose.',
      },
      {
        heading: 'Section 5 — Removal of Board Members',
        body:
          'Board members may be removed for lack of active participation, for recorded absences in three or more of Board meetings, and when a member loses his/her good standing status. First he/she will be contacted by the Board president to determine and understand the problem. The President may recommend to the Board that the individual be asked to resign from the Board. A Board member may be removed by an affirmative vote of two-thirds of the Board Members present in a meeting where the required quorum is present.',
      },
    ],
  },
  {
    number: 'V',
    title: 'Officers of the Association',
    sections: [
      {
        heading: 'Section 1 — Officers',
        body: 'Officers shall include a President, Vice President, Treasurer and Secretary.',
      },
      {
        heading: 'Section 2 — Election of Officers',
        body:
          'All officers shall serve for a term of three years unless the officer ceases to qualify or is terminated. Officer of the Association shall not serve more than two consecutive terms or six years. Officers of the Association shall be nominated by the Nominating Committee, and elected by the Board Members for terms of three years each. In the event any officer, other than the President, resigns from the position of officer, or resigns from the Board during a term of office, the President may recommend another currently sitting Board member to complete the term, and a majority vote of Board Members present in a meeting will be required for approval. In the event of the resignation of the President, the Vice President shall assume the position of President and will then recommend a successor to the Vice Presidency, subject to the same requirement of Board\'s approval.',
      },
      {
        heading: 'Section 3 — Duties and Functions of the Officers',
        body:
          'President: principal Officer, supervises and oversees the management of the Association, presides over all board and annual meetings, serves as principal liaison, signs deeds and contracts on behalf of the Association. Vice President: performs the duties of the President in his/her absence, serves as chief Public Relations official, chairs the Program Committee. Secretary: keeps accurate records of all meetings, gives all notices required by law and these By-Laws, chairs the Web Site Committee, maintains the Association Seal. Treasurer: oversees custody of the funds and securities, ensures proper deposits and disbursements, presents a Financial Report at every Board meeting and Annual Meeting, chairs the Fund Raising Committee, files federal and state Information Returns.',
      },
    ],
  },
  {
    number: 'VI',
    title: 'Committees',
    sections: [
      {
        heading: 'Section 1 — Establishment of Committees',
        body:
          'The Board shall establish Committees to oversee specific aspects of the Association\'s activities. Committees shall review and consider activities and proposals and make recommendations to the full Board for consideration.',
      },
      {
        heading: 'Section 2 — The Executive Committee',
        body:
          'The Officers (President, Vice President, Secretary, and Treasurer) will constitute the Executive Committee. The President shall be the Chairperson. The Committee is responsible for managing, executing, and implementing all policies, projects, and programs already determined by the Board.',
      },
      {
        heading: 'Section 3 — Fund Raising Committee',
        body:
          'The Treasurer shall be the chairperson; the Board appoints the other members. The committee develops fundraising goals for the short and long term, crafts a fundraising plan, and identifies potential sources of funds.',
      },
      {
        heading: 'Section 4 — Audit Committee',
        body:
          'The Board may establish an internal audit committee on a temporary basis. Duties include assurance of the proper utilization of AYAA\'s resources and the appropriate handling of all contracts. A written report should be submitted to the Board before April 30th of each year.',
      },
      {
        heading: 'Section 5 — Program Committee',
        body:
          'The Vice President is chairperson. The Committee reviews and makes recommendations on policies, practices, and the expansion of existing or new programs, and is responsible for an annual program plan and evaluation.',
      },
      {
        heading: 'Section 6 — Nominating Committee',
        body:
          'Members are appointed by the Board. The Committee oversees nomination and election procedures and develops slates for Board and officer vacancies. In selecting nominees, the Committee focuses on greater inclusion and fair representation, taking diversity into account.',
      },
      {
        heading: 'Section 7 — Support Committees',
        body:
          'AYAA Support Committees are voluntary entities composed of former students or friends organized in various US and Canada townships. A Support Committee requires at least three members, and shall have at least a Chairperson, Secretary, and a Treasurer. Support Committees may not operate or use funds without the consent of AYAA\'s Board, and shall report to the AYAA Board on a bi-annual basis.',
      },
      {
        heading: 'Section 8 — The Website Committee',
        body:
          'The Secretary serves as chair; the Web Master is automatically a member. The Committee maintains and updates the AYAA website to improve the visibility, understanding, and support for the Association.',
      },
    ],
  },
  {
    number: 'VII',
    title: 'Meetings',
    sections: [
      {
        heading: 'Section 1 — Board Members',
        body:
          'The regular meeting, teleconferencing or email-based communication of the Board shall be held once every three months following the date of the Annual Meeting, unless otherwise ordered by the majority of the Board Members. Special meetings may be called by the President or by any five Board Members with at least seven working days\' notice.',
      },
      {
        heading: 'Section 2 — Quorum',
        body:
          'A majority of the entire members of the Board in good standing shall constitute a quorum for the transactions of business at any regular or special meetings of the Board. Members present at any properly called meeting shall constitute a quorum of the General Assembly.',
      },
      {
        heading: 'Section 3 — Manner of Acting',
        body:
          'The act of the majority of the Board present at a meeting at which a quorum is present shall be the act of the Board Members unless specifically stated in the Bylaws. An affirmative vote of two-thirds of all Board Members shall be required to recommend a resolution to the General Assembly to adopt, amend or repeal the bylaws, or to dissolve the Association. A majority vote of members present in a General Assembly Meeting shall be the act of the General Assembly for all matters, except dissolution, which requires three-fourths of members present.',
      },
    ],
  },
  {
    number: 'VIII',
    title: 'Contracts, Loans and Deposits',
    sections: [
      {
        heading: 'Section 1 — Contracts',
        body:
          'The Board may authorize any officer or officers to enter into any contract or to execute and deliver an instrument on behalf of the Association. Such authority may be general or confined to specific instances.',
      },
      {
        heading: 'Section 2 — Loans',
        body:
          'No loans shall be contracted on behalf of the Association and no evidence of indebtedness shall be issued in its name except as authorized by resolution of the Board.',
      },
      {
        heading: 'Section 3 — Financial',
        body:
          'All checks, drafts or other orders for payment of money issued in the name of the Association shall be signed by such officer(s) as determined by resolution of the Board. All funds shall be deposited within 24 hours of being received (or the following business day if received on a Friday or legal holiday) to the credit of the Association.',
      },
    ],
  },
  {
    number: 'IX',
    title: 'General Provisions',
    sections: [
      {
        heading: 'Section 1 — Fiscal Year',
        body:
          'Unless ordered otherwise by the Board, the fiscal year of the Association shall be from June 1 through May 30 of each and every Calendar year.',
      },
      {
        heading: 'Section 2 — Parliamentary Procedure',
        body:
          'The simplified version of Robert\'s Rule of Order shall govern the association in all cases they are applicable and in which they are not inconsistent with these Bylaws or the decisions, policies or procedures adopted by the Board of AYAA. In the event of conflict, the Board\'s decision shall prevail.',
      },
      {
        heading: 'Section 3 — Dissolution',
        body:
          'As the Association solely stands for charitable and educational purposes as authorized by 501(c)(3) of the Federal Revenue Code, upon dissolution, after paying all liabilities, the remaining assets of AYAA should be distributed to Atse Yohannes School, in Mekelle, Tigray, Ethiopia.',
      },
      {
        heading: 'Section 4 — Amendments',
        body:
          'Except as otherwise provided herein, these By-laws may be amended or repealed and new By-laws may be adopted, by the affirmative vote of the majority of the General Assembly, at any regular or special meeting.',
      },
    ],
  },
];

export const BYLAWS_LAST_UPDATED = 'May 24, 2008';

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
    // Featured on the homepage spotlight (ReunionFlyer). `discountUrl` renders
    // as the clickable "Reunion Discount Link" (Holiday Inn Express Charlotte
    // Airport group block).
    slug: 'charlotte-reunion-2026',
    date: '2026-07-04',
    title: 'Atse Yohannes Alumni School Reunion 2026',
    location: 'Fiesta Banquet Hall, 1520 Alleghany St, Charlotte, NC 28208',
    description:
      'Join us for a celebration with a purpose to support mental health awareness and assistance for our students — a pilot project for Tigray. For those of you that will be coming to Charlotte, hotel discount is available at Boutique Hotel in Charlotte / Holiday Inn Express and Suites Charlotte Airport.',
    type: 'Reunion',
    featured: true,
    discountUrl:
      'https://www.ihg.com/holidayinnexpress/hotels/us/en/charlotte/cltqu/hoteldetail?fromRedirect=true&qSrt=sBR&qIta=99502056&icdv=99502056&qSlH=CLTQU&qCpid=786792598&qAAR=IED6R&qRtP=IED6R&setPMCookies=true&qSHBrC=EX&qDest=108%20Airport%20Commons%20Dr%2C%20Charlotte%2C%20NC%2C%20US&showApp=true&adjustMonth=false&srb_u=1',
    discountLabel: 'Reunion Discount Link',
  },
  {
    slug: 'family-day-charlotte-2026',
    date: '2026-07-05',
    title: 'Family Activities at the Park',
    location: '6220 Park Road, Charlotte, NC 28210',
    description:
      'Sunday family activities starting at 11:00 AM. Come and enjoy a picnic, games, music, group pictures, and catching up with old friends and family.',
    type: 'Gathering',
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
  {
    slug: 'memorial-day-2027',
    date: '2027-05-29',
    title: 'Memorial Day Weekend Reunion 2027',
    location: 'TBA, USA',
    description:
      'Save the date for next year’s flagship reunion. Location and full program will be announced as planning progresses.',
    type: 'Reunion',
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
  {
    // Migrated from the legacy AYAA "Links" page — partner institutions,
    // sister alumni associations, and regional development organizations.
    category: 'Relevant Resources',
    items: [
      { title: 'Mekelle University', type: 'Link', url: 'http://www.mu.edu.et/' },
      { title: 'Mekelle Institute of Technology', type: 'Link', url: 'http://www.mitethiopia.edu.et/' },
      { title: 'Addis Ababa University', type: 'Link', url: 'http://www.aau.edu.et/' },
      { title: 'Enderta Regional Development Association', type: 'Link', url: 'http://enderta.org/' },
      { title: 'Kilete Awlaelo', type: 'Link', url: 'http://awlaelo.org/' },
      { title: 'Negstsaba', type: 'Link', url: 'http://www.negstsaba.com/' },
      { title: 'Segen Foundation', type: 'Link', url: 'http://segenatfoundation.org/' },
      { title: 'Ethiopia Reads', type: 'Link', url: 'http://www.ethiopiareads.org/' },
      { title: 'Agazi Alumni', type: 'Link', url: 'http://www.agazi.net/' },
      { title: 'Shire Development Association', type: 'Link', url: 'http://dasna.net/' },
      { title: 'Axum Alumni Association', type: 'Link', url: 'http://www.axumalumniassociation.org/' },
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

// Mission, Vision, and "Who We Are" copy preserved verbatim from the legacy
// AYAA website (atseyohannes.org/what-we-do.html). Do not rewrite without
// the Board's sign-off — this is the language the alumni community knows.
export const VALUES: Value[] = [
  {
    icon: 'Target',
    title: 'Mission',
    body: 'Atse Yohannes Alumni Association (AYAA) is established to connect alumni with their high school and with each other, and to promote, coordinate, and deliver alumni and friends\' technical, material, and financial support for the benefit of Atse Yohannes School.',
  },
  {
    icon: 'Sparkles',
    title: 'Vision',
    body: 'To promote passionate changes for self-sustainability wherever we can.',
  },
  {
    icon: 'HeartHandshake',
    title: 'Who We Are',
    body: 'A non-political, non-partisan, non-profit and non-governmental association that provides a vital link between Atse Yohannes School and private donors — alumni, parents, and friends of the school — whose technical and material support facilitates educational programming and student opportunity.',
  },
];

// "Our Story" narrative — preserved verbatim from the legacy AYAA website
// (atseyohannes.org/what-we-do.html). This is the language the alumni
// community knows; do not paraphrase without the Board's approval.
export const OUR_STORY = `Never in the 60-year history of Atse Yohannes School (located in the capital city of Mekelle, Tigray, Ethiopia) has there been more of a need for support from alumni and friends. Within the past few decades, the number of students joining the school has escalated. At the same time, the corresponding total budget per student has dwindled and the cost of running the school has substantially increased. Despite these challenges, students as well as teachers of the school are confronting their daily school work by overcoming equally difficult circumstances.

In recognition of these difficult challenges faced by the school, Atse Yohannes Alumni Association (AYAA) became a reality on January 11th, 2003, when a group of alumni set to begin a well-deserved support mechanism to their alma mater. AYAA is a non-political, non-partisan, non-profit and non-governmental association that provides a vital link between the Atse Yohannes School and private donors (alumni, parents, friends of the school) whose technical and material support facilitate educational programming and student opportunity in the school. AYAA supports the school's efforts to maintain, preserve, and improve institutional quality.`;

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
