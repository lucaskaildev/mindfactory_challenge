import { DateToYYYYMM, YYYYMMToDate } from '@/lib/date';

describe('lib/date', () => {
  describe('DateToYYYYMM', () => {
    it('converts january date to YYYYMM correctly', () => {
      const d = new Date(2025, 0, 15);
      expect(DateToYYYYMM(d)).toBe(202501);
    });

    it('converts December date to YYYYMM correctly', () => {
      const d = new Date(2025, 11, 31);
      expect(DateToYYYYMM(d)).toBe(202512);
    });
  });

  describe('YYYYMMToDate', () => {
    it('parses 202501 to a Date of 2025-01-01', () => {
      const d = YYYYMMToDate(202501);
      expect(d.getFullYear()).toBe(2025);
      expect(d.getMonth()).toBe(0);
      expect(d.getDate()).toBe(1);
    });

    it('parses 202509 to a Date of 2025-09-01', () => {
      const d = YYYYMMToDate(202509);
      expect(d.getFullYear()).toBe(2025);
      expect(d.getMonth()).toBe(8);
      expect(d.getDate()).toBe(1);
    });
  });
});
