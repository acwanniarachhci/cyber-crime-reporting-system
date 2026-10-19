import React from 'react';

const TIPS = [
  {
    title: 'Phishing Emails & Messages',
    body: 'Be suspicious of urgent messages asking you to click a link or verify account details. Check the sender address carefully, and never enter passwords or OTPs on a page you reached via a link.',
  },
  {
    title: 'Fake Online Shops',
    body: 'Prices that seem too good to be true, requests for bank transfer only (no card/COD), and brand-new pages with no reviews are red flags. Verify the seller before paying in advance.',
  },
  {
    title: 'Investment & Job Scams',
    body: 'Be wary of guaranteed high returns or job offers requiring an upfront "registration fee". Legitimate investments and employers do not pressure you to pay to get paid.',
  },
  {
    title: 'Romance Scams',
    body: 'Be cautious with online relationships that quickly move to requests for money, especially for emergencies, travel, or "customs fees" for a gift.',
  },
  {
    title: 'SIM Swap Fraud',
    body: 'If your phone suddenly loses signal and you did not request a SIM change, contact your provider immediately — this could mean your number has been hijacked to intercept OTPs.',
  },
  {
    title: 'Fake Accounts Impersonating People You Know',
    body: 'If a "friend" messages asking for money from a new or slightly-different account, verify by calling them directly before sending anything.',
  },
];

const Awareness = () => (
  <div className="page">
    <h2>📚 Scam Awareness</h2>
    <p>Learn to recognize common scam tactics so you can protect yourself and others.</p>
    <div className="awareness-grid">
      {TIPS.map((tip) => (
        <div key={tip.title} className="awareness-card">
          <h3>{tip.title}</h3>
          <p>{tip.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Awareness;