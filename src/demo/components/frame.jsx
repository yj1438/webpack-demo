import React, { Component } from 'react';
import { observer } from 'mobx-react';

import '../style/frame.less';

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
            <div className="wrap frame">
                <header>
                    this is frame title dsfs~~ : {this.state.data.title}
                </header>
                <hr />
                {this.props.children}
            </div>
        );
    }
}

export default Frame;
