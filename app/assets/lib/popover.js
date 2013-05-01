/**
 * @author Yang Sun
 */

exports.popover = function(msg) {
	var popoverWin = Ti.UI.createWindow({
		backgroundColor : 'white',
		navBarHidden : true
	});

	var container = Ti.UI.createView({
		layout : 'vertical',
		height : 'auto'
	});

	var createDate = new Date(Date(msg.created_at));
	var expireDate = new Date(Date.parse(msg.expiredate));
	container.add(getLabel("Message:", true));
	container.add(getLabel(msg.message + "\n", false));
	container.add(getLabel("Created by: " + msg.user.username, true));
	container.add(getLabel("Created at: " + createDate.toLocaleString(), false));
	container.add(getLabel("Expired at: " + expireDate.toLocaleString(), false));

	Ti.Geolocation.purpose = "Recieve User Location";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			alert('Stash cannot get your current location.');
			return;
		}

		container.add(getLabel("Distance: " + distance(e.coords.latitude, e.coords.longitude, msg.coordinates[0][1], msg.coordinates[0][0]) + " m", false));
		var button = Ti.UI.createButton({
			title : 'Back',
			height : '40dp',
			width : '100dp',
			top : '20dp'
		});
		button.addEventListener('click', function(e) {
			popoverWin.close();
		});
		container.add(button);

		var form = Ti.UI.createScrollView({
			contentHeight : 'auto',
			contentWidth : 'auto',
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : true,
			top : '20dp',
			bottom : '20dp'
		});

		form.add(container);

		popoverWin.add(form);

		popoverWin.open({
			modal : true,
			modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL,
			modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
		});
	});
}
function getLabel(content, largeInterval) {
	return Ti.UI.createLabel({
		text : content,
		top : largeInterval ? '15dp' : '2dp',
		left : '35dp',
		right : '35dp',
		color : '#222',
		font : {
			fontSize : '16dp',
			fontWeight : 'bold'
		},
		height : 'auto',
		width : 'auto',
		autoLink : Titanium.UI.AUTOLINK_URLS
	});
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