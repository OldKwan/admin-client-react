import React, { Component } from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Button,
    message,
} from 'antd'
import {
    LeftOutlined,
} from '@ant-design/icons'
import {
    get_categoryList,
    post_addPorduct,
} from '@/api'
import LinkButton from '@/components/LinkButton'
import PicturesWall from './pictures-wall'
import RichText from './RichTextEditor'


const { Item } = Form
const { TextArea } = Input

const checkPrice = (rule, value) => {
    console.log(value);
    if (value > 0) {
      return Promise.resolve();
    }

    return Promise.reject('Price must be greater than zero!');
};

const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
}
const rules = {
    pName: [
        { required: true, message: 'Please input product name!' },
    ],
    desc: [
        { required: true, message: 'Please input product description!' },
    ],
    price: [
        { required: true, message: 'Please input product price!' },
        { validator: checkPrice },
    ],
    cate: [
        { required: true, message: 'Category must be select!' },
    ],
}


class AddUpdate extends Component {
    constructor(props){
        super(props);
        this.state = {
            options: [
                {
                  value: 'zhejiang',
                  label: 'Zhejiang',
                  isLeaf: false,
                },
                {
                  value: 'jiangsu',
                  label: 'Jiangsu',
                  isLeaf: false,
                },
              ]
        }
        this.product = {}
        this.picWallRef = null
        this.richTextRef = null
    }

    componentWillMount() {
        if (this.props.location.state) {
            const {
                isUpdate,
                product,
            } = this.props.location.state
            if (isUpdate) {
                this.product = product
            }
        }
        this.loadCategoryList(0, (dat) => {
            this.setState({
                options: dat.map(item => ({
                    value: item._id,
                    label: item.name,
                    isLeaf: false,
                }))
            }, () => {
                if (this.product.pCategoryId && this.product.pCategoryId !== '0') {
                    this.loadCategoryList(this.product.pCategoryId, (dat2) => {
                        const allOption = dat.map(item1 => {
                            if (item1._id === this.product.pCategoryId) {
                                return {
                                    value: item1._id,
                                    label: item1.name,
                                    isLeaf: false,
                                    children: dat2.map(item3 => ({
                                        value: item3._id,
                                        label: item3.name,
                                        isLeaf: true,
                                    }))
                                }
                            } else {
                                return {
                                    value: item1._id,
                                    label: item1.name,
                                    isLeaf: true,
                                }
                            }
                        })
                        this.setState({
                            options: allOption,
                        })
                    })
                }
            })
        })
    }

    

    onFinish = async (vals) => {
        this.picWallRef && (vals.imgs = this.picWallRef.getPics() || [])
        this.richTextRef && (vals.detail = this.richTextRef.getDetail() || '')
        const params = {
            name: vals.pName,
            desc: vals.desc,
            price: vals.price,
            detail: vals.detail,
            imgs: vals.imgs,
            categoryId: vals.category[vals.category.length - 1],
            pCategoryId: vals.category.length > 1 ? vals.category[0] : '0',
        }
        const { data } = await post_addPorduct(params)
        if (data.status === 0 && data.data) {
            message.success('添加商品成功!')
            this.formRef && this.formRef.resetFields()
            this.props.history.goBack()
        } else {
            message.error('添加商品失败!')
        }
    }

    onFinishFailed = err => {
        message.error(err.errorFields[0].errors[0])
    }

    loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        this.loadCategoryList(targetOption.value, (dat) => {
        targetOption.loading = false;
        if (dat.length > 0) {
            targetOption.children = dat.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }))
        } else {
            targetOption.isLeaf = true
        }
          this.setState({
            options: [...this.state.options],
          });
        })
    };

    onChange = (value) => {
        console.log(value);
    }

    loadCategoryList = async (parentId = 0, cb) => {
        this.loading = true
        const { data } = await get_categoryList({
            parentId,
        })
        this.loading = false
        if (data.status === 0 && data.data) {
            cb && cb(data.data)
        } else {
            message.error('获取分类失败!')
        }
    }

    render() {
        const title = (
            <span>
                <LinkButton>
                    <LeftOutlined style={{ marginRight: 10, color: '#1da57a' }} onClick={() => this.props.history.goBack()}/>
                </LinkButton>
                <span>Product Detail</span>
            </span>
        )
        const categoryList = []
        if (this.product.pCategoryId === '0') {
            categoryList.push(this.product.categoryId)
        } else if (this.product.pCategoryId && this.product.pCategoryId !== '0') {
            categoryList.push(this.product.pCategoryId)
            categoryList.push(this.product.categoryId)
        }
        
        return (
            <Card title={title}>
                <Form
                    {...formLayout}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    initialValues={{
                        pName: this.product.name || '',
                        desc: this.product.desc || '',
                        price: this.product.price || '',
                        category: categoryList,
                    }}
                    ref={ref => this.formRef = ref}
                >
                    <Item label="Product Name" name="pName" rules={rules.pName}>
                        <Input placeholder="enter product name" />
                    </Item>
                    <Item label="Product Desc" name="desc" rules={rules.desc}>
                        <TextArea placeholder="enter product description" autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Item>
                    <Item label="Product Price" name="price" rules={rules.price}>
                        <Input placeholder="enter product price" addonAfter="RMB" />
                    </Item>
                    <Item label="Product Category" name="category" rules={rules.cate}>
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                            onChange={this.onChange}
                            changeOnSelect
                        />
                    </Item>
                    <Item label="Product Pictures" name="imgs" wrapperCol={{ span: 16 }}>
                        <PicturesWall ref={ref => this.picWallRef = ref} imgs={this.product.imgs || []} />
                    </Item>
                    <Item label="Product Detail" name="detail" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        <RichText detail={this.product.detail || ''} ref={ref => this.richTextRef = ref}/>
                    </Item>
                    <Button type="primary" htmlType="submit">
                        submit
                    </Button>
                </Form>
            </Card>
        );
    }
}

export default AddUpdate;