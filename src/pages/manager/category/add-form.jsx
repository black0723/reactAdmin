import React, {Component} from 'react'
import {Form, Select, Input} from 'antd'
import PropTypes from 'prop-types' //类型检查

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {

  /**
   * 接收到的值的类型检查
   */
  static propTypes = {
    categories: PropTypes.array.isRequired,  //一级分类指定类型
    parentId: PropTypes.number.isRequired,
    setForm: PropTypes.func.isRequired
  }

  componentWillMount() {
    //将form对象通过setForm函数传递给父组件
    this.props.setForm(this.props.form)
  }

  render() {

    //export default Form.create()(AddForm)包装之后就会得到
    const {getFieldDecorator} = this.props.form;
    const {categories, parentId} = this.props

    return (
      <Form>
        <Item>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            })(
              <Select>
                <Option value={0}>一级分类</Option>
                {
                  categories.map(o => <Option value={o.id}>{o.categoryName}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item>
          {
            getFieldDecorator('categoryName', {
              rules: [
                {required: true, message: '分类名称不能为空！'}
              ]
            })(
              <Input placeholder={'请输入分类名称'}/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)
