import React from 'react';

export default class LegendContainer extends React.Component {
    render() {
        if (this.props.legends.length) {
            return (
                <div className="legend-container">
                    {this.getLegends()}
                </div>
            )
        } else {
            return null;
        }
    }

    getLegends = () => {
        return this.props.legends.map(legend => {
            return (
                <div key={legend.id}>
                    {legend.html}
                </div>
            )
        })
    }
}
