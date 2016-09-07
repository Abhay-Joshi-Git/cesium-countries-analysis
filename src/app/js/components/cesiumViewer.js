import React from 'react';

export default class CesiumViewer extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps.viewerId == this.props.viewerId) || (nextProps.visible == this.props.visible))
    }

    render() {
        if (this.props.visible) {
            return (
                <div id={this.props.viewerId} className="full-height"></div>
            );
        } else {
            return null;
        }
    }
}
