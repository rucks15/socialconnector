import React, { Component } from 'react';
import Navbar from './components/layouts/navbar';
import Footer from './components/layouts/footer';
import Landing from './components/layouts/landing';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import {Provider} from 'react-redux';
import store from './store';

import './App.css';



class App extends Component {
  render() {
    return (
      <Provider store = {store}>
      <Router>
      <div className="App">
        <Navbar />
        <Route exact path = "/" component = { Landing } />
        <div className="container">
          <Route exact path = "/register" component={Register}/>
          <Route exact path = "/login" component={Login}/>
        </div>
        <Footer />
      </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
