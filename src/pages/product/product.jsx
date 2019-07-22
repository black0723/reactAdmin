import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path={'/admin/product'} component={ProductHome} exact={true}/>
        <Route path={'/admin/product/addupdate'} component={ProductAddUpdate}/>
        <Route path={'/admin/product/detail'} component={ProductDetail}/>
        <Redirect to={'/admin/product'}/>
      </Switch>
    )
  }
}