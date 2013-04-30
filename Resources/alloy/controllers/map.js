function Controller() {
    function refreshAnnotations(mapView) {
        Ti.Geolocation.purpose = "Recieve User Location";
        Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
        Titanium.Geolocation.distanceFilter = 10;
        Titanium.Geolocation.getCurrentPosition(function(e) {
            if (e.error) {
                alert("Stash cannot get your current location.");
                return;
            }
            mapView.setRegion({
                latitude: e.coords.latitude,
                longitude: e.coords.longitude,
                latitudeDelta: .01,
                longitudeDelta: .01
            });
            getMessagesOnCloud(mapView, e.coords.longitude, e.coords.latitude);
        });
    }
    function getMessagesOnCloud(mapView, lng, lat) {
        var Cloud = require("ti.cloud");
        Cloud.debug = true;
        Cloud.Objects.query({
            classname: "messages",
            limit: 50,
            where: {
                expiredate: {
                    $gt: new Date()
                },
                coordinates: {
                    $nearSphere: [ lng, lat ],
                    $maxDistance: 157e-7
                }
            }
        }, function(e) {
            e.success && addAnnotationsOnMap(mapView, e.messages);
        });
    }
    function addAnnotationsOnMap(mapView, messages) {
        var annotations = [];
        for (var i = 0; messages.length > i; i++) {
            var msg = messages[i];
            var annotation = Titanium.Map.createAnnotation({
                latitude: msg.coordinates[0][1],
                longitude: msg.coordinates[0][0],
                title: msg.message.substring(0, 15) + " ...",
                subtitle: "Click to see details",
                animate: true,
                draggable: false,
                data: msg
            });
            annotation.setImage("/images/marker_blue.png");
            annotations.push(annotation);
        }
        mapView.removeAllAnnotations();
        mapView.setAnnotations(annotations);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.mapWin = Ti.UI.createWindow({
        id: "mapWin",
        title: "Map"
    });
    $.__views.mapWin && $.addTopLevelView($.__views.mapWin);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var mapview = Titanium.Map.createView({
        mapType: Titanium.Map.STANDARD_TYPE,
        animate: true,
        regionFit: true,
        userLocation: true,
        hideAnnotationWhenTouchMap: true
    });
    $.mapWin.add(mapview);
    $.mapWin.addEventListener("focus", function() {
        refreshAnnotations(mapview);
    });
    $.mapWin.addEventListener("click", function(e) {
        if ("title" == e.clicksource || "subtitle" == e.clicksource) {
            var popoverWin = require("lib/popover");
            popoverWin.popover(e.annotation.data);
        }
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;