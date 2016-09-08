import React from 'react';
import Toggle from 'react-toggle';
import countriesData from '../../../data/countries_details.geo.json';
import CesiumCountryService from '../cesium/countryService.js';
import countryConstants from '../../../data/countryConstants.js';

const colorByEconomicCategoryLegendId = 'colorByEconomicCategory';

export default class Countries extends React.Component {
    constructor(props) {
        super();
        if (props.cesiumViewer) {
            this.loadCountries(props.cesiumViewer);
        }
        this.state = {
            enableCountries: true,
            colorByEconomy: false,
            enableGDPOpacity: false,
            extrusionByGDP: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.cesiumViewer && !this.props.cesiumViewer) && this.state.enableCountries) {
            this.loadCountries(nextProps.cesiumViewer);
        }
    }

    render() {
        return (
            <div className='col-sm-12 container'>
                <div className='row'>
                    {this.getEnableCountriesToggleUI()}
                    {this.getColorByEconomyUI()}
                    {this.getOpacityByGDPUI()}
                    {this.getExtrusionByGDPUI()}
                </div>
            </div>
        )
    }

    getOpacityByGDPUI() {
        return (
            <div className='well well-sm text-center col-sm-12'>
                <label>Opacity By GDP/Capita : </label>
                <span className='toggle-container'>
                    <Toggle
                        checked={this.state.enableGDPOpacity}
                        disabled={!this.state.enableCountries}
                        onChange={this.onEnableGDPOpacity}
                    />
                </span>
            </div>
        )
    }

    getExtrusionByGDPUI() {
        return (
            <div className='well well-sm text-center col-sm-12'>
                <label>Extrusion By GDP/Capita : </label>
                <span className='toggle-container'>
                    <Toggle
                        checked={this.state.extrusionByGDP}
                        disabled={!this.state.enableCountries}
                        onChange={this.onExtrusionByGDPChange}
                    />
                </span>
            </div>
        )
    }

    getEnableCountriesToggleUI() {
        return (
            <div className='well well-sm text-center col-sm-12'>
                <label>Enable Countries : </label>
                <span className='toggle-container'>
                    <Toggle
                        checked={this.state.enableCountries && !!this.props.cesiumViewer}
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
                        checked={this.state.colorByEconomy}
                        disabled={!this.state.enableCountries}
                        onChange={this.onColorByEconomyChange}
                    />
                </span>
            </div>
        )
    }

    onEnableCountriesChange = (event) => {
        if (event.target.checked) {
            this.loadCountries(this.props.cesiumViewer);
        } else {
            this.removeCountries(this.props.cesiumViewer);
        }
        this.setState({
            enableCountries: !this.state.enableCountries
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

    onColorByEconomyChange = (event) => {
        this.setState({
            colorByEconomy: !this.state.colorByEconomy
        });
    }

    onEnableGDPOpacity = (event) => {
        this.setState({
            enableGDPOpacity: !this.state.enableGDPOpacity
        });
    }

    onExtrusionByGDPChange = () => {
        this.setState({
            extrusionByGDP: !this.state.extrusionByGDP
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.enableCountries) {
            if (this.state.colorByEconomy) {
                this.setState({
                    colorByEconomy: false
                });
            }

            if (this.state.enableGDPOpacity) {
                this.setState({
                    enableGDPOpacity: false
                });
            }

            if (this.state.extrusionByGDP) {
                this.setState({
                    extrusionByGDP: false
                })
            }
        }
        if (this.state.colorByEconomy != prevState.colorByEconomy) {
            this.applyColorByEconomy(this.state.colorByEconomy);
        }
        if (this.state.enableGDPOpacity != prevState.enableGDPOpacity) {
            this.applyGDPOpacity(this.state.enableGDPOpacity);
        }
        if (this.state.extrusionByGDP != prevState.extrusionByGDP) {
            this.applyExtrusionByGDP(this.state.extrusionByGDP);
        }
    }

    applyExtrusionByGDP = (enable) => {
        this.applyExtrusionByGDPDataScouce(enable)
    }

    applyExtrusionByGDPDataScouce = (enable) => {
        var countriesDataSource = this.getCountriesDataSource();
        if (enable) {
            if (countriesDataSource) {
                CesiumCountryService.applyExtrusionByGDP(countriesDataSource, this.getExtrusionByGDPMap());
            } else {
                this.setState({
                    extrusionByGDP: false
                })
            }
        } else {
            if (countriesDataSource && this.props.cesiumViewer.dataSources.contains(countriesDataSource)) {
                CesiumCountryService.removeExtrusionByGDP(countriesDataSource);
            }
        }
    }

    applyGDPOpacity = (enable) => {
        this.applyGDPOpacityDataSource(enable);
    }

    applyGDPOpacityDataSource = (enable) => {
        var countriesDataSource = this.getCountriesDataSource();
        if (enable) {
            if (countriesDataSource) {
                CesiumCountryService.applyGDPOpacity(countriesDataSource, this.getGDPOpacityMap());
            } else {
                this.setState({
                    enableGDPOpacity: false
                })
            }
        } else {
            if (countriesDataSource && this.props.cesiumViewer.dataSources.contains(countriesDataSource)) {
                CesiumCountryService.removeGDPOpacity(countriesDataSource);
            }
        }
    }

    getExtrusionByGDPMap = () => {
        return [
            {
                GDPRange: {
                    min: 0,
                    max: 2000
                },
                extrudedHeight: 0
            },
            {
                GDPRange: {
                    min: 2000,
                    max: 4000
                },
                extrudedHeight: 200000
            },
            {
                GDPRange: {
                    min: 4000,
                    max: 6000
                },
                extrudedHeight: 400000
            },
            {
                GDPRange: {
                    min: 6000
                },
                extrudedHeight: 600000
            }
        ];
    }

    getGDPOpacityMap = () => {
        return [
            {
                GDPRange: {
                    min: 0,
                    max: 2000
                },
                alpha: 0.2
            },
            {
                GDPRange: {
                    min: 2000,
                    max: 4000
                },
                alpha: 0.5
            },
            {
                GDPRange: {
                    min: 4000,
                    max: 6000
                },
                alpha: 0.8
            },
            {
                GDPRange: {
                    min: 6000
                },
                alpha: 1.0
            }
        ];
    }

    applyColorByEconomy = (enable) => {
        this.applyColorByEconomyLegend(enable);
        this.applyColorByEconomyDataSource(enable);
    }

    getCountriesDataSource = () => {
        return this.props.cesiumViewer.dataSources._dataSources.find(item =>
            item.name == 'countriesDataSource');
    }

    applyColorByEconomyDataSource = (enable) => {
        var countriesDataSource = this.getCountriesDataSource();

        if (enable) {
            if (countriesDataSource) {
                CesiumCountryService.applyColorByEconomycCategory(countriesDataSource, this.getCategoryColorMap());
            } else {
                this.setState({
                    colorByEconomy: false
                });
            }
        } else {
            if (countriesDataSource && this.props.cesiumViewer.dataSources.contains(countriesDataSource)) {
                CesiumCountryService.removeColorByEconomyCategory(countriesDataSource);
            }
        }
    }

    applyColorByEconomyLegend = (enable) => {
        if (enable) {
            this.addColorByEconomyLegend();
        } else {
            this.removeColorByEconomyLegend();
        }
    }

    getCategoryColorMap = () => {
        return countryConstants.economicCategories.map(category => {
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
    }

    addColorByEconomyLegend = () => {
        if (typeof this.props.addLegend == 'function') {
            this.props.addLegend(this.getColorByEconomicCategoryLegend(this.getCategoryColorMap()));
        }
    }

    removeColorByEconomyLegend = () => {
        this.props.removeLegend(colorByEconomicCategoryLegendId)
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
            id: colorByEconomicCategoryLegendId,
            html: html
        }
    }
}
