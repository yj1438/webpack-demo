import React, { Component } from 'react';

class LazyComponent extends Component {
    constructor(props) {
        super(props);
        console.log(props);
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
                this is a lazy Component!!!;
                <br/>
                name: {this.props.name} ===== tips: {this.props.tips}
            </div>
        );
    }
}

export default LazyComponent;