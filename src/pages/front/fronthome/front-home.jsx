import React, {Component} from 'react'
import {Layout,Menu, Icon} from 'antd';

import './front-home.less'
import {Route, Switch} from "react-router-dom";
import Index from '../index/index'

const {Header, Footer, Content} = Layout;
const { SubMenu } = Menu;

export default class FrontHome extends Component {
  state = {
    current: 'mail',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <div>
        <Layout style={{minHeight: '100%'}}>
          <Header>
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
              <Menu.Item key="mail">
                <Icon type="mail" />
                Navigation One
              </Menu.Item>
              <Menu.Item key="app" disabled>
                <Icon type="appstore" />
                Navigation Two
              </Menu.Item>
              <SubMenu
                title={
                  <span className="submenu-title-wrapper">
              <Icon type="setting" />
              Navigation Three - Submenu
            </span>
                }
              >
                <Menu.ItemGroup title="Item 1">
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="Item 2">
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
              <Menu.Item key="alipay">
                <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                  Navigation Four - Link
                </a>
              </Menu.Item>
            </Menu>
          </Header>
          <Content>
            <Switch>
              <Route path='/index' component={Index}/>
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </div>
    )
  }
}