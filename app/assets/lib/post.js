/**
 * @author Yang Sun
 */

exports.postActivity = function() {
	var popupWin = Ti.UI.createWindow({
		backgroundColor : 'white',
		// opacity : 0.5,
		navBarHidden : true,
	});

	var fields = [{
		title : 'Message: ',
		type : 'textarea',
		id : 'id_msg'
	}, {
		title : 'Expire Date: ',
		type : 'date',
		id : 'id_expire'
	}, {
		title : 'Post',
		type : 'submit',
		id : 'id_postBtn'
	}, {
		title : 'Back',
		type : 'submit',
		id : 'id_backBtn'
	}];

	var forms = require('lib/forms');
	var form = forms.createForm({
		style : forms.STYLE_LABEL,
		fields : fields
	});

	form.addEventListener('id_postBtn', function(e) {
		var date = new Date(Date.parse(e.values.id_expire));
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		if (yesterday >= date) {
			alert("Expiration date cannot be smaller than today");
			return;
		}

		if (e.values.id_msg.length == 0) {
			alert("Message cannot be empty");
			return;
		}
		collectCurrentLocationPost(popupWin, e.values.id_msg.replace(/^\s+|\s+$/g, ''), e.values.id_expire);
	});

	form.addEventListener('id_backBtn', function(e) {
		popupWin.close();
	});
	popupWin.add(form);

	//open the window as a modal window (popup like)
	popupWin.open({
		modal : true,
		modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL,
		modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
	});
}
function collectCurrentLocationPost(popupWin, msg, expire) {
	Ti.Geolocation.purpose = "Recieve User Location";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			alert('Stash cannot get your current location');
			return;
		}
		postOnCloud(popupWin, msg, expire, e.coords.longitude, e.coords.latitude);
	});
}

function postOnCloud(popupWin, msg, expire, lng, lat) {
	var Cloud = require('ti.cloud');
	Cloud.debug = true;
	Cloud.Objects.create({
		classname : "messages",
		fields : {
			message : msg,
			expiredate : expire,
			coordinates : [lng, lat]
		}
	}, function(e) {
		if (e.success) {
			var toast = Titanium.UI.createNotification({
				duration : Ti.UI.NOTIFICATION_DURATION_LONG,
				message : "Post Successfully!"
			});
			toast.show();
			popupWin.close();
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}
