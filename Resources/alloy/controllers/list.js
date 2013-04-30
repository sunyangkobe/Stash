function Controller() {
    function refreshLocation() {
        Ti.Geolocation.purpose = "Recieve User Location";
        Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
        Titanium.Geolocation.distanceFilter = 10;
        Titanium.Geolocation.getCurrentPosition(function(e) {
            if (e.error) {
                alert("Stash cannot get your current location.");
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
                    $maxDistance: 157e-7
                }
            },
            order: "created_at"
        }, function(e) {
            e.success && createTableView(e.messages, lng, lat);
        });
    }
    function createTableView(messages) {
        var data = [];
        for (var i = 0; messages.length > i; i++) {
            var msg = messages[i];
            var row = Ti.UI.createTableViewRow({
                theid: i
            });
            row.add(Ti.UI.createLabel({
                text: msg.message.substring(0, 35) + (msg.message.length > 35 ? " ..." : ""),
                height: Ti.UI.SIZE,
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                font: {
                    fontSize: "16dp",
                    fontWeight: "bold"
                },
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
                height: Ti.UI.SIZE,
                width: Ti.UI.SIZE
            }));
            row.addEventListener("click", function(e) {
                var popoverWin = require("lib/popover");
                popoverWin.popover(messages[e.index]);
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
    var tableview;
    tableview = Titanium.UI.createTableView({});
    $.listWin.add(tableview);
    $.listWin.addEventListener("focus", function() {
        refreshLocation();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;