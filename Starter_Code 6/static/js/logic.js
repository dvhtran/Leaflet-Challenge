// Creating map object
var myMap = L.map("map",{
    center: [37.09,-95.71],
    zoom: 3
});

// Creating the tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; <a href='https://openstreetmap.org'>OpenStreetMap</a>contributors",
    maxZoom: 18
}).addTo(myMap);

// Funtion to determine color based on depth
function getColor(depth) {
    return depth >= 90 ? "#FF0000":
            depth >= 70 ? "#FF8000":
            depth >= 50 ? "#FFB900":
            depth >= 30 ? "#FFEE00":
            depth >= 10 ? "#ACB3344":
                            "#69B34C";
}

// Function to determine radius based on magnitude
function getRadius(magnitude) {
    return magnitude * 5;
}

// Function to create circle markers for each earthquake
function createCircleMarker(feature,latlng){
    var depth = feature.geometry.coordinates[2];
    var magnitude = feature.properties.mag;

    var circleOptions = {
        radius: getRadius(magnitude),
        fillColor: getColor(depth),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var marker = L.circleMarker(latlng,circleOptions);

    //popup
    var popupContent = "<h3>Magnitude: " + magnitude + "</h3>" +
                        "<h3>Location: " + feature.properties.place + "</h3>" +
                        "<h3>Depth: " + depth + "</h3>";
    
    marker.bindPopup(popupContent);

    return marker;
}

// Fetch earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    L.geoJSON(data, {
        pointToLayer: createCircleMarker
    }).addTo(myMap);

    var legend = L.control({position: "bottomright"});

    legend.onAdd = function(){ 
        var div = L.DomUtil.create("div","info legend");

        var depthLabels = ["-10-10","10-30","30-50","50-70","70-90","90+"];
        var colors = ["#69B34C", "#ACB334", "#FFB92E", "#FFE15", "#FF4E11", "#FFODOD"];

        for (var i = 0; i < depthLabels.length; i++) {
            div.innerHTML += '<i style="Background: ' + colors[i] + '"></i> ' + depthLabels[i] + '<br>';
        }

        return div; 
    };

    legend.addTo(myMap);
});