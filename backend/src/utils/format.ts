import dateFormat from 'dateformat';

export class Format {
  static formatDateTime(date: Date): string {
    return dateFormat(date, 'HH:MM yyyy-mm-dd');
  }
  static formatPrice(price: number) {
    //Chuyển về định dạng VNĐ
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }
}
