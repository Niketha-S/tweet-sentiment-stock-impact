<script>
    import { onMount } from 'svelte';
    import Plotly from 'plotly.js-dist-min';
    import { loadCSV } from '../lib/parseData.js';
  
    let chartEl;
  
    onMount(async () => {
      const data = await loadCSV('/data/stock_sentiment_data.csv');
  
      const trace = {
        x: data.map(d => d.volatility_10d),
        y: data.map(d => d.return_3d),
        mode: 'markers',
        type: 'scatter',
        name: 'Volatility vs Return',
      };
  
      const layout = {
        title: '3-Day Return vs. 10-Day Volatility',
        xaxis: { title: '10-Day Volatility' },
        yaxis: { title: '3-Day Return (%)' }
      };
  
      Plotly.newPlot(chartEl, [trace], layout);
    });
  </script>
  
  <div bind:this={chartEl}></div>
  