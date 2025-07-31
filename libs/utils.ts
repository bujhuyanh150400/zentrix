import dayjs from "dayjs";

export const removeVietnameseTones = (str: string) => {
    return str
        .normalize("NFD") // Tách dấu khỏi ký tự
        .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};

export const formatMessageTime = (createdAt: string) => {
    const created = dayjs(createdAt);
    const now = dayjs();

    const diffInDays = now.diff(created, 'day');

    if (diffInDays > 1) {
        // Quá 1 ngày → hiển thị ngày/tháng/năm
        return created.format('DD/MM/YYYY');
    } else {
        // Trong hôm nay hoặc hôm qua → chỉ hiện giờ
        return created.format('HH:mm');
    }
};

export const calculateBidAskSpread = (price: number, spread: string) => {
    const floatSpread = parseFloat(spread);
    if (floatSpread && price) {
        const bid = +(price - floatSpread / 2).toFixed(5); // SELL
        const ask = +(price + floatSpread / 2).toFixed(5); // BUY
        return {bid, ask, spread};
    } else {
        return {bid: 0, ask: 0, spread};
    }
}

export const formatNumber = (num: number) => {
    return num.toFixed(2);
};
export const parseToNumber = (text: string) => {
    const num = Number(text);
    return isNaN(num) ? 0 : num;
};
export const calculateProfit = (price: number, percent: string, volume: string, type: "TP" | "SL") => {
    const percentValue = parseToNumber(percent);
    const volumeValue = parseToNumber(volume);
    if (!percentValue || !volumeValue || percentValue < 0 || volumeValue <= 0) {
        return 0;
    }
    if (type === "TP") {
        return (price * volumeValue + ((price * percentValue / 100) * volumeValue)).toFixed(2);
    } else {
        return (price * volumeValue - ((price * percentValue / 100) * volumeValue)).toFixed(2);
    }
}

export function generateUniqueIdRecharge(): string {
    const uniquePart = Date.now().toString(16) + Math.floor(Math.random() * 1000000).toString(16);
    return ('NAP' + uniquePart).toUpperCase();
}