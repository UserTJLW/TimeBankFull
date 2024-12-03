import React from 'react';
function CurrencyConverter({
  fromCurrency,
  toCurrency,
  amount,
  rates,
  onFromCurrencyChange,
  onToCurrencyChange,
  onAmountChange,
  onConvert,
  convertedAmount
}) {
  // Opciones de monedas disponibles
  const currencyOptions = Object.keys(rates);
  return (
    <div className="currency-converter">
      <div className="input-group">
        <select
          value={fromCurrency}
          onChange={(e) => onFromCurrencyChange(e.target.value)}
        >
          {currencyOptions.map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="Monto a convertir: "
        />
        <select
          value={toCurrency}
          onChange={(e) => onToCurrencyChange(e.target.value)}
        >
          {currencyOptions.map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <button onClick={onConvert}>Convertir</button>
      </div>
      {convertedAmount !== null && (
        <div className="result">
          <h2>Resultado:</h2>
          <p>{amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}</p>
        </div>
      )}
    </div>
  );
}
export default CurrencyConverter;