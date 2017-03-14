MMM-StockAnalyzer
===================
This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror). It can display information from [StockAnalyzer](https://stockanalyzer.jnphilipp.org).


## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/jnphilipp/MMM-StockAnalyzer.git`.


## Config
The entry in `config.js` can include the following options:

|Option|Description|
|---|---|
|`apiKey`|The [StockAnalyzer](htpps://stockanalyzer.jnphilipp.org) API key, which can be obtained by creating an StockAnalyzer account.<br><br>This value is **REQUIRED**|
|`portfolioUrl`|The StockAnalyzer portfolio API end point.<br><br>**Default value:** `https://stockanalyzer.jnphilipp.org/portfolio/api/portfolio?api-key=`|
|`positions`|Optional parameter for portfolio API requests.<br><br>**Possible values:** `open`<br>**Default value:** `all`, `closed` and `open`|
|`animationSpeed`|Speed of the update animation. (Milliseconds)<br><br>**Possible values:** `0` - `5000`<br>**Default value:** `1000` (1 second)|
|`updateInterval`|How often the content is updated. (Milliseconds)<br><br>**Possible values:** `1000` - `86400000`<br>**Default value:** `15 * 60 * 1000` (15 minutes)|
|`initialLoadDelay`|The initial delay before loading. If you have multiple modules that use the same API key, you might want to delay one of the requests. (Milliseconds)<br><br>**Possible values:** `1000` - `5000`<br>**Default value:** `2500`|
|`retryDelay`|The delay before retrying after a request failure. (Milliseconds)<br><br>**Possible values:** `1000` - `60000`<br>**Default value:** `2500`|



Here is an example of an entry in `config.js`
```
{
    module: 'MMM-StockAnalyzer',
    position: 'top-left',
    config: {
        apiKey: 'APIKEY',
        positions: 'open',
    }
},
```
