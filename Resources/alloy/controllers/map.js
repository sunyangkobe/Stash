function Controller() {
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
    var mapView = Titanium.Map.createView({
        mapType: Titanium.Map.STANDARD_TYPE,
        region: {
            latitude: 37.389569,
            longitude: -122.050212,
            latitudeDelta: .1,
            longitudeDelta: .1
        },
        animate: true,
        regionFit: true,
        userLocation: false
    });
    $.mapWin.add(mapView);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;