import React, { useEffect, useRef, useState, useCallback } from 'react';
import { initializePlaceAutocompleteElement, validateAddressForCISElement, formatAddressElement } from '@/utils/googleMaps';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

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

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = observer(({
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
  const { t } = useTranslate();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteElementRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const initializingRef = useRef(false);

  // Обработчик выбора места
  const handlePlaceSelect = useCallback(async (event: Event) => {
    const customEvent = event as CustomEvent;
    const place = customEvent.detail.place;
    
    if (!place) return;

    try {
      // Запрашиваем необходимые поля
      await place.fetchFields({
        fields: ['formattedAddress', 'addressComponents']
      });
      
      // Проверяем, что данные получены
      if (place.formattedAddress) {
        // Валидируем адрес для стран СНГ
        const validation = validateAddressForCISElement(place);
        
        if (validation.isValid) {
          const formattedAddress = formatAddressElement(place);
          onChange(formattedAddress);
          onPlaceSelect(place);
          onValidationChange(true);
        } else {
          onValidationChange(false, validation.errorMessage);
        }
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      onValidationChange(false, 'Ошибка получения данных адреса');
    }
  }, [onChange, onPlaceSelect, onValidationChange]);

  // Инициализация Google Maps API
  useEffect(() => {
    // Предотвращаем повторную инициализацию
    if (initializingRef.current || autocompleteElementRef.current) return;

    const initializeAutocomplete = async () => {
      initializingRef.current = true;
      
      try {
        setIsLoading(true);
        const PlaceAutocompleteElement = await initializePlaceAutocompleteElement();
        
        if (inputRef.current && !autocompleteElementRef.current) {
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

            // Добавляем обработчик выбора места
            autocompleteElementRef.current.addEventListener('gmp-placeselect', handlePlaceSelect);
          }

          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing Google Maps PlaceAutocompleteElement:', error);
        onValidationChange(false, 'Ошибка инициализации карт');
      } finally {
        setIsLoading(false);
        initializingRef.current = false;
      }
    };

    initializeAutocomplete();

    // Очистка при размонтировании
    return () => {
      if (autocompleteElementRef.current) {
        autocompleteElementRef.current.removeEventListener('gmp-placeselect', handlePlaceSelect);
        autocompleteElementRef.current.remove();
        autocompleteElementRef.current = null;
      }
      initializingRef.current = false;
      setIsInitialized(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`relative ${className} `}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-col flex-1">
        <label className="text-sm font-medium flex gap-2">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
          <span className="text-sm text-default-500">
            ({t("delivery_by_cng")})
          </span>
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
});

export default AddressAutocomplete;
