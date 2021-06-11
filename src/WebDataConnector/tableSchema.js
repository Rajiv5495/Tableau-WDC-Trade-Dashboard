const {tableau, $} = window;


function annualConnector() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schemas for the 2 Tables
    myConnector.getSchema = function(schemaCallback) {

        // Columns for the Annual Table
        var annual_cols = [{
            id: "yr",
            alias: "year",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "aggrLevel",
            alias: "HS Code Level",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "rgDesc",
            alias: "Trade Flow",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "rtTitle",
            alias: "Country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "ptTitle",
            alias: "Partner Country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "cmdCode",
            alias: "HS Code",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "cmdDescE",
            alias: "HS Code Description",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "NetWeight",
            alias: "Weight in Metric Tons",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "TradeValue",
            alias: "Trade value in USD",
            dataType: tableau.dataTypeEnum.int
        }];

        var AnnualTableSchema = {
            id: "UNComtradeData_Annual",
            alias: "UN Comtrade Data-Annual",
            columns: annual_cols
        };

        // Columns for the Monthly Table
        var monthly_cols = [{
            id: "yr_m",
            alias: "year",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "period_m",
            alias: "Month",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "periodDesc_m",
            alias: "Period",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "aggrLevel_m",
            alias: "HS Code Level",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "rgDesc_m",
            alias: "Trade Flow",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "rtTitle_m",
            alias: "Country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "ptTitle_m",
            alias: "Partner Country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "cmdCode_m",
            alias: "HS Code",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "cmdDescE_m",
            alias: "HS Code Description",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "NetWeight_m",
            alias: "Weight in Metric Tons",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "TradeValue_m",
            alias: "Trade value in USD",
            dataType: tableau.dataTypeEnum.int
        }];

        var MonthlyTableSchema = {
            id: "UNComtradeData_Monthly",
            alias: "UN Comtrade Data-Monthly",
            columns: monthly_cols
        };

        schemaCallback([AnnualTableSchema, MonthlyTableSchema]);
    };


    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var cc_code = JSON.parse(tableau.connectionData).cc;
        var cc_string = String(cc_code[0].value)
        if (cc_code.length > 1) {
            for (let c=1; c < cc_code.length; c++) {
                cc_string += "%2C" + String(cc_code[c].value)
            }    
        }
        
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear()-1;
        var array_5_years = [];
        for (let x=0; x<5; x++) array_5_years.push(currentYear-x);
        var array_5_years_string = String(array_5_years[0]);
        for (let y=1; y<5; y++) { array_5_years_string += "%2C"+String(array_5_years[y]) };

        var yearForMonthlyTable = currentDate.getMonth() > 5 ? currentDate.getFullYear() : currentDate.getFullYear()-1;
        var apiURL_Annual = "https://comtrade.un.org/api/get?max=100000&type=C&freq=A&px=HS&ps="
                                + array_5_years_string +
                                "&r=all&p=0&rg=all&cc="+cc_string+"&fmt=json"
        var apiURL_Monthly = "https://comtrade.un.org/api/get?max=100000&type=C&freq=M&px=HS&ps="
                                +String(yearForMonthlyTable)+
                                "&r=all&p=0&rg=all&cc="+cc_string+"&fmt=json"
        
        if (table.tableInfo.id === 'UNComtradeData_Monthly') {

            $.getJSON(apiURL_Monthly, function(resp) {
                var feat = resp.dataset
                var tableData = []
           
            for (var i = 0; i < feat.length; i++) {
                tableData.push({
                    "yr_m": feat[i].yr,
                    "period_m": feat[i].period,
                    "periodDesc_m": feat[i].periodDesc,
                    "aggrLevel_m": feat[i].aggrLevel,
                    "rgDesc_m": feat[i].rgDesc,
                    "rtTitle_m": feat[i].rtTitle,
                    "ptTitle_m": feat[i].ptTitle,
                    "cmdCode_m": feat[i].cmdCode,
                    "cmdDescE_m": feat[i].cmdDescE,
                    "NetWeight_m": Math.round(feat[i].NetWeight/1000),
                    "TradeValue_m": feat[i].TradeValue,
                })
            }table.appendRows(tableData)
            doneCallback();
        })
        
        }
        if (table.tableInfo.id === 'UNComtradeData_Annual') {
            $.getJSON(apiURL_Annual, function(resp) {
                var feat_a = resp.dataset
                var tableData = []
    
            for (var j = 0; j < feat_a.length; j++) {
                tableData.push({
                    "yr": feat_a[j].yr,
                    "aggrLevel": feat_a[j].aggrLevel,
                    "rgDesc": feat_a[j].rgDesc,
                    "rtTitle": feat_a[j].rtTitle,
                    "ptTitle": feat_a[j].ptTitle,
                    "cmdCode": feat_a[j].cmdCode,
                    "cmdDescE": feat_a[j].cmdDescE,
                    "NetWeight": Math.round(feat_a[j].NetWeight/1000),
                    "TradeValue": feat_a[j].TradeValue,
                })
            }table.appendRows(tableData)
            doneCallback();
        })
    }
    
            
       
    }
    return myConnector;
}


export default annualConnector;

