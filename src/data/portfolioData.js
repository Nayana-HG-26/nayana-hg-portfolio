// Centralized editorial portfolio data for Nayana H G.

export const PORTFOLIO_PROFILE = {
  initials: 'NHG',
  fullName: 'Nayana H G',
  tagline: 'MCA Student · Full-Stack Developer · Problem Solver',
  heroHeadline: 'Turning Ideas Into Code, Building Experiences That Matter.',
  heroIntro:
    'I am Nayana H G, currently pursuing my Master of Computer Applications (MCA) at Sir M. Visvesvaraya Institute of Technology, Bangalore. With a BCA foundation from Seshadripuram College, Tumakuru, I enjoy crafting thoughtful web interfaces, practical software systems, and responsive full-stack applications.',
  locationCurrent: 'Bangalore, Karnataka',
  locationHome: 'Madhugiri, Tumakuru District, Karnataka 572112',
  email: 'nayanahg26@gmail.com',
  phone: '+91 8296663506',
  phoneHref: 'tel:+918296663506',
  whatsappUrl: 'https://wa.me/918296663506',
  githubUrl: 'https://github.com/Nayana-HG-26/',
  linkedinUrl: 'https://www.linkedin.com/in/nayana-h-g-2a7090367',
  profileImagePrimary:
    'https://image2url.com/r2/default/images/1774250182171-2d07b457-d5d1-49dc-ba6a-8b261a94aebc.jpeg',
  profileImageFallback: '/assets/images/profile.jpg',
  resumePdfUrl:
    'https://image2url.com/r2/default/documents/1774250082552-8248c236-2b88-4e26-a267-ba820e0f9ffd.pdf',
};

export const ABOUT_CONTENT = {
  heading: 'Passion Fuels Purpose.',
  paragraphs: [
    'Hello! I am Nayana H G, an aspiring software developer currently pursuing my Master of Computer Applications (MCA) at Sir M. Visvesvaraya Institute of Technology, Bangalore, after completing my Bachelor of Computer Applications (BCA) at Seshadripuram College, Tumakuru.',
    'My journey in technology started with curiosity about how websites and everyday software solve human problems. Over time, writing my first C programs, designing responsive HTML/CSS pages, and collaborating on student AI demonstrations turned that curiosity into a focused engineering goal.',
    'Today, I focus on building clean, accessible, full-stack web experiences with React.js, JavaScript, Node.js, and MongoDB while strengthening my core foundations in Java, Python, C, and Database Management Systems.',
  ],
  careerObjective:
    'To join a collaborative software engineering team where I can apply my web development and programming fundamentals to build meaningful, user-centered products while continuously learning modern software architecture.',
  strengths: [
    'Analytical problem-solving & structured debugging',
    'Quick learner adaptable to evolving stacks & workflows',
    'Clear communication & dependable team collaboration',
    'Consistent focus on clean design & usability',
  ],
  stats: [
    { value: 'MCA', label: 'Currently Pursuing at Sir MVIT' },
    { value: '4+', label: 'Verified Certifications' },
    { value: '4', label: 'Featured Software Projects' },
    { value: '4+', label: 'Workshops & Public Exhibitions' },
  ],
};

export const ORBITAL_SKILLS = [
  { id: 'html', name: 'HTML5', category: 'frontend', ring: 1, angle: 30, level: 88, note: 'Semantic markup & accessible document structure.' },
  { id: 'css', name: 'CSS3', category: 'frontend', ring: 1, angle: 150, level: 86, note: 'Responsive layouts, Flexbox, Grid & modern animations.' },
  { id: 'js', name: 'JavaScript', category: 'programming', ring: 1, angle: 270, level: 80, note: 'ES6+, DOM interaction, async flows & application logic.' },
  { id: 'react', name: 'React.js', category: 'frontend', ring: 2, angle: 45, level: 78, note: 'Component architecture, hooks, routing & UI state.' },
  { id: 'node', name: 'Node.js', category: 'backend', ring: 2, angle: 135, level: 72, note: 'Server-side JavaScript & Express REST API endpoints.' },
  { id: 'java', name: 'Java', category: 'programming', ring: 2, angle: 225, level: 75, note: 'Object-oriented programming & foundational algorithms.' },
  { id: 'c', name: 'C Language', category: 'programming', ring: 2, angle: 315, level: 75, note: 'Structured programming & CodeVita codathon problem solving.' },
  { id: 'mongo', name: 'MongoDB', category: 'database', ring: 3, angle: 0, level: 72, note: 'Document modeling, collections & full-stack persistence.' },
  { id: 'python', name: 'Python', category: 'programming', ring: 3, angle: 72, level: 80, note: 'Core programming, scripting & data fundamentals.' },
  { id: 'dbms', name: 'DBMS', category: 'database', ring: 3, angle: 144, level: 80, note: 'Relational schemas, SQL concepts & data integrity.' },
  { id: 'r', name: 'R Language', category: 'programming', ring: 3, angle: 216, level: 68, note: 'Introductory data analysis & visualization.' },
  { id: 'git', name: 'Git & VS Code', category: 'tools', ring: 3, angle: 288, level: 82, note: 'Version control, local debugging & MacBook Neo dev workflow.' },
];

export const SKILL_CATEGORIES = [
  { key: 'all', label: 'All Technologies' },
  { key: 'programming', label: 'Programming' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'database', label: 'Database' },
  { key: 'tools', label: 'Tools' },
];

export const EDUCATION_LIST = [
  {
    id: 'mca',
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Sir M. Visvesvaraya Institute of Technology, Bangalore',
    status: 'Currently Pursuing',
    location: 'Bangalore, Karnataka',
    highlights: [
      'Postgraduate specialization in software engineering, web technologies, and database systems.',
      'Building full-stack React.js, Node.js, and MongoDB applications alongside core CS coursework.',
    ],
  },
  {
    id: 'bca',
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Seshadripuram College, Tumakuru',
    status: 'Completed',
    location: 'Tumakuru, Karnataka',
    highlights: [
      'Built strong foundations in C, Java, Python, web technologies (HTML, CSS, JavaScript), and DBMS.',
      'Actively participated in CodeVita C-Programming Codathon, aptitude workshops, and Open AI Day.',
    ],
  },
  {
    id: 'puc',
    degree: 'Pre-University Course (PUC – PCMCs)',
    institution: 'Sri Siddaganga PU College For Women, Tumakuru',
    status: 'Completed',
    location: 'Tumakuru, Karnataka',
    highlights: [
      'Studied Physics, Chemistry, Mathematics, and Computer Science.',
    ],
  },
  {
    id: 'sslc',
    degree: 'Secondary School Leaving Certificate (SSLC)',
    institution: 'Govt. High School, Dabbegatta',
    status: 'Completed',
    location: 'Dabbegatta, Tumakuru',
    highlights: [
      'Completed foundational schooling with active participation in co-curricular activities.',
    ],
  },
];

export const PROJECTS_LIST = [
  {
    id: 'genz-exam-pro',
    number: '01',
    featured: true,
    category: 'Full-Stack Web Platform',
    title: 'Gen-Z Exam Pro',
    image: '/assets/images/project-fullstack.jpg',
    description:
      'An interactive online examination and assessment web platform designed to streamline digital tests, timed evaluations, and instant score feedback for students and educators.',
    techStack: ['React.js', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'CSS3'],
    features: [
      'Timed online examination interface with clear question navigation',
      'Automated evaluation workflow with structured result summaries',
      'Responsive editorial UI optimized for desktop and mobile browsers',
    ],
    githubUrl: 'https://github.com/Nayana-HG-26/',
    liveUrl: '',
  },
  {
    id: 'smart-crop-monitoring',
    number: '02',
    featured: false,
    category: 'Smart Agriculture & AI',
    title: 'Smart Crop Monitoring and Disease Detection',
    image: '/assets/images/project-ai-showcase.jpg',
    description:
      'A smart agriculture solution focused on assisting farmers and learners with crop health monitoring, leaf disease identification insights, and preventive care guidance.',
    techStack: ['Python', 'HTML5', 'CSS3', 'JavaScript', 'Classification Concepts'],
    features: [
      'Crop image inspection workflow for identifying potential leaf diseases',
      'Clear presentation of symptoms and suggested preventive actions',
      'Accessible web interface tailored for non-technical users',
    ],
    githubUrl: 'https://github.com/Nayana-HG-26/',
    liveUrl: '',
  },
  {
    id: 'employee-complaint-system',
    number: '03',
    featured: false,
    category: 'Enterprise Workflow App',
    title: 'Employee Complaint Issue Management System',
    image: '/assets/images/project-javascript.jpg',
    description:
      'A structured workplace grievance and issue-tracking portal enabling employees to log tickets transparently while administrators track status and resolution history.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST API'],
    features: [
      'Ticket submission with category tagging and status tracking',
      'Dedicated administrative view for prioritizing and resolving issues',
      'Persistent database storage for auditability and accountability',
    ],
    githubUrl: 'https://github.com/Nayana-HG-26/',
    liveUrl: '',
  },
  {
    id: 'open-ai-day-demo',
    number: '04',
    featured: false,
    category: 'Academic Public Exhibition',
    title: 'Open AI Day Student Demonstration',
    image: '/assets/images/project-ai-showcase.jpg',
    description:
      'Live student AI demonstration exhibited during the "OPEN AI DAY" public outreach program at Seshadripuram College, Tumakuru, presenting practical AI concepts to visitors.',
    techStack: ['Student Demo', 'AI Concepts', 'Public Presentation'],
    features: [
      'Live interactive demonstration presented to faculty and visiting students',
      'Peer collaboration and clear explanation of technical concepts',
    ],
    githubUrl: 'https://github.com/Nayana-HG-26/',
    liveUrl:
      'https://image2url.com/r2/default/documents/1774245629086-5472b606-901b-43d6-b82d-00f254d6e061.pdf',
    liveLabel: 'Exhibition Certificate',
  },
];

export const CERTIFICATIONS_LIST = [
  {
    id: 'infosys-dm',
    title: 'Digital Marketing Certificate',
    issuer: 'Infosys Springboard',
    year: '2025',
    description:
      'Covered SEO fundamentals, social media workflows, and digital outreach strategies.',
    pdfUrl:
      'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/2210c0b6-3d9f-4ea8-b622-2fcf556cc9dc.pdf',
  },
  {
    id: 'cisco-cyber',
    title: 'Cyber Security Certificate',
    issuer: 'Cisco Networking Academy',
    year: '2025',
    description:
      'Built foundational awareness of cybersecurity principles, threat vectors, and defensive practices.',
    pdfUrl:
      'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/f1fe0465-2c95-4030-b929-7941458945bd.pdf',
  },
  {
    id: 'simplilearn-r',
    title: 'R Programming Certificate',
    issuer: 'Simplilearn',
    year: '2025',
    description:
      'Hands-on introduction to R syntax, exploratory data analysis, and visual plotting.',
    pdfUrl:
      'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/38955707-9449-48c8-9349-7ec21bcb90ab.pdf',
  },
  {
    id: 'simplilearn-python',
    title: 'Python for Beginners Certificate',
    issuer: 'Simplilearn',
    year: '2025',
    description:
      'Learned core Python data types, control flow, functions, and structured problem solving.',
    pdfUrl:
      'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/ca487350-cd14-4338-86a0-fa211b340e1f.pdf',
  },
];

export const EXPERIENCE_LIST = [
  {
    id: 'be10x',
    role: 'AI Tools Workshop Participant',
    organization: 'be10x Platform (Online)',
    duration: 'May 2025',
    points: [
      'Practiced accelerated coding, debugging workflows, and structured presentations with modern AI tools.',
      'Completed introductory exercises in data analysis and workflow productivity.',
    ],
    certificateUrl:
      'https://image2url.com/r2/default/documents/1774244580270-dd8b5522-91a3-49bf-88cd-a21dd391ccf0.pdf',
  },
  {
    id: 'codevita',
    role: 'CodeVita Workshop & Codathon Participant (C-Programming)',
    organization: 'Seshadripuram College, Tumakuru',
    duration: 'July 2024',
    points: [
      'Completed an intensive 1-day workshop and hands-on codathon focused on C-Programming.',
      'Sharpened algorithmic logic under timed coding challenges.',
    ],
    certificateUrl:
      'https://image2url.com/r2/default/documents/1774245629086-5472b606-901b-43d6-b82d-00f254d6e061.pdf',
  },
  {
    id: 'glisten',
    role: 'Aptitude & Soft Skills Career Readiness Trainee',
    organization: 'Glisten Education · Seshadripuram College, Tumakuru',
    duration: 'June 2024',
    points: [
      'Attended structured training on quantitative aptitude, technical communication, and interview readiness.',
    ],
    certificateUrl:
      'https://image2url.com/r2/default/documents/1774245462756-f1b055a1-06ab-44ee-bd15-60dfdf32dbe9.pdf',
  },
  {
    id: 'open-ai-day',
    role: 'Student Project Exhibitor — "OPEN AI DAY"',
    organization: 'Seshadripuram College, Tumakuru',
    duration: 'December 2023',
    points: [
      'Presented a student AI project during a public outreach exhibition to faculty and visitors.',
      'Gained practical experience explaining technical solutions in plain language.',
    ],
    certificateUrl:
      'https://image2url.com/r2/default/documents/1774245629086-5472b606-901b-43d6-b82d-00f254d6e061.pdf',
  },
];

export const INTERNSHIP_STATUS = {
  heading: 'Actively Seeking Software & Full-Stack Internships',
  summary:
    'As an MCA Student at Sir M. Visvesvaraya Institute of Technology, Bangalore, I am open to software engineering, frontend React.js, or full-stack MERN internships where I can contribute meaningfully and learn from experienced engineers.',
  targets: [
    'Frontend Developer Intern (React.js, JavaScript, CSS3)',
    'Full-Stack Developer Intern (React.js, Node.js, Express.js, MongoDB)',
    'Software Development Intern (Java, Python, C, DBMS)',
  ],
};

export const HOBBIES_LIST = [
  {
    name: 'Reading',
    note: 'Technology essays, developer blogs, and personal growth books.',
    icon: 'book',
  },
  {
    name: 'Coding',
    note: 'Experimenting with UI animations, JavaScript challenges, and clean web tools.',
    icon: 'code',
  },
  {
    name: 'Music',
    note: 'Listening to acoustic and instrumental playlists for deep focus.',
    icon: 'music',
  },
  {
    name: 'Photography',
    note: 'Capturing natural light, everyday architecture, and quiet outdoor frames.',
    icon: 'camera',
  },
];
