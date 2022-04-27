import React from 'react';
import { Result, Button, notification } from 'antd';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import http403ForbiddenLogo from 'assets/images/exceptions/403.png';

@withRouter
export default class Http403Forbidden extends React.Component {
  componentDidMount() {
    notification.error({
      message: 'Unauthorized Access',
      description: 'You have no rights to access this page!',
    });
  }

  render() {
    return (
      <div className="card">
        <Helmet title="Forbidden" />
        <Result
          title="403"
          subTitle="You are not authorized to access this page"
          extra={<Button type="primary" onClick={() => this.props.history.goBack()}>Go Back</Button>}
          icon={<div><img src={http403ForbiddenLogo} alt="forbidden" /></div>}
        />
      </div>
    )
  }
}


