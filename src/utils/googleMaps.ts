import { Loader } from '@googlemaps/js-api-loader';

// Список стран СНГ
export const CIS_COUNTRIES = [
  'RU', // Россия
  'BY', // Беларусь
  'KZ', // Казахстан
  'KG', // Кыргызстан
  'TJ', // Таджикистан
  'UZ', // Узбекистан
  'AM', // Армения
  'AZ', // Азербайджан
  'GE', // Грузия
  'MD', // Молдова
  'TM', // Туркменистан
];

// Инициализация Google Maps API
let mapsApi: typeof google | null = null;

export const initializeGoogleMaps = async (): Promise<typeof google> => {
  if (mapsApi) {
    return mapsApi;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Maps API key not found. Please set VITE_GOOGLE_API_KEY in your environment variables.');
  }

  const loader = new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['places'],
  });

  try {
    mapsApi = await loader.load();
    return mapsApi;
  } catch (error) {
    console.error('Error loading Google Maps API:', error);
    throw error;
  }
};

// Инициализация нового PlaceAutocompleteElement
export const initializePlaceAutocompleteElement = async (): Promise<typeof google.maps.places.PlaceAutocompleteElement> => {
  const google = await initializeGoogleMaps();
  
  if (!google.maps.places.PlaceAutocompleteElement) {
    throw new Error('PlaceAutocompleteElement is not available. Please check your Google Maps API configuration.');
  }
  
  return google.maps.places.PlaceAutocompleteElement;
};

// Проверка, является ли страна страной СНГ
export const isCISCountry = (countryCode: string): boolean => {
  return CIS_COUNTRIES.includes(countryCode.toUpperCase());
};

// Получение информации о стране из результата Google Places
export const getCountryFromPlace = (place: google.maps.places.PlaceResult): string | null => {
  if (!place.address_components) return null;

  const countryComponent = place.address_components.find(
    component => component.types.includes('country')
  );

  return countryComponent?.short_name || null;
};

// Типы для нового PlaceAutocompleteElement
interface PlaceAutocompletePlace {
  formattedAddress: string;
  addressComponents: Array<{
    types: string[];
    shortText: string;
  }>;
}

// Получение информации о стране из нового PlaceAutocompleteElement
export const getCountryFromPlaceElement = (place: PlaceAutocompletePlace): string | null => {
  if (!place.addressComponents) return null;

  const countryComponent = place.addressComponents.find(
    (component) => component.types.includes('country')
  );

  return countryComponent?.shortText || null;
};

// Валидация адреса для стран СНГ
export const validateAddressForCIS = (place: google.maps.places.PlaceResult): {
  isValid: boolean;
  countryCode: string | null;
  errorMessage?: string;
} => {
  const countryCode = getCountryFromPlace(place);
  
  if (!countryCode) {
    return {
      isValid: false,
      countryCode: null,
      errorMessage: 'Не удалось определить страну для данного адреса'
    };
  }

  if (!isCISCountry(countryCode)) {
    return {
      isValid: false,
      countryCode,
      errorMessage: 'Доставка возможна только в страны СНГ'
    };
  }

  return {
    isValid: true,
    countryCode
  };
};

// Валидация адреса для стран СНГ (новый API)
export const validateAddressForCISElement = (place: PlaceAutocompletePlace): {
  isValid: boolean;
  countryCode: string | null;
  errorMessage?: string;
} => {
  const countryCode = getCountryFromPlaceElement(place);
  
  if (!countryCode) {
    return {
      isValid: false,
      countryCode: null,
      errorMessage: 'Не удалось определить страну для данного адреса'
    };
  }

  if (!isCISCountry(countryCode)) {
    return {
      isValid: false,
      countryCode,
      errorMessage: 'Доставка возможна только в страны СНГ'
    };
  }

  return {
    isValid: true,
    countryCode
  };
};

// Форматирование адреса
export const formatAddress = (place: google.maps.places.PlaceResult): string => {
  return place.formatted_address || '';
};

// Форматирование адреса (новый API)
export const formatAddressElement = (place: PlaceAutocompletePlace): string => {
  return place.formattedAddress || '';
};

// Получение координат
export const getCoordinates = (place: google.maps.places.PlaceResult): {
  lat: number;
  lng: number;
} | null => {
  const location = place.geometry?.location;
  if (!location) return null;

  return {
    lat: location.lat(),
    lng: location.lng()
  };
};
