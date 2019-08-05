import React, {Component} from 'react'
import {Card, Table, Button, Modal, message} from 'antd'

import LinkButton from '../../components/link-button'
import {reqUsers} from "../../api";


export default class User extends Component {

  state = {
    users: [{id: 1, username: 'aaa'}],
    isShowModel: false
  }

  /**
   * 初始化表格的列
   * @returns {*[]}
   */
  initColumns = () => {
    return [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '所属角色',
        dataIndex: 'usertype',
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
            }>修改</LinkButton>
            <LinkButton onClick={
              () => {
                this.toUpdateCategory(row)
              }
            }>删除</LinkButton>
          </span>
        ),
      }
    ]
  }

  /**
   * 添加、修改用户
   */
  saveUser = () => {

  }

  /**
   * 获取用户列表
   * @returns {Promise<void>}
   */
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const users = result.data
      this.setState({users})
    }
  }

  componentWillMount() {
    this.columns = this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {

    const title = (
      <Button type={'primary'}>创建用户</Button>
    )

    const {users, isShowModel} = this.state

    return (
      <Card title={title}>
        <Table
          dataSource={users}
          columns={this.columns}
          bordered
          rowKey='id' //找数据列里的id字段
          pagination={{
            pageSize: 5,
            showQuickJumper: true,
            showSizeChanger: true,
          }}
        />

        <Modal
          title="创建用户"
          visible={isShowModel}
          onOk={this.saveUser}
          onCancel={() => this.setState({isShowModel: false})}
        >
        </Modal>
      </Card>
    )
  }
}