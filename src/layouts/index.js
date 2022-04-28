import React, { Fragment } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
import Loader from 'components/LayoutComponents/Loader'
import { getLayout } from 'utils/ui'
import PublicLayout from './Public'
import LoginLayout from './Login'
import MainLayout from './Main'

const Layouts = {
  public: PublicLayout,
  login: LoginLayout,
  main: MainLayout,
}

@withRouter
class IndexLayout extends React.PureComponent {
  previousPath = ''

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { prevLocation } = prevProps;
    if (location !== prevLocation) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {children, location: { pathname, search }, user} = this.props;
    // NProgress Management
    const currentPath = pathname + search
    if (currentPath !== this.previousPath) {
      NProgress.start();
    }

    setTimeout(() => {
      NProgress.done()
      this.previousPath = currentPath
    }, 300)

    const layout = getLayout(pathname);
    const Container = Layouts[layout];
    const isUserAuthorized = user.authorized;
    const isUserLoading = user.loading;
    const isLoginLayout = layout === 'login'; // auth layout

    const BootstrappedLayout = () => {
      // show loader when user in check authorization process, not authorized yet and not on login pages
      if (isUserLoading && !isUserAuthorized && !isLoginLayout) {
        return <Loader />
      }
      // redirect to login page if current is not login page and user not authorized
      if (!isLoginLayout && !isUserAuthorized) {
        return <Redirect to="/accounts/login" />
      }
      // redirect to menus page when user on login page and authorized
      if (isLoginLayout && isUserAuthorized) {
        return <Redirect to="/dashboard" />
      }
      // in other case render previously set layout
      return <Container>{children}</Container>
    }

    return (
      <Fragment>
        <Helmet
          titleTemplate="Milliways | The Restaurant at the End of the Universe | Staff Client"
          title="Milliways - The Restaurant at the End of the Universe"
        />
        {BootstrappedLayout()}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.accounts.user
  }
}

export default connect(mapStateToProps)(IndexLayout);
