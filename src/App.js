import React from 'react';
import 'antd/dist/antd.less';
import { BrowserRouter, Route, Switch, Router } from 'react-router-dom'

import Login from '@/pages/login/login'

import AdminPage from '@/pages/admin/admin'



import NotFound from '@/pages/NotFound/NotFound'

// import history from './services/history/history'

function App() {
  return (
    // <BrowserRouter history={history}>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={AdminPage} />

        <Route path="/" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
