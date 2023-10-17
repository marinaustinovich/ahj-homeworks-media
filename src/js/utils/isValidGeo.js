export function parseCoordinates(input) {
  const cleanedInput = input.replace(/^\s*\[|\]\s*$/g, '').trim();
  const parts = cleanedInput.split(/,\s*/);

  if (parts.length !== 2) {
    throw new Error('Некорректный формат ввода');
  }

  const cleanedParts = parts.map((part) => part.replace(/−/g, '-'));
  const latitude = parseFloat(cleanedParts[0]);
  const longitude = parseFloat(cleanedParts[1]);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new Error('Некорректные значения широты и долготы');
  }

  return {
    latitude,
    longitude,
  };
}

export default function isValidGeo(string) {
  try {
    return parseCoordinates(string);
  } catch (error) {
    console.error(error.message);

    return error.message;
  }
}
