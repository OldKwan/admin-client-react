import React from 'react';
import 'antd/dist/antd.less';
import { BrowserRouter, Route, HashRouter, Switch, Router } from 'react-router-dom'

import Login from '@/pages/login/login'

import AdminPage from '@/pages/admin/admin'



import NotFound from '@/pages/NotFound/NotFound'

import history from './services/history/history'

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="" component={AdminPage} exact />

        <Route path="/" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
