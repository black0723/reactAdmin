import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Menu, Icon} from 'antd';

import './index.less'
import logo from '../../assets/images/logo.png'

const {SubMenu} = Menu;

export default class LeftNav extends Component {

  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <div className={'left-nav'}>
        <Link to={'/admin'} className={'left-nav-header'}>
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>

        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="1">
            <Icon type="pie-chart"/>
            <span>首页</span>
          </Menu.Item>

          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail"/>
                <span>商品</span>
              </span>
            }
          >
            <Menu.Item key="7">
              <Icon type="mail"/>
              <span>品类管理</span>
            </Menu.Item>
            <Menu.Item key="8">
              <Icon type="mail"/>
              <span>商品管理</span>
            </Menu.Item>
          </SubMenu>

        </Menu>
      </div>
    )
  }
}