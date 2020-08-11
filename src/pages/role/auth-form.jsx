import React, { Component } from 'react'
import {
  Form,
  Input,
  message,
  Tree,
} from 'antd'
import CONFIG from '@/config'
import {
    menuList,
} from '@/config/menuConfig.js'

const Item = Form.Item
const { TreeNode  } = Tree
const FormItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 16},
}

/* 
根据 treeNodes的数据数组生成对应的 标签数组
使用 reduce() 和递归
 */
function getTreeStruct(treeNodes) {
    return treeNodes.reduce((pre, item) => {
        if (!item.treeData) {
            pre.push((
                <TreeNode title={item.title} key={item.key} />
            ))
        } else {
            pre.push((
                <TreeNode key={item.key} title={item.title} >
                    {
                        getTreeStruct(item.treeData)
                    }
                </TreeNode>
            ))
        }
        return pre
    }, [])
}

class AuthForm extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
    this.treeStruct = null
  }

  componentWillMount() {
      this.treeStruct = getTreeStruct(menuList)
  }

  
  render() {
    const {
        role,
        onCheck,
        menus,
    } = this.props
    return (
        <Form
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        ref={ref => this.formRef = ref}
        >
            <Item label="role name" {...FormItemLayout}>
            <Input type="text" disabled value={role.name}/>
            </Item>
            <Tree
                checkable
                defaultExpandAll
                checkedKeys={menus}
                onCheck={onCheck}
            >
                <TreeNode key="all" title="平臺權限">
                    {
                        this.treeStruct
                    }
                </TreeNode>
            </Tree>
        </Form>
    )
  }
}

export default AuthForm;