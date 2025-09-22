import { FechaFabricacionValidator } from '@/validators/fecha-fabricacion.validator';

describe('FechaFabricacionValidator.isValid', () => {
  it('accepts valid YYYYMM values not in the future', () => {
    expect(FechaFabricacionValidator.isValid(202001)).toBe(true);
    expect(FechaFabricacionValidator.isValid(199912)).toBe(true);
  });

  it('rejects months outside 1..12 and years < 1900', () => {
    expect(FechaFabricacionValidator.isValid(202313)).toBe(false); // month 13
    expect(FechaFabricacionValidator.isValid(202300)).toBe(false); // month 00
    expect(FechaFabricacionValidator.isValid(189912)).toBe(false); // year < 1900
  });

  it('rejects future dates', () => {
    expect(FechaFabricacionValidator.isValid(299912)).toBe(false);
  });

  it('works with string inputs as well as numbers', () => {
    expect(FechaFabricacionValidator.isValid('202001')).toBe(true);
  });
});
