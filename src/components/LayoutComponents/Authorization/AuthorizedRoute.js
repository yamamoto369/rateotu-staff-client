import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { hasRole } from 'utils/auth';

const AuthorizedRoute = (roles = []) => (WrappedComponent) => {
  @connect(({ accounts: { user } }) => ({ user }))
  class WithAuthorization extends React.Component {
    handleAuthorization = () => {
      const { user } = this.props;
      const to = '/forbidden';
      // if user has no authorized role — make redirect to the 403 page
      if (!hasRole(user, roles)) {
        return <Redirect to={to} />
      }
      // if access is authorized — return a wrapped route
      return <WrappedComponent {...this.props} />
    }

    render() {
      return this.handleAuthorization();
    }
  }
  return WithAuthorization;
}

export default AuthorizedRoute;
