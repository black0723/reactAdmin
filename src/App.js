/*根组件
* 1.简单的：函数方式（无状态）
* 2.复杂的：类定义（有状态）
* */

import React, {Component} from 'react'
//引入路由组件
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Admin from './pages/manager/admin/admin'
import FrontHome from './pages/front/fronthome/front-home'

export default class App extends Component {

  render() {
    //必须要返回一个虚拟dom
    return (
      <BrowserRouter>
        {/*路由组件在哪个组件里面映射，就看他在哪个组件里面显示(相当于这个地方被路由组件的内容给替换了),只匹配其中一个*/}
        <Switch>
          <Route path='/admin' component={Admin}></Route>
          <Route path='/' component={FrontHome}></Route>
          <Route component={FrontHome}/>
        </Switch>
      </BrowserRouter>
    )
  }
}
