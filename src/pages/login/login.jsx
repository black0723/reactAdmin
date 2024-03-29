import React, {Component} from 'react'
import {Form, Icon, Input, Button, Select, message} from 'antd';
import {Redirect} from 'react-router-dom'

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin, reqGetRoles} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

/*
登录的路由组件
 */
class Login extends Component {

  state = {
    roles: []
  }

  constructor(props) {
    super(props)
    console.log('constructor(props)')
    this.getRoles()
  }

  getRoles = async () => {
    const result = await reqGetRoles()
    if (result.status === 0) {
      this.setState({roles: result.data})
    }
  }

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
    this.props.form.validateFields(async (err, values) => {
      if (!err) {

        //console.log('Form表单验证成功，准备提交ajax请求: ', values);
        const {username, password,roleId} = values

        /*
        //使用promise
        reqLogin(username, password, '管理员').then(res => {
          console.log('promise 成功了', res.data)
        }).catch(e => {
          console.log('promise 出错了', e)
        })
        */

        //使用async await
        /*
        //自己处理异常
        try{
           const response = await reqLogin(username, password, '管理员')
           console.log('async await 成功了', response.data)
         }catch (e) {
           console.log('async await 出错了', e)
         }
         */
        //ajax统一处理了异常信息之后
        const result = await reqLogin(username, password, roleId)
        //console.log('async await 成功了', response.data)
        if (result.status === 0) {
          //提示登录成功
          message.success(result.msg)
          //保存登录信息到内存
          memoryUtils.user = result.data
          //保存登录信息到local中
          storageUtils.saveUser(result.data)
          //跳转到管理界面 push()可回退，replace()不可回退
          this.props.history.replace('/admin/home')
        } else {
          message.error(result.msg)
        }
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
    //如果用户已经登录，跳转到管理界面
    const user = memoryUtils.user
    if (user && user.id) {
      return <Redirect to={'/admin'}/>
    }

    //得到form对象
    const form = this.props.form
    const {getFieldDecorator} = form
    const {roles} = this.state

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
                    initialValue: 'admin'
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
                    ], initialValue: 'admin'
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
                {
                  getFieldDecorator('roleId', {
                  })(
                    <Select
                      suffixIcon={<Icon type="usergroup-add" style={{color: 'rgba(0,0,0,.25)'}}/>}
                      placeholder={'请选择角色'}>
                      {
                        roles.map(o => <Select.Option key={o.id} value={o.id}>{o.name}</Select.Option>)
                      }
                    </Select>
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

/*
async 和 await
1.作用
  简化promise对象的使用：不用再使用.then()来指定成功或失败的回调函数
  以同步编码方式（没有回调函数了）实现异步流程
2.哪里写await
  在返回promise的表达式的左边写await：不想要promise对象而想要promise异步执行成功的value数据
  const response = await reqLogin(username, password, '管理员')
3.哪里写async
  await所在函数（最近的函数）定义的左侧
 */

/*
1. 登陆后, 刷新后依然是已登陆状态 (维持登陆)
2. 登陆后, 关闭浏览器后打开浏览器访问依然是已登陆状态 (自动登陆)
3. 登陆后, 访问登陆路径自动跳转到管理界面
*/