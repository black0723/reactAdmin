import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import './index.less'
import {formateDate} from '../../utils/dateUtils' //分别暴露需要{}
import memoryUtils from '../../utils/memoryUtils' //默认暴露不需要大括号{}
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api'
import menuConfig from '../../config/menuConfig'
import LinkButton from '../link-button'

class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()), // 当前时间字符串
    dayPictureUrl: '',//天气图片URL
    weather: '' //天气情况文本
  }

  //获取当前天气
  getWeather = async () => {
    //调用接口请求函数获取数据，返回的是promise对象
    const result = await reqWeather('北京')
    const {dayPictureUrl, weather} = result
    //更新状态
    this.setState({
      dayPictureUrl,
      weather
    })
  }

  //获取面包屑（当前请求的title）
  getTitle = () => {
    //当前请求路径
    const path = this.props.location.pathname
    let title = ''
    menuConfig.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(o => path.indexOf(o.key) >= 0)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  //退出登录
  logout = () => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要退出吗？',
      //使用箭头函数，否则this不对
      onOk: () => {
        //清除user
        storageUtils.removeUser()
        memoryUtils.user = {}
        //跳转到登录
        this.props.history.replace('/admin/login')
      },
      onCancel() {
        console.log('取消退出')
      }
    })
  }

  /*
  在第一次render()之后执行，一般在这里做异步ajax或者定时器操作
   */
  componentDidMount() {
    //获取当前时间
    this.intervalId = setInterval(() => {
      //每隔1秒获取当前时间，并更新状态
      const currentTime = formateDate(Date.now())
      this.setState({
        currentTime
      })
    }, 1000)

    //获取当前的天气
    this.getWeather()
  }

  /*
  当前组件卸载之前执行
   */
  componentWillUnmount() {
    //清除定时器
    clearInterval(this.intervalId)
  }

  render() {

    //解构状态
    const {currentTime, dayPictureUrl, weather} = this.state
    //获取登录用户
    const user = memoryUtils.user
    //获取面包屑title
    const title = this.getTitle()

    return (
      <div className={'header'}>
        <div className={'header-top'}>
          <span>欢迎，{user.username}</span>
          {/*<a href="javascript:void(0)" onClick={this.logout}>退出</a>*/}
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className={'header-bottom'}>
          <div className={'header-bottom-left'}>{title}</div>
          <div className={'header-bottom-right'}>
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

//暴露包装后的组件，为了使用路由信息
export default withRouter(Header)