import React from 'react';
import { Form, Input, Button, Checkbox, Icon, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { loginRequest } from 'redux/accounts/actions';
import styles from 'pages/accounts/style.module.scss';

const mapStateToProps = state => {
  return {
    login: state.accounts.login,
  }
}

@Form.create()
@connect(mapStateToProps, { loginRequest })
class Login extends React.Component {
  handleSubmit = event => {
    event.preventDefault()
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        const payload = {
            username: values.username,
            password: values.password,
          };
          this.props.loginRequest(payload);
      }
    })
  }

  isButtonDisabled = () => {
    const { getFieldsValue, getFieldsError } = this.props.form;
    const fields = getFieldsValue();
    delete fields.remember;
    const valuesEntered = Object.values(fields).every(val => val);
    const hasErrors = Object.values(getFieldsError()).some(val => val);
    return !valuesEntered || hasErrors;
  }

  render() {
    const {
      form,
      login,
      login: { errors },
    } = this.props;
    return (
      <div>
        <Helmet title="Login" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase text-center">
                    <strong>Please log in</strong>
                  </h4>
                  <br />
                  {errors.detail && <Alert
                    message="Error"
                    description={errors.detail}
                    type="error"
                    showIcon
                  />}
                  <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item label="Username">
                      {form.getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                      })(
                        <Input
                          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          placeholder="Username"
                        />,
                      )}
                    </Form.Item>
                    <Form.Item label="Password">
                      {form.getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your password!' }],
                      })(
                        <Input
                          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          type="password"
                          placeholder="Password"
                        />,
                      )}
                    </Form.Item>
                    <Form.Item>
                      {form.getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: false,
                      })(
                        <Checkbox>Remember me</Checkbox>
                      )}
                      <Link
                        className="login-form-forgot float-right text-primary"
                        style={{ lineHeight: '36px' }}
                        to="/accounts/password/reset"
                      >
                        Forgot password?
                      </Link>
                    </Form.Item>
                    <div className="form-actions text-center">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button mb-2"
                        loading={login.isLoading}
                        disabled={this.isButtonDisabled()}
                        block
                      >
                        Sign in
                      </Button>
                      <span className="ml-3 register-link">
                        <Link
                          to="/accounts/register"
                          className="text-primary utils__link--underlined"
                        >
                          Register
                        </Link>{' '}
                        if you don&#39;t have account
                      </span>
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

export default Login;
