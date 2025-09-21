import { DominioValidator } from '@/validators/dominio.validator';

// valid formats: AAA999 and AA999AA
describe('DominioValidator format', () => {
  it('accepts AAA999 format', () => {
    expect(DominioValidator.isValid('ABC123')).toBe(true);
  });

  it('accepts AA999AA format', () => {
    expect(DominioValidator.isValid('AB123CD')).toBe(true);
  });

  it('rejects invalid formats', () => {
    expect(DominioValidator.isValid('ABCD123')).toBe(false);
    expect(DominioValidator.isValid('AB1234C')).toBe(false);
    expect(DominioValidator.isValid('A1B2C3')).toBe(false);
    expect(DominioValidator.isValid('AB 123 CD')).toBe(false);
    expect(DominioValidator.isValid('123ABC')).toBe(false);
  });
});

describe('DominioValidator normalization', () => {
  it('normalizes lowercase to uppercase for AAA999 and AA999AA', () => {
    expect(DominioValidator.isValid('abc123')).toBe(true);
    expect(DominioValidator.isValid('ab123cd')).toBe(true);
  });
});
