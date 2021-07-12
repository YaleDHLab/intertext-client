import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './components/App';
import Results from './components/results/Results';
import Waffle from './components/Waffle';
import Sankey from './components/charts/Sankey';

const routes = (
  <App>
    <Switch>
      <Route path="/sankey" component={Sankey} />
      <Route path="/waffle" component={Waffle} />
      <Route path="/" component={Results} />
    </Switch>
  </App>
);

export { routes };
