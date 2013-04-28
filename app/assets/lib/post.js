/**
 * @author Yang Sun
 */

exports.postActivity = function() {
	var popupWin = Ti.UI.createWindow({
		backgroundColor : 'black',
		opacity : 0.5,
		navBarHidden : true,
		layout : "vertical"
	});

	popupWin.add(getLabel());

	var textArea = getTextArea();
	popupWin.add(textArea);

	// var btnBar = Ti.UI.createButtonBar({
	// width : 250,
	// top : 300
	// });
	popupWin.add(getPostBtn(textArea));
	popupWin.add(getBackBtn(popupWin));

	//open the window as a modal window (popup like)
	popupWin.open({
		modal : true,
		modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL,
		modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
	});
}
function getLabel() {
	return Ti.UI.createLabel({
		text : "Message",
		color : "white",
		font : {
			size : 20
		},
		textAlign : "left"
	});
}

function getTextArea() {
	return Ti.UI.createTextArea({
		borderWidth : 2,
		borderRadius : 5,
		textAlign : "left",
		font : {
			color : "black"
		},
		width : 400,
		height : 300,
		keyboardType : Ti.UI.KEYBOARD_ASCII,
		returnKeyType : Ti.UI.RETURNKEY_DONE
	});
}

function getBackBtn(win) {
	var backBtn = Ti.UI.createButton({
		title : "Back",
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	});

	backBtn.addEventListener("click", function(e) {
		win.close();
	});
	return backBtn;
}

function getPostBtn(textArea) {
	var postBtn = Ti.UI.createButton({
		title : "Post",
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	});

	postBtn.addEventListener("click", function(e) {
		if (textArea.getValue().length == 0) {
			alert("Message cannot be empty");
			return;
		}
		collectCurrentLocationPost(textArea.getValue());
	});

	return postBtn;
}

function collectCurrentLocationPost(msg) {
	Ti.Geolocation.purpose = "Recieve User Location";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			alert('Stash cannot get your current location');
			return;
		}
		postOnCloud(msg, e.coords.longitude, e.coords.latitude);
	});
}

function postOnCloud(msg, lng, lat) {
	var Cloud = require('ti.cloud');
	Cloud.debug = true;
	Cloud.Objects.create({
		classname : "messages",
		fields : {
			message : msg,
			coordinates : [lng, lat]
		}
	}, function(e) {
		if (e.success) {
			var msg = e.messages[0];
			alert('Success:\n' + 'id: ' + msg.id + '\n' + 'message: ' + msg.message + '\n' + 'coordinates: ' + msg.coordinates + '\n' + 'created_at: ' + msg.created_at);
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}
