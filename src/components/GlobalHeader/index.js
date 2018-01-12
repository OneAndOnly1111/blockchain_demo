import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import styles from './index.less';
import logo from '../../images/avatar.jpg';
const { Header } = Layout;
const userID = "demo";
export default class GlobalHeader extends PureComponent {

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
  }

  render() {
    const { collapsed } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout" disabled><Icon type="logout" />退出登录</Menu.Item>
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
          <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={logo} />
                <span className={styles.name}>{userID}</span>
              </span>
            </Dropdown>
        </div>
      </Header>
    );
  }
}