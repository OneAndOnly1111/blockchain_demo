import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Icon, Input, Checkbox, message, notification, Radio } from "antd";
import $ from "jquery";
import styles from "./LoginLayout.less";
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
    logining: false,
  }

  /*登录验证*/
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          logining: true
        });
        $.ajax({
          url: `/${values.node}/users/login`,
          type: 'post',
          data: JSON.stringify({
            userID: +values.userID,
            password: values.password
          }),
          success: () => {
            //将用户id和pwd及访问节点存储到localStorage
            localStorage.clear();
            localStorage.setItem("userID", values.userID);
            localStorage.setItem("password", values.password);
            localStorage.setItem("node", values.node);
            this.setState({
              logining: false
            });
            this.props.subscribeAuth(true);
            this.props.history.push("/");
            location.reload();
            notification.success({
              message: "登陆成功！",
              description: "欢迎访问区块链Demo~",
              duration: 4.5,
              icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
            });
          },
          error: (err) => {
            message.error(`登陆失败！用户名或密码错误！${err.status}: ${err.statusText}`);
            this.setState({
              logining: false
            });
          },
        });
      }
    });
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
            <FormItem label="访问节点" {...formItemLayout}>
              {getFieldDecorator('node', {
                rules: [{ required: true, message: '请选择要访问的节点！' }],
              })(
                <RadioGroup>
                  <Radio value={"a"}>节点A</Radio>
                  <Radio value={"b"}>节点B</Radio>
                  <Radio value={"c"}>节点C</Radio>
                </RadioGroup>
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
              <Button size="large" type="primary" htmlType="submit" className={styles.login_btn} loading={this.state.logining} >
                {this.state.logining ? '登录中...': '登录'}
              </Button>
              或 <Link to="/register">立即注册！</Link>
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