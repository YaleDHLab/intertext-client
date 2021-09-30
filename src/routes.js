import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import App from './components/App';
import Cards from './components/cards/Cards';
import Waffle from './components/charts/Waffle';
import Sankey from './components/charts/Sankey';
import Scatterplot from './components/charts/Scatterplot';
import Works from './components/works/Works';
import Viewer from './components/viewer/Viewer';

const routes = (
  <App>
    <Switch>
      <Route path='/sankey' component={Sankey} />
      <Route path='/waffle' component={Waffle} />
      <Route path='/scatterplot' component={Scatterplot} />
      <Route path='/works' component={Works} />
      <Route path='/cards' component={Cards} />
      <Route path='/viewer/:id' component={Viewer} />
      <Route exact path='/' component={Cards}>
        <Redirect to='cards' />
      </Route>
    </Switch>
  </App>
);

export { routes };
