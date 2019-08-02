import React, {Component} from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types' //类型检查

import menuConfig from '../../config/menuConfig'

const Item = Form.Item
const {TreeNode} = Tree

export default class AuthForm extends Component {

  /**
   * 接收到的值的类型检查
   */
  static propTypes = {
    role: PropTypes.object
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

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuConfig)
  }

  render() {

    const {role} = this.props

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
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}
