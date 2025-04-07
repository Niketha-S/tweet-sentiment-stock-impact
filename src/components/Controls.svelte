<script>
  import { onMount } from 'svelte';
  import { loadCSV } from '../lib/parseData.js';
  import { createEventDispatcher } from 'svelte';

  export let selectedStock;
  export let selectedWindow;
  export let selectedModel;

  const dispatch = createEventDispatcher();
  let stocks = [];

  const windows = ["1", "3", "7"];
  const models = ["LSTM", "TextBlob"];

  // ✅ Map stock code to company name
  const stockNameMap = {
    TSLA: 'Tesla',
    FB: 'Facebook',
    AAPL: 'Apple',
    AMZN: 'Amazon',
    GOOGL: 'Google',
    MSFT: 'Microsoft',
    NFLX: 'Netflix'
    // Add more as needed!
  };

  onMount(async () => {
    const data = await loadCSV('/data/stock_sentiment_data.csv');
    const cleanedStocks = data
      .map(d => d.stock)
      .filter(Boolean)
      .filter(s => /^[A-Z]{1,5}$/.test(s));

    stocks = Array.from(new Set(cleanedStocks)).sort();

    if (!selectedStock && stocks.length > 0) {
      selectedStock = stocks[0];
      dispatch('stockChange', { stock: selectedStock });
    }
  });

  function handleStockChange(e) {
    dispatch('stockChange', { stock: e.target.value });
  }

  function handleWindowChange(e) {
    dispatch('windowChange', { window: e.target.value });
  }

  function handleModelChange(e) {
    dispatch('modelChange', { model: e.target.value });
  }
</script>

<div>
  <label>Stock:</label>
  <select bind:value={selectedStock} on:change={handleStockChange}>
    {#each stocks as s}
      <option value={s}>{stockNameMap[s] || s}</option>
    {/each}
  </select>

  <label style="margin-left: 1rem;">Return Window (days):</label>
  <select bind:value={selectedWindow} on:change={handleWindowChange}>
    {#each windows as w}
      <option value={w}>{w}-Day</option>
    {/each}
  </select>

  <label style="margin-left: 1rem;">Model:</label>
  <select bind:value={selectedModel} on:change={handleModelChange}>
    {#each models as m}
      <option value={m}>{m}</option>
    {/each}
  </select>
</div>

<style>
  select {
    margin: 0.5rem;
    padding: 0.5rem;
  }
</style>
