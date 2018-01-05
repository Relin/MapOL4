proj4.defs("EPSG:31370", "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs");
var LocationPicker = {};
LocationPicker.belgiumProjection = ol.proj.get('EPSG:31370');
LocationPicker.belgiumProjection.setExtent([17736.0314, 23697.0977, 297289.9391, 245375.4223]);
/*var belgiumProjection = new ol.proj.Projection({
    code: 'EPSG:31370',
    extent: [17736.0314, 23697.0977, 297289.9391, 245375.4223],
    units: 'm'
});
ol.proj.addProjection(belgiumProjection);
*/
LocationPicker.url_spw_geolocalisation = "http://geoservices.wallonie.be/geolocalisation/rest/searchAll/";
LocationPicker.url_spw_geolocalisation_xy = "http://geoservices.wallonie.be/geolocalisation/rest/getNearestPosition/";
LocationPicker.map = {};
LocationPicker.data = {
    point: null,
    linestring: null,
    polygon: null
};
LocationPicker.raster_osm = new ol.layer.Tile({
    source: new ol.source.OSM()
});
LocationPicker.wkt_source = new ol.source.Vector({
    projection: LocationPicker.belgiumProjection,
});
LocationPicker.vector_wkt = new ol.layer.Vector({
    source: LocationPicker.wkt_source
});
LocationPicker.view = new ol.View({
    projection: LocationPicker.belgiumProjection,
    center: ol.proj.fromLonLat([168378.865657, 130247.210877]),
    //center: ol.proj.transform([4.686133, 50.564602], 'EPSG:4326', 'EPSG:31370'),
    extent: LocationPicker.belgiumProjection.getExtent() || undefined,
    zoom: 1
});
LocationPicker.style = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        snapToPixel: false,
        fill: new ol.style.Fill({
            color: 'yellow'
        }),
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 1
        })
    })
});
LocationPicker.draw = new ol.interaction.Draw({
    source: LocationPicker.wkt_source,
    type: "Point"
});


//Change type of geometry
LocationPicker.addInteractions = function() {
    LocationPicker.map.removeInteraction(LocationPicker.draw);
    LocationPicker.draw = new ol.interaction.Draw({
        source: LocationPicker.wkt_source,
        type: this.value
    });
    LocationPicker.draw.on('drawend', LocationPicker.onClick);
    LocationPicker.map.addInteraction(LocationPicker.draw);
}

LocationPicker.addGeom = function(geom){
    var geomFeature = new ol.Feature({
        name: "Geom",
        geometry: geom
    });
    LocationPicker.wkt_source.addFeature(geomFeature);
}

LocationPicker.onClick = function(evt) {
    console.log(evt.feature.getGeometry());
    var myGeom = evt.feature.getGeometry();
    switch (myGeom.getType()) {
        case "Point":
            LocationPicker.data.point = myGeom;
            x = myGeom.getFlatCoordinates()[0];
            y = myGeom.getFlatCoordinates()[1];
            $.get(LocationPicker.url_spw_geolocalisation_xy + encodeURIComponent(x) + '/' + encodeURIComponent(y), function(data) {
                $("#adresse_xy_result").append(data.adresse);
            }).fail(function() {
                $("#adresse_xy_result").html("Erreur de connexion");
            });
            LocationPicker.wkt_source.clear();
            if(LocationPicker.data.linestring){
                LocationPicker.addGeom(LocationPicker.data.linestring);
            }
            if(LocationPicker.data.polygon){
                LocationPicker.addGeom(LocationPicker.data.polygon);
            }
            break;
        case "LineString":
            LocationPicker.data.linestring = myGeom;
            LocationPicker.wkt_source.clear();
            if(LocationPicker.data.point){
                LocationPicker.addGeom(LocationPicker.data.point);
            }
            if(LocationPicker.data.polygon){
                LocationPicker.addGeom(LocationPicker.data.polygon);
            }
            break;
        case "Polygon":
            LocationPicker.data.polygon = myGeom;
            LocationPicker.wkt_source.clear();
            if(LocationPicker.data.point){
                LocationPicker.addGeom(LocationPicker.data.point);
            }
            if(LocationPicker.data.linestring){
                LocationPicker.addGeom(LocationPicker.data.linestring);
            }
            break;
    }
    $("#adresse_xy_result").empty();
    var myWKT = new ol.format.WKT();
    $("#wkt").html(myWKT.writeGeometry(myGeom));
}

//Creation d'un bouton de control de dessin
/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
LocationPicker.controlDraw = function(opt_options) {

    var options = opt_options || {};

    var buttonPoint = document.createElement('button');
    buttonPoint.innerHTML = 'P';
    buttonPoint.value = 'Point';

    var buttonLineString = document.createElement('button');
    buttonLineString.innerHTML = 'L';
    buttonLineString.value = 'LineString';

    var buttonPolygon = document.createElement('button');
    buttonPolygon.innerHTML = 'Z';
    buttonPolygon.value = 'Polygon';

    buttonPoint.addEventListener('click', LocationPicker.addInteractions);
    buttonPoint.addEventListener('touchstart', LocationPicker.addInteractions);
    buttonLineString.addEventListener('click', LocationPicker.addInteractions);
    buttonLineString.addEventListener('touchstart', LocationPicker.addInteractions);
    buttonPolygon.addEventListener('click', LocationPicker.addInteractions);
    buttonPolygon.addEventListener('touchstart', LocationPicker.addInteractions);

    var element = document.createElement('div');
    element.className = 'cssButtonGeom ol-unselectable ol-control';
    element.appendChild(buttonPoint);
    element.appendChild(buttonLineString);
    element.appendChild(buttonPolygon);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
ol.inherits(LocationPicker.controlDraw, ol.control.Control);

$(function() {

    LocationPicker.map = new ol.Map({
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: {
                collapsible: false
            }
        }).extend([
            new LocationPicker.controlDraw()
        ]),
        layers: [
            LocationPicker.raster_osm,
            LocationPicker.vector_wkt
        ],
        view: LocationPicker.view
    });

    LocationPicker.draw.on('drawend', LocationPicker.onClick);
    LocationPicker.map.addInteraction(LocationPicker.draw);
    LocationPicker.view.animate({
        center: [168378.865657, 130247.210877],
        zoom: 2
    });
});
