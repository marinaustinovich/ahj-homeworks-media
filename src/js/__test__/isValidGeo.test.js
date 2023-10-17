import isValidGeo, { parseCoordinates } from '../utils/isValidGeo';

describe('parseCoordinates', () => {
  test('valid input with spaces and brackets', () => {
    const result = parseCoordinates('[51.50851, −0.12572]');
    expect(result).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });
  test('valid input without spaces and brackets', () => {
    const result = parseCoordinates('51.50851,−0.12572');
    expect(result).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });
  test('invalid input with too many parts', () => {
    expect(() => parseCoordinates('51.50851, −0.12572, 123.456')).toThrow(
      'Некорректный формат ввода',
    );
  });
  test('invalid input with incorrect format', () => {
    expect(() => parseCoordinates('51.50851: −0.12572')).toThrow(
      'Некорректный формат ввода',
    );
  });
  test('invalid input with non-numeric values', () => {
    expect(() => parseCoordinates('51.50851, abc')).toThrow(
      'Некорректные значения широты и долготы',
    );
  });
});

describe('isValidGeo', () => {
  test('valid input', () => {
    const result = isValidGeo('51.50851, −0.12572');
    expect(result).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });
  test('invalid input', () => {
    const result = isValidGeo('51.50851, abc');
    expect(result).toBe('Некорректные значения широты и долготы');
  });
});
