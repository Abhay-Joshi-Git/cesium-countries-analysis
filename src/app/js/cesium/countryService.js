
export default {
    loadCountries: function(viewer, data) {
        var promise = Cesium.GeoJsonDataSource.load(data);
        

        promise.then(function(dataSource) {
               viewer.dataSources.add(dataSource);
               var entities = dataSource.entities.values;
               var len = dataSource.entities.values.length;

               var colorHash = {};
               for (var i = 0; i < len; i++) {
                   var entity = entities[i];
                   var name = entity.name;
                   var color = Cesium.Color.Blue;
                   var color = colorHash[name];
                      if (!color) {
                          color = Cesium.Color.fromRandom({
                              alpha : 1.0
                          });
                          colorHash[name] = color;
                      }

                   if (entity.polygon) {
                       //entity.polygon.material = color;
                   }
               }
           }).otherwise(function(error){
               window.alert(error);
           });
    }
}
