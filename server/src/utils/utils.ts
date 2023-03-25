
export namespace Utils {
  export function FormatDate(date: Date): string {
    return date.getDay() + "-" + date.getMonth() + "-" + date.getFullYear();
  }
}
