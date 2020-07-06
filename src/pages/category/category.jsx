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
import {
    PlusOutlined,
    RightSquareOutlined
} from '@ant-design/icons'

import {
    get_categoryList,
    post_editCategory,
    post_addCategory,
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
            secondCate: '',
            secondId: '',
            currentEdit: '',
            currentEditId: 0, 
            currentAddParentId: 0,
            currentAdd: '',
            levelOne: [],
        }
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.handleEditShow(category)}>修改分类</LinkButton>
                        {
                            !this.state.secondCate && <LinkButton onClick={() => this.handleSecondCate(category)}>查看子分类</LinkButton>
                        }
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
        this.addInputRef = null
        this.editInputRef = null
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
            if (parentId == 0) {
                this.setState({
                    levelOne: data.data,
                })
            }
            this.setState({
                dataSource: data.data,
            })
        } else {
            message.error('获取分类失败!')
        }
    }

    handleEditShow = cate => {
        this.setState({
            editVisible: true,
            currentEdit: cate.name,
            currentEditId: cate._id,
        })
    }

    handleAddCategory = async () => {
        const {
            currentAddParentId,
            currentAdd,
            secondId,
        } = this.state
        const {data} = await post_addCategory({
            parentId: currentAddParentId,
            categoryName: currentAdd,
        })
        if (data.status === 0) {
            message.success('添加成功!')
            this.setState({
                addVisible: false,
            }, () => {
                this.loadCategoryList(secondId || 0)
            })
        }
    }

    handleEditCategory = async () => {
        const {
            currentEditId,
            currentEdit,
            secondId,
        } = this.state
        const {data} = await post_editCategory({
            categoryId: currentEditId,
            categoryName: currentEdit,
        })
        if (data.status === 0) {
            message.success('编辑成功!')
            this.setState({
                editVisible: false,
            }, () => {
                this.loadCategoryList(secondId || 0)
            })
        }
    }

    handleSecondCate = (category) => {
        this.loadCategoryList(category._id)
        this.setState({
            secondCate: category.name,
            secondId: category._id,
            currentAddParentId: category._id,
        })
    }

    loadFirstCate = () => {
        this.loadCategoryList()
        this.setState({
            secondCate: '',
            secondId: '',
            currentAddParentId: '',
        })
    }

    onInputChange = (name, val) => {
        this.setState({
            [name]: val.target.value,
        })
    }

    addChange = val => {
        this.setState({
            currentAddParentId: val,
        })
    }

    afterClose = name => {
        this.setState({
            [name]: '',
        })
    }

    render() {
        const {
            dataSource,
            addVisible,
            editVisible,
            secondCate,
            currentEdit,
            currentAdd,
            levelOne,
            secondId,
        } = this.state
        const title = (
            <>
                <LinkButton onClick={this.loadFirstCate}>一级分类列表</LinkButton>
                {
                    secondCate && (
                        <>
                            <RightSquareOutlined style={{ margin: '0 10px' }}/>
                            {secondCate}
                        </>
                    )
                }
            </>
        )

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
                    onCancel={() => this.setState({ addVisible: false, currentAdd: '' })}
                    afterClose={() => this.afterClose('currentAdd')}
                >
                    <div style={{marginBottom: '16px'}}>所属分类: </div>
                    <Select value={secondId || '0'} style={{ width: '100%', marginBottom: '40px' }} onChange={val => this.addChange(val)}>
                        <Option value="0">一级分类</Option>
                        {
                            (levelOne && levelOne.length !== 0) && levelOne.map(item => (
                                <Option value={item._id} key={item._id}>{item.name}</Option>
                            ))
                        }
                    </Select>
                    <div style={{marginBottom: '16px'}}>分类名称: </div>
                    <Input placeholder="请输入分类名称" value={currentAdd} style={{ marginBottom: '40px' }} onChange={val => this.onInputChange( 'currentAdd', val)} />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={editVisible}
                    onOk={this.handleEditCategory}
                    onCancel={() => this.setState({ editVisible: false, currentEdit: '' })}
                    afterClose={() => this.afterClose('currentEdit')}
                >
                    <Input placeholder="请输入名称" value={currentEdit} style={{ marginBottom: '40px' }} onChange={val => this.onInputChange('currentEdit', val)} />
                </Modal>
            </Card>
        );
    }
}

export default category;