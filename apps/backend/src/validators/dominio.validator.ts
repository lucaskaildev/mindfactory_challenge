export class DominioValidator {
  private static readonly DOMINIO_REGEX =
    /^[A-Z]{3}[0-9]{3}$|^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;

  /**
   * Validates dominio format (AAA999 or AA999AA)
   * Returns true if the dominio matches the pattern, false otherwise.
   */
  public static isValid(dominio: string): boolean {
    return DominioValidator.DOMINIO_REGEX.test(
      DominioValidator.normalize(dominio),
    );
  }

  /**
   * Normalize input string (uppercase)
   */
  private static normalize(dominio: string): string {
    return dominio.toUpperCase();
  }
}
