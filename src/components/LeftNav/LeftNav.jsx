import React, { Component } from 'react'
import { Menu } from 'antd';
import { Link } from 'react-router-dom'
import AntdIcon from '@ant-design/icons-react';

import logo from '@/assets/images/logo.png'
import {
    menuList,
} from '@/config/menuConfig.js'

import './LeftNav.less'

const { SubMenu } = Menu;

class LeftNav extends Component {
    render() {
        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                >
                    {
                        menuList.map(item => {
                            if (item.children && item.children.length) {
                                return (
                                    <SubMenu key={item.key} title={
                                        <span>
                                            <AntdIcon type={item.icon} />
                                            {item.title}
                                        </span>
                                    }>
                                        {
                                            item.children.map(item2 => (
                                                <Menu.Item key={item2.key}>
                                                    <Link to={item2.key}>
                                                        <AntdIcon type={item2.icon} />
                                                        {item2.title}
                                                    </Link>
                                                </Menu.Item>
                                            ))
                                        }
                                    </SubMenu>
                                )
                            } else {
                                return (
                                    <Menu.Item key={item.key}>
                                        <Link to={item.key}>
                                            <AntdIcon type={item.icon} />
                                            {item.title}
                                        </Link>
                                    </Menu.Item>
                                )
                            }
                        })
                    }
                </Menu>
            </div>
        );
    }
}

export default LeftNav
