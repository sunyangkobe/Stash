function Controller() {
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
    var Cloud = require("ti.cloud");
    Cloud.debug = true;
    Cloud.Objects.query({
        classname: "messages",
        limit: 50,
        where: {
            coordinates: {
                $nearSphere: [ -122.1, 37.1 ],
                $maxDistance: .00126
            }
        },
        order: "created_at"
    }, function(e) {
        if (e.success) for (var i = 0; e.messages.length > i; i++) {
            var msg = e.messages[i];
            alert("id: " + msg.id + "\n" + "message: " + msg.message + "\n" + "created_at: " + msg.created_at);
        } else alert("Error:\n" + (e.error && e.message || JSON.stringify(e)));
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;