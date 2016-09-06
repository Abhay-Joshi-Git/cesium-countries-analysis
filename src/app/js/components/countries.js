import React from 'react';
import Toggle from 'react-toggle';
import countriesData from '../../../data/countries_details.geo.json';
import CesiumCountryService from '../cesium/countryService.js';

export default class Countries extends React.Component {


    constructor(props) {
        super();
        console.log(props);
        this.state = {
            enableCountries: props.enableCountries
        }
    }

    render() {
        return (
            <div className="col-sm-12 container">
                <div className="row">
                    {this.getEnableCountriesToggleUI()}
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
                                onChange={this.onEnableCountriesChange}
                            />
                        </span>
                </div>
            </div>
        )
    }

    onEnableCountriesChange = (event) => {
        console.log('on enable countries change ', event.target.checked, this.props.CesiumViewer.dataSources);
        CesiumCountryService.loadCountries(this.props.CesiumViewer, countriesData);
    }


}
