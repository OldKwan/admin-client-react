import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import {
    get_getRole,
} from '@/api'
import CONFIG from '@/config'
import {
    formateDate,
} from '@/utils/utils'
import AddRole from './add-form'

import './role.less'

class rule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            role: {},
            total: 0,
            addVisible: false,
        }
    }

    componentWillMount() {
        this.loadRolesList()
        this.initColumn()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }

    loadRolesList = async () => {
        const { data } = await get_getRole()
        if (data.status === CONFIG.SUCCESS_CODE && data.data) {
            this.setState({
                roles: data.data,
                total: data.data.length,
            })
        } else {
            message.error('加載角色列表失敗!')
        }
    }

    onRow = role => {
        return {
            onClick: e => {
                this.setState({
                    role,
                })
            }
        }
    }

    render() {
        const {
            roles,
            total,
            role,
            addVisible,
        } = this.state
        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({ addVisible: true })}>create role</Button> &nbsp;&nbsp;
                <Button type="primary" disabled={!role._id}>reset role</Button>
            </span>
        )
        return (
            <Card title={title} >
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: CONFIG.PAGE_SIZE, total }}
                    rowSelection={{ type: 'radio', selectedRowKeys: [role._id] }}
                    onRow={this.onRow}
                >

                </Table>
                <Modal
                    title="添加分类"
                    visible={addVisible}
                    onOk={() => {
                        this.formRef.submit()
                    }}
                    onCancel={() => this.setState({ addVisible: false })}
                >
                    <AddRole setRef={formRef => this.formRef = formRef} onClose={() => this.setState({ addVisible: false })} />
                </Modal>
            </Card>
        );
    }
}

export default rule;