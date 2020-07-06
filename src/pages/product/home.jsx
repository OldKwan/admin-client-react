import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message,
} from 'antd'
import {
    PlusOutlined,
} from '@ant-design/icons'
import LinkButton from '@/components/LinkButton'
import {
    post_ProductList,
} from '@/api'


const Option = Select.Option

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            dataSource: [],
            pageNum: 1,
        }
        this.columns = [
            {
                title: 'Product name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Description',
                dataIndex: 'desc',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: price => `¥${price}`
            },
            {
                title: 'Status',
                dataIndex: 'status',
                render: status => {
                    return (
                        <span>
                            <Button type="primary">Off Shelf</Button>
                            <span>selling</span>
                        </span>
                    )
                },
                width: 120,
            },
            {
                title: 'Operate',
                render: (product) => (
                    <span>
                        <LinkButton>detail</LinkButton>/
                        <LinkButton>edit</LinkButton>
                    </span>
                ),
                width: 150,
            }
        ]
        this.loading = false
    }

    componentWillMount() {
        this.loadProductList()
    }

    loadProductList = async () => {
        const {
            pageNum,
        } = this.state
        const { data } = await post_ProductList({
            pageNum,
            pageSize: 2,
        })
        if (data.status === 0 && data.data) {
            this.setState({
                dataSource: data.data.list,
            })
        } else {
            message.error('獲取產品列表失敗!')
        }
    }
    
    render() {
        const {
            dataSource,
        } = this.state
        const title = (
            <span>
                <Select value="1" style={{width: 150}}>
                    <Option value="1">Search by name</Option>
                    <Option value="2">Search by description</Option>
                </Select>
                <Input placeholder="key-word" style={{width: 150, margin: '0 15px'}} />
                <Button type="primary">Search</Button>
            </span>
        )
        const extra = (
            <Button type="primary">
                <PlusOutlined />
                Add Product
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={dataSource}
                    columns={this.columns}
                    bordered={true}
                    rowKey="_id"
                    loading={this.loading}
                    pagination={{ showQuickJumper: true }}
                />
            </Card>
        );
    }
}

export default Home
