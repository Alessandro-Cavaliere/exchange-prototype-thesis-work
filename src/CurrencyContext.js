import React, { createContext, useContext, useEffect, useState } from "react";

const Currency = createContext();

const CurrencyContext = ({ children }) => {
    const [currency, setCurrency] = useState("EUR");
    const [symbol, setSymbol] = useState("€");

    useEffect(() => {
        if (currency === "EUR") setSymbol("€");
        else if (currency === "USD") setSymbol("$");
    }, [currency]);

    return (
        <Currency.Provider value={{ currency, setCurrency, symbol }}>
            {children}
        </Currency.Provider>
    );
};

export default CurrencyContext;

export const CurrencyState = () => {
    return useContext(Currency);
};