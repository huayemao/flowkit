export interface University {
  id: number;
  name: string;
  city: string;
  province: string;
  coordinates: number[];
  region: string;
  type: string;
  description: string;
}

export interface ProvinceWithCount extends GeoJSON.Feature {
  properties: {
    name: string;
    universityCount?: number;
  };
}

export interface FilterState {
  searchTerm: string;
  selectedProvince: string;
  selectedRegion: string;
  selectedType: string;
}

export type ViewMode = 'map' | 'list' | 'both';