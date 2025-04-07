<script>
  import { onMount } from 'svelte';
  import Plotly from 'plotly.js-dist-min';
  import { loadCSV } from '../lib/parseData.js';

  export let selectedStock;
  export let selectedWindow;
  export let selectedModel;
  let chartEl;

  async function updateChart() {
    const data = await loadCSV('/data/stock_sentiment_data.csv');

    const filtered = data.filter(d =>
      d.stock === selectedStock &&
      !isNaN(d.date) &&
      !isNaN(d.return_1d) &&
      !isNaN(d[selectedModel.toLowerCase()])
    );

    if (filtered.length === 0) {
      Plotly.purge(chartEl);
      return;
    }

    const returnKey = selectedWindow === "1" ? 'return_1d'
                    : selectedWindow === "3" ? 'return_3d'
                    : 'return_7d';

    const sentimentKey = selectedModel.toLowerCase();

    // ✅ Aggregate: one bubble per day (choose dominant sentiment)
    const dateMap = new Map();

    filtered.forEach(d => {
      const dateStr = d.dateStr;
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, d);
      } else {
        const existing = dateMap.get(dateStr);
        // Prefer more negative sentiment
        if (d[sentimentKey] < existing[sentimentKey]) {
          dateMap.set(dateStr, d);
        }
      }
    });

    const reducedData = Array.from(dateMap.values());

    const frames = reducedData.reduce((acc, d) => {
      const dateFrame = acc[d.dateStr] || { name: d.dateStr, data: [] };
      dateFrame.data.push(d);
      acc[d.dateStr] = dateFrame;
      return acc;
    }, {});

    const frameList = Object.values(frames).map(frame => {
      return {
        name: frame.name,
        data: [{
          x: frame.data.map(d => d[sentimentKey]),
          y: frame.data.map(d => d[returnKey]),
          mode: 'markers',
          marker: {
            size: 30, // ✅ Increased bubble size
            color: frame.data.map(d => d[sentimentKey] > 0 ? 'green' : 'red'),
            line: { width: 1, color: 'black' },
            showscale: false // ✅ No colorbar
          },
          customdata: frame.data.map(d => ({
            date: d.dateStr,
            sentiment: d[sentimentKey].toFixed(2),
            sentimentLabel: d[sentimentKey] > 0 ? 'Positive' : d[sentimentKey] < 0 ? 'Negative' : 'Neutral',
            returnPercent: (d[returnKey] * 100).toFixed(2),
            volatility: Math.abs(d.volatility_10d).toFixed(2)
          })),
          hovertemplate: `
            <b>Date:</b> %{customdata.date}<br>
            <b>Sentiment:</b> %{customdata.sentiment} (%{customdata.sentimentLabel})<br>
            <b>Return:</b> %{customdata.returnPercent}%<br>
            <b>Volatility:</b> %{customdata.volatility}<br>
            <extra></extra>
          `
        }]
      };
    });

    const layout = {
      title: `${selectedStock} - Sentiment Impact Analysis (${selectedModel})`,
      xaxis: {
        title: {
          text: `${selectedModel} Sentiment Score (Negative to Positive)`,
          font: { size: 16 }
        },
        tickfont: { size: 14 }
      },
      yaxis: {
        title: {
          text: `${selectedWindow}-Day Stock Return (%)`,
          font: { size: 16 }
        },
        tickfont: { size: 14 }
      },
      updatemenus: [{
        type: 'buttons',
        showactive: false,
        buttons: [{
          label: 'Play',
          method: 'animate',
          args: [null, {
            mode: 'immediate',
            frame: { duration: 1200, redraw: true }, // ✅ Slower animation
            fromcurrent: true,
            transition: { duration: 600, easing: 'cubic-in-out' }
          }]
        }, {
          label: 'Pause',
          method: 'animate',
          args: [[null], { mode: 'immediate', frame: { duration: 0, redraw: false } }]
        }]
      }],
      hovermode: 'closest'
    };

    const initialData = frameList[0]?.data || [];

    Plotly.newPlot(chartEl, initialData, layout).then(() => {
      Plotly.addFrames(chartEl, frameList);
    });
  }

  $: selectedStock, selectedWindow, selectedModel, updateChart();
</script>

<div bind:this={chartEl}></div>
