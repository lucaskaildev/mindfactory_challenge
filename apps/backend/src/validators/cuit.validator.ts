export class CuitValidator {
  private static readonly COEFFICIENTS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

  private static digitCheck(cuit: string): boolean {
    // SEE: https://es.wikipedia.org/wiki/C%C3%B3digo_de_control
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cuit[i], 10) * this.COEFFICIENTS[i];
    }

    const calculatedDigit = (11 - (sum % 11)) % 11;
    const checkDigit = calculatedDigit === 11 ? 0 : calculatedDigit;

    const providedDigit = parseInt(cuit[10], 10);

    return checkDigit === providedDigit;
  }

  public static isValid(value: any): boolean {
    const cuit = String(value ?? '');
    if (!/^\d{11}$/.test(cuit)) return false;

    return CuitValidator.digitCheck(cuit);
  }
}
