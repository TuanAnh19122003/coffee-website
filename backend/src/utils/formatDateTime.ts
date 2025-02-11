import dateFormat from "dateformat";

export class FormatDateTime{
    static formatDateTime(date: Date): string {
        return dateFormat(date, "yyyy-mm-dd HH:MM:ss");
    }
}