import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
import 'styles/login.css';
import AlertInfo from 'common/components/AlertInfo';
import Auth  from 'common/utils/auth';
import { userLogin } from 'common/actions/UserAction.js';
import {defaultRoute} from 'constants/routeNav.js'

const mapStateToProps = (state)=>{
    return {
      isLogin: state.app.user.isLogin,
    }
}

const mapDispathToProps = (dispatch) => {
    return {
        onUserLogin: (params) => {
            dispatch( userLogin(params) );
        },
    }
}
class Login extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props, context) {
     super(props, context);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isLogin) {
    
        this.context.router.history.push(defaultRoute);
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onUserLogin(values)    
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="login-container">
          <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('user_name', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
           
            <Button type="primary" htmlType="submit" className="login-form-button">
              登陆
            </Button>
        
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispathToProps)(Form.create()(Login));
