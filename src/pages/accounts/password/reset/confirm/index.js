import React, { Component } from 'react';
import { Form, Input, Button, Icon, notification, Alert } from 'antd';
import { Helmet } from 'react-helmet';
import AccountAPIClient from 'api/clients/accounts';
import styles from 'pages/accounts/password/reset/style.module.scss';

@Form.create()
class PasswordResetConfirm extends Component {
  state = {
    isLoading: false,
    errors: {}
  }

  handleSubmit = event => {
    event.preventDefault()
    const { form, match } = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        this.setState({isLoading: true});
        const requestBody = {
          uid: match.params.uid,
          token: match.params.token,
          new_password: values.new_password,
          re_new_password: values.re_new_password
        };

        AccountAPIClient.resetUserPasswordConfirm(requestBody)
          .then((response) => {
            if (response.status === 204) {
              this.setState({ isLoading: false });
              this.props.history.push('/accounts/login');
              notification.success({
                message: 'Password Changed',
                description: `You have successfully changed your password!
                You may now proceed to log in.`,
                duration: 10
              });
            }
          })
          .catch(error => {
            if (error.response.status === 400) {
              this.setState({
                isLoading: false,
                errors: {...error.response.data}
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
    const { isLoading, errors } = this.state;
    const { form } = this.props;
    const tokenErrors = errors.uid || errors.token || errors.non_field_errors;
    return (
      <div>
        <Helmet title="Reset" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Password Reset Confirm</strong>
                  </h4>
                  <br />
                  {tokenErrors && <Alert message={tokenErrors} type="error" showIcon />}
                  <br />
                  <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <Form.Item
                      {...errors.new_password && {
                        help: errors.new_password,
                        validateStatus: 'error',
                      }}
                      hasFeedback
                      label="Password"
                    >
                      {form.getFieldDecorator('new_password', {
                        rules: [
                          { required: true, message: 'Please input your password' },
                        ],
                      })(
                        <Input
                          size="default"
                          type="password"
                          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          placeholder="Password"
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      {...errors.re_new_password && {
                        help: errors.re_new_password,
                        validateStatus: 'error',
                      }}
                      hasFeedback
                      label="Confirm Password"
                    >
                      {form.getFieldDecorator('re_new_password', {
                        rules: [
                          { required: true, message: 'Please input your password' },
                        ],
                      })(
                        <Input
                          size="default"
                          type="password"
                          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          placeholder="Password (Confirm)"
                        />
                      )}
                    </Form.Item>
                    <div className="form-actions">
                      <Button
                        type="primary"
                        className="width-150 mr-4"
                        htmlType="submit"
                        loading={isLoading}
                        disabled={this.isButtonDisabled()}
                      >
                        Change Password
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

export default PasswordResetConfirm;
