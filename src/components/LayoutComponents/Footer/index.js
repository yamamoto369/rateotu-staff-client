import React from 'react';
import restaurantMobileLogo from 'assets/images/logo-mobile.png';
import styles from './style.module.scss';

const Footer = () => (
  <div className={styles.footer}>
    <div className={styles.inner}>
      <div className="row">
        <div className="col-12 text-center">
          <p>
            <strong>Milliways - The Restaurant at the End of the Universe</strong>
          </p>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="row">
          <div className="col-12 text-center">
            <div className={styles.copyright}>
              <img src={restaurantMobileLogo} rel="noopener noreferrer" alt="Rateotu logo" />
              <span>
                © 2022{' '}
                <a target="_blank" rel="noopener noreferrer">
                  The Restaurant at the End of the Universe
                </a>
                <br />
                All rights reserved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Footer
