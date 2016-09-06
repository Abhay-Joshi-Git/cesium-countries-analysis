import React from "react";
import Countries from './countries.js';

window.CESIUM_BASE_URL = '../../../lib/Cesium/';
require('../../../lib/CesiumUnminified/Cesium.js');
var Cesium = window.Cesium;

var viewer = new Cesium.Viewer('cesiumContainer');
console.log(viewer.dataSources);

export default () => (
    <div>
        <h3 className="text-center">Selection Panel</h3>

        <br />
        <Countries enableCountries={true} cesiumViewer={viewer} />
    </div>
);
