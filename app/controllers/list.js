/**
 * @author Yang Sun
 */

if (Ti.Platform.osname == "iphone") {
	var postBtn = Ti.UI.createButton({
		title : "Post",
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});

	postBtn.addEventListener('click', function(e) {
		var postController = require('lib/post');
		postController.postActivity();
	});

	$.listWin.rightNavButton = postBtn;
}

var Cloud = require('ti.cloud');
Cloud.debug = true;
Cloud.Objects.query({
	classname : "messages",
	limit : 50,
	where : {
		coordinates : {
			$nearSphere : [-122.1, 37.1],
			$maxDistance : 0.00126
		}
	},
	order : "created_at"
}, function(e) {
	if (e.success) {
		//alert('Success:\n' + 'Count: ' + e.messages.length);
		for (var i = 0; i < e.messages.length; i++) {
			var msg = e.messages[i];
			alert('id: ' + msg.id + '\n' + 'message: ' + msg.message + '\n' + 'created_at: ' + msg.created_at);
		}
	} else {
		alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	}
});
