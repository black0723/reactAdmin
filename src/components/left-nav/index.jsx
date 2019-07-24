import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd';

import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'

const {SubMenu} = Menu;

class LeftNav extends Component {

  /*state = {
    collapsed: false
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }*/

  //1.使用map+递归调用，根据menu的数据，生成对应的标签
  getMenuNodesMap = (menuList) => {

    return menuList.map(item => {
      //每个item就是数组[i]
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        //得到当前请求的路由路径
        //非路由组件LeftNav没有路由组件的属性，必须经过withRouter包装才有
        let path = this.props.location.pathname
        //针对/admin/product/detail特殊处理
        if (path.indexOf('/admin/product') === 0) {
          path = '/admin/product'
        }

        //如果当前的路由和和菜单的子key匹配（则展开），将菜单的key保存为openKey
        const cItem = item.children.find(o => path.indexOf(o.key) === 0)
        if (cItem) {
          this.openKey = item.key
        }

        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
            }
          >
            {/*使用递归调用来生成子路由*/}
            {this.getMenuNodesMap(item.children)}
          </SubMenu>
        )
      }
    })
  }

  //2.使用reduce()+递归，根据menu的数据，生成对应的标签
  getMenuNodesReduce = (menuList) => {

    //得到当前请求的路由路径
    //非路由组件LeftNav没有路由组件的属性，必须经过withRouter包装才有
    const path = this.props.location.pathname

    //reduce(回调函数(prev上一次统计的结果,item当前项)，初始值)；回调函数遍历的值push到[]中
    return menuList.reduce((prev, item) => {
      if (item.children) {

        //如果当前的路由和和菜单的子key匹配（则展开），将菜单的key保存为openKey
        const cItem = item.children.find(o => path.indexOf(o.key) === 0)
        if (cItem) {
          this.openKey = item.key
        }

        prev.push(
          (
            <SubMenu
              key={item.key}
              title={
                <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
              }
            >
              {/*使用递归调用来生成子路由*/}
              {this.getMenuNodesReduce(item.children)}
            </SubMenu>
          )
        )
      } else {
        prev.push(
          (
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        )
      }
      //返回累加的结果
      return prev
    }, [])
  }

  /*
  在第一次render()之前执行，作用为第一次render()渲染准备数据
  */
  componentWillMount() {
    /*调用函数，生成菜单，两种方法都可以*/
    //this.menuNodes = this.getMenuNodesMap(menuList)
    this.menuNodes = this.getMenuNodesReduce(menuList)
  }

  render() {

    //得到当前请求的路由路径
    //非路由组件LeftNav没有路由组件的属性，必须经过withRouter包装才有
    let path = this.props.location.pathname
    //针对/admin/product/detail特殊处理
    if (path.indexOf('/admin/product') === 0) {
      path = '/admin/product'
    }

    //得到需要打开菜单项的key
    const openKey = this.openKey

    return (
      <div className={'left-nav'}>
        <Link to={'/admin'} className={'left-nav-header'}>
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>

        <Menu
          //defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
          //inlineCollapsed={this.state.collapsed}
        >
          {
            /*调用函数，生成菜单，两种方法都可以*/
            /*this.getMenuNodesMap(menuList)*/
            /*this.getMenuNodesReduce(menuList)*/
            this.menuNodes
          }

          {/*
          <Menu.Item key="/admin/home">
            <Link to={'/admin/home'}>
              <Icon type="pie-chart"/>
              <span>首页</span>
            </Link>
          </Menu.Item>

          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail"/>
                <span>商品</span>
              </span>
            }
          >
            <Menu.Item key="/admin/category">
              <Link to={'/admin/category'}>
                <Icon type="mail"/>
                <span>品类管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/admin/product">
              <Link to={'/admin/product'}>
                <Icon type="mail"/>
                <span>商品管理</span>
              </Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="/admin/user">
            <Link to={'/admin/user'}>
              <Icon type="pie-chart"/>
              <span>用户管理</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="/admin/role">
            <Link to={'/admin/role'}>
              <Icon type="pie-chart"/>
              <span>角色管理</span>
            </Link>
          </Menu.Item>

          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="mail"/>
                <span>统计图表</span>
              </span>
            }
          >
            <Menu.Item key="/admin/charts/bar">
              <Link to={'/admin/charts/bar'}>
                <Icon type="mail"/>
                <span>柱状图</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/admin/charts/line">
              <Link to={'/admin/charts/line'}>
                <Icon type="mail"/>
                <span>折线图</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/admin/charts/pie">
              <Link to={'/admin/charts/pie'}>
                <Icon type="mail"/>
                <span>饼状图</span>
              </Link>
            </Menu.Item>
          </SubMenu>*/}

        </Menu>
      </div>
    )
  }
}

/*
withRouter:高阶组件
1.包装非路由组件，返回一个新的组件，并且传递3个属性：history/props/match
 */
export default withRouter(LeftNav)
