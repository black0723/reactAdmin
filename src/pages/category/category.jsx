import React, {Component} from 'react'
import {Card, Table, Button, Icon, message, Modal} from 'antd'

import LinkButton from '../../components/link-button'
import {reqAddCategory, reqUpdateCategory, reqGetCategory} from '../../api/index'

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
  getCategories = async () => {
    //在发送请求之前显示loading
    this.setState({
      loading: true
    })

    const {parentId} = this.state
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
  toUpdateCategory =(category) =>{
    this.setState({
      showStatus: 2
    })
  }

  /**
   * 保存添加分类
   */
  addCategory = () => {

  }

  /**
   * 修改分类
   */
  updateCategory = () => {

  }

  /**
   * 点击取消，隐藏对话框
   */
  handleCancel = () => {
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
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>

        <Modal
          title="修改分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>

      </Card>
    )
  }
}