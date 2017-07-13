import React, { Component } from 'react';

class componentName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            component: null,
            props: null,
        };
        this._isMounted = false;
    }

    componentWillMount() {
        this._load();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillReceiveProps(next) {
        if (next.component === this.props.component) {
            return null;
        }
        this._load();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _load() {
        this.props.component( com => {
            this.setState({
                component: com.default || com,
            });
        });
    }

    render() {
        const LazyComponent = this.state.component;
        const props = Object.assign({}, this.props);
        delete props.component;
        return LazyComponent ? (
            <LazyComponent {...props}/>
        ) : null;
    }
}

export default componentName;