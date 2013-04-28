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
	tableview = Titanium.UI.createTableView({
		left : 20,
		right : 20,
	});
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
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	var Cloud = require('ti.cloud');
	Cloud.debug = true;
	Cloud.Objects.query({
		classname : "messages",
		limit : 50,
		where : {
			expiredate : {
				"$gt" : yesterday
			},
			coordinates : {
				$nearSphere : [lng, lat],
				$maxDistance : 0.00126
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
		if (Ti.Platform.osname == "android") {
			var row = Ti.UI.createTableViewRow({
				title : msg.message,
				color : "white",
				font : {
					fontSize : 30,
					fontFamily : 'Helvetica Neue'
				},
				height : Ti.UI.SIZE,
				top : 10,
				bottom : 10
			});
		} else if (Ti.Platform.osname == "iphone") {
			var row = Ti.UI.createTableViewRow({
				title : msg.message,
				color : "black",
				font : {
					fontSize : 30,
					fontFamily : 'Helvetica Neue'
				},
				height : Ti.UI.SIZE,
			});
		}

		var createDate = new Date(Date(msg.created_at));
		var expireDate = new Date(Date.parse(msg.expiredate));
		row.addEventListener("click", function(e) {
			var info = "Message: " + msg.message + "\n";
			info += "Created by: " + msg.user.username + "\n";
			info += "Created on: " + createDate.toLocaleDateString() + "\n";
			info += "Expired on: " + expireDate.toLocaleDateString() + "\n";
			info += "Distance: " + distance(lat, lng, msg.coordinates[0][1], msg.coordinates[0][0]) + " km";
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
	return parseFloat(dist).toFixed(2)
}