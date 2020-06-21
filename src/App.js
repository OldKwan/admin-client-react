import React from 'react';
import 'antd/dist/antd.less';
import { BrowserRouter, Route, HashRouter, Switch } from 'react-router-dom'

import Login from '@/pages/login/login'

import AdminPage from '@/pages/admin/admin'
import Home from '@/pages/home/home'
import Category from '@/pages/category/category'
import Product from '@/pages/product/product'
import User from '@/pages/user/user'
import Role from '@/pages/role/role'
import Charts from '@/pages/charts/charts'


import NotFound from '@/pages/NotFound/NotFound'


function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/" component={AdminPage} exact />

        <Route path="/" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
