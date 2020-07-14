import React, { Component } from 'react'
import {
    Card,
    List,
    message,
} from 'antd'
import {
    LeftOutlined,
} from '@ant-design/icons'
import LinkButton from '@/components/LinkButton'
import CONFIG from '@/config'
import {
    get_cateById,
} from '@/api'
import PicturesWall from './pictures-wall'


const Item = List.Item

class Detail extends Component {
    constructor(props){
        super(props);
        this.state = {
            cName1: '',
            cName2: '',
        }
    }

    async componentWillMount() {
        const {product} = this.props.location.state
        if (product) {
            const {
                pCategoryId,
                categoryId,
            } = product
            if (pCategoryId === '0') {
                this.loadCategoryName(categoryId, (dat) => {
                    this.setState({
                        cName1: dat.name,
                    })
                })
            } else {
                const result = await Promise.all([get_cateById({categoryId: pCategoryId}), get_cateById({categoryId})])
                if ((result[0].data.status === 0) && (result[1].data.status === 0)) {
                    this.setState({
                        cName1: result[0].data.data.name,
                        cName2: result[1].data.data.name,
                    })
                }
            }
            
        }
    }

    loadCategoryName = async (categoryId, cb) => {
        const {data} = await get_cateById({
            categoryId,
        })
        if (data.status === 0 && data.data) {
            cb && cb(data.data)
        } else {
            message.error('獲取產品列表失敗!')
        }
    }
    
    render() {
        const {
            cName1,
            cName2,
        } = this.state
        const {product} = this.props.location.state
        const {
            name,
            desc,
            price,
            imgs,
            detail,
        } = product
        const title = (
            <span>
                <LinkButton>
                    <LeftOutlined style={{ marginRight: 10, color: '#1da57a' }} onClick={() => this.props.history.goBack()}/>
                </LinkButton>
                <span>Product Detail</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">Product Name:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">Product Desc:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">Product Price:</span>
                        <span>{price} 元</span>
                    </Item>
                    <Item>
                        <span className="left">Product Category:</span>
                        <span>{cName1}{cName2 === '' ? '' : ` --> ${cName2}`}</span>
                    </Item>
                    <Item>
                        <span className="left">Product Pictures:</span>
                        <PicturesWall />
                    </Item>
                    <Item>
                        <span className="left">Product Detail:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        );
    }
}

export default Detail;