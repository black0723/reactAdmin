import React, {PureComponent} from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types' //类型检查

import menuConfig from '../../config/menuConfig'

const Item = Form.Item
const {TreeNode} = Tree

export default class AuthForm extends PureComponent {

  /**
   * 接收到的值的类型检查
   */
  static propTypes = {
    role: PropTypes.object
  }

  //构造函数初始化
  constructor(props) {
    super(props)

    //初始化状态 选中的菜单
    const {menus} = this.props.role
    console.log('constructor(props) menus', menus)
    this.state = {
      checkedKeys: menus
    }
  }

  /**
   * 根据数据生成树
   */
  getTreeNodes = (menuConfig) => {
    return menuConfig.reduce((prev, item) => {
      prev.push(
        <TreeNode title={item.title} key={item.key}>
          {
            item.children ? this.getTreeNodes(item.children) : null
          }
        </TreeNode>
      )
      return prev
    }, [])
  }

  /**
   * 为父组件提供已选择的menus
   * @returns {string[] | {checked: string[]; halfChecked: string[]} | Array | *}
   */
  getMenus = () => {
    return this.state.checkedKeys
  }

  /**
   * 点击复选框触发
   * @param checkedKeys 选中的key
   */
  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys)
    this.setState({checkedKeys})
  }

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuConfig)
  }

  /**
   * 当组件接收到新的属性的时候调用，在render()之前执行
   */
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps(nextProps)', nextProps)
    //接收到新的传递过来的值之后，更新状态
    const {menus} = nextProps.role
    //componentWillReceiveProps这个方法本身就会更新，所以在这里setState时，不会重新render
    this.setState({
      checkedKeys: (menus && typeof menus === 'string' ? JSON.parse(menus) : menus)
    })
    //this.state.checkedKeys = menus
  }

  render() {

    const {role} = this.props
    const {checkedKeys} = this.state

    //指定Form/Item布局的配置对象
    const formItemLayout = {
      labelCol: {span: 6}, //左侧label的宽度
      wrapperCol: {span: 15},
    }

    return (
      <Form {...formItemLayout}>
        <Item label={'角色名称'}>
          <Input value={role.name} disabled={true}/>
        </Item>

        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}
