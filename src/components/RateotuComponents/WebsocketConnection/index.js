import React, { Component } from 'react';
import { connect } from 'react-redux';
import { wsConnect, wsDisconnect } from 'redux/websockets/actions';

const mapStateToProps = (state) => {
  return {
    user: state.accounts.user,
    wsConnected: state.ws.connected,
  };
};

@connect(mapStateToProps, { wsConnect, wsDisconnect })
class WebSocketConnection extends Component {
  componentDidMount() {
    const { user, wsConnected } = this.props;
    if (user.authorized && !wsConnected) {
      this.props.wsConnect();
    }
  }

  componentWillUnmount() {
    const { user, wsConnected } = this.props;
    if (user.authorized && wsConnected) {
      this.props.wsDisconnect();
    }
  }

  render() {
    return <>{this.props.children}</>;
  }
}

export default WebSocketConnection;
