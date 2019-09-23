import React, {Component} from 'react'
import {Layout} from 'antd';

import './front-home.less'
import Home from '../product/front-home'

const {Header, Footer, Content} = Layout;

export default class FrontHome extends Component {
  render() {
    return (
      <div>
        <Layout style={{minHeight: '100%'}}>
          <Header>Header</Header>
          <Content>

          </Content>
          <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验>
          </Footer>
        </Layout>
      </div>
    )
  }
}