import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import App from './components/App';
import Home from './components/Home';
import Results from './components/results/Results';
import Waffle from './components/Waffle';
import Scatterplot from './components/Scatterplot';

const routes = (
  <App>
    <div className="page-container">
      <Switch>
        <Route exact path="/insights" component={Home} />
        <Route exact path="/results" component={Results} />
        <Route path="/waffle" component={Waffle} />
        <Route path="/scatterplot" component={Scatterplot} />
        <Route exact path="/">
          <Redirect to='/results?query=""' />
        </Route>
      </Switch>
    </div>
  </App>
);

export { routes };
