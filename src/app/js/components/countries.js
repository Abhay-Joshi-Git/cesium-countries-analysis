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
            <div className='col-sm-12 container'>
                <div className='row'>
                    {this.getEnableCountriesToggleUI()}
                    {this.getColorByEconomyUI()}
                </div>
            </div>
        )
    }

    getEnableCountriesToggleUI() {
        return (
            <div className='well well-sm text-center col-sm-12'>
                <label>Enable Countries : </label>
                <span className='toggle-container'>
                    <Toggle
                        checked={this.state.enableCountries}
                        onChange={this.onEnableCountriesChange}
                    />
                </span>
            </div>
        )
    }

    getColorByEconomyUI() {
        return this.getColorByEconomyToggleUI();
    }

    getColorByEconomyToggleUI() {
        return (
            <div className='well well-sm text-center col-sm-12'>
                <label>Color By Economy : </label>
                <span className='toggle-container'>
                    <Toggle
                        onChange={this.onColorByEconomyChange}
                    />
                </span>
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

        if (typeof this.props.addLegend == 'function') {
            this.props.addLegend(this.getColorByEconomicCategoryLegend(categoryColorMap));
        }

        CesiumCountryService.applyColorByEconomycCategory(countriesDataSource, categoryColorMap);
    }

    getColorByEconomicCategoryLegend = (categoryColorMap) => {
        var html = categoryColorMap.map(item => {
            var colorDisplayStyle = {
                background: item.color.toCssColorString(),
                display: 'inline-block',
                width: '15px',
                height: '1em'
            }
            return (
                <div className='legend-item-container' key={item.categoryName}>
                    <span className='color-label'>{item.categoryDisplayName}</span>
                    <div className='color-display-square'
                        style={colorDisplayStyle}
                    />
                </div>
            );
        });
        html = (
            <div className='legend-group-container'>
                <h4 className='legend-group-header'>
                    Economic Category
                </h4>
                {html}
            </div>
        );
        return {
            id: 'colorByEconomicCategory',
            html: html
        }
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
