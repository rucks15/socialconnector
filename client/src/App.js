import React, { Component } from 'react';
import Navbar from './components/layouts/navbar';
import Footer from './components/layouts/footer';
import Landing from './components/layouts/landing';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Landing />
        <Footer />
      </div>
    );
  }
}

export default App;
