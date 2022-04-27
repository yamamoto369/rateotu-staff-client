import React from 'react'
import ProfileMenu from './ProfileMenu'
import styles from './style.module.scss'

class TopBar extends React.Component {
  render() {
    return (
      <div className={styles.topbar}>
        <div className="ml-4">
          <ProfileMenu />
        </div>
      </div>
    );
  }
}

export default TopBar
