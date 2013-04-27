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
				alert("pop up a window to send the message");
			});
		}
		activity.actionBar.title = "Stash";
		activity.invalidateOptionsMenu();
	});
}

$.index.open();
