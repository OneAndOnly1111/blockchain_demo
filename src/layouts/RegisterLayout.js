import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Icon, Input, Checkbox, message, notification, Radio } from "antd";
import $ from "jquery";
import styles from "./LoginRegister.less";
import logo from "../assets/logo.ico";
import GlobalFooter from "../components/GlobalFooter";
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const copyright = <div>Copyright <Icon type="copyright" /> 2018 云熵网络科技技术部出品</div>;
const links = [{
  title: '云熵官网',
  href: 'http://crazycdn.com',
  blankTarget: true,
}, {
  title: 'GitHub',
  href: 'https://github.com/oneandonly1111/blockchain_demo',
  blankTarget: true,
}, {
  title: 'Ant Design',
  href: 'http://ant.design',
  blankTarget: true,
}];


class LoginForm extends React.Component {

  state = {
    confirmDirty: false,
    submitting: false,
  }

  /*登录验证*/
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submitting: true
        });
        $.ajax({
          url: `/${values.node}/users/registration`,
          type: 'post',
          data: JSON.stringify({
            userID: +values.userID,
            userName: values.userName,
            password: values.password,
            email: values.email
          }),
          success: () => {
            message.success(`注册成功！即将跳转到登录页面~`, 3, () => { this.props.history.push("/user/login") });
            this.setState({
              submitting: false
            });
          },
          error: (err) => {
            message.error(`注册失败！HIA ${err.status}: ${err.statusText}`);
            this.setState({
              submitting: false
            });
          },
        });
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致，请重新输入！');
    } else {
      callback();
    }
  }

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['passwordComfirm'], { force: true });
    }
    callback();
  }


  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>Demo</span>
            </Link>
          </div>
          <div className={styles.desc}></div>
        </div>
        <div className={styles.main}>
          <h3>用户注册</h3>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请填写用户名！' }],
              })(
                <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('userID', {
                rules: [{ required: true, message: '请填写用户ID！' }],
              })(
                <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户ID" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: '请填写邮箱地址！' },{ type: 'email', message: '邮箱地址格式错误！', }],
              })(
                <Input size="large" prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请填写密码！' },{ validator: this.checkConfirm }],
              })(
                <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('passwordComfirm', {
                rules: [{ required: true, message: '请确认密码！' },{ validator: this.checkPassword }],
              })(
                <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} onBlur={this.handleConfirmBlur} type="password" placeholder="确认密码" />
              )}
            </FormItem>
            <FormItem>
              <Button
                size="large"
                className={styles.submit}
                type="primary"
                htmlType="submit"
                loading={this.state.submitting}
              >
                {this.state.submitting ? '注册中...' : '注册'}
              </Button> 
              <Link className = { styles.login } to = "/user/login" >使用已有账户登录 </Link> 
            </FormItem>
          </Form>
        </div>
        <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
      </div>
    );
  }
}

const RegisterLayout = Form.create()(LoginForm);
export default RegisterLayout;