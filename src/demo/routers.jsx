import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Frame from './components/frame';
import Index from './components/index';
import Error from './components/error';

const routers = (
    <Route path="/">
        <Route path="/(:base)/demo" component={Frame}>
            <IndexRoute component={Index} />
            <Route path="index" component={Index} />
        </Route>
        <Route path="*" component={Error} />
    </Route>
);

export default routers;
