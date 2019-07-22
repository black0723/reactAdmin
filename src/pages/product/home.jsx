import React, {Component} from 'react'
import {Card, Select, Input, Button, Icon, Table, message} from 'antd'

import LinkButton from '../../components/link-button'
import {reqProduct} from '../../api'
import {PAGE_SIZE} from '../../utils/constant'

export default class ProductHome extends Component {

  state = {
    loading: false,
    total: 0, //总记录数
    products: [], //商品数组

  }

  /**
   * 初始化列名
   */
  initColumns() {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'title',
      },
      {
        title: '商品描述',
        dataIndex: 'intro',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => { //当前指定了dataIndex: 'price'传入的就是该字段的值，不指定则传入的是row的值
          return '￥' + price
        }
      },
      {
        title: '图片',
        dataIndex: 'imagepath',
      },
      {
        width: 150,
        title: '状态',
        dataIndex: 'status',
        render: (status) => {
          return (
            <span>
              <span>在售</span>
              <Button type={'primary'} style={{marginLeft: 8}}>下架</Button>
            </span>
          )
        }
      },
      {
        width: 150,
        title: '操作',
        render: (row) => {
          return (
            <span>
              <LinkButton>详情</LinkButton>
              <LinkButton>修改</LinkButton>
            </span>
          )
        }
      },
    ]
  }

  /**
   * 获取商品列表
   */
  getProducts = async (pageIndex, pageSize) => {
    this.setState({loading: true})
    const result = await reqProduct(pageIndex, pageSize);
    this.setState({loading: false})

    if (result.status === 0) {
      const {records, total} = result.data
      this.setState({
        products: records,
        total
      })
    } else {
      message.error('获取列表数据失败！')
    }
  }

  /**
   * 页码改变的回调，参数是改变后的页码及每页条数
   * @param page
   * @param pageSize
   */
  onChange = (page, pageSize) => {
    console.log('onChange()', page, pageSize)
    this.getProducts(page, pageSize)
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getProducts(1, PAGE_SIZE)
  }


  render() {

    const {products, total, loading} = this.state

    const title = (
      <span>
        <Select style={{width: 150}}>
          <Select.Option value={'1'}>按名称搜索</Select.Option>
          <Select.Option value={'2'}>按描述搜索</Select.Option>
        </Select>
        <Input placeholder={'关键字'} style={{width: 150, margin: '0px 20px'}}/>
        <Button type={'primary'}>检索</Button>
      </span>
    )

    const extra = (
      <Button type={'primary'}>
        <Icon type={'plus'}></Icon>
        添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          loading={loading}
          dataSource={products}
          columns={this.columns}
          rowKey={'id'}
          bordered={true}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            total: total,
            //onChange: this.onChange,
            onChange: this.getProducts, //参数一样
          }}
        />
      </Card>
    )
  }
}