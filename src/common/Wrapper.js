import React from 'react';

export const mapNavigationStateParamsToProps = (SomeComponent, props) => {
    if (!props) {
        props = {};
    }
    return class extends React.Component {
        static navigationOptions = SomeComponent.navigationOptions;
        render() {
            const { navigation: { state: { params }}} = this.props;
            return <SomeComponent {...params} {...this.props} {...props} />
        }
    }
};