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
			text : msg.message,
			autoLink : Titanium.UI.AUTOLINK_ALL,
			height : Ti.UI.SIZE,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			font : {
				fontSize : 30,
				fontFamily : 'Helvetica Neue'
			},
			top : 10,
			bottom : 10,
			left : 10,
			right : 10,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE
		}));

		row.addEventListener("click", function(e) {
			var msg = messages[e.index];
			var createDate = new Date(Date(msg.created_at));
			var expireDate = new Date(Date.parse(msg.expiredate));
			var info = "Message: " + msg.message + "\n\n";
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
	var radlng1 = Math.PI * lng1 / 180;
	var radlng2 = Math.PI * lng2 / 180;
	var theta = lng1 - lng2;
	var radtheta = Math.PI * theta / 180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;
	dist = dist * 1.609344;
	return parseFloat(dist).toFixed(3) * 1000
}