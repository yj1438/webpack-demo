import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routers from './routers';

import 'normalize.css';
import './style/index.less';

//向页面中渲染
ReactDOM.render(<Router routes={routers} history={browserHistory} />, document.getElementById('app'));
