export const CoinList = () =>
    "https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json";

export const HistoricalChart = (id, days = 365, currency) =>
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

export const SingleCoin = (id) =>
    `https://api.coingecko.com/api/v3/coins/${id}`;

export const CoinMarkets = (currency) =>
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

export const PriceSwap = (tokenA,tokenB,value) =>
    `https://api.0x.org/swap/v1/price?sellToken=${tokenA}&buyToken=${tokenB}&sellAmount=${value}`;
