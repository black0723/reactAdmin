import React, {Component} from 'react'
import {Card, Icon, List, message} from 'antd'

import LinkButton2 from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constant'
import {reqProductDetail} from '../../api'

export default class ProductDetail extends Component {

  state = {
    product: {}
  }

  //获取商品详情
  getProductDetail = async (id) => {
    const result = await reqProductDetail(id)
    if (result.status === 0) {
      this.setState({
        product: result.data
      })
    } else {
      message.error('获取数据失败')
    }
  }

  componentDidMount() {
    //读取路由传过来的state数据
    const productId = this.props.location.state.id
    this.getProductDetail(productId)
  }

  render() {

    const {product} = this.state
    product.images = ['1.jpg', '2.jpg']

    const title = (
      <span>
        <LinkButton2>
          <Icon
            type={'arrow-left'}
            style={{marginRight: 10, fontSize: 18}}
            onClick={() => this.props.history.goBack()}
          />
        </LinkButton2>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className={'product-detail'}>
        <List bordered={true}>
          <List.Item>
            <span className={'left'}>商品名称：</span>
            <span>{product.title}</span>
          </List.Item>
          <List.Item>
            <span className={'left'}>商品描述：</span>
            <span>{product.intro}</span>
          </List.Item>
          <List.Item>
            <span className={'left'}>商品价格：</span>
            <span>￥{product.price}</span>
          </List.Item>
          <List.Item>
            <span className={'left'}>商品分类：</span>
            <span>{product.categoryName}{product.categoryName2 ? "-->" + product.categoryName2 : ""}</span>
          </List.Item>
          <List.Item>
            <span className={'left'}>商品图片：</span>
            <span>
              {
                product.images.map(o => (
                  <img key={o} src={BASE_IMG_URL + o} alt="image" className={'product-img'}/>
                ))
              }
          </span>
          </List.Item>
          <List.Item>
            <span className={'left'}>商品详情：</span>
            <span dangerouslySetInnerHTML={{__html: product.remark}}></span>
          </List.Item>
        </List>
      </Card>
    )
  }
}
