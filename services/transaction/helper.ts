import {_TypeTrading, Transaction} from "@/services/transaction/@types";



// tính giá đầu vào
export const calculateConvertPrice = (transaction: Transaction, realTimePrice: number) => {
    if (transaction.type_trading === _TypeTrading.USD) {
        return  transaction.volume * transaction.rate_to_usd;
    } else {
        return transaction.volume * realTimePrice;
    }
}


export const calculateCloseTransaction= (transaction: Transaction, realTimePrice: number) => {
    // Giá lúc mua
    const entryPriceConvert = calculateConvertPrice(transaction, realTimePrice);

    // Giá lúc bán
    let priceCloseConvert = 0;
    if (transaction.type_trading === _TypeTrading.USD) {
        const lot = (transaction.volume * transaction.rate_to_usd) / transaction.entry_price;
        priceCloseConvert = realTimePrice * lot * transaction.rate_to_usd;
    }else{
        priceCloseConvert = realTimePrice * transaction.volume * transaction.rate_to_usd;
    }
    const priceProfit = priceCloseConvert - entryPriceConvert;
    const percentProfitLoss = priceProfit / entryPriceConvert;

    // Đòn bẩy
    const level = transaction.level ? transaction.level : 10000;
    const profit = entryPriceConvert * level * percentProfitLoss;
    const total = entryPriceConvert + profit;
    return{
        close_price_convert: priceCloseConvert,
        total: total
    }
}