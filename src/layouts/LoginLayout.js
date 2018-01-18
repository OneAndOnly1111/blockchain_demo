import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Icon, Input, Checkbox, message } from "antd";
import $ from "jquery";
import md5 from "md5";
import styles from "./LoginLayout.less";
import logo from "../assets/logo.ico";
import GlobalFooter from "../components/GlobalFooter";

const FormItem = Form.Item;
const copyright = <div>Copyright <Icon type="copyright" /> 2018 云熵网络科技技术部出品</div>;
const links = [{
  title: '云熵官网',
  href: 'http://crazycdn.com',
  blankTarget: true,
}, {
  title: 'GitHub',
  href: 'https://github.com/oneandonly1111/console',
  blankTarget: true,
}, {
  title: 'Ant Design',
  href: 'http://ant.design',
  blankTarget: true,
}];


class LoginForm extends React.Component {
  /*登录验证*/
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("login-values", values)
        $.ajax({
          url: '/users/login',
          type: 'post',
          data: JSON.stringify({
            userID: values.userID,
            password: values.password
          }),
          statusCode: {
            201: (xhr) => {
              message.success('登录成功！欢迎访问~');
            },
            400: (xhr) => {
              message.error(`statusCode:400,当前请求无法被服务器理解！`);
              this.props.subscribeAuth(true);
              this.props.history.push("/");
              //将用户id和pwd存储到localStorage
              localStorage.setItem("userID", values.userID);
              localStorage.setItem("password", values.password);
            },
            404: (xhr) => {
              message.error(`statusCode:404！不存在的请求！`);
            },
            500: (xhr) => {
              message.error(`statusCode:500,服务器错误！`);
            },
          },
        })
      }
    });
  }

  render() {
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
          <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
        </div>
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('userID', {
                rules: [{ required: true, message: '请填写用户名！' }],
              })(
                <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请填写密码！' }],
              })(
                <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住密码</Checkbox>
              )}
              <a className={styles.forgot_pwd} href="">忘记密码</a>
              <Button size="large" type="primary" htmlType="submit" className={styles.login_btn}>
                登录
              </Button>
              或 <a href="">立即注册！</a>
            </FormItem>
          </Form>
        </div>
        <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
      </div>
    );
  }
}

const LoginLayout = Form.create()(LoginForm);
export default LoginLayout;