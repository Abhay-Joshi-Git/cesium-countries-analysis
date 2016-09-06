
export default {
    loadCountries: function(viewer, data) {
        var dataSource = new Cesium.GeoJsonDataSource('countriesDataSource')
        var promise = dataSource.load(data);

        promise.then(function(dataSource) {
            viewer.dataSources.add(dataSource);
        }).otherwise(function(error){
            window.alert(error);
        });
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

            color = Cesium.Color.fromAlpha(
                color,
                0.8
            );
            if (entity.polygon) {
                entity.polygon.material = color;
            }
        }
    }
}
