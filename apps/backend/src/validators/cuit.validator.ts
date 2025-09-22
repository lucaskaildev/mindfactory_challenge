export const COEFFICIENTS: number[] = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
export function digitCheck(sequence: string, coef: number[]): boolean {
  // SEE: https://es.wikipedia.org/wiki/C%C3%B3digo_de_control
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(sequence[i], 10) * coef[i];
  }

  const calculatedDigit = (11 - (sum % 11)) % 11;
  const checkDigit = calculatedDigit === 11 ? 0 : calculatedDigit;

  const providedDigit = parseInt(sequence[10], 10);

  return checkDigit === providedDigit;
}
export class CuitValidator {
  private static readonly COEFFICIENTS: number[] = COEFFICIENTS;

  private static digitCheck(cuit: string): boolean {
    return digitCheck(cuit, this.COEFFICIENTS);
  }

  public static isValid(value: any): boolean {
    const cuit = String(value ?? '');
    if (!/^\d{11}$/.test(cuit)) return false;

    return CuitValidator.digitCheck(cuit);
  }
}
