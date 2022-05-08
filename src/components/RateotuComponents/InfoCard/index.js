import React from 'react';
import styles from './style.module.scss';

function InfoCard(props) {
  const { title, value, type } = props;
  const className = `${styles.infoCard} ${type.length > 0 ? styles[type] : ''}`;

  return (
    <>
      <div className={className}>
        <span className={styles.digit}>
          <i className="fas fa-pound-sign fa-lg" />
        </span>
        <div className={styles.desc}>
          <span className={styles.title}>{title}</span>
          <p>Total: {value}</p>
        </div>
      </div>
    </>
  );
}

export default InfoCard;
