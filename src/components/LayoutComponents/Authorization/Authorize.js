import React from 'react';
import { connect } from 'react-redux';
import { hasRole } from 'utils/auth';

@connect(({ accounts: { user } }) => ({ user }))
class Authorize extends React.Component {
  handleAuthorization = () => {
    const { children, user, roles = [] } = this.props;
    // if user has no authorized role — prevent component from rendering
    if (!hasRole(user, roles)) {
      return null;
    }
    // if access is authorized — return a children component
    return children;
  }

  render() {
    return this.handleAuthorization();
  }
}

export default Authorize;
