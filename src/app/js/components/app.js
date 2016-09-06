import React from "react";
import Countries from './countries.js';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            viewer: null
        }
    }

    render() {
        return (
            <div className="full-height">
                <div id="selectionPanel" className="custom-options-container full-height col-sm-4">
                    <h3 className="text-center">Selection Panel</h3>
                    <br />
                    <Countries enableCountries={true} cesiumViewer={this.state.viewer} />
                </div>
                <div className="cesium-viewer-container full-height col-sm-8">
                    <div id="cesiumContainer" className="full-height">
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            viewer: new Cesium.Viewer('cesiumContainer')
        });
    }
}
