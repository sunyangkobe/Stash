/**
 * @author Yang Sun
 */

Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 10;
Titanium.Geolocation.getCurrentPosition(function(e) {
	if (e.error) {
		alert('Stash cannot get your current location');
		return;
	}

	// var curLocation = Titanium.Map.createAnnotation({
		// latitude : e.coords.latitude,
		// longitude : e.coords.longitude,
		// title : "My Current Location",
		// animate : true,
		// // leftButton : '../images/appcelerator_small.png',
		// myid : 0 // Custom property to uniquely identify this annotation.
	// });

	var mapview = Titanium.Map.createView({
		mapType : Titanium.Map.STANDARD_TYPE,
		region : {
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			latitudeDelta : 0.01,
			longitudeDelta : 0.01
		},
		animate : true,
		regionFit : true,
		userLocation : true
		// annotations : [curLocation]
	});

	$.mapWin.add(mapview);

});
