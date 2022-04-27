import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Divider, Alert, Spin} from 'antd';
import { Link } from 'react-router-dom';
import AccountAPIClient from 'api/clients/accounts';
import styles from 'pages/accounts/style.module.scss';

export default class AccountActivated extends Component{
  state = {
    isLoading: true,
    message: '',
    messageType: ''
  }

  componentDidMount() {
    const { match } = this.props;
    const requestBody = {
      uid: match.params.uid,
      token: match.params.token
    };

    AccountAPIClient.activateUser(requestBody)
      .then(response => {
        if (response.status === 204) {
          this.setState({
            isLoading: false,
            message: 'Account Activation Successful',
            messageType: 'success'
          })
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.setState({
            isLoading: false,
            message: 'Account Already Activated',
            messageType: 'warning'
          })
        } else if (error.response.status === 400) {
          this.setState({
            isLoading: false,
            message: 'Link expired or invalid',
            messageType: 'error'
          })
        }
      })
  }

  render() {
    const { isLoading, message, messageType } = this.state;
    return (
      <div>
        <Helmet title="Account Activated" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <Spin spinning={isLoading}>
                  <div className={styles.form}>
                    <h4 className="text-uppercase text-center">
                      <Divider><Alert message={message} type={messageType} showIcon /></Divider>
                    </h4>
                    <br />
                    {messageType === 'error' ? (
                      <p className="text-center">
                        Please contact customer service for further assistance
                      </p>
                      ) : (
                        <p className="text-center">
                          Your account is activated. Please login to trade.
                          <Link className="text-primary" to="/"> Log In</Link>
                        </p>
                      )
                    }
                  </div>
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
