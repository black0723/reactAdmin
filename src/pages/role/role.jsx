import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'

import {reqGetRoles, reqAddRoles, reqSetRolesAuth} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import MemoryUtils from '../../utils/memoryUtils'
import storageUtils from "../../utils/storageUtils";

export default class Role extends Component {

  state = {
    roles: [], //所有角色列表
    selectedRole: {},//当前行选择的角色
    isShowAddForm: false, //是否显示添加角色的窗口
    isShowAuth: false, // 是否显示设置角色权限
  }

  constructor(props) {
    super(props)

    //1.创建容器，接收子组件的menus值
    this.authMenus = React.createRef()
  }

  /**
   * 列
   */
  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime'
      },
      {
        title: '授权时间',
        dataIndex: 'authTime'
      },
      {
        title: '授权人',
        dataIndex: 'authName'
      }
    ]
  }

  /**
   * 获取角色
   */
  getRoles = async () => {
    const result = await reqGetRoles()
    if (result.status === 0) {
      const newRoles = result.data.reduce((prev, item) => {
        item.menus = item.menus ? JSON.parse(item.menus) : []
        prev.push(item)
        return prev
      }, [])

      this.setState({
        roles: newRoles
      })
    }
  }

  /**
   * 添加角色
   */
  addRole = () => {
    //1.表单验证
    this.form.validateFields(async (errors, values) => {
      if (!errors) {
        //2.收集数据
        const {roleName} = values
        //清除表单数据
        this.form.resetFields()
        //发送请求
        const result = await reqAddRoles(roleName)
        if (result.status === 0) {
          message.success('添加成功！')
          this.setState({isShowAddForm: false})
          this.getRoles()

          /**
           * 可以这么更新状态
           const roles = [...this.state.roles]
           roles.push(role)
           this.setState({roles})

           //更新状态：
           1.如果是在原来基础上添加一条数据那么
           //react强烈建议的使用函数的方式
           2.如果是替换到数据（更新的数据和原来的没有关系）
           //则使用传递对象的方式

           this.setState(state=>{ //函数方式
              roles:[...state.roles,newRole]
             })
           */
        } else {
          message.error('添加失败！')
        }
      }
    })
  }

  /**
   * 设置角色权限
   */
  saveSetRoleAuth = async () => {
    //当前tr选择的role
    const role = this.state.selectedRole
    //得到子组件当前checkbox选择的menus
    const menus = this.authMenus.current.getMenus()

    //更新role的menus
    role.menus = JSON.stringify(menus && menus.length > 0 ? menus : [])
    //指定授权人
    role.authName = MemoryUtils.user.username
    //console.log('authName', role)

    //发送ajax请求
    const result = await reqSetRolesAuth(role)
    if (result.status === 0) {
      //方法1，更新列表，重新发请求
      this.getRoles()

      //如果当前更新的是自己的权限，强制退出
      if (role.id === MemoryUtils.user.roleId) {
        message.success('当前用户角色已被修改，请重新登录！')
        MemoryUtils.user = {}
        storageUtils.removeUser()
        this.props.history.replace('/admin/login')
      } else {
        message.success('操作成功！')
        //方法2，更新列表，更新role，更新状态
        this.setState({
          roles: [...this.state.roles],
          isShowAuth: false
        })
      }
    } else {
      message.error('操作失败！')
    }
  }

  /**
   * 去设置角色权限
   */
  toSetRoleAuth = () => {
    this.setState({isShowAuth: true})
  }

  /**
   * 设置行属性
   * @param record 行的对象属性
   */
  onRow = (record) => {
    return {
      onClick: event => { // 点击行
        console.log('onRow onClick()', record)
        this.setState({
          selectedRole: record
        })
      },
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {
    const {roles, selectedRole, isShowAddForm, isShowAuth} = this.state
    const title = (
      <span>
        <Button
          type={'primary'}
          style={{marginRight: 15}}
          onClick={() => {
            this.setState({isShowAddForm: true})
          }}
        >创建角色</Button>
        <Button
          type={'primary'}
          disabled={selectedRole.id ? false : true}
          onClick={this.toSetRoleAuth}
        >设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          dataSource={roles}
          columns={this.columns}
          bordered
          rowKey='id' //找数据列里的id字段
          pagination={{
            pageSize: 5,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            showTotal: this.showTotal,
            //total:21
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [selectedRole.id],
            onSelect: (record) => {
              this.setState({
                selectedRole: record
              })
            }
          }}
          onRow={this.onRow}
        />

        <Modal
          title="添加角色"
          visible={isShowAddForm}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAddForm: false})
          }}
        >
          <AddForm
            setForm={
              (form) => {
                this.form = form
                /*把form存起来*/
              }
            }
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.saveSetRoleAuth}
          onCancel={() => {
            this.setState({isShowAuth: false})
          }}
        >
          <AuthForm role={selectedRole} ref={this.authMenus}/>
        </Modal>
      </Card>
    )
  }
}