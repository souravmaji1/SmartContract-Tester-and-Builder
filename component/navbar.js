// Navbar.jsx

import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css'; // Import the CSS module
import { Days_One } from 'next/font/google'


const daysone = Days_One({
  subsets: ['latin'],
  weight: '400'
});


const Navbar = () => {
  const [navChecked, setNavChecked] = useState(false);

  const handleNavToggle = () => {
    setNavChecked(!navChecked);
  };

  return (
    <div className={styles.nav}>
      <div className={styles['nav-header']}>
        <div className={styles['nav-title']}>BuilderX</div>
      </div>
      <div className={styles['nav-btn']}>
        <label htmlFor="nav-check">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>
      <div className={styles['nav-links']}>
        <a className={` ${daysone.className}`}  href="" target="_blank">HOME</a>
        <a className={` ${daysone.className}`}  href="" target="_blank">DOCS</a>
        <a className={` ${daysone.className}`}  href="" target="_blank">LINKS</a>
      </div>
    </div>
  );
};

export default Navbar;
