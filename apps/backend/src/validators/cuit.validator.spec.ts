import {
  CuitValidator,
  COEFFICIENTS,
  digitCheck,
} from '@/validators/cuit.validator';

const VALID_CUITS = ['20123456786', '23123456785', '30123456781'];
const INVALID_CHECK_DIGIT_CUITS = ['20123456787', '23123456784', '30123456780'];

describe('CUIT helper function', () => {
  it('digitCheck returns true for valid check digits', () => {
    for (const cuit of VALID_CUITS) {
      expect(digitCheck(cuit, COEFFICIENTS)).toBe(true);
    }
  });

  it('digitCheck returns false for invalid check digits', () => {
    for (const cuit of INVALID_CHECK_DIGIT_CUITS) {
      expect(digitCheck(cuit, COEFFICIENTS)).toBe(false);
    }
  });
});

describe('CuitValidator class', () => {
  it('isValid accepts valid CUITs', () => {
    for (const cuit of VALID_CUITS) {
      expect(CuitValidator.isValid(cuit)).toBe(true);
    }
  });

  it('isValid rejects invalid check digit', () => {
    for (const cuit of INVALID_CHECK_DIGIT_CUITS) {
      expect(CuitValidator.isValid(cuit)).toBe(false);
    }
  });

  it('isValid rejects non-digit characters or wrong length', () => {
    expect(CuitValidator.isValid('1234567890')).toBe(false); // 10 digits
    expect(CuitValidator.isValid('123456789012')).toBe(false); // 12 digits
    expect(CuitValidator.isValid('ABCDEFGHIJK')).toBe(false); // non-digits
    expect(CuitValidator.isValid('1234567890A')).toBe(false); // mixed
  });
});
