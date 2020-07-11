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
    get_searchProduct,
    post_updateProductStatus,
} from '@/api'
import CONFIG from '@/config'


const Option = Select.Option

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            dataSource: [],
            total:10,
            productName: '',
            productDesc: '',
            searchType: '1',
            pageNum: 1,
            pageSize: CONFIG.PAGE_SIZE,
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
                render: product => {
                    const { status, _id } = product
                    return (
                        <span>
                            <Button
                                type="primary"
                                onClick={() => this.loadUpdateProductStatus(_id, status === 1 ? 2 : 1)}
                            >
                                {status === 1 ? 'Off Shelf' : 'On Shelf'}
                            </Button>
                            <span>
                                {status === 1 ? 'selling' : 'Off Shelf'}
                            </span>
                        </span>
                    )
                },
                width: 120,
            },
            {
                title: 'Operate',
                render: (product) => (
                    <span>
                        <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>detail</LinkButton>/
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
            pageSize,
        } = this.state
        const { data } = await post_ProductList({
            pageNum,
            pageSize,
        })
        if (data.status === 0 && data.data) {
            this.setState({
                dataSource: data.data.list,
                total: data.data.total,
            })
        } else {
            message.error('獲取產品列表失敗!')
        }
    }
    loadSearchProduct = async () => {
        const {
            pageNum,
            pageSize,
            productName,
            productDesc,
            searchType,
        } = this.state
        const { data } = await get_searchProduct({
            pageNum,
            pageSize,
            productName: searchType === '1' ? productName : '',
            productDesc: searchType === '2' ? productDesc : '',
        })
        if (data.status === 0 && data.data) {
            this.setState({
                dataSource: data.data.list,
                total: data.data.total,
            })
        } else {
            message.error('獲取產品列表失敗!')
        }
    }

    pageOnChange = (page, pageSize) => {
        const {
            productName,
            productDesc,
            searchType,
        } = this.state
        this.setState({
            pageNum: page,
            pageSize,
        }, () => {
            if ((productName && searchType === '1') || (productDesc && searchType === '2')) {
                this.loadSearchProduct()
            } else {
                this.loadProductList()
            }
        })
    }

    onInputChange = (name, event) => {
        this.setState({
            [name]: event.target.value,
        })
    }

    handleSearch = () => {
        this.setState({
            pageNum: 1,
            pageSize: CONFIG.PAGE_SIZE,
        }, () => {
            this.loadSearchProduct()
        })
    }

    loadUpdateProductStatus = async (productId, status) => {
        const {
            productName,
            productDesc,
            searchType,
        } = this.state
        const { data } = await post_updateProductStatus({
            productId,
            status,
        })
        if (data.status === 0) {
            // reload product list
            if ((productName && searchType === '1') || (productDesc && searchType === '2')) {
                this.loadSearchProduct()
            } else {
                this.loadProductList()
            }
        }
    }
    
    render() {
        const {
            dataSource,
            total,
            searchType,
            pageNum,
            productName,
            productDesc,
        } = this.state
        const searchInputName = searchType === '1' ? 'productName' : 'productDesc'
        const searchInputValue = searchType === '1' ? productName : productDesc
        const title = (
            <span>
                <Select value={searchType} style={{width: 150}} onChange={(val) => this.setState(state => ({searchType: val}))}>
                    <Option value="1">Search by name</Option>
                    <Option value="2">Search by description</Option>
                </Select>
                <Input placeholder="key-word" value={searchInputValue} style={{width: 150, margin: '0 15px'}} onChange={(e) => this.onInputChange(searchInputName, e)} />
                <Button type="primary" onClick={this.handleSearch}>Search</Button>
            </span>
        )
        const extra = (
            <Button type="primary" onClick={() => this.props.history.push('/product/add-update')}>
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
                    pagination={{ showQuickJumper: true, pageSize: CONFIG.PAGE_SIZE, total, onChange: this.pageOnChange, current: pageNum }}
                />
            </Card>
        );
    }
}

export default Home
