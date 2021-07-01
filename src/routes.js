import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './components/App';
import Results from './components/results/Results';
import Waffle from './components/Waffle';

const routes = (
  <App>
    <Switch>
      <Route path="/waffle" component={Waffle} />
      <Route path="/" component={Results} />
    </Switch>
  </App>
);

export { routes };
