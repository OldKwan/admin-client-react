import React, { Component } from 'react'
import { Menu } from 'antd';
import { Link } from 'react-router-dom'
import { ApartmentOutlined } from '@ant-design/icons'

import logo from '@/assets/images/logo.png'
import {
    menuList,
} from '@/config/menuConfig.js'

import './LeftNav.less'

const { SubMenu } = Menu;


/* 
根据 treeNodes的数据数组生成对应的 标签数组
使用 map() 和递归
 */
function getMenuNodes(treeNodes) {
    return treeNodes.map(item => {
        if (!item.children) {
            return (
                <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.key}>
                        {item.title}
                    </Link>
                </Menu.Item>
            )
        } else {
            return (
                <SubMenu key={item.key} icon={item.icon} title={item.title} >
                    {
                        getMenuNodes(item.children)
                    }
                </SubMenu>
            )
        }
    })
}

/* 
根据 treeNodes的数据数组生成对应的 标签数组
使用 reduce() 和递归
 */
function getMenuNodes2(treeNodes) {
    return treeNodes.reduce((pre, item) => {
        if (!item.children) {
            pre.push((
                <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.key}>
                        {item.title}
                    </Link>
                </Menu.Item>
            ))
        } else {
            pre.push((
                <SubMenu key={item.key} icon={item.icon} title={item.title} >
                    {
                        getMenuNodes2(item.children)
                    }
                </SubMenu>
            ))
        }
        return pre
    }, [])
}

function LeftNav(props) {
    const key = window.location.pathname
    return (
        <div className="left-nav">
            <Link to="/" className="left-nav-header">
                <img src={logo} alt="" />
                <h1>硅谷后台</h1>
            </Link>
            <Menu
                selectedKeys={[key]}
                mode="inline"
                theme="dark"
            >
                {
                    getMenuNodes(menuList)
                }
            </Menu>
        </div>
    );
}

export default LeftNav
