import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Layout} from 'antd';

import memoryUtils from '../../../utils/memoryUtils'
import LeftNav from '../../../components/left-nav/index'
import Header from '../../../components/header/index'

/*引入路由组件*/
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../../not-found/not-found'

const {Footer, Sider, Content} = Layout;

/*
后台管理的路由组件
 */
export default class Admin extends Component {
  render() {

    //获取内存中的user
    const user = memoryUtils.user
    if (!user || !user.id) {
      return <Redirect to="/admin/login"/>
    }
    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav></LeftNav>
        </Sider>
        <Layout>
          <Header>Header</Header>
          {/*路由组件在哪个组件里面映射，就看他在哪个组件里面显示(相当于这个地方被路由组件的内容给替换了)*/}
          <Content style={{margin: '20px 20px 0', backgroundColor: '#fff'}}>
            <Switch>
              {/*如果是访问 / 则跳转到/admin/home  绝对匹配 exact={true}*/}
              <Redirect from='/admin' to='/admin/home' exact={true}/>
              <Redirect from='/' to='/admin/home' exact={true}/>

              <Route path='/admin/home' component={Home}/>
              <Route path='/admin/category' component={Category}/>
              <Route path='/admin/product' component={Product}/>
              <Route path='/admin/role' component={Role}/>
              <Route path='/admin/user' component={User}/>
              <Route path='/admin/charts/bar' component={Bar}/>
              <Route path='/admin/charts/line' component={Line}/>
              <Route path='/admin/charts/pie' component={Pie}/>

              {/*如果上面都没有匹配到则显示NotFound*/}
              <Route component={NotFound}/>
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
