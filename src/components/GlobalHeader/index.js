import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import $ from "jquery";
import styles from './index.less';
import avatar from '../../assets/avatar.jpg';
import { userID, password } from '../../utils/utils.js';
const { Header } = Layout;
// const userID = "demo";
export default class GlobalHeader extends PureComponent {

  state = {
    balance: this.props.balance || '0',
    userName: this.props.userName || 'demo',
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
  }

  handleMenuClick = (item, key, keyPath) => {
    if (item.key == "logout") {
      localStorage.clear();
      localStorage.removeItem("userID");
      localStorage.removeItem("password");
      this.props.subscribeAuth(false);
    }
  }

  //获取个人信息
  // getUserInfo = () => {
  //   $.ajax({
  //     url: `/record/user?userID=${userID}&password=${password}`,
  //     contentType: 'application/json',
  //     success: (res) => {
  //       console.log("users-info", res)
  //       if (res.users) {
  //         this.setState({
  //           balance: res.users[0].balance,
  //           userName: res.users[0].UserName
  //         });
  //       }
  //     }
  //   });
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log("header-sdm", nextProps, nextState)
  //   return true
  // }

  render() {
    console.log("props--header", this.props)
    console.log("balance", this.state.balance, this.state.userName)
    const { collapsed, subscribeAuth } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Link to="/login"><Icon type="logout" />退出登录</Link></Menu.Item>
      </Menu>
    );
    return (
      <Header className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          <span className={styles.balance}>
          账户余额：<Icon type="pay-circle" className={styles.balance_icon}/><b>{ this.state.balance }</b>
          </span>
          <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={avatar} />
                <span className={styles.name}>{this.state.userName}</span>
              </span>
            </Dropdown>
        </div>
      </Header>
    );
  }
}