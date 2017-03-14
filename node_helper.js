var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({
    start: function () {
        console.log(this.name + " helper method started...");
    },

    portfolioRequest: function (url) {
        var self = this;
        request({url: url, method: "GET"}, function (error, response, body) {
            if ( !error && response.statusCode == 200 )
                self.sendSocketNotification("PORTFOLIO_RESULT", JSON.parse(body));
            else
                console.log(self.name + ": " + body);
        });
    },

    socketNotificationReceived: function(notification, url) {
        if ( notification === "GET_PORTFOLIO" )
            this.portfolioRequest(url);
    }
});
