import React from "react";
import Countries from './countries.js';
import CesiumViewer from './cesiumViewer.js';
import LegendContainer from './legendContainer.js';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            viewer: null,
            legends: []
        }
    }

    render() {
        return (
            <div className="full-height">
                <div id="selectionPanel" className="custom-options-container full-height col-sm-3">
                    <h3 className="text-center">Selection Panel</h3>
                    <br />
                    <Countries
                        cesiumViewer={this.state.viewer}
                        addLegend={this.addLegend}
                        removeLegend={this.removeLegend}
                    />
                </div>
                <div className="cesium-viewer-container full-height col-sm-9">
                    <div>
                        <LegendContainer legends={this.state.legends} />
                    </div>
                    <CesiumViewer viewerId="cesiumContainer" visible={true}/>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            viewer: new Cesium.Viewer('cesiumContainer')
        });
    }

    addLegend = (legend) => {
        this.state.legends.filter(item => item.id !== legend.id);
        this.setState({
            legends: [...this.state.legends, legend]
        });
    }

    removeLegend = (id) => {
        this.setState({
            legends: this.state.legends.filter(item => item.id != id)
        })
    }
}
