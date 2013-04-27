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

	var label = Ti.UI.createLabel({
		text : "Message",
		color : "white",
		font : {
			size : 20
		},
		textAlign : "left"
	});
	popupWin.add(label);

	var textArea = Ti.UI.createTextArea({
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
	popupWin.add(textArea);

	// var btnBar = Ti.UI.createButtonBar({
	// width : 250,
	// top : 300
	// });

	var postBtn = Ti.UI.createButton({
		title : "Post",
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	});

	postBtn.addEventListener("click", function(e) {
		var Cloud = require('ti.cloud');
		Cloud.debug = true;
		Cloud.Objects.create({
			classname : "messages",
			fields : {
				message : textArea.getValue(),
				coordinates : [-122.1, 37.1]
			}
		}, function(e) {
			if (e.success) {
				var msg = e.messages[0];
				alert('Success:\n' + 'id: ' + msg.id + '\n' + 'message: ' + msg.message + '\n' + 'coordinates: ' + msg.coordinates + '\n' + 'created_at: ' + msg.created_at);
			} else {
				alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});
	});

	popupWin.add(postBtn);

	var backBtn = Ti.UI.createButton({
		title : "Back",
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	});

	backBtn.addEventListener("click", function(e) {
		popupWin.close();
	});
	// btnBar.add(backBtn);
	// btnBar.add(postBtn);

	popupWin.add(backBtn);

	// popupWin.addEventListener('click', function(e) {
	// popupWin.close()
	// });

	//open the window as a modal window (popup like)
	popupWin.open({
		modal : true,
		modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL,
		modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
	});
}
