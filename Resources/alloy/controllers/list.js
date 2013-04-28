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
                coordinates: {
                    $nearSphere: [ lng, lat ],
                    $maxDistance: .00126
                }
            },
            order: "created_at"
        }, function(e) {
            e.success ? createTableView(e.messages) : alert("Error:\n" + (e.error && e.message || JSON.stringify(e)));
        });
    }
    function createTableView(messages) {
        var data = [];
        for (var i = 0; messages.length > i; i++) {
            var msg = messages[i];
            var row = Ti.UI.createTableViewRow({
                title: msg.message,
                color: "white",
                font: {
                    fontSize: 30,
                    fontFamily: "Helvetica Neue"
                },
                top: 10,
                bottom: 10
            });
            row.addEventListener("click", function() {
                var info = "Message: " + msg.message + "\n";
                info += "Created by: " + msg.user.username + "\n";
                info += "Created on: " + msg.created_at + "\n";
                alert(info);
            });
            data.push(row);
        }
        tableview.setData(data);
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
    var tableview = Titanium.UI.createTableView({
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