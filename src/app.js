import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import LoginLayout from "./layouts/LoginLayout";
import BasicLayout from "./layouts/BasicLayout";
import "./styles/main.css";

export default class App extends React.Component {
  state = {
    isAuthenticated: false,
  }

  subscribeAuth = (auth) => {
    this.setState({
      isAuthenticated: auth
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate---", nextProps, nextState);
    return nextState.isAuthenticated ? true : false;
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
             <PublicRoute path="/login" component={LoginLayout} subscribeAuth={this.subscribeAuth} />
             <PrivateRoute path="/" isAuthenticated={this.state.isAuthenticated} component={BasicLayout} subscribeAuth={this.subscribeAuth} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const PrivateRoute = ({ isAuthenticated, component: Component, subscribeAuth, ...rest }) => (
<Route { ...rest } render={
  props => (isAuthenticated ? (<Component {...props} subscribeAuth={subscribeAuth} />): (<Redirect to={{ pathname: '/login', state: { from: props.location }}}/>))
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