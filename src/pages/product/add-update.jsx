import React, {Component} from 'react'
import {Card, Form, Input, Cascader, Upload, Button, Icon} from 'antd'

import LinkButton from '../../components/link-button'

const {Item} = Form
const {TextArea} = Input

class ProductAddUpdate extends Component {

  /**
   * 提交表单
   */
  doSubmit = () => {
    //进行表单验证，如果通过了才发请求提交表单
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log('values', values)
        alert('验证通过，发送ajax请求提交表单')
      }
    })
  }

  /**
   * 验证价格是否合法
   * @param rule
   * @param value
   * @param callback
   */
  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  }

  render() {

    //指定Form/Item布局的配置对象
    const formItemLayout = {
      labelCol: {span: 2}, //左侧label的宽度
      wrapperCol: {span: 8},
    }

    const title = (
      <span>
        <LinkButton>
          <Icon
            type={'arrow-left'}
            style={{marginRight: 10, fontSize: 18}}
            onClick={() => this.props.history.goBack()}
          />
        </LinkButton>
        <span>添加商品</span>
      </span>
    )

    const {getFieldDecorator} = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label={'商品名称'}>
            {
              getFieldDecorator('title', {
                initialValue: '',
                rules: [{required: true, message: '商品名称不能为空'}]
              })(<Input placeholder={'请输入商品名称'}/>)
            }
          </Item>
          <Item label={'商品描述'}>
            {
              getFieldDecorator('intro', {
                initialValue: '',
                rules: [{required: true, message: '商品描述不能为空'}]
              })(<TextArea placeholder={'请输入商品描述'} autosize={{minRows: 2, maxRows: 6}}/>)
            }
          </Item>
          <Item label={'商品价格'}>
            {
              getFieldDecorator('price', {
                initialValue: '',
                rules: [
                  {required: true, message: '商品价格不能为空'},
                  {validator: this.validatePrice}
                ]
              })(<Input placeholder={'请输入价格'} type={'number'} addonAfter={'元'} min={1}/>)
            }
          </Item>
          <Item label={'商品分类'}>
            <div>商品分类</div>
          </Item>
          <Item label={'商品图片'}>
            <div>商品图片</div>
          </Item>
          <Item label={'商品详情'}>
            <div>商品详情</div>
          </Item>
          <Item>
            <Button type={'primary'} onClick={this.doSubmit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

//暴露出form对象
export default Form.create()(ProductAddUpdate)
