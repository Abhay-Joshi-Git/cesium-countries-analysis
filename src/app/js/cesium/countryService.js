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
        console.log('original color', entities[0].polygon.material);

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
        var entities = dataSource.entities.values;
        var len = dataSource.entities.values.length;

        for (var i = 0; i < len; i++) {
            let entity = entities[i];
            if (entity.polygon) {
                entity.polygon.material = getDefaultColor();
            }
        }



    }
}
