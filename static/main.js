window.onload = function () {
    // Fetch the JSON data
    fetch("static/wetterDataInside.json")
        .then((response) => response.json())
        .then((data) => {
            // Use the data to generate the chart
            generateChart(data.allStats);
        })
        .catch((error) => console.error("Error fetching JSON:", error));

    function generateChart(allStats) {
        // Use the last 12 data points
        var last12Stats = allStats.slice(-12);

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

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title: {
                text: "Temp and Humi Graph",
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
                    return CanvasJS.formatDate(new Date(e.value), "HH:mm");
                },
            },
            axisY: {
                title: "Temp",
                titleFontColor: "#FF7373",
                suffix: " *C",
                lineColor: "#FF7373",
                tickColor: "#FF7373",
            },
            axisY2: {
                title: "Humidity",
                titleFontColor: "#02E0D9",
                suffix: " %",
                lineColor: "#02E0D9",
                tickColor: "#02E0D9",
            },
            data: [
                {
                    type: "spline",
                    name: "temp",
                    showInLegend: true,
                    yValueFormatString: "#,##0.00 *C",
                    indexLabelFontColor: "#FF7373",
                    indexLabelPlacement: "outside",
                    color: "#FF7373",  // Explicitly set the line color
                    dataPoints: chartData.map(function (point) {
                        return { x: point.x, y: point.y1 };
                    }),
                },
                {
                    type: "spline",
                    axisYType: "secondary",
                    name: "humidity",
                    showInLegend: true,
                    yValueFormatString: "#,##0.#",
                    indexLabelFontColor: "#02E0D9",
                    indexLabelPlacement: "outside",
                    color: "#02E0D9",  // Explicitly set the line color
                    dataPoints: chartData.map(function (point) {
                        return { x: point.x, y: point.y2 };
                    }),
                },
            ],
            
        });
        chart.render();
    }
};
