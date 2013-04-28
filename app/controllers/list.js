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

// create table view
var tableview = Titanium.UI.createTableView({
	left : 20,
	right : 20,
});

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
			alert('Stash cannot get your current location');
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
			coordinates : {
				$nearSphere : [lng, lat],
				$maxDistance : 0.00126
			}
		},
		order : "created_at"
	}, function(e) {
		if (e.success) {
			createTableView(e.messages);
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function createTableView(messages) {
	var data = [];
	for (var i = 0; i < messages.length; i++) {
		var msg = messages[i];
		var row = Ti.UI.createTableViewRow({
			title : msg.message,
			color : "white",
			font : {
				fontSize : 30,
				fontFamily : 'Helvetica Neue'
			},
			top : 10,
			bottom : 10
		});
		row.addEventListener("click", function(e) {
			var info = "Message: " + msg.message + "\n";
			info += "Created by: " + msg.user.username + "\n";
			info += "Created on: " + msg.created_at + "\n";
			alert(info);
		});
		data.push(row);
	}

	tableview.setData(data);
}
