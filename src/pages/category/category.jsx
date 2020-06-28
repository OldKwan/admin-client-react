import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    message,
    Modal,
    Input,
    Select,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import {
    get_categoryList,
} from '@/api'
import LinkButton from '@/components/LinkButton'

import './category.less'

const { Option } = Select;

class category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            addVisible: false,
            editVisible: false,
        }
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                render: () => (
                    <span>
                        <LinkButton onClick={() => this.setState({ editVisible: true })}>修改分类</LinkButton>
                        <LinkButton>查看子分类</LinkButton>
                    </span>
                ),
                width: 200,
            }
        ]
        this.extra = (
            <Button type="primary" onClick={() => this.setState({ addVisible: true })}>
                <PlusOutlined />
                添加
            </Button>
        )
        this.loading = false
    }

    componentDidMount() {
        this.loadCategoryList()
    }

    loadCategoryList = async (parentId = 0) => {
        this.loading = true
        const { data } = await get_categoryList({
            parentId,
        })
        this.loading = false
        if (data.status === 0 && data.data) {
            this.setState({
                dataSource: data.data,
            })
        } else {
            message.error('获取分类失败!')
        }
    }

    handleAddCategory = () => {
        console.log('AddCategory');
    }

    handleEditCategory = () => {
        console.log('EditCategory');
    }

    render() {
        const {
            dataSource,
            addVisible,
            editVisible,
        } = this.state
        const title = "一级分类列表"

        return (
            <Card title={title} extra={this.extra}>
                <Table
                    dataSource={dataSource}
                    columns={this.columns}
                    bordered={true}
                    rowKey="_id"
                    loading={this.loading}
                    pagination={{ showQuickJumper: true }}
                />
                <Modal
                    title="添加分类"
                    visible={addVisible}
                    onOk={this.handleAddCategory}
                    onCancel={() => this.setState({ addVisible: false })}
                >
                    <div style={{marginBottom: '16px'}}>所属分类: </div>
                    <Select defaultValue="lucy" style={{ width: '100%', marginBottom: '40px' }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>
                            Disabled
                        </Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                    <div style={{marginBottom: '16px'}}>分类名称: </div>
                    <Input placeholder="请输入分类名称" style={{ marginBottom: '40px' }} />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={editVisible}
                    onOk={this.handleEditCategory}
                    onCancel={() => this.setState({ editVisible: false })}
                >
                    <Input placeholder="请输入名称" style={{ marginBottom: '40px' }} />
                </Modal>
            </Card>
        );
    }
}

export default category;