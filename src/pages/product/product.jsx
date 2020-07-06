import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './home'
import ProductDetail from './detail'
import ProductAddUpdate from './add-update'

import './product.less'

class product extends Component {
    render() {
        return (
            <Switch>
                <Route path="/product" component={ProductHome} exact />
                <Route path="/product/add-update" component={ProductAddUpdate} />
                <Route path="/product/detail" component={ProductDetail} />
                <Redirect to="/product" />
            </Switch>
        );
    }
}

export default product;