import React from 'react';
import Toggle from 'react-toggle';
import countriesData from '../../../data/countries_details.geo.json';
import CesiumCountryService from '../cesium/countryService.js';
import countryConstants from '../../../data/countryConstants.js';

export default class Countries extends React.Component {
    constructor(props) {
        super();
        if (props.enableCountries && props.cesiumViewer) {
            this.loadCountries(props.cesiumViewer);
        }
        this.state = {
            enableCountries: props.enableCountries && !!props.cesiumViewer
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((!this.state.enableCountries && nextProps.enableCountries) && nextProps.cesiumViewer) {
            this.loadCountries(nextProps.cesiumViewer);
        } else if ((this.state.enableCountries) && !(nextProps.enableCountries && nextProps.cesiumViewer)){
            this.removeCountries(nextProps.cesiumViewer);
        }
        this.state = {
            enableCountries: nextProps.enableCountries && !!nextProps.cesiumViewer
        }
    }

    render() {
        return (
            <div className="col-sm-12 container">
                <div className="row">
                    {this.getEnableCountriesToggleUI()}
                    {this.getColorByEconomyUI()}
                </div>
            </div>
        )
    }

    getEnableCountriesToggleUI() {
        return (
            <div className="panel panel-default col-sm-12">
                <div className="panel-body">
                        <label>Enable Countries : </label>
                        <span className="toggle-container">
                            <Toggle
                                checked={this.state.enableCountries}
                                onChange={this.onEnableCountriesChange}
                            />
                        </span>
                </div>
            </div>
        )
    }

    getColorByEconomyUI() {
        return this.getColorByEconomyToggleUI();
    }

    getColorByEconomyToggleUI() {
        return (
            <div className="panel panel-default col-sm-12">
                <div className="panel-body">
                        <label>Color By Economy : </label>
                        <span className="toggle-container">
                            <Toggle
                                onChange={this.onColorByEconomyChange}
                            />
                        </span>
                </div>
            </div>
        )
    }

    onColorByEconomyChange = (event) => {
        var countriesDataSource = this.props.cesiumViewer.dataSources._dataSources.find(item =>
            item.name == 'countriesDataSource');

        if (countriesDataSource && !event.target.checked) {
            CesiumCountryService.disableDataSourceMaterial(countriesDataSource);
            return;
        }

        var categoryColorMap = countryConstants.economicCategories.map(category => {
            var color;
            switch (category.categoryName) {
                case 'leastDeveloped': color = Cesium.Color.RED;
                    break;
                case 'developing': color = Cesium.Color.ORANGE;
                    break;
                case 'emerging' : color = Cesium.Color.BLUE;
                    break;
                case 'developed' : color = Cesium.Color.GREEN;
                    break;
                default: color = Cesium.Color.WHITE;
            }
            return {
                    ...category,
                    color: color
            }
        });
        CesiumCountryService.applyColorByEconomycCategory(countriesDataSource, categoryColorMap);
    }

    onEnableCountriesChange = (event) => {
        if (event.target.checked) {
            this.loadCountries(this.props.cesiumViewer);
        } else {
            this.removeCountries(this.props.cesiumViewer);
        }
        this.setState({
            enableCountries: event.target.checked
        });
    }

    loadCountries = (viewer) => {
        CesiumCountryService.loadCountries(viewer, countriesData);
    }

    removeCountries = (viewer) => {
        var countriesDataSource = viewer.dataSources._dataSources.find(item =>
            item.name == 'countriesDataSource');

        CesiumCountryService.removeCountries(viewer, countriesDataSource);
    }


}
