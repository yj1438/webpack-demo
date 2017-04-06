import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Frame from './components/frame';
import Nav from './components/nav';
import Index from './components/index';
import Error from './components/error';

const Routers = () => (
    <Router>
        <Frame>
            <Nav />
            <Route exact path="/" component={Index} />
            <Route path="/demo.html" component={Index} />
            <Route path="*" component={Error} />
        </Frame>
    </Router>
);

export default Routers;
