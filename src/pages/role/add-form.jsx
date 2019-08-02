import React, {Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types' //类型检查

const Item = Form.Item

class AddForm extends Component {

  /**
   * 接收到的值的类型检查
   */
  static propTypes = {
    setForm: PropTypes.func.isRequired
  }

  componentWillMount() {
    //将form对象通过setForm函数传递给父组件
    this.props.setForm(this.props.form)
  }

  render() {

    //export default Form.create()(AddForm)包装之后就会得到
    const {getFieldDecorator} = this.props.form;

    //指定Form/Item布局的配置对象
    const formItemLayout = {
      labelCol: {span: 6}, //左侧label的宽度
      wrapperCol: {span: 15},
    }

    return (
      <Form {...formItemLayout}>
        <Item label={'角色名称'}>
          {
            getFieldDecorator('roleName', {
              rules: [
                {required: true, message: '角色名称不能为空！'}
              ]
            })(
              <Input placeholder={'请输入角色名称'}/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)
