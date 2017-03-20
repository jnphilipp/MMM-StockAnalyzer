var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({
    start: function () {
        console.log(this.name + " helper method started...");
    },

    socketNotificationReceived: function(notification, payload) {
        if ( notification === "GET_DATA" ) {
            var self = this;
            request({url: payload.url, method: "GET"}, function (error, response, body) {
                if ( !error && response.statusCode == 200 )
                    self.sendSocketNotification("REQUEST_RESULT", {id: payload.id, data: JSON.parse(body)});
                else
                    console.log(self.name + ": " + body);
            });
        }
    }
});
