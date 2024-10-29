import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import boost from 'highcharts/modules/boost';
import exporting from 'highcharts/modules/exporting';
import accessibility from 'highcharts/modules/accessibility';

// Initialize the Highcharts modules
boost(Highcharts);
exporting(Highcharts);
accessibility(Highcharts);

const HighChartsComponent = () => {
  useEffect(() => {
    // Generate data
    const getData = (n) => {
      const arr = [];
      let i, x, a, b, c, spike;
      for (
        i = 0, x = Date.UTC(new Date().getUTCFullYear(), 0, 1) - n * 1000;
        i < n;
        i = i + 1, x = x + 1000
      ) {
        if (i % 100 === 0) {
          a = 2 * Math.random();
        }
        if (i % 1000 === 0) {
          b = 2 * Math.random();
        }
        if (i % 10000 === 0) {
          c = 2 * Math.random();
        }
        if (i % 50000 === 0) {
          spike = 10;
        } else {
          spike = 0;
        }
        arr.push([
          x,
          2 * Math.sin(i / 100) + a + b + c + spike + Math.random(),
        ]);
      }
      return arr;
    };
    const n = 100000,
      data = getData(n);

    // Create the Highcharts chart
    Highcharts.chart('container', {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: `Highcharts drawing ${n} points`,
        align: 'left',
      },
      subtitle: {
        text: 'Using the Boost module',
        align: 'left',
      },
      accessibility: {
        screenReaderSection: {
          beforeChartFormat:
            '<{headingTagName}>{chartTitle}</{headingTagName}><div>{chartSubtitle}</div><div>{chartLongdesc}</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div>',
        },
      },
      tooltip: {
        valueDecimals: 2,
      },
      xAxis: {
        type: 'datetime',
      },
      series: [
        {
          data: data,
          lineWidth: 0.5,
          name: 'Hourly data points',
        },
      ],
    });
  }, []); // Run only once after initial render

  return (
    <div>
      <div id="container"></div>
      <p>
        Using the Highcharts Boost module, it is possible to render large
        amounts of data on the client side. This chart shows a line series with{' '}
        {n} data points. The points represent hourly data since 1965. Click and
        drag in the chart to zoom in.
      </p>
    </div>
  );
};

export default HighChartsComponent;
