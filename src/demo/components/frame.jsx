import React, { Component } from 'react';
import { observer } from 'mobx-react';

import dataStore from '../stores/dataStore';

@observer
class Frame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: dataStore,
        };
    }

    render() {
        return (
            <div className="wrap">
                <header>
                    this is frame title dsfs~~ : {this.state.data.title}
                </header>
                {this.props.children}
            </div>
        );
    }
}

export default Frame;
