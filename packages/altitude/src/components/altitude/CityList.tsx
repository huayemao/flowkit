import React from 'react';
import { ScrollArea } from '@flowkit/shared-ui';
import { CityData } from './types';

interface CityListProps {
  cities: CityData[];
  selectedCities: Set<string>;
  onCitySelect: (cityId: string) => void;
  onCityDeselect: (cityId: string) => void;
}

const CityList: React.FC<CityListProps> = ({ 
  cities, 
  selectedCities, 
  onCitySelect, 
  onCityDeselect 
}) => {
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-2">
        {cities.map(city => (
          <div
            key={city.id}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${selectedCities.has(city.id) ? 'bg-cyan-50 border-l-4 border-cyan-500' : 'hover:bg-gray-50'}`}
            onClick={() => selectedCities.has(city.id) ? onCityDeselect(city.id) : onCitySelect(city.id)}
          >
            <div>
              <p className="font-medium text-gray-900">{city.name}</p>
              <p className="text-sm text-gray-500">{city.country} · {city.continent}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-cyan-600">{city.altitude}m</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CityList;