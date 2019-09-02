import React, {Component} from 'react'
import {Layout} from 'antd';

import './front-home.less'
import {Redirect, Route, Switch} from "react-router-dom";
import Home from '../fronthome/front-home'

const {Header, Footer, Content} = Layout;

export default class FrontHome extends Component {
  render() {
    return (
      <div>
        <Layout style={{minHeight: '100%'}}>
          <Header>Header</Header>
          <Content>
            <Switch>
              <Route path='/' component={Home}/>
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验>
          </Footer>
        </Layout>
      </div>
    )
  }
}