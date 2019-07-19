import React, {Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types' //类型检查

const Item = Form.Item

class UpdateForm extends Component {

  /**
   * 接收到的值的类型检查
   */
  static propTypes = {
    category: PropTypes.object.isRequired,  //指定类型为object
    setForm: PropTypes.func.isRequired
  }

  componentWillMount () {
    //将form对象通过setForm函数传递给父组件
    this.props.setForm(this.props.form)
  }

  render() {

    //export default Form.create()(AddForm)包装之后就会得到
    const {getFieldDecorator} = this.props.form;
    //接收组件传过来的值（编辑的当前的一条数据）
    const {category} = this.props

    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              //初始值指定为传过来的值
              initialValue: category.categoryName
            })(
              <Input placeholder={'请输入分类名称'}/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateForm)
