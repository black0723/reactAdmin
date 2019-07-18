import React, {Component} from 'react'
import {Form, Input} from 'antd'

const Item = Form.Item

class UpdateForm extends Component {
  render() {

    //export default Form.create()(AddForm)包装之后就会得到
    const {getFieldDecorator} = this.props.form;

    return (
      <Form>
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

export default Form.create()(UpdateForm)
