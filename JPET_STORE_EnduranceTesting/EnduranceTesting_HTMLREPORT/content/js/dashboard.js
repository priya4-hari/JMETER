/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9012963251323575, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9145599250936329, 500, 1500, "Signout"], "isController": true}, {"data": [0.9911380597014925, 500, 1500, "Click AngelFish"], "isController": true}, {"data": [0.9915809167446211, 500, 1500, "Checkout"], "isController": true}, {"data": [0.991822429906542, 500, 1500, "AddToCart"], "isController": true}, {"data": [0.9995318352059925, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.9981247069854665, 500, 1500, "jp@gc - Dummy Sampler"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "Click FISH"], "isController": true}, {"data": [0.9934579439252337, 500, 1500, "Click EST-1"], "isController": true}, {"data": [0.4904562383612663, 500, 1500, "Signin"], "isController": true}, {"data": [0.984089845577913, 500, 1500, "Confirm"], "isController": true}, {"data": [0.989242282507016, 500, 1500, "Continue"], "isController": true}, {"data": [0.48443308550185876, 500, 1500, "Launch"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4285, 0, 0.0, 143.0714119019839, 0, 2390, 51.0, 416.0, 460.6999999999998, 495.0, 0.942942204134554, 0.3737333408959425, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Signout", 2136, 0, 0.0, 525.096441947566, 463, 8201, 481.0, 518.0, 636.7499999999993, 1471.9200000000092, 0.4699852997575483, 1.93269868540535, 0.0], "isController": true}, {"data": ["Click AngelFish", 2144, 0, 0.0, 211.5736940298506, 0, 26873, 161.0, 177.0, 205.75, 717.2000000000007, 0.4717759592301074, 0.8449456510079151, 0.0], "isController": true}, {"data": ["Checkout", 2138, 0, 0.0, 180.42609915809132, 154, 5981, 161.0, 175.0, 202.0, 559.4700000000034, 0.470461487952181, 1.1029088569986316, 0.0], "isController": true}, {"data": ["AddToCart", 2140, 0, 0.0, 181.65186915887875, 0, 7862, 161.0, 176.0, 209.0, 679.5700000000033, 0.47089961410436765, 1.0076687872552559, 0.0], "isController": true}, {"data": ["Debug Sampler", 2136, 0, 0.0, 1.5346441947565537, 0, 1348, 0.0, 1.0, 1.0, 1.0, 0.47004073466310553, 0.31799306641779007, 0.0], "isController": false}, {"data": ["jp@gc - Dummy Sampler", 2133, 0, 0.0, 284.3506797937175, 51, 2390, 288.0, 459.0, 482.0, 498.0, 0.47336568997543294, 0.052698914704296246, 0.0], "isController": false}, {"data": ["Click FISH", 2146, 0, 0.0, 189.3345759552654, 0, 26785, 160.0, 175.0, 200.0, 658.7600000000184, 0.4722135549495066, 0.8050909499315004, 0.0], "isController": true}, {"data": ["Click EST-1", 2140, 0, 0.0, 178.6873831775699, 154, 8655, 161.0, 176.0, 204.0, 628.4500000000226, 0.4708981634311489, 0.8311884648598847, 0.0], "isController": true}, {"data": ["Signin", 2148, 0, 0.0, 724.1405959031658, 494, 8875, 642.0, 691.1000000000001, 860.55, 2514.559999999963, 0.47260226954698825, 2.8777205278552613, 0.0], "isController": true}, {"data": ["Confirm", 2137, 14, 0.6551240056153487, 233.86382779597568, 0, 57509, 162.0, 179.0, 222.0, 711.8199999999988, 0.47023812929282083, 1.0502013825870182, 0.0], "isController": true}, {"data": ["Continue", 2138, 1, 0.04677268475210477, 225.54630495790454, 0, 57516, 161.0, 177.0, 215.0, 677.8700000000085, 0.4704547589975573, 0.9154522810234438, 0.0], "isController": true}, {"data": ["Launch", 2152, 0, 0.0, 767.9335501858741, 323, 11018, 667.0, 779.4000000000001, 1146.4499999999994, 3262.1099999999774, 0.473453910075878, 4.160143260165234, 0.0], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4285, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
