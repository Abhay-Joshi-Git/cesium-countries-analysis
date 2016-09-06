import React from 'react';
import Toggle from 'react-toggle';
import countriesData from '../../../data/countries_details.geo.json';
import CesiumCountryService from '../cesium/countryService.js';
import countryConstants from '../../../data/countryConstants.js';

export default class Countries extends React.Component {
    constructor(props) {
        super();
        console.log(props);
        this.state = {
            enableCountries: props.enableCountries
        }
        if (props.enableCountries) {
            this.loadCountries(props.cesiumViewer);
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
                                defaultChecked={this.state.enableCountries}
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
        console.log('dataSources', this.props.cesiumViewer.dataSources._dataSources);
        //return;
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
        console.log(countriesDataSource, categoryColorMap);
        CesiumCountryService.applyColorByEconomycCategory(countriesDataSource, categoryColorMap);

    }

    onEnableCountriesChange = (event) => {
        console.log('on enable countries change ', event.target.checked, this.props.CesiumViewer.dataSources);
        this.loadCountries(this.props.cesiumViewer);
    }

    loadCountries = (viewer) => {
        CesiumCountryService.loadCountries(viewer, countriesData);
    }


}
