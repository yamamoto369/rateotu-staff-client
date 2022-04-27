import React, { Component } from 'react';
import { Form, Input, Button, Alert, Icon } from 'antd';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import AccountAPIClient from 'api/clients/accounts';
import styles from 'pages/accounts/password/reset/style.module.scss';

@Form.create()
class PasswordReset extends Component {
  state = {
    isSent: false,
    isLoading: false,
    message: '',
    messageType: ''
  }

  handleSubmit = event => {
    event.preventDefault()
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        this.setState({ isLoading: true });
        const requestBody = {email: values.email};

        AccountAPIClient.resetUserPassword(requestBody)
          .then((response) => {
            if (response.status === 204) {
              this.setState({
                isSent: true,
                isLoading: false,
                message: `If the provided email address matches that account's verified email address,
                you'll receive an email with the reset link shortly.`,
                messageType: 'info'
              })
            }
          })

      }
    })
  }

  isButtonDisabled = () => {
    const { getFieldsValue, getFieldsError } = this.props.form;
    const valuesEntered = Object.values(getFieldsValue()).every(val => val);
    const hasErrors = Object.values(getFieldsError()).some(val => val);
    return !valuesEntered || hasErrors;
  }

  render() {
    const { isSent, isLoading, message, messageType } = this.state;
    const { form } = this.props
    return (
      <div>
        <Helmet title="Reset" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Restore Password</strong>
                  </h4>
                  <br />
                  {isSent && (
                    <Alert
                      message={message}
                      type={messageType}
                      showIcon
                    />
                  )}
                  <br />
                  <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <Form.Item label="Email">
                      {form.getFieldDecorator('email', {
                        rules: [
                          { required: true, message: 'Please input your e-mail address' },
                          { type: 'email', message: 'Not valid E-mail address' }
                        ]
                      })(
                        <Input
                          size="default"
                          prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          placeholder="Email"
                        />
                      )}
                    </Form.Item>
                    <div className="mb-2">
                      <Link to="/accounts/login" className="utils__link--blue utils__link--underlined">
                        Back to login
                      </Link>
                    </div>
                    <div className="form-actions">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        disabled={this.isButtonDisabled()}
                        block
                      >
                        Restore Password
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PasswordReset;
