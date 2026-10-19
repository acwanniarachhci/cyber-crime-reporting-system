import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    title: 'Incident Reporting',
    desc: 'Submit details of a scam anonymously or with an account, in minutes.',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&h=350&fit=crop',
    link: '/report',
    linkText: 'Report a Scam',
  },
  {
    title: 'Other Cyber Crime',
    desc: 'Hacking, malware, identity theft, or any cybercrime not listed above — report it here.',
    img: '/1.jpg',
    link: '/report',
    linkText: 'Register a Complaint',
  },
  {
    title: 'Evidence Upload',
    desc: 'Attach screenshots or documents to support your report.',
    img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=350&fit=crop',
    link: '/report',
    linkText: 'Submit Evidence',
  },
  {
    title: 'Case Tracking',
    desc: "Follow your report's status using your unique case ID.",
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=350&fit=crop',
    link: '/track',
    linkText: 'Track Case',
  },
  {
    title: 'Scam Awareness',
    desc: 'Learn to recognize common scam tactics before they reach you.',
    img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=350&fit=crop',
    link: '/awareness',
    linkText: 'Learn More',
  },
  {
    title: 'Verified Scam Database',
    desc: 'Search known scam phone numbers, accounts, and websites.',
    img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&h=350&fit=crop',
    link: '/database',
    linkText: 'Search Database',
  },
  {
    title: 'Admin Investigation',
    desc: 'Investigators triage, track, and resolve reported cases.',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=350&fit=crop',
    link: '/login',
    linkText: 'Admin Login',
  },
    
];

const Home = () => (
  <div className="page home-page">
    <section className="hero">
      <h1>🔒 Digital Scam / Cybercrime Reporting System</h1>
      <p>
        Report online scams, fake accounts, phishing attempts, and payment fraud. Track your case,
        browse verified scam records, and help protect others.
      </p>
      <div className="hero-actions">
        <Link to="/report" className="btn btn-primary">Report a Scam</Link>
        <Link to="/track" className="btn btn-secondary">Track My Case</Link>
      </div>
    </section>

    <section className="feature-grid-img">
      {FEATURES.map((f) => (
        <div key={f.title} className="feature-img-card">
          <div className="feature-img-wrap">
            <img src={f.img} alt={f.title} />
            <div className="feature-img-title">{f.title}</div>
          </div>
          <div className="feature-img-body">
            <p>{f.desc}</p>
            <Link to={f.link} className="btn btn-primary btn-sm">{f.linkText}</Link>
          </div>
        </div>
      ))}
    </section>
  </div>
);

export default Home;