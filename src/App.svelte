<script>
  import Controls from './components/Controls.svelte';
  import SentimentChart from './components/SentimentChart.svelte';

  let selectedStock = '';
  let selectedWindow = '1';
  let selectedModel = 'LSTM';

  function handleStockChange(e) {
    selectedStock = e.detail.stock;
  }

  function handleWindowChange(e) {
    selectedWindow = e.detail.window;
  }

  function handleModelChange(e) {
    selectedModel = e.detail.model;
  }
</script>

<main>
  <Controls
    bind:selectedStock
    bind:selectedWindow
    bind:selectedModel
    on:stockChange={handleStockChange}
    on:windowChange={handleWindowChange}
    on:modelChange={handleModelChange}
  />
  <SentimentChart {selectedStock} {selectedWindow} {selectedModel} />
</main>

<style>
  main {
    padding: 2rem;
    font-family: sans-serif;
    background-color: #121212;
    color: white;
  }
</style>
