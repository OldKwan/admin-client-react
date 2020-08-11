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
    post_updateRole,
} from '@/api'
import CONFIG from '@/config'
import {
    formateDate,
} from '@/utils/utils'
import AddRole from './add-form'
import AuthRole from './auth-form'
import storage from '@/storage'


import './role.less'

class rule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            role: {},
            total: 0,
            addVisible: false,
            setVisible: false,
            menus: [],
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
                    menus: role.menus,
                })
            }
        }
    }

    onAddSuccess = (role) => {
        this.setState(state => ({
            roles: [...state.roles, role],
        }))
    }

    handleAuthClick = (m) => {
        const { menus } = this.state
        this.setState({
            menus: m,
        })
    }

    loadUpdateRoles = async () => {
        const { role, roles, menus } = this.state
        const user = storage.getUser()
        const { data } = await post_updateRole({
            _id: role._id,
            menus,
            auth_time: new Date().getTime(),
            auth_name: user.username,
        })
        if (data.status === CONFIG.SUCCESS_CODE && data.data) {
            roles.forEach(role => {
                if (role._id === data.data._id) {
                    role.menus = data.data.menus
                }
            })
            this.setState({
                roles: roles,
                setVisible: false,
            })
            message.success('授权成功!')
        } else {
            message.error('授权失败!')
        }
    }

    submitUpdate = () => {
        this.loadUpdateRoles()
    }

    render() {
        const {
            roles,
            total,
            role,
            addVisible,
            setVisible,
            menus,
        } = this.state
        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({ addVisible: true })}>create role</Button> &nbsp;&nbsp;
                <Button type="primary" disabled={!role._id} onClick={() => this.setState({ setVisible: true })}>reset role</Button>
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
                    onCancel={() => {
                        this.setState({
                            addVisible: false,
                        }, () => {
                            this.formRef && this.formRef.resetFields()
                        })
                    }}
                >
                    <AddRole
                        setRef={formRef => this.formRef = formRef}
                        onClose={() => this.setState({ addVisible: false })}
                        onAddSuccess={this.onAddSuccess}
                    />
                </Modal>
                <Modal
                    title="設置角色權限"
                    visible={setVisible}
                    onOk={this.submitUpdate}
                    onCancel={() => {
                        this.setState({
                            setVisible: false,
                            menus: role.menus,
                        })
                    }}
                >
                    <AuthRole
                        role={role}
                        menus={menus}
                        onCheck={this.handleAuthClick}
                    />
                </Modal>
            </Card>
        );
    }
}

export default rule;