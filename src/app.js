import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import LoginLayout from "./layouts/LoginLayout";
import BasicLayout from "./layouts/BasicLayout";
import "./styles/main.css";
import "../node_modules/clipboard/dist/clipboard.min.js";
import { userID, password } from './utils/utils';
import $ from "jquery";

export default class App extends React.Component {
  state = {
    isAuthenticated: localStorage.getItem("userID") ? true : false,
  }

  componentDidMount() {
    $.ajax({
      url: `/record/user?userID=${userID}&password=${password}`,
      contentType: 'application/json',
      success: (res) => {
        console.log("users-info--app", res)
        if (res.users) {
          let balance = res.users[0].balance;
          let userName = res.users[0].UserName;
          this.setState({
            balance: balance,
            userName: userName
          });
        }
      }
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  // location.reload();
  // if (this.state.isAuthenticated == nextState.isAuthenticated) {
  //   return false;
  // } else {
  //   return true;
  // }
  // }

  subscribeAuth = (auth) => {
    this.setState({
      isAuthenticated: auth
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
             <PublicRoute path="/login" component={LoginLayout} subscribeAuth={this.subscribeAuth} />
             <PrivateRoute path="/" isAuthenticated={this.state.isAuthenticated} component={BasicLayout} subscribeAuth={this.subscribeAuth} balance={this.state.balance} userName={this.state.userName} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const PrivateRoute = ({ isAuthenticated, component: Component, subscribeAuth, balance, userName, ...rest }) => (
<Route { ...rest } render={
  props => (isAuthenticated? (<Component {...props} subscribeAuth={subscribeAuth} balance={balance} userName={userName} />): (<Redirect to={{ pathname: '/login', state: { from: props.location }}}/>))
}
/>
)

const PublicRoute = ({ component: Component, subscribeAuth, ...rest }) => (
<Route {...rest} render={
  props => <Component {...props} subscribeAuth={subscribeAuth} />
}
/>
)

//暂时无需
const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}