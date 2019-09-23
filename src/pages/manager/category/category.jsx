import React, {Component} from 'react'
import {Card, Table, Button, Icon, message, Modal} from 'antd'

import LinkButton from '../../../components/link-button/index'
import {reqAddCategory, reqUpdateCategory, reqGetCategory} from '../../../api/index'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {

  state = {
    loading: false,// 标识是否正在加载中
    categories: [],// 一级分类列表
    subCategories: [], // 二级分类列表
    parentId: 0, // 父分类的 ID
    parentName: '', // 父分类的名称
    showStatus: 0, // 是否显示对话框 0: 都不显示, 1: 显示添加, 2: 显示更新
  }

  /**
   * 初始化表格的列
   * @returns {*[]}
   */
  initColumns = () => {
    return [
      {
        title: '分类名称',
        dataIndex: 'categoryName',
      },
      {
        title: '操作',
        width: 300,

        //每行都会渲染自己的render
        render: (row) => (
          <span>
            <LinkButton onClick={
              () => {
                this.toUpdateCategory(row)
              }
            }>修改分类</LinkButton>
            {
              /*
                如果这么写onClick={this.showSubCategories(row.parentId)}，那么在渲染的时候就调用而不是点击的时候
                <LinkButton onClick={this.showSubCategories(row.parentId)}>查看子分类</LinkButton>
                所以要改成下面这种写法
                onClick={() => {this.showSubCategories(row.id)}}
                总结：如何想事件回调函数传递参数
                  1，先定义一个匿名函数，
                  2，在匿名函数里调用处理的函数并传递参数
              */
              this.state.parentId === 0 ?
                <LinkButton onClick={() => {
                  console.log('onClick', row)
                  this.showSubCategories(row)
                }}>查看子分类</LinkButton>
                : null
            }
          </span>
        ),
      }
    ]
  }

  /**
   * 获取一级/二级分类数据
   * @returns {Promise<void>}
   */
  getCategories = async (parentId) => {
    //在发送请求之前显示loading
    this.setState({
      loading: true
    })

    //parentId传值了就按parentId，不传就从状态中取
    parentId = parentId || this.state.parentId
    const result = await reqGetCategory(parentId)

    //在请求结束后隐藏loading
    this.setState({
      loading: false
    })

    if (result.status === 0) {
      const categories = result.data
      if (parentId === 0) {
        //更新一级状态
        this.setState({
          categories
        })
      } else {
        //更新2级状态
        this.setState({
          subCategories: categories
        })
      }

    } else {
      message.error('获取分类数据失败')
    }
  }

  /**
   * 获取二级分类
   * @param parentId 父id
   */
  showSubCategories = (category) => {
    //先更新状态(********更新状态的操作是异步执行的********)
    //setState的回调函数，在状态更新且重新render()之后执行
    this.setState({
      parentId: category.id,
      parentName: category.categoryName
    }, () => {
      //调用函数获取二级分类
      this.getCategories()
    })

  }

  /**
   * 显示一级分类列表
   */
  showCategories = () => {
    this.setState({
      parentId: 0,
      parentName: '',
      subCategories: []
    })
  }

  /**
   * pageSize 变化的回调
   * @param current
   * @param pageSize
   */
  onShowSizeChange = (current, pageSize) => {
    console.log('onShowSizeChange()', current, pageSize);
  }

  /**
   * 用于显示数据总量和当前数据顺序
   * @param total
   * @returns {string}
   */
  showTotal = (total, range) => {
    return `${range[0]}-${range[1]} of ${total} items`
  }

  /**
   * 页码改变的回调，参数是改变后的页码及每页条数
   * @param page
   * @param pageSize
   */
  onChange = (page, pageSize) => {
    console.log('onChange()', page, pageSize)
  }

  /**
   * 去添加分类，弹出对话框
   */
  toAddCategory = () => {
    this.setState({
      showStatus: 1
    })
  }

  /**
   * 去修改分类，弹出对话框
   */
  toUpdateCategory = (category) => {
    //保存原来的category
    this.category = category

    //更新分类
    this.setState({
      showStatus: 2
    })
  }

  /**
   * 保存添加分类
   */
  addCategory = () => {
    //先验证表单
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //1.发请求更新数据,(a.收集数据{id, categoryName})
        //a.准备数据
        /*
            1.categoryName是用户输入的，应该从form对象里取，
            2.但是form对象在子组件UpdateForm组件里（这里就涉及到子组件向父组件传值）
            解决：通过props
              //a.父组件：接收setForm函数参数把子组件的form传递过来
              setForm = {
                  (form)=>{ this.form = form }
              }
              //b.子组件：通过setForm函数传递参数把子组件的form传递过来
              componentWillMount () {
                //将form对象通过setForm函数传递给父组件
                this.props.setForm(this.props.form)
              }
         */
        //从this.form对象中取出categoryName的表单值
        //const parentId = this.form.getFieldValue('parentId')
        //const categoryName = this.form.getFieldValue('categoryName')
        const {parentId, categoryName} = values
        //这里参数是单个传递进去的
        const result = await reqAddCategory(parentId, categoryName)
        if (result.status === 0) {
          message.success('保存成功！')
          //2.清除数据，关闭窗口
          this.form.resetFields()
          this.setState({
            showStatus: 0
          })

          //添加的分类就是当前分类列表下的分类
          if (parentId === this.state.parentId) {
            //3.重新显示列表
            this.getCategories()
          } else if (parentId === 0) {
            //在二级分类下，添加一级分类，
            this.getCategories(parentId)
          }
        } else {
          message.error('添加分类失败！')
        }
      }
    })
  }

  /**
   * 修改分类
   */
  updateCategory = () => {
    //先进行表单验证
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //1.发请求更新数据,(a.收集数据{id, categoryName})
        //a.准备数据
        const id = this.category.id
        /*
            1.categoryName是用户输入的，应该从form对象里取，
            2.但是form对象在子组件UpdateForm组件里（这里就涉及到子组件向父组件传值）
            解决：通过props
              //a.父组件：接收setForm函数参数把子组件的form传递过来
              setForm = {
                  (form)=>{ this.form = form }
              }
              //b.子组件：通过setForm函数传递参数把子组件的form传递过来
              componentWillMount () {
                //将form对象通过setForm函数传递给父组件
                this.props.setForm(this.props.form)
              }
         */
        //从this.form对象中取出categoryName的表单值
        //const categoryName = this.form.getFieldValue('categoryName')
        const {categoryName} = values
        //这里参数是传递的对象
        const result = await
          reqUpdateCategory({id, categoryName})
        if (result.status === 0) {
          message.success('保存成功！')
          //2.清除数据，关闭窗口
          this.form.resetFields()
          this.setState({
            showStatus: 0
          })

          //3.重新显示列表
          this.getCategories()
        } else {
          message.error('修改分类失败！')
        }
      }
    })
  }

  /**
   * 点击取消，隐藏对话框
   */
  handleCancel = () => {
    //2.清除数据，关闭窗口
    this.form.resetFields()
    this.setState({
      showStatus: 0
    })
  }

  /**
   * 为第一次render准备数据
   */
  componentWillMount() {
    this.columns = this.initColumns()
  }

  /**
   * 执行异步任务：发送ajax请求
   */
  componentDidMount() {
    this.getCategories()
  }

  /**
   * 渲染页面
   * @returns {*}
   */
  render() {

    //读取状态数据
    const {categories, subCategories, parentId, parentName, loading, showStatus} = this.state
    //读取原来的分类
    const category = this.category

    const cardTitle = parentId === 0 ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
        <Icon type={'arrow-right'} style={{marginRight: 10, marginLeft: 5}}/>
        <span>{parentName}</span>
      </span>
    )

    const extra = (
      <Button type={'primary'} onClick={this.toAddCategory}>
        <Icon type={'plus'}/>
        添加
      </Button>
    )

    return (
      <Card title={cardTitle} extra={extra} style={{width: '100%'}}>
        <Table
          dataSource={parentId === 0 ? categories : subCategories}
          columns={this.columns}
          bordered
          rowKey='id' //找数据列里的id字段
          loading={loading}
          pagination={{
            pageSize: 5,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            showTotal: this.showTotal,
            onChange: this.onChange,
            //total:21
          }}
        />

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categories={categories}
            parentId={parentId}
            setForm={
              (form) => {
                this.form = form
                /*把form存起来*/
              }
            }
          />
        </Modal>

        <Modal
          title="修改分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          {/*传递参数*/}
          <UpdateForm
            category={category}
            setForm={
              (form) => {
                this.form = form
                /*把form存起来*/
              }
            }
          />
        </Modal>

      </Card>
    )
  }
}
