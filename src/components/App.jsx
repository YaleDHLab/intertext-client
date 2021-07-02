import React from 'react';
import Header from './header/Header';
import Footer from './Footer';

export default class AppWrapper extends React.Component {
  render() {
    return (
      <div className="app-container col">
        <Header />
        <div className="page-container">{this.props.children}</div>
        <Footer />
      </div>
    );
  }
}
