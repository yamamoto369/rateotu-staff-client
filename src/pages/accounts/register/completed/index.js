import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Divider, notification, Button } from 'antd';
import { Link } from 'react-router-dom'
import AccountAPIClient from 'api/clients/accounts';
import styles from 'pages/accounts/style.module.scss';
import { ReactComponent as RegistrationCompletedIcon } from 'assets/images/icons/registration-completed.svg';

export default class RegisterComplete extends Component {
  state = {
    time: '',
    seconds: 600,
    isClicked: false
  }

  componentWillUnmount() {
    if (this.state.isClicked) {
      clearInterval(this.timerID);
    }
  }

  resendActivationEmail = () => {
    const { location } = this.props;
    const email = location.state ? location.state.email : ''
    if (email) {
      const requestBody = { 'email': email };

      AccountAPIClient.resendUserActivationEmail(requestBody)
        .then(response => {
          if (response.status === 204) {
            this.startTimerCountdown()
            notification.success({
              message: 'Email Verification',
              description: `We've sent a verification mail to ${email}`,
              duration: 10
            });
          }
        })
    }
  }

  startTimerCountdown = () => {
    this.setState({ isClicked: true })
    this.timerID = setInterval(() => this.tick(), 1000)
  }

  tick = () => {
    this.setState(prevState => ({
      time: new Date((prevState.seconds - 1) * 1000).toISOString().substr(11, 8),
      seconds: prevState.seconds - 1
    }))
    if (this.state.seconds === 0) {
      clearInterval(this.timerID)
      this.setState({
        time: '',
        seconds: 600,
        isClicked: false
      })
    }
  }

  render() {
    const { time, isClicked } = this.state;
    const { location } = this.props;
    const email = location.state ? location.state.email : '';

    return (
      <div>
        <Helmet title="Registration Completed" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h3 className="text-uppercase text-center">
                    <Link to="/">
                      <RegistrationCompletedIcon />
                    </Link>
                    <Divider orientation="center"><strong>Email Verification</strong></Divider>
                  </h3>
                  <br />
                  <p className="text-center">We&apos;ve sent a confirmation email to your registered email address.<strong> {email} </strong>
                    Please follow the instructions in the email to continue.
                  </p>
                  <Divider />
                  <p>If you haven&apos;t received the email, please try the following:</p>
                  <ul>
                    <li>Make sure the email address you provided is correct.</li>
                    <li>Check your spam or junk mail folders.</li>
                    <li>Make sure your email client is functioning normally.</li>
                  </ul>
                  {email ? (
                    <Button
                      className="float-right"
                      type="link"
                      onClick={this.resendActivationEmail}
                      disabled={isClicked}
                    >
                      {isClicked ? (
                        <p style={{ whiteSpace: 'pre' }}>{`Resend email >> \n ${time}`}</p>
                        ) : (
                          <p>{'Resend email >>'}</p>
                        )
                      }
                    </Button>
                    ) : ''
                  }
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

