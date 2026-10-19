import React from 'react';

const Footer = () => (
  <footer className="footer">
    <p>Digital Scam / Cybercrime Reporting System &copy; {new Date().getFullYear()}</p>
    <p className="footer-note">
      If you are in immediate danger or this is a financial emergency, contact your bank and the
      police directly in addition to filing a report here.
    </p>
  </footer>
);

export default Footer;