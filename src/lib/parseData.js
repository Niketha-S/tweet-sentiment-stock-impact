import * as d3 from 'd3';

export async function loadCSV(path) {
  const parseDate = d3.timeParse("%d/%m/%Y");

  const data = await d3.csv(path, d => {
    // Clean and normalize stock codes
    let stockCode = d['STOCK']?.toUpperCase().trim();
    if (!stockCode || !/^[A-Z]{1,5}$/.test(stockCode)) {
      stockCode = null; // Remove garbage entries
    }

    return {
      date: parseDate(d['DATE']),
      dateStr: d['DATE'],
      stock: stockCode,
      return_1d: +d['1_DAY_RETURN'],
      return_3d: +d['3_DAY_RETURN'],
      return_7d: +d['7_DAY_RETURN'],
      volatility_10d: +d['VOLATILITY_10D'],
      lstm: +d['LSTM_POLARITY'],
      textblob: +d['TEXTBLOB_POLARITY'],
      tweet_volume: +d['TWEET_VOLUME'] || 50
    };
  });

  console.log("✅ Cleaned & Parsed rows:", data.length);
  console.log("👀 Sample parsed row:", data[0]);

  return data;
}
