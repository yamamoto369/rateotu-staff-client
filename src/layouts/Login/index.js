import React from 'react'
import { Layout } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import restaurantLogoInverse from 'assets/images/logo.png';
import styles from './style.module.scss'

@withRouter
class LoginLayout extends React.PureComponent {
  render() {
    const { children } = this.props

    return (
      <Layout>
        <Layout.Content>
          <div
            className={`${styles.layout} ${styles.light}`}
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/resources/images/auth-bg.jpg)`,
            }}
          >
            <div className={styles.header}>
              <div className={styles.logo}>
                <Link to="/">
                  <img
                    src={restaurantLogoInverse}
                    alt=" The Restaurant at the End of the Universe logo"
                  />
                </Link>
              </div>
            </div>
            <div className={styles.content}>{children}</div>
            <div className={`${styles.footer} text-center`}>
              <p>&copy; 2022 The Restaurant at the End of the Universe.</p>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    );
  }
}

export default LoginLayout
