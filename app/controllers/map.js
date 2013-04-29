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

	$.mapWin.rightNavButton = postBtn;
}

var mapview = Titanium.Map.createView({
	mapType : Titanium.Map.STANDARD_TYPE,
	animate : true,
	regionFit : true,
	userLocation : true
});

$.mapWin.add(mapview);
$.mapWin.addEventListener("focus", function(e) {
	refreshAnnotations(mapview);
});

function refreshAnnotations(mapView) {
	Ti.Geolocation.purpose = "Recieve User Location";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			alert('Stash cannot get your current location');
			return;
		}

		mapView.setRegion({
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			latitudeDelta : 0.01,
			longitudeDelta : 0.01
		});
		getMessagesOnCloud(mapView, e.coords.longitude, e.coords.latitude);
	});
}

function getMessagesOnCloud(mapView, lng, lat) {
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
				$maxDistance : 0.00126
			}
		},
	}, function(e) {
		if (e.success) {
			addAnnotationsOnMap(mapView, e.messages);
		} else {
			//alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function addAnnotationsOnMap(mapView, messages) {
	var annotations = [];
	for (var i = 0; i < messages.length; i++) {
		var msg = messages[i];
		var createDate = new Date(Date.parse(msg.created_at));
		var expireDate = new Date(Date.parse(msg.expiredate));
		var info = "Created by " + msg.user.username;
		info += " and expired on: " + expireDate.toLocaleDateString();
		var annotation = Titanium.Map.createAnnotation({
			latitude : msg.coordinates[0][1],
			longitude : msg.coordinates[0][0],
			title : msg.message,
			subtitle : info,
			image : "/images/marker_purple.png",
			animate : true,
			draggable : false
		});
		annotations.push(annotation);
	}
	mapView.setAnnotations(annotations);
}
