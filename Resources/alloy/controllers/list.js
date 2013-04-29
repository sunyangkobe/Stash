function Controller() {
    function refreshLocation() {
        Ti.Geolocation.purpose = "Recieve User Location";
        Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
        Titanium.Geolocation.distanceFilter = 10;
        Titanium.Geolocation.getCurrentPosition(function(e) {
            if (e.error) {
                alert("Stash cannot get your current location");
                return;
            }
            getMessagesOnCloud(e.coords.longitude, e.coords.latitude);
        });
    }
    function getMessagesOnCloud(lng, lat) {
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
                    $maxDistance: .00126
                }
            },
            order: "created_at"
        }, function(e) {
            e.success && createTableView(e.messages, lng, lat);
        });
    }
    function createTableView(messages, lng, lat) {
        var data = [];
        for (var i = 0; messages.length > i; i++) {
            var msg = messages[i];
            var row;
            row = Ti.UI.createTableViewRow({
                theid: i,
                title: msg.message,
                color: "white",
                font: {
                    fontSize: 30,
                    fontFamily: "Helvetica Neue"
                },
                height: Ti.UI.SIZE,
                top: 10,
                bottom: 10
            });
            row.addEventListener("click", function(e) {
                var msg = messages[e.index];
                var createDate = new Date(Date(msg.created_at));
                var expireDate = new Date(Date.parse(msg.expiredate));
                var info = "Message: " + msg.message + "\n\n\n";
                info += "Created by: " + msg.user.username + "\n";
                info += "Created on: " + createDate.toLocaleString() + "\n";
                info += "Expired on: " + expireDate.toLocaleString() + "\n";
                info += "Distance: " + distance(lat, lng, msg.coordinates[0][1], msg.coordinates[0][0]) + " m";
                alert(info);
            });
            data.push(row);
        }
        tableview.setData(data);
    }
    function distance(lat1, lng1, lat2, lng2) {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        Math.PI * lng1 / 180;
        Math.PI * lng2 / 180;
        var theta = lng1 - lng2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = 180 * dist / Math.PI;
        dist = 1.1515 * 60 * dist;
        dist = 1.609344 * dist;
        return 1e3 * parseFloat(dist).toFixed(3);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.listWin = Ti.UI.createWindow({
        id: "listWin",
        title: "List"
    });
    $.__views.listWin && $.addTopLevelView($.__views.listWin);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var tableview;
    tableview = Titanium.UI.createTableView({
        left: 20,
        right: 20
    });
    $.listWin.add(tableview);
    $.listWin.addEventListener("focus", function() {
        refreshLocation();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;