/**
 * Certifications — static baseline. The backend (Render) can add extra
 * items at runtime; anything matching a title here is NOT overridden.
 */

const CLOUDINARY = 'https://res.cloudinary.com/dkifkkxr9/image/upload/v';

export const FEATURED_CERT = {
  _id: 'aws-saa',
  title: 'AWS Certified Solutions Architect – Associate',
  issuer: 'Amazon Web Services',
  date: '2026-10-28',
  expires: '2029-10-28',
  validationNumber: 'e17de3d7d99d4efaa9e26bdd425be530',
  credentialUrl: 'https://aws.amazon.com/verification',
  pdf: '/docs/AWS_Solutions_Architect_Associate.pdf',
  featured: true,
};

export const CERTIFICATIONS = [
  FEATURED_CERT,
  {
    _id: 'cloudadvisory-internship',
    title: 'Internship DevOps Engineer (Micro-Internship)',
    issuer: 'The CloudAdvisory · Aug 2025 – Jan 2026',
    date: '2026-01-13',
    credentialUrl: 'https://www.linkedin.com/in/nimesha-yasith/details/certifications/',
    image: `${CLOUDINARY}1782318811/portfolio/xwidlwevuzn1heotipjy.jpg`,
  },
  {
    _id: 'cisco-network-technician',
    title: 'Network Technician Career Path',
    issuer: 'Cisco Networking Academy',
    date: '2025-01-30',
    credentialUrl: 'https://www.credly.com/badges/198ca4e5-4af9-460e-ba4e-cb926c0ee90f/linked_in_profile',
    image: `${CLOUDINARY}1782317737/portfolio/ogujju8t547qkpgtjekd.jpg`,
  },
  {
    _id: 'eminance-4',
    title: 'EMINANCE 4.0',
    issuer: 'University of Ruhuna',
    date: '2024-04-06',
    credentialUrl: 'https://www.linkedin.com/in/nimesha-yasith/details/certifications/',
    image: `${CLOUDINARY}1782383017/portfolio/nbmbmryval2mhcvpg8a3.png`,
  },
  {
    _id: 'cyc-plus',
    title: 'Cyber Security Course (CYC+)',
    issuer: 'Extraordinary Thinkers (PVT) LTD',
    date: '2024-01-10',
    credentialUrl: 'https://www.linkedin.com/in/nimesha-yasith/details/certifications/',
    image: `${CLOUDINARY}1782317926/portfolio/b3hpikccs64cxuf5ogeq.jpg`,
  },
  {
    _id: 'xbotix-2023',
    title: 'XbotiX 2023 Organizing Committee Member',
    issuer: 'XbotiX',
    date: '2023-08-24',
    credentialUrl: 'https://www.linkedin.com/in/nimesha-yasith/details/certifications/',
    image: `${CLOUDINARY}1782318054/portfolio/l0e84lgfdvt8d16l6tvj.jpg`,
  },
];

/** Normalise a title so "Cyber Security Course (CYC+) " matches "Cyber Security Course (CYC+)". */
export const certKey = (title = '') =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
