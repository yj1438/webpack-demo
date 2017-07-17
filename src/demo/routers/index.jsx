import React, { Component } from 'react';

import dataStore from '../stores/dataStore';

// lazy
import LazyComponent from 'bundle-loader?lazy&name=lazy_[name]!../components/lazyComponent.jsx';
import LazyLoader from '../common/lazyloader';

class Index extends Component {
    constructor(props) {
        super(props);
        this.store = dataStore;
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                this is index page!!! haha~~~AAA
                <button type="button" onClick={this.store.inputTitle.bind(this.store, 'this is new title ttt!')}>click this!</button>
                <LazyLoader component={LazyComponent} name={'lazyname'} tips={'lazytips'}/>
            </div>
        );
    }
}




// Index.propTypes = {

// };

export default Index;

