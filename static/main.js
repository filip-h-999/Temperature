window.onload = function () {
    // Fetch the JSON data for the first chart
    fetch("static/wetterDataInside.json")
        .then((response) => response.json())
        .then((data) => {
            // Use the data to generate the chart
            generateChart(data.allStats, "chartContainer", "Inside Data", "#eb3434", "#6e34eb");
            parsDataIn(data.allStats)
        })
        .catch((error) => console.error("Error fetching JSON:", error));

    // Fetch the JSON data for the second chart
    fetch("static/wetterDataOutside.json")
        .then((response) => response.json())
        .then((data) => {
            // Use the data to generate the second chart
            generateChart(data.allStats, "chartContainer2", "Outside Data", "#68eb34", "#33BFFF");
            parsDataOut(data.allStats)
        })
        .catch((error) => console.error("Error fetching JSON:", error));

    function generateChart(allStats, containerId, chartTitle, tempColor, humidityColor) {
        // Use the last 12 data points
        var last12Stats = allStats.slice(-24);

        var chartData = [];

        // Extract data for the chart
        last12Stats.forEach(function (data) {
            var timestamp = new Date(data.Time).getTime();

            chartData.push({
                x: timestamp,
                y1: data.Temp,
                y2: data.Humidity,
            });
        });

        // Calculate the average time difference between consecutive data points
        var totalDifference = 0;
        for (var i = 1; i < chartData.length; i++) {
            totalDifference += chartData[i].x - chartData[i - 1].x;
        }
        var averageDifference = totalDifference / (chartData.length - 1);

        var chart = new CanvasJS.Chart(containerId, {
            animationEnabled: true,
            title: {
                text: chartTitle,
            },
            toolTip: {
                shared: true,
                contentFormatter: function (e) {
                    var content = "Time: ";
                    for (var i = 0; i < e.entries.length; i++) {
                        content +=
                            CanvasJS.formatDate(new Date(e.entries[i].dataPoint.x), "H:mm") +
                            "<br>";
                        content +=
                            "<strong>" + e.entries[i].dataSeries.name + "</strong>: ";
                        content += e.entries[i].dataPoint.y + "<br><br>";
                    }
                    return content;
                },
            },
            axisX: {
                title: "Time",
                suffix: " h",
                interval: averageDifference,
                labelFormatter: function (e) {
                    return CanvasJS.formatDate(new Date(e.value), "HH");
                },
            },
            axisY: {
                interlacedColor: "Azure",
                title: "Temp",
                titleFontColor: tempColor,
                suffix: " *C",
                lineColor: tempColor,
                tickColor: tempColor,
            },
            axisY2: {
                title: "Humidity",
                titleFontColor: humidityColor,
                suffix: " %",
                lineColor: humidityColor,
                tickColor: humidityColor,
            },
            data: [
                {
                    type: "spline",
                    name: "Temperature",
                    showInLegend: true,
                    yValueFormatString: "#,##0.00 *C",
                    indexLabelFontColor: tempColor,
                    indexLabelPlacement: "outside",
                    color: tempColor,
                    dataPoints: chartData.map(function (point) {
                        return { x: point.x, y: point.y1 };
                    }),
                },
                {
                    type: "spline",
                    axisYType: "secondary",
                    name: "Humidity",
                    showInLegend: true,
                    yValueFormatString: "#,##0.#",
                    indexLabelFontColor: humidityColor,
                    indexLabelPlacement: "outside",
                    color: humidityColor,
                    dataPoints: chartData.map(function (point) {
                        return { x: point.x, y: point.y2 };
                    }),
                },
            ],
        });
        chart.render();
    }

    function parsDataIn(allStats){
        dayData = 0;
        if (allStats.length < 24) {
            dayData = allStats.length;
        }
        else {
            dayData = 24;
        }

        var lastValue = allStats.slice(-1);
        var temp = lastValue[0].Temp;
        var humidity = lastValue[0].Humidity;

        var currentElement = document.getElementById("current");
        currentElement.innerHTML = temp + " *C" + " / " + humidity + "%";

        var higestTempIn = allStats.slice(-dayData);
        var maxTempIn = Math.max.apply(Math, higestTempIn.map(function(o) { return o.Temp; }));
        var maxTempInElement = document.getElementById("highIn");
        maxTempInElement.innerHTML = maxTempIn + " *C";

        var lowestTemp = allStats.slice(-dayData);
        var minTempIn = Math.min.apply(Math, lowestTemp.map(function(o) { return o.Temp; }));
        var minTempInElement = document.getElementById("lowIn");
        minTempInElement.innerHTML = minTempIn + " *C";

        var higestHumidity = allStats.slice(-dayData);
        var maxHumidity = Math.max.apply(Math, higestHumidity.map(function(o) { return o.Humidity; }));
        var maxHumidityElement = document.getElementById("hHIn");
        maxHumidityElement.innerHTML = maxHumidity + "%";

        var lowestHumidity = allStats.slice(-dayData);
        var minHumidity = Math.min.apply(Math, lowestHumidity.map(function(o) { return o.Humidity; }));
        var minHumidityElement = document.getElementById("lHIn");
        minHumidityElement.innerHTML = minHumidity + "%";
    }

    function parsDataOut(allStats){
        dayData = 0;
        if (allStats.length < 24) {
            dayData = allStats.length;
        }
        else {
            dayData = 24;
        }

        var lastValue = allStats.slice(-1);
        var temp = lastValue[0].Temp;
        var humidity = lastValue[0].Humidity;

        var currentElement = document.getElementById("currentOut");
        currentElement.innerHTML = temp + " *C" + " / " + humidity + "%";

        var highesTempOut = allStats.slice(-dayData);
        var maxTempOut = Math.max.apply(Math, highesTempOut.map(function(o) { return o.Temp; }));
        var maxTempOutElement = document.getElementById("highOut");
        maxTempOutElement.innerHTML = maxTempOut + " *C";

        var lowestTempOut = allStats.slice(-dayData);
        var minTempOut = Math.min.apply(Math, lowestTempOut.map(function(o) { return o.Temp; }));
        var minTempOutElement = document.getElementById("lowOut");
        minTempOutElement.innerHTML = minTempOut + " *C";

        var higestHumidityOut = allStats.slice(-dayData);
        var maxHumidityOut = Math.max.apply(Math, higestHumidityOut.map(function(o) { return o.Humidity; }));
        var maxHumidityOutElement = document.getElementById("hHOut");
        maxHumidityOutElement.innerHTML = maxHumidityOut + "%";

        var lowestHumidityOut = allStats.slice(-dayData);
        var minHumidityOut = Math.min.apply(Math, lowestHumidityOut.map(function(o) { return o.Humidity; }));
        var minHumidityOutElement = document.getElementById("lHOut");
        minHumidityOutElement.innerHTML = minHumidityOut + "%";
    }

};
