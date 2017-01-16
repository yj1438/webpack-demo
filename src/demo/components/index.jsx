import React, { Component } from 'react';

import dataStore from '../stores/dataStore';

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

    // _bindInputTitle() {
    //     dataStore.inputTitle('this is new title!');
    // }

    render() {
        return (
            <div>
                this is index page!!! fdsfs
                welcome to main element.
                WTF !!!
                <button type="button" onClick={this.store.inputTitle.bind(this.store, 'this is new title ttt!')}>click this!</button>
            </div>
        );
    }
}

Index.propTypes = {

};

export default Index;

