import React, { Component } from 'react';
import { Form, Input, Button, Checkbox, Icon } from 'antd';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerRequest } from 'redux/accounts/actions';
import styles from 'pages/accounts/style.module.scss';

const mapStateToProps = state => {
  return {
    register: state.accounts.register
  }
}

@Form.create()
@connect(mapStateToProps, { registerRequest })
class Register extends Component {
  state = {
    isConfirmBlured: false,
  }

  handleSubmit = event => {
    event.preventDefault()
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        const credentials = {
          username: values.username,
          email: values.email,
          password: values.password
        };
        this.props.registerRequest(credentials);
      }
    })
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState(state => ({
      isConfirmBlured: state.isConfirmBlured || !!value
    }));
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    const password = form.getFieldValue('password');
    if (value && password) {
      if (value !== password) {
        callback('Passwords do not match!');
      }
    }
    callback();
  }

  compareToSecondPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.isConfirmBlured) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  isButtonDisabled = () => {
    const { getFieldsValue, getFieldsError } = this.props.form;
    const valuesEntered = Object.values(getFieldsValue()).every(val => val);
    const hasErrors = Object.values(getFieldsError()).some(val => val);
    return !valuesEntered || hasErrors;
  }

  render() {
    const { form, register, register: {errors} } = this.props;

    return (
      <div>
        <Helmet title="Register" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase text-center">
                    <strong>Create an account</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <Form.Item
                      {...errors.username && {
                        help: errors.username,
                        validateStatus: 'error',
                      }}
                      hasFeedback
                      label="Username"
                    >
                      {form.getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username' }],
                      })(
                        <Input
                          size="default"
                          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          placeholder="Username"
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      {...errors.email && {
                        help: errors.email,
                        validateStatus: 'error',
                      }}
                      hasFeedback
                      label="Email"
                    >
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
                    <Form.Item
                      {...errors.password && {
                      help: errors.password,
                      validateStatus: 'error',
                      }}
                      hasFeedback
                      label="Password"
                    >
                      {form.getFieldDecorator('password', {
                        rules: [
                          { required: true, message: 'Please input your password' },
                          { validator: this.compareToSecondPassword }
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
                      label="Confirm Password"
                      hasFeedback
                    >
                      {form.getFieldDecorator('confirm', {
                        rules: [
                          { required: true, message: 'Please input your password' },
                          { validator: this.compareToFirstPassword }
                        ],
                      })(
                        <Input
                          size="default"
                          type="password"
                          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          placeholder="Password (Confirm)"
                          onBlur={this.handleConfirmBlur}
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      {form.getFieldDecorator('terms', {
                        valuePropName: 'checked',
                        initialValue: false,
                      })(
                        <Checkbox>
                          I read and accept{' '}
                          <a href="#" onClick={(e) => e.preventDefault()} className="text-primary">
                            terms and conditions
                          </a>
                        </Checkbox>,
                      )}
                    </Form.Item>
                    <div className="form-actions text-center">
                      <Button
                        className="mb-2"
                        type="primary"
                        htmlType="submit"
                        loading={register.isLoading}
                        disabled={this.isButtonDisabled()}
                        block
                      >
                        Register
                      </Button>
                      <span className="ml-3 register-link">
                        Already have an account?
                        {' '}
                        <Link to="/accounts/login" className="text-primary utils__link--underlined">
                          Login
                        </Link>
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

export default Register;
