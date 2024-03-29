import React, {Component} from 'react'
import {Button, Row, Col} from 'antd'

import './not-found.less'

/*前台 404 页面
*/
export default class NotFound extends Component {
  goHome = () => {
    //this.props.setHeadTitle('首页')
    this.props.history.replace('/admin/home')
  }
  render() {
    return (
      <Row className='not-found'>
        <Col span={12} className='left'></Col>
        <Col span={12} className='right'>
          <h1>404</h1>
          <h2>抱歉，你访问的页面不存在</h2>
          <div>
            <Button type='primary' onClick={this.goHome}>
              回到首页
            </Button>
          </div>
        </Col>
      </Row>
    )
  }
}
