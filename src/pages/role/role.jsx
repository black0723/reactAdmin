import React, {Component} from 'react'
import {Card, Button, Table} from 'antd'

export default class Role extends Component {

  state = {
    roles: [
      {
        name: '管理员',
        createTime: '',
        authTime: '',
        authName: ''
      },
      {
        name: '测试',
        createTime: '',
        authTime: '',
        authName: ''
      }
    ]
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
   * 设置行属性
   * @param record 行的对象属性
   */
  onRow = (record) => {
    return {
      onClick: event => { // 点击行
        console.log('onRow onClick()',record)
      },
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  render() {
    const {roles} = this.state
    const title = (
      <span>
        <Button type={'primary'} style={{marginRight: 15}}>创建角色</Button>
        <Button type={'primary'} disabled={true}>设置角色权限</Button>
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
            onChange: this.onChange,
            //total:21
          }}
          rowSelection={{type: 'radio'}}
          onRow={this.onRow}
        />
      </Card>
    )
  }
}