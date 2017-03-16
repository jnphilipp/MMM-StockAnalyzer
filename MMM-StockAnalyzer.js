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
        portfolioUrl: "https://stockanalyzer.jnphilipp.org/portfolio/api/portfolio?api-key=",
        positions: "open",

        animationSpeed: 1000,
        updateInterval: 15 * 60 * 1000,
        initialLoadDelay: 2500,
        retryDelay: 2500
    },

    getStyles: function() {
        return ["MMM-StockAnalyzer.css"];
    },

    start: function() {
        Log.info("MMM-StockAnalyzer started.");
        this.portfolioData = {};

        this.scheduleUpdate(this.config.initialLoadDelay);
        this.updateTimer = null;
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "small";
        wrapper.innerHTML = "StockAnalyzer";
        if ( !("stock_positions" in this.portfolioData) && !("fund_positions" in this.portfolioData) )
            return wrapper;

        var table = document.createElement("table");
        table.className = "xsmall";

        for ( var i in this.portfolioData["stock_positions"] )
            this.addPositionRow(this.portfolioData["stock_positions"][i], table);
        for ( var i in this.portfolioData["fund_positions"] )
            this.addPositionRow(this.portfolioData["fund_positions"][i], table);

        return table;
    },

    addPositionRow: function(position, table) {
        var row = document.createElement("tr");
        table.appendChild(row);

        var nameCell = document.createElement("th");
        nameCell.innerHTML = position.name;
        row.appendChild(nameCell);

        var priceCell = document.createElement("td");
        priceCell.innerHTML = position.price.toFixed(3) + position.currency;
        priceCell.className = "align-right " + (position.change[0] > 0 ? "green" : "") + (position.change[0] < 0 ? "red" : "");
        row.appendChild(priceCell);

        var changeCell = document.createElement("td");
        changeCell.innerHTML = position.change[0].toFixed(3) + position.currency + "/" + position.change[1].toFixed(3) + "%";
        changeCell.className = "align-right " + (position.change[0] > 0 ? "green" : "") + (position.change[0] < 0 ? "red" : "");
        row.appendChild(changeCell);

        var positionCell = document.createElement("td");
        positionCell.innerHTML = position.return[0].toFixed(3) + position.currency + " (" + position.win_loss[0].toFixed(3) + position.currency + "/" + position.win_loss[1].toFixed(3) + position.currency + ")";
        positionCell.className = "align-right " + (position.win_loss > 0 ? "green" : "red");
        row.appendChild(positionCell);
    },

    getHeader: function() {
        if ( "performance" in this.portfolioData )
            return this.data.header + " <span style=\"float: right;\">" + this.portfolioData["performance"]["performance"].toFixed(3) + "%</span>";
        else
            return this.data.header;
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if ( typeof delay !== "undefined" && delay >= 0 )
            nextLoad = delay;

        var self = this;
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(function() {
            self.updatePortfolio();
        }, nextLoad);
    },

    updatePortfolio: function() {
        if ( this.config.apiKey === "" ) {
            Log.error("StockAnalyzer: API KEY not set!");
            return;
        }

        var url = this.config.portfolioUrl + this.config.apiKey + (this.config.positions ? "&positions=" + this.config.positions : "");
        this.sendSocketNotification("GET_PORTFOLIO", url);
    },

    socketNotificationReceived: function(notification, payload) {
        if ( notification === "PORTFOLIO_RESULT" ) {
            this.portfolioData = payload;
            this.updateDom(this.config.animationSpeed);
        }
    },
});
