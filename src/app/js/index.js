
import React from "react";
import ReactDom from "react-dom";
import App from "./components/app.js";

window.CESIUM_BASE_URL = '../../lib/Cesium/';
require('../../lib/CesiumUnminified/Cesium.js');
var Cesium = window.Cesium;

ReactDom.render(
    <App />,
    document.getElementById('app')
);
