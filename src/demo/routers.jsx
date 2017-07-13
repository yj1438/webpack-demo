import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import Frame from './components/frame';
import Index from './routers/index';
import Detail from './routers/detail';
import Error from './routers/error';

const isReactComponent = (obj) => Boolean(obj && obj.prototype && Boolean(obj.prototype.isReactComponent));

const component = (component) => {
    return isReactComponent(component)
        ? {component}
        : {getComponent: (loc, cb)=> component(
            comp=> cb(null, comp.default || comp))}
};

const routers = (
    <Router>
        <Route path="/" component={Frame}>
            <IndexRoute {...component(Index)} />
            <Route path="index.html" {...component(Index)} />
            <Route path="detail.html" {...component(Detail)} />
        </Route>
        <Route path="*" component={Error} />
    </Router>
);

export default routers;
