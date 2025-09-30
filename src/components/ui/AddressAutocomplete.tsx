import React, { useEffect, useRef, useState } from 'react';
import { initializePlaceAutocompleteElement, validateAddressForCISElement, formatAddressElement } from '@/utils/googleMaps';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  onValidationChange: (isValid: boolean, errorMessage?: string) => void;
  placeholder?: string;
  label?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
  className?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelect,
  onValidationChange,
  placeholder = "Введите адрес",
  label = "Адрес доставки",
  isInvalid = false,
  errorMessage,
  isRequired = false,
  className = ""
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteElementRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Инициализация Google Maps API
  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        setIsLoading(true);
        const PlaceAutocompleteElement = await initializePlaceAutocompleteElement();
        
        if (inputRef.current) {
          // Создаем новый элемент автодополнения
          autocompleteElementRef.current = new PlaceAutocompleteElement({});
          
          // Настраиваем элемент
          if (autocompleteElementRef.current) {
            autocompleteElementRef.current.setAttribute('placeholder', placeholder);
            autocompleteElementRef.current.setAttribute('restricted-countries', 'ru,by,kz,kg,tj,uz,am,az,ge,md,tm');
            autocompleteElementRef.current.setAttribute('types', 'address');
            
            // Заменяем input на новый элемент
            const parentElement = inputRef.current.parentElement;
            if (parentElement && autocompleteElementRef.current) {
              parentElement.replaceChild(autocompleteElementRef.current, inputRef.current);
            }

            // Обработчик выбора места
            autocompleteElementRef.current.addEventListener('gmp-placeselect', (event: Event) => {
              const customEvent = event as CustomEvent;
              const place = customEvent.detail.place;
              
              if (place && place.formattedAddress) {
                // Валидируем адрес для стран СНГ
                const validation = validateAddressForCISElement(place);
                
                if (validation.isValid) {
                  const formattedAddress = formatAddressElement(place);
                  onChange(formattedAddress);
                  onPlaceSelect(place);
                  onValidationChange(true);
                } else {
                  onValidationChange(false, validation.errorMessage);
                  // Не меняем значение поля, если адрес невалиден
                }
              }
            });
          }

          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing Google Maps PlaceAutocompleteElement:', error);
        onValidationChange(false, 'Ошибка инициализации карт');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAutocomplete();

    // Очистка при размонтировании
    return () => {
      if (autocompleteElementRef.current) {
        autocompleteElementRef.current.remove();
      }
    };
  }, [onChange, onPlaceSelect, onValidationChange, placeholder]);

  return (
    <div className={`relative ${className} `}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-col flex-1">
        <label className="text-sm font-medium mb-2">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
          
        </label>
        
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-solid outline-transparent group-data-[focus-visible=true]:z-10 ${
              isInvalid ? 'border-red-500' : 'border-gray-300'
            } ${!isInitialized ? 'bg-gray-100' : ''}`}
            disabled={!isInitialized}
          />

          <span className="text-sm text-default-500">
            Доставка по СНГ
          </span>
          </div>
          
          {/* <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
          </div> */}
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
      
      {!isInitialized && !isLoading && (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-50 rounded-lg flex items-center justify-center">
          <span className="text-sm text-gray-500">Загрузка карт...</span>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
