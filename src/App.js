/*根组件
* 1.简单的：函数方式（无状态）
* 2.复杂的：类定义（有状态）
* */

import React, {Component} from 'react'
//引入路由组件
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {

  render() {
    //必须要返回一个虚拟dom
    return (
      <BrowserRouter>
        {/*只匹配其中一个*/}
        <Switch>
          <Route path='/admin/login' component={Login}></Route>
          <Route path='/admin' component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}
