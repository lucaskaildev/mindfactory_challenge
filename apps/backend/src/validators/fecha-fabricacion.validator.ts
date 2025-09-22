import { DateToYYYYMM } from '@/lib/date';

export class FechaFabricacionValidator {
  /**
   * Validates fecha fabricacion (YYYYMM format, not future)
   * Returns true if fechaFabricacion is valid, false otherwise.
   */
  public static isValid(value: number | string): boolean {
    const fechaStr = value.toString();

    const year = parseInt(fechaStr.slice(0, 4), 10);
    const month = parseInt(fechaStr.slice(4, 6), 10);

    if (year < 1900) return false;
    if (month < 1 || month > 12) return false; //TODO: replace for a lib call

    const currentYYYYMM = DateToYYYYMM(new Date());
    if (parseInt(fechaStr, 10) > currentYYYYMM) return false;

    return true;
  }
}
