import React from 'react';
import Header from './partials/Header';
import Footer from './partials/Footer';

export default class AppWrapper extends React.Component {
  render() {
    return (
      <div className="app-container col">
        <Header />
        <div className="page-container flex-1">{this.props.children}</div>
        <Footer />
      </div>
    );
  }
}
