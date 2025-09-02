// config/crypto-config.js

// =====================================================================
// КОНФИГУРАЦИЯ КРИПТОВАЛЮТ
// =====================================================================

// Список криптовалютных пар для отображения.
export const cryptoPairs = [
    { symbol: 'BTCUSDT', name: 'Bitcoin' },
    { symbol: 'ETHUSDT', name: 'Ethereum' },
    { symbol: 'BNBUSDT', name: 'BNB' },
    { symbol: 'SOLUSDT', name: 'Solana' },
    { symbol: 'XRPUSDT', name: 'XRP' },
    { symbol: 'ADAUSDT', name: 'Cardano' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin' }
];

// --- НОВЫЙ БЛОК: Настройки API ---
export const apiSettings = {
    // Как часто (в миллисекундах) запрашивать цену через REST API.
    // 3000 = 3 секунды. Уменьшение значения увеличит частоту обновлений.
    priceUpdateInterval: 350 
};