import React, {Component} from 'react'
import {Form, Input, Select} from 'antd'
import PropTypes from 'prop-types' //类型检查

import {reqGetRoles} from '../../api'

const Item = Form.Item
const Option = Select.Option

class UserForm extends Component {

  /**
   * 接收到的值的类型检查
   */
  static propTypes = {
    setForm: PropTypes.func.isRequired, //表单
    user: PropTypes.object //修改的user
  }

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

  componentWillMount() {
    console.log('componentWillMount()')
    //将form对象通过setForm函数传递给父组件
    this.props.setForm(this.props.form)
  }

  componentDidMount() {
    console.log('componentDidMount()')
  }

  render() {
    console.log('render()')
    const {roles} = this.state
    const user = this.props.user || {}

    //export default Form.create()(AddForm)包装之后就会得到
    const {getFieldDecorator} = this.props.form;

    //指定Form/Item布局的配置对象
    const formItemLayout = {
      labelCol: {span: 6}, //左侧label的宽度
      wrapperCol: {span: 15},
    }

    return (
      <Form {...formItemLayout}>
        <Item label={'用户名'}>
          {
            getFieldDecorator('username', {
              initialValue: user.username,
              rules: [
                {required: true, message: '用户名不能为空！'}
              ]
            })(
              <Input placeholder={'请输入用户名'}/>
            )
          }
        </Item>

        <Item label={'密码'}>
          {
            getFieldDecorator('password', {
              initialValue: user.password,
              rules: [
                {required: true, message: '密码不能为空！'}
              ]
            })(
              <Input type={'password'} placeholder={'请输入密码'}/>
            )
          }
        </Item>

        <Item label={'手机号'}>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
              rules: [
                {required: true, message: '手机号不能为空！'}
              ]
            })(
              <Input placeholder={'请输入手机号'}/>
            )
          }
        </Item>

        <Item label={'邮箱'}>
          {
            getFieldDecorator('email', {
              initialValue: user.email,
              rules: [
                {required: true, message: '邮箱不能为空！'}
              ]
            })(
              <Input placeholder={'请输入邮箱'}/>
            )
          }
        </Item>

        <Item label={'角色'}>
          {
            getFieldDecorator('roleId', {
              initialValue: user.roleId,
              rules: [
                {required: true, message: '角色不能为空！'}
              ]
            })(
              <Select placeholder={'请选择角色'}>
                {
                  roles.map(o => <Option key={o.id} value={o.id}>{o.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)
