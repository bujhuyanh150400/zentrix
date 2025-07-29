const removeVietnameseTones = (str: string) => {
    return str
        .normalize("NFD") // Tách dấu khỏi ký tự
        .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};