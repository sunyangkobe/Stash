function Controller() {
    function startApp() {
        "android" == Ti.Platform.osname && $.index.addEventListener("open", function() {
            var activity = $.index.getActivity();
            activity.onCreateOptionsMenu = function(e) {
                var menuItem = e.menu.add({
                    title: "Create Stash Here",
                    showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS
                });
                menuItem.addEventListener("click", function() {
                    var postController = require("lib/post");
                    postController.postActivity();
                });
            };
            activity.actionBar.title = "Stash";
            activity.invalidateOptionsMenu();
        });
        $.index.open();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createTabGroup({
        id: "index"
    });
    $.__views.mapTab = Alloy.createController("map", {
        id: "mapTab"
    });
    $.__views.leftTab = Ti.UI.createTab({
        window: $.__views.mapTab.getViewEx({
            recurse: true
        }),
        id: "leftTab",
        title: "Map View",
        icon: "KS_nav_ui.png"
    });
    $.__views.index.addTab($.__views.leftTab);
    $.__views.listTab = Alloy.createController("list", {
        id: "listTab"
    });
    $.__views.rightTab = Ti.UI.createTab({
        window: $.__views.listTab.getViewEx({
            recurse: true
        }),
        id: "rightTab",
        title: "List View",
        icon: "KS_nav_views.png"
    });
    $.__views.index.addTab($.__views.rightTab);
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Cloud = require("ti.cloud");
    Cloud.debug = true;
    Cloud.accessToken ? startApp() : Cloud.Users.secureLogin({
        title: "Log in to Stash"
    }, function(e) {
        if (e.success) {
            Ti.API.info("Success. accessToken = " + Cloud.accessToken);
            startApp();
        } else Ti.API.info("Error: " + JSON.stringify(e));
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;