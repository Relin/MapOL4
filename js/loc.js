proj4.defs("EPSG:31370","+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs");
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
LocationPicker.url_spw_geolocalisation="http://geoservices.wallonie.be/geolocalisation/rest/searchAll/";
LocationPicker.map = {};
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
        fill: new ol.style.Fill({color: 'yellow'}),
        stroke: new ol.style.Stroke({color: 'red', width: 1})
    })
});
LocationPicker.draw = new ol.interaction.Draw({
    source: LocationPicker.wkt_source,
    type: "Point",
    style:LocationPicker.style
});

$(function() {

    LocationPicker.map = new ol.Map({
        target: 'map',
        layers: [
            LocationPicker.raster_osm,
            LocationPicker.vector_wkt
        ],
        view: LocationPicker.view
    });
    LocationPicker.map.addInteraction(LocationPicker.draw);
    LocationPicker.view.animate({
        center: [168378.865657, 130247.210877],
        zoom:1
    });

    function onClick(evt) {
        var myPoint = evt.feature.getGeometry();
        evt.feature.setStyle(LocationPicker.style);

        $("#wkt").val(wkt);
        wkt_source.clear();

        $.get(LocationPicker.url_spw_geolocalisation + encodeURIComponent(search), function(data) {

        }).fail(function() {
            $("#adresse_search_result").html("Erreur de connexion");
        }).always(function() {
            $("#adresse_search_result").show();
        });
    }

    LocationPicker.draw.on('drawend', onClick);

});
