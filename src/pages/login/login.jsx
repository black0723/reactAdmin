import React, {Component} from 'react'
import {Form, Icon, Input, Button} from 'antd';

import './login.less'
import logo from './images/logo.png'

/*
登录的路由组件
 */
class Login extends Component {

  //处理登录
  handleSubmit = (event) => {
    //阻止事件的默认行为
    event.preventDefault()
    //得到form对象
    //const form = this.props.form
    //获取表单项目的输入数据
    //const values = form.getFieldsValue()
    //console.log('handleSubmit', values)

    //对所有的表单字段验证
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('验证成功，提交请求: ', values);
      }
    });

  }

  //对密码验证
  validatorPwd = (rule, value, callback) => {
    if (!value) {
      callback('密码不能为空') //验证失败，并指定提示文本
    } else if (value.length < 4) {
      callback('密码长度不能小于4位')
    } else if (value.length > 12) {
      callback('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      callback('密码必须为字母数字下划线组成!')
    } else {
      callback() //验证通过
    }
  }

  render() {

    //得到form对象
    const form = this.props.form
    const {getFieldDecorator} = form;

    return (
      <div className='login'>
        <header className={'login-header'}>
          <img src={logo} alt="logo"/>
          <h1>商城后台管理系统</h1>
        </header>
        <section className={'login-content'}>
          <h2>用户登录</h2>
          <div>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                {
                  getFieldDecorator('username', {
                    //声明式验证，直接用别人定义好的验证规则
                    rules: [
                      {required: true, whitespace: true, message: '用户名不能为空!'},
                      {min: 4, message: '用户名最少4位!'},
                      {max: 12, message: '用户名最多12位!'},
                      {pattern: /^[a-zA-Z0-9]+$/, message: '用户名必须为字母数字下划线组成!'},
                    ],
                    initialValue:'admin'
                  })(
                    <Input
                      prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                      placeholder="用户名"
                    />
                  )
                }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('password', {
                    rules: [
                      {validator: this.validatorPwd}
                    ],initialValue:'admin'
                  })(
                    <Input
                      prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                      type="password"
                      placeholder="密码"
                    />
                  )
                }
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
    )
  }
}

/*
1.高阶函数
  特点： 接收函数类型的参数，函数的返回值是函数。
  举例： setTimeout，promise,then,forEach,filter,map,find,findIndex,bind()，
        Form.create()，getFieldDecorator
2.高阶组件
  本质就是个函数
  特点：接收一个组件，返回一个新的组件，并且传入特定的属性。
  作用：扩展组件的功能
 */
// 包装Form组件生成一个新的组件Form(Login)，
// 新组件会向Form组件传递一个对象属性form
const WarpLogin = Form.create()(Login)
export default WarpLogin
