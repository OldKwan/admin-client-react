import React, { Component } from 'react'
import { Layout } from 'antd'
import { Switch, Route } from 'react-router-dom'

import storage from '@/storage'
import { replace } from '@/services/history'
import LeftNav from '@/components/LeftNav/LeftNav'
import Header from '@/components/Header/Header'

import Home from '@/pages/home/home'
import Category from '@/pages/category/category'
import Product from '@/pages/product/product'
import User from '@/pages/user/user'
import Role from '@/pages/role/role'
import Charts from '@/pages/charts/charts'

const { Footer, Sider, Content } = Layout

class admin extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const user = storage.getUser()
        if (!user || !user._id) {
            replace('/login')
            return null
        }
        return (
            <Layout style={{ height: '100%' }}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header />
                    <Content style={{backgroundColor: 'white'}}>
                        <Switch>
                            <Route path="/" component={Home} exact />
                            <Route path="/home" component={Home} />
                            <Route path="/category" component={Category} />
                            <Route path="/product" component={Product} />
                            <Route path="/user" component={User} />
                            <Route path="/role" component={Role} />
                            <Route path="/charts" component={Charts} />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#aaaaaa' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default admin