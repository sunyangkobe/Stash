/**
 * @author Yang Sun
 */

if (Ti.Platform.osname == "iphone") {
	var postBtn = Ti.UI.createButton({
		title : "Create Stash Here",
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});

	postBtn.addEventListener('click', function(e) {
		var postController = require('lib/post');
		postController.postActivity();
	});

	$.listWin.rightNavButton = postBtn;
}

// create table view
var tableview;
if (Ti.Platform.osname == "android") {
	tableview = Titanium.UI.createTableView({});
} else if (Ti.Platform.osname == "iphone") {
	tableview = Titanium.UI.createTableView();
}

$.listWin.add(tableview);
$.listWin.addEventListener("focus", function(e) {
	refreshLocation();
});

function refreshLocation() {
	Ti.Geolocation.purpose = "Recieve User Location";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			alert('Stash cannot get your current location.');
			return;
		}

		getMessagesOnCloud(e.coords.longitude, e.coords.latitude);

	});
}

function getMessagesOnCloud(lng, lat) {
	var Cloud = require('ti.cloud');
	Cloud.debug = true;
	Cloud.Objects.query({
		classname : "messages",
		limit : 50,
		where : {
			expiredate : {
				"$gt" : new Date()
			},
			coordinates : {
				$nearSphere : [lng, lat],
				$maxDistance : 0.0000157
			}
		},
		order : "created_at"
	}, function(e) {
		if (e.success) {
			createTableView(e.messages, lng, lat);
		} else {
			// alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function createTableView(messages, lng, lat) {
	var data = [];
	for (var i = 0; i < messages.length; i++) {
		var msg = messages[i];
		var row = Ti.UI.createTableViewRow({
			theid : i
		});

		row.add(Ti.UI.createLabel({
			text : msg.message.substring(0, 35) + ((msg.message.length > 35) ? " ..." : ""),
			height : Ti.UI.SIZE,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			top : 10,
			bottom : 10,
			left : 10,
			right : 10,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE
		}));

		row.addEventListener("click", function(e) {
			var popoverWin = require('lib/popover');
			popoverWin.popover(messages[e.index]);
		});
		data.push(row);
	}
	tableview.setData(data);
}