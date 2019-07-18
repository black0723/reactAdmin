import React, {Component} from 'react'
import {Form, Select, Input} from 'antd'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
  render() {

    //export default Form.create()(AddForm)包装之后就会得到
    const {getFieldDecorator} = this.props.form;

    return (
      <Form>
        <Item>
          {
            getFieldDecorator('parentId', {
              initialValue: 0
            })(
              <Select>
                <Option value={0}>一级分类</Option>
                <Option value={2}>aaa</Option>
                <Option value={3}>bbb</Option>
              </Select>
            )
          }
        </Item>
        <Item>
          {
            getFieldDecorator('categoryName', {

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
