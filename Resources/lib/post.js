function collectCurrentLocationPost(popupWin, msg, expire) {
    Ti.Geolocation.purpose = "Recieve User Location";
    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
    Titanium.Geolocation.distanceFilter = 10;
    Titanium.Geolocation.getCurrentPosition(function(e) {
        if (e.error) {
            alert("Stash cannot get your current location");
            return;
        }
        postOnCloud(popupWin, msg, expire, e.coords.longitude, e.coords.latitude);
    });
}

function postOnCloud(popupWin, msg, expire, lng, lat) {
    var Cloud = require("ti.cloud");
    Cloud.debug = true;
    Cloud.Objects.create({
        classname: "messages",
        fields: {
            message: msg,
            expiredate: expire,
            coordinates: [ lng, lat ]
        }
    }, function(e) {
        if (e.success) {
            var toast = Titanium.UI.createNotification({
                duration: Ti.UI.NOTIFICATION_DURATION_LONG,
                message: "Post Successfully!"
            });
            toast.show();
            popupWin.close();
        } else alert("Error:\n" + (e.error && e.message || JSON.stringify(e)));
    });
}

exports.postActivity = function() {
    var popupWin = Ti.UI.createWindow({
        backgroundColor: "white",
        navBarHidden: true
    });
    var fields;
    fields = [ {
        title: "Message: ",
        type: "textarea",
        id: "id_msg"
    }, {
        title: "Expire Date: ",
        type: "date",
        id: "id_expiredate"
    }, {
        title: "Expire Time: ",
        type: "time",
        id: "id_expiretime"
    }, {
        title: "Post",
        type: "submit",
        id: "id_postBtn"
    }, {
        title: "Back",
        type: "submit",
        id: "id_backBtn"
    } ];
    var forms = require("lib/forms");
    var form = forms.createForm({
        style: forms.STYLE_LABEL,
        fields: fields
    });
    form.addEventListener("id_postBtn", function(e) {
        var date;
        date = new Date(Date.parse(e.values.id_expiredate));
        date.setTime(e.values.id_expiretime);
        if (date.getTime() <= new Date().getTime()) {
            alert("Expire time must be larger than current time.");
            return;
        }
        if (0 == e.values.id_msg.length) {
            alert("Message cannot be empty");
            return;
        }
        collectCurrentLocationPost(popupWin, e.values.id_msg.replace(/^\s+|\s+$/g, ""), date);
    });
    form.addEventListener("id_backBtn", function() {
        popupWin.close();
    });
    popupWin.add(form);
    popupWin.open({
        modal: true,
        modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL,
        modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
    });
};