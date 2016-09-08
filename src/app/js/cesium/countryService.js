const defaultColor = {
    red: 255,
    green: 220,
    blue: 0,
    alpha: 125
};

const getDefaultColor = () => {
    return Cesium.Color.fromBytes(
        defaultColor.red,
        defaultColor.green,
        defaultColor.blue,
        defaultColor.alpha
    );
};

export default {
    loadCountries: function(viewer, data) {
        var dataSource = new Cesium.GeoJsonDataSource('countriesDataSource')
        var promise = dataSource.load(data);

        promise.then(function(dataSource) {
            viewer.dataSources.add(dataSource);
            var entities = dataSource.entities.values;
            var len = dataSource.entities.values.length;
            for (var i = 0; i < len; i++) {
                let entity = entities[i];
                if (entity.polygon) {
                    entity.polygon.material = getDefaultColor()
                }
            }
        }).otherwise(function(error){
            window.alert(error);
        });
    },

    removeCountries: function(viewer, dataSource) {
        viewer.dataSources.remove(dataSource, true);
    },

    applyColorByEconomycCategory: function(dataSource, categoryColorMap) {
        var entities = dataSource.entities.values;
        var len = dataSource.entities.values.length;

        for (var i = 0; i < len; i++) {
            let color = Cesium.Color.WHITE;
            let entity = entities[i];
            let category = categoryColorMap.find(item => {
                return item.dataValues.includes(entity.properties.economy)
            });
            if (category) {
                color = category.color;
            }

            if (entity.polygon) {
                entity.polygon.material = color;
            }
        }
    },

    disableDataSourceMaterial: function(dataSource) {
        if (!dataSource) return;

        var entities = dataSource.entities.values;
        var len = dataSource.entities.values.length;

        for (var i = 0; i < len; i++) {
            let entity = entities[i];
            if (entity.polygon) {
                entity.polygon.material = getDefaultColor();
            }
        }
    },

    applyGDPOpacity: function(dataSource, opacityMap) {
        var entities = dataSource.entities.values;
        var len = dataSource.entities.values.length;
        console.log('entities[0].polygon', entities[0].polygon);

        for (var i = 0; i < len; i++) {
            let color = Cesium.Color.WHITE;
            let entity = entities[i];
            let GDPPerCapita = this.getGDPPerCapita(entity.properties);
            let category = opacityMap.find(item => {
                return (
                    ((!item.GDPRange.max) || (item.GDPRange.max > GDPPerCapita))
                    && (item.GDPRange.min < GDPPerCapita))
            });

            if (entity.properties.name === 'India' || entity.properties.name === 'Nepal') {
                console.log(GDPPerCapita, entity.polygon._material._color._value, category);
            }

            if (category && entity.polygon) {
                entity.polygon.material = Cesium.Color.fromAlpha(
                    entity.polygon._material._color._value,
                    category.alpha
                );
            }
        }
    },

    getGDPPerCapita: function(entityProps) {
        return entityProps.gdp_md_est * 1000000 / entityProps.pop_est;
    }


}
