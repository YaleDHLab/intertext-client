import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import App from './components/App';
import Results from './components/results/Results';
import Waffle from './components/charts/Waffle';
import Sankey from './components/charts/Sankey';
import Scatterplot from './components/charts/Scatterplot';
import Works from './components/works/Works';

const routes = (
  <App>
    <Switch>
      <Route path="/sankey" component={Sankey} />
      <Route path="/waffle" component={Waffle} />
      <Route path="/scatterplot" component={Scatterplot} />
      <Route path="/works" component={Works} />
      <Route path="/cards" component={Results} />
      <Route exact path="/" component={Results}>
        <Redirect to="cards" />
      </Route>
    </Switch>
  </App>
);

export { routes };
