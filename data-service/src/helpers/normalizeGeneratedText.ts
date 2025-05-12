// Оставляем только китайские символы
export const normalizeGeneratedText = (text: string) => {
    return text.replace(/[^\u4e00-\u9fa5]/g, "");
}