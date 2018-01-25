import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import $ from "jquery";
import styles from './index.less';
import avatar from '../../assets/avatar.jpg';
import { userID, password, node } from '../../utils/utils.js';
const { Header } = Layout;
export default class GlobalHeader extends PureComponent {

  state = {
    // balance: this.props.balance || '0',
    // userName: this.props.userName || 'demo',
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
  }

  handleMenuClick = (item, key, keyPath) => {
    if (item.key == "logout") {
      localStorage.clear();
      this.props.subscribeAuth(false);
    }
  }

  componentDidMount() {
    this.getUserInfo();
    window.setInterval(this.getUserInfo, 5 * 1000);
  }

  //获取个人信息
  getUserInfo = () => {
    $.ajax({
      url: `/${node}/record/user?userID=${userID}&password=${password}`,
      contentType: 'application/json',
      // async: false,
      success: (res) => {
        console.log("users-info", res)
        if (res.user) {
          this.setState({
            balance: res.user[0].balance,
            userName: res.user[0].userName
          });
        }
      }
    });
  }

  render() {
    console.log("GlobalHeader--render!!!", this.props, this.state);
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