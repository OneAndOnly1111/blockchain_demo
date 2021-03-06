import React from "react";
import { Layout, Icon } from 'antd';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import SiderMenu from "../components/SiderMenu";
import GlobalHeader from "../components/GlobalHeader";
import GlobalFooter from "../components/GlobalFooter";
import NotFound from "../components/Exception/404";
import { getRouterData } from "../common/route.js";
import { getMenuData } from "../common/menu.js";
import { userID, password } from "../utils/utils";
import $ from "jquery";
/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);


const { Content } = Layout;
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

export default class BasicLayout extends React.Component {
  state = {
    collapsed: false,
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const { collapsed } = this.state;
    console.log("BasicLayout--render!!!--props,---state", this.props, this.state);
    return (
      <div>
        <Layout>
          <SiderMenu
            collapsed={collapsed}
            subscribeAuth={this.props.subscribeAuth}
          />
          <Layout>
            <GlobalHeader
              collapsed={collapsed}
              onCollapse={this.toggle}
              subscribeAuth={this.props.subscribeAuth}
            />
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              <Switch>
                {
                  redirectData.map(item =>
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  )
                }
                {
                  getRouterData().map((route,index)=>(
                    <Route exact={route.exact} path={route.path} key={route.key||index} component={route.component} />
                  ))
                }
                <Redirect exact from="/" to="/video/upload" />
                <Route component={NotFound} />
              </Switch>
            </Content>
            <GlobalFooter links={links} copyright={copyright} />
          </Layout>
        </Layout>
      </div>
    );
  }
}