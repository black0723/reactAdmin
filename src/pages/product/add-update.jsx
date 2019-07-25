import React, {Component} from 'react'
import {Card, Form, Input, Cascader, Upload, Button, Icon} from 'antd'

import LinkButton from '../../components/link-button'
import {reqGetCategory} from '../../api'

const {Item} = Form
const {TextArea} = Input

class ProductAddUpdate extends Component {

  state = {
    options: [], //Cascader分类的数据源
  }

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
   * 自定义验证价格是否合法
   * @param rule
   * @param value
   * @param callback
   */
  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback()
    } else {
      callback(' 价格必须大于0')
    }
  }

  /**
   * 异步获取一级/二级分类
   * @param parentId
   * async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
   */
  getCategorys = async (parentId) => {
    const result = await reqGetCategory(parentId)
    if (result.status === 0) {
      const categorys = result.data  //取出分类数据
      //如果是一级分类
      if (parentId === 0) {
        //把分类数据拼接成options格式的数组
        const options = categorys.map(o => ({
          value: o.id,
          label: o.categoryName,
          isLeaf: false,
        }))
        //更新状态
        this.setState({options})
      } else {
        //二级分类
        return categorys  //返回二级列表（当前async函数返回的promise成功，且value为categorys）
      }
    }
  }

  /**
   * 分类，异步获取二级分类
   * @param selectedOptions
   */
  loadData = async selectedOptions => {
    //当前选中的一级分类的option
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true

    //根据选中的分类，异步获取二级分类
    const parentId = targetOption.value //当前选中的值就是二级分类的parentId
    //因为this.getCategorys(parentId)返回的是一个promise对象，所以要加上await
    const subCategorys = await this.getCategorys(parentId)
    targetOption.loading = false

    if (subCategorys && subCategorys.length > 0) {
      //生成二级列表的options，并且关联到当前一级option上
      const childOptions = subCategorys.map(o => (
        {
          value: o.id,
          label: o.categoryName,
          isLeaf: true
        }
      ))
      //关联到当前一级option上
      targetOption.children = childOptions
    } else {
      //没有二级分类
      targetOption.isLeaf = true //是叶子节点
    }
    //更新状态
    this.setState({options: [...this.state.options]})
  }

  componentDidMount() {
    //上来就获取一级分类
    this.getCategorys(0)
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
            <Cascader
              options={this.state.options}
              loadData={this.loadData}
            />
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
