/* global Module */

/* Magic Mirror
 * Module: MMM-StockAnalyzer
 *
 * By Nathanael Philipp http://jnphilipp.org
 * MIT Licensed.
 */

Module.register("MMM-StockAnalyzer", {
    defaults: {
        apiKey: "",
        baseUrl: "https://stockanalyzer.jnphilipp.org/portfolio/api/",
        api: "portfolio",
        positions: "open",
        renderAs: "table",

        animationSpeed: 1000,
        updateInterval: 15 * 60 * 1000
    },

    getStyles: function() {
        return ["MMM-StockAnalyzer.css"];
    },

    start: function() {
        Log.info("MMM-StockAnalyzer started.");
        this.resultData = {};

        if ( !this.config.api in ["portfolio", "watchlist"] )
            this.config.api = "portfolio";
        if ( !this.config.renderAs in ["table", "marquee"] )
            this.config.renderAs = "table";

        this.scheduleUpdate();
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "small";
        wrapper.innerHTML = "StockAnalyzer";
        if ( !"response_date" in this.resultData )
            return wrapper;

        if ( this.config.renderAs == "table" ) {
            var table = document.createElement("table");
            table.className = "xsmall";

            if ( this.config.api == "portfolio" ) {
                for ( var i in this.resultData["stock_positions"] )
                    this.addRow(this.resultData["stock_positions"][i], table);
                for ( var i in this.resultData["fund_positions"] )
                    this.addRow(this.resultData["fund_positions"][i], table);
            }
            else if ( this.config.api == "watchlist" ) {
                for ( var i in this.resultData["commodities"] )
                    this.addRow(this.resultData["commodities"][i], table);
                for ( var i in this.resultData["companies"] )
                    this.addRow(this.resultData["companies"][i], table);
                for ( var i in this.resultData["funds"] )
                    this.addRow(this.resultData["funds"][i], table);
                for ( var i in this.resultData["indices"] )
                    this.addRow(this.resultData["indices"][i], table);
            }

            return table;
        }
        else if ( this.config.renderAs == "marquee" ) {
            var marquee = document.createElement("div");
            marquee.className = "xsmall marquee";

            if ( this.config.api == "portfolio" ) {
                for ( var i in this.resultData["stock_positions"] )
                    this.addSpan(this.resultData["stock_positions"][i], marquee);
                for ( var i in this.resultData["fund_positions"] )
                    this.addSpan(this.resultData["fund_positions"][i], marquee);
            }
            else if ( this.config.api == "watchlist" ) {
                for ( var i in this.resultData["commodities"] )
                    this.addSpan(this.resultData["commodities"][i], marquee);
                for ( var i in this.resultData["companies"] )
                    this.addSpan(this.resultData["companies"][i], marquee);
                for ( var i in this.resultData["funds"] )
                    this.addSpan(this.resultData["funds"][i], marquee);
                for ( var i in this.resultData["indices"] )
                    this.addSpan(this.resultData["indices"][i], marquee);
            }

            return marquee;
        }
    },

    addRow: function(position, table) {
        var row = document.createElement("tr");
        table.appendChild(row);

        var nameCell = document.createElement("th");
        nameCell.innerHTML = position.name;
        row.appendChild(nameCell);

        var priceCell = document.createElement("td");
        priceCell.innerHTML = position.price.toFixed(3) + (position.currency ? position.currency : "");
        priceCell.className = "align-right " + (position.change[0] > 0 ? "green" : "") + (position.change[0] < 0 ? "red" : "");
        row.appendChild(priceCell);

        var changeCell = document.createElement("td");
        changeCell.innerHTML = position.change[0].toFixed(3) + (position.currency ? position.currency : "") + "/" + position.change[1].toFixed(3) + "%";
        changeCell.className = "align-right " + (position.change[0] > 0 ? "green" : "") + (position.change[0] < 0 ? "red" : "");
        row.appendChild(changeCell);

        if ( position.return && position.win_loss ) {
            var positionCell = document.createElement("td");
            positionCell.className = "align-right";

            var span = document.createElement("span");
            span.innerHTML = position.return[0].toFixed(3) + (position.currency ? position.currency : "");
            span.className = (position.win_loss[0] > 0 ? "green" : "red");
            positionCell.appendChild(span);

            positionCell.innerHTML += " (";
            var span2 = document.createElement("span");
            span2.innerHTML = position.win_loss[0].toFixed(3) + (position.currency ? position.currency : "");
            span2.className = (position.win_loss[0] > 0 ? "green" : "red");
            positionCell.appendChild(span2);

            positionCell.innerHTML += "/";
            var span3 = document.createElement("span");
            span3.innerHTML = position.win_loss[1].toFixed(3) + (position.currency ? position.currency : "");
            span3.className = (position.win_loss[1] > 0 ? "green" : "red");
            positionCell.appendChild(span3);
            positionCell.innerHTML += ")";
            row.appendChild(positionCell);
        }
    },

    addSpan: function(position, marquee) {
        var wrapper = document.createElement("span");
        marquee.appendChild(wrapper);

        var name = document.createElement("span");
        name.innerHTML = position.name;
        wrapper.appendChild(name);

        var price = document.createElement("span");
        price.innerHTML = position.price.toFixed(3) + (position.currency ? position.currency : "");
        price.className = (position.change[0] > 0 ? "green" : "") + (position.change[0] < 0 ? "red" : "");
        wrapper.innerHTML += "&nbsp;&nbsp;";
        wrapper.appendChild(price);

        var change = document.createElement("span");
        change.innerHTML = "(" + position.change[0].toFixed(3) + (position.currency ? position.currency : "") + "/" + position.change[1].toFixed(3) + "%)";
        change.className = (position.change[0] > 0 ? "green" : "") + (position.change[0] < 0 ? "red" : "");
        wrapper.innerHTML += "&nbsp;&nbsp;";
        wrapper.appendChild(change);

        if ( position.return && position.win_loss ) {
            var position = document.createElement("span");

            var span = document.createElement("span");
            span.innerHTML = position.return[0].toFixed(3) + (position.currency ? position.currency : "");
            span.className = (position.win_loss[0] > 0 ? "green" : "red");
            position.appendChild(span);

            position.innerHTML += " (";
            var span2 = document.createElement("span");
            span2.innerHTML = position.win_loss[0].toFixed(3) + (position.currency ? position.currency : "");
            span2.className = (position.win_loss[0] > 0 ? "green" : "red");
            position.appendChild(span2);

            position.innerHTML += "/";
            var span3 = document.createElement("span");
            span3.innerHTML = position.win_loss[1].toFixed(3) + (position.currency ? position.currency : "");
            span3.className = (position.win_loss[1] > 0 ? "green" : "red");
            position.appendChild(span3);
            position.innerHTML += ")";
            wrapper.innerHTML += "&nbsp;&nbsp;";
            wrapper.appendChild(position);
        }

        wrapper.innerHTML += "&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;";
    },

    getHeader: function() {
        if ( "performance" in this.resultData )
            return this.data.header + " <span style=\"float: right;\">" + this.resultData["performance"]["performance"].toFixed(3) + "%</span>";
        else
            return this.data.header;
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if ( typeof delay !== "undefined" && delay >= 0 )
            nextLoad = delay;

        var self = this;
        setInterval(function() {
            self.updatePortfolio();
        }, nextLoad);
    },

    updatePortfolio: function() {
        if ( this.config.apiKey === "" ) {
            Log.error("StockAnalyzer: API KEY not set!");
            return;
        }

        var url = this.config.baseUrl + this.config.api + "?api-key=" + this.config.apiKey + (this.config.api == "portfolio" && this.config.positions ? "&positions=" + this.config.positions : "");
        this.sendSocketNotification("GET_DATA", {id: this.identifier, url: url});
    },

    socketNotificationReceived: function(notification, payload) {
        if ( notification === "REQUEST_RESULT" && payload.id === this.identifier ) {
            this.resultData = payload.data;
            this.updateDom(this.config.animationSpeed);
        }
    },
});
