import React from 'react';
import { connect } from 'react-redux';
import { Menu, Dropdown, Avatar } from 'antd';
import { logout } from 'redux/accounts/actions';
import styles from './style.module.scss';


const mapStateToProps = (state) => {
  return {
    user: state.accounts.user,
    isSettingsOpen: state.settings.isSettingsOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    dispatch,
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class ProfileMenu extends React.Component {
  handleClick = (e) => {
    const { dispatch, isSettingsOpen } = this.props;
    if (e.key === 'display-settings') {
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isSettingsOpen',
          value: !isSettingsOpen,
        },
      });
    }
  };

  handleLogout = (e) => {
    e.preventDefault();
    this.props.logout();
  };

  render() {
    const { user } = this.props;
    const menu = (
      <Menu selectable={false} onClick={this.handleClick}>
        <Menu.Item key="user-info">
          <strong>Hello, {user.username || 'Anonymous'}</strong>
          <div>
            <strong>Role:</strong>{' '}
            {user.role}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="display-settings">
          <i className={`${styles.menuIcon} fab fa-phabricator fa-lg`} />
          Display Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <a href="#" onClick={this.handleLogout}>
            <i className={`${styles.menuIcon} fas fa-sign-out fa-lg`} />
            Logout
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <div className={styles.dropdown}>
          <Avatar className={styles.avatar} shape="square" size="large" icon="user" />
        </div>
      </Dropdown>
    );
  }
}

export default ProfileMenu;
