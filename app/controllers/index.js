/**
 * @author Yang Sun
 */

var Cloud = require('ti.cloud');
Cloud.debug = true;
// optional; if you add this line, set it to false for production


Cloud.Users.secureLogin({
	title : "Log in to Stash",
}, function(e) {
	if (!e.success) {
		Ti.API.info("Error: " + JSON.stringify(e));
	} else {
		Ti.API.info('Success. accessToken = ' + Cloud.accessToken);
		startApp();
	}
}); 


function startApp() {
	if (Ti.Platform.osname == "android") {
		$.index.addEventListener("open", function(e) {
			var activity = $.index.getActivity();
			activity.onCreateOptionsMenu = function(e) {
				var menuItem = e.menu.add({
					title : "Post",
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
					// icon : "add_icon.png"
				});
				menuItem.addEventListener("click", function(e) {
					var postController = require('lib/post');
					postController.postActivity();
				});
			}
			activity.actionBar.title = "Stash";
			activity.invalidateOptionsMenu();
		});
	}

	$.index.open();
}
