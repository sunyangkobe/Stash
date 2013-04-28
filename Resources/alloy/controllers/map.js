function Controller() {
    function refreshAnnotations(mapView) {
        Ti.Geolocation.purpose = "Recieve User Location";
        Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
        Titanium.Geolocation.distanceFilter = 10;
        Titanium.Geolocation.getCurrentPosition(function(e) {
            if (e.error) {
                alert("Stash cannot get your current location");
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
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var Cloud = require("ti.cloud");
        Cloud.debug = true;
        Cloud.Objects.query({
            classname: "messages",
            limit: 50,
            where: {
                expiredate: {
                    $gt: yesterday
                },
                coordinates: {
                    $nearSphere: [ lng, lat ],
                    $maxDistance: .00126
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
            new Date(Date.parse(msg.created_at));
            var expireDate = new Date(Date.parse(msg.expiredate));
            var info = "Created by " + msg.user.username;
            info += " and expired on: " + expireDate.toLocaleDateString();
            var annotation = Titanium.Map.createAnnotation({
                latitude: msg.coordinates[0][1],
                longitude: msg.coordinates[0][0],
                title: msg.message,
                subtitle: info,
                image: "/images/marker_purple.png",
                animate: true,
                draggable: false
            });
            annotations.push(annotation);
        }
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
    if ("iphone" == Ti.Platform.osname) {
        var postBtn = Ti.UI.createButton({
            title: "Post",
            style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        });
        postBtn.addEventListener("click", function() {
            var postController = require("lib/post");
            postController.postActivity();
        });
        $.mapWin.rightNavButton = postBtn;
    }
    var mapview = Titanium.Map.createView({
        mapType: Titanium.Map.STANDARD_TYPE,
        animate: true,
        regionFit: true,
        userLocation: true
    });
    $.mapWin.add(mapview);
    $.mapWin.addEventListener("focus", function() {
        refreshAnnotations(mapview);
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;