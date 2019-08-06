import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Bar extends Component {

  state = {
    sales: [5, 20, 36, 10, 10, 20], //销量
    stores: [15, 10, 26, 20, 18, 16], //库存
  }

  /**
   * 提供配置对象
   */
  getOption = (sales, stores) => {

    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量', '库存']
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: sales
      }, {
        name: '库存',
        type: 'bar',
        data: stores
      }]
    }
  }

  /**
   * 销售更新，
   */
  update = () => {
    this.setState({
      //销量+1
      sales: this.state.sales.map(o => o + 1),
      //库存-1
      stores: this.state.stores.reduce((prev, item) => {
        prev.push(item - 1)
        return prev
      }, [])
    })
  }

  render() {

    const {sales, stores} = this.state

    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>销售</Button>
        </Card>
        <Card title='柱状图一'>
          <ReactEcharts option={this.getOption(sales, stores)} style={{height: 300}}/>
        </Card>
      </div>
    )
  }
}