import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@heroui/react';
import { useTranslate } from '@/utils/useTranslate';
import './GooglePlacesAutocomplete.css';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  label?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder,
  label,
  isInvalid,
  errorMessage,
  isRequired = false,
}) => {
  const { t } = useTranslate();
//   const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<google.maps.places.PlacesService | null>(null);

  // Коды стран СНГ
  const CIS_COUNTRIES = [
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

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const { Loader } = await import('@googlemaps/js-api-loader');
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          version: 'weekly',
          libraries: ['places'],
        });

        await loader.load();
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setLoadError('Не удалось загрузить Google Maps. Проверьте подключение к интернету.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google?.maps?.places) return;

    const options: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: CIS_COUNTRIES },
      fields: ['formatted_address', 'geometry', 'name', 'place_id'],
      types: ['address'],
    };

    const autocompleteInstance = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    // Создаем сервис для получения детальной информации о месте
    const map = new google.maps.Map(document.createElement('div'));
    serviceRef.current = new google.maps.places.PlacesService(map);

    // setAutocomplete(autocompleteInstance);

    const listener = autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();
      
      if (place.formatted_address) {
        onChange(place.formatted_address);
        onPlaceSelect?.(place);
      }
    });

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [isLoaded, onChange, onPlaceSelect]);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
  };

  // Показываем ошибку загрузки, если есть
  const displayError = loadError || errorMessage;
  const isInputInvalid = isInvalid || !!loadError;

  return (
    <div className="w-full">
      <Input
        ref={inputRef}
        label={label}
        labelPlacement="outside-top"
        placeholder={isLoading ? 'Google maps...' : placeholder}
        value={value}
        onValueChange={handleInputChange}
        isInvalid={isInputInvalid}
        errorMessage={displayError}
        isRequired={isRequired}
        className="w-full"
        isDisabled={isLoading}
        description={isLoaded ? t("start_typing_address") : undefined}
      />
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">
          Загрузка Google Maps API...
        </div>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;
