import React, { useEffect, Component } from 'react'
import { Menu } from 'antd';
import { Link } from 'react-router-dom'

import logo from '@/assets/images/logo.png'
import {
    menuList,
} from '@/config/menuConfig.js'

import './LeftNav.less'

const { SubMenu } = Menu;
let openKey

/* 
根据 treeNodes的数据数组生成对应的 标签数组
使用 map() 和递归
 */
// function getMenuNodes(treeNodes) {
//     return treeNodes.map(item => {
//         if (!item.children) {
//             return (
//                 <Menu.Item key={item.key} icon={item.icon}>
//                     <Link to={item.key}>
//                         {item.title}
//                     </Link>
//                 </Menu.Item>
//             )
//         } else {
//             const cItem = item.children.some(node => node.key === key)
//             if (cItem) {
//                 openKey = item.key
//             }
//             return (
//                 <SubMenu key={item.key} icon={item.icon} title={item.title} >
//                     {
//                         getMenuNodes(item.children)
//                     }
//                 </SubMenu>
//             )
//         }
//     })
// }

/* 
根据 treeNodes的数据数组生成对应的 标签数组
使用 reduce() 和递归
 */
// function getMenuNodes2(treeNodes) {
//     return treeNodes.reduce((pre, item) => {
//         if (!item.children) {
//             pre.push((
//                 <Menu.Item key={item.key} icon={item.icon}>
//                     <Link to={item.key}>
//                         {item.title}
//                     </Link>
//                 </Menu.Item>
//             ))
//         } else {
//             const cItem = item.children.some(node => node.key === key)
//             if (cItem) {
//                 openKey = item.key
//             }
//             pre.push((
//                 <SubMenu key={item.key} icon={item.icon} title={item.title} >
//                     {
//                         getMenuNodes2(item.children)
//                     }
//                 </SubMenu>
//             ))
//         }
//         return pre
//     }, [])
// }

class LeftNav extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
        this.key = undefined
        this.menuNodes = null
        this.openKey = undefined
    }

    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    getMenuNodes = (treeNodes) => {
        this.key = window.location.pathname
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
                const cItem = item.children.some(node => this.key.indexOf(node.key) === 0)
                if (cItem) {
                    this.openKey = item.key
                }
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title} >
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }
    
    render() {
        this.key = window.location.pathname
        if (this.key.indexOf('/product') === 0) {
            this.key = '/product'
        }
        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    selectedKeys={[this.key]}
                    defaultOpenKeys={[this.openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        );
    }
}

export default LeftNav
