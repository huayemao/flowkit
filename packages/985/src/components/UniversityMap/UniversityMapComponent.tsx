import React, { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import chinaProvincesJson from '../../../public/resources/china-provinces.json';
import { University, ViewMode } from '../../types/university';
import { universityData, MAPBOX_ACCESS_TOKEN } from '../../constants/university';
import { generateColorScale, getMapStyle, normalizeProvinceName } from '../../utils/universityUtils';

interface UniversityMapComponentProps {
  universities: University[];
  selectedUniversity: University | null;
  viewMode: ViewMode;
  isDark: boolean;
  onUniversitySelect: (university: University) => void;
  onMapLoad: () => void;
}

const UniversityMapComponent: React.FC<UniversityMapComponentProps> = ({
  universities,
  selectedUniversity,
  viewMode,
  isDark,
  onUniversitySelect,
  onMapLoad
}) => {
  const [colorScale, setColorScale] = useState<Record<string, string>>({});

  console.log(universities);

  useEffect(() => {
    setColorScale(generateColorScale(isDark));
  }, [isDark]);

  if (viewMode === 'list') return null;

  // 处理标记点击
  const handleMarkerClick = (e: any, university: University) => {
    e.stopPropagation();
    onUniversitySelect(university);
  };

  return (
    <div className="w-full h-[70vh] relative rounded-xl overflow-hidden shadow-lg transition-all duration-500">
      <Map
        interactive={false}
        style={{ width: '100%', height: '100%' }}
        onLoad={(event) => {
          // 适应 geojson 内容，确保完整显示中国所有省份
          const map = event.target;
          
          // 创建边界对象
          const bounds = new mapboxgl.LngLatBounds();
          
          // 遍历所有省份要素，扩展边界
          chinaProvincesJson.features.forEach((feature: any) => {
            // 确保几何体存在
            if (feature.geometry && feature.geometry.coordinates) {
              // 根据不同的几何体类型处理坐标
              const coordinates = feature.geometry.coordinates;
              
              // 处理多边形（MultiPolygon）
              if (feature.geometry.type === 'MultiPolygon') {
                coordinates.forEach((polygon: any) => {
                  polygon[0].forEach((coord: any) => {
                    bounds.extend(coord);
                  });
                });
              }
              // 处理多边形（Polygon）
              else if (feature.geometry.type === 'Polygon') {
                coordinates[0].forEach((coord: any) => {
                  bounds.extend(coord);
                });
              }
            }
          });
          
          // 优化地图显示，减少内边距，确保内容更大
          map.fitBounds(bounds, { 
            padding: 5, // 进一步减少内边距
            maxZoom: 6,  // 提高最大缩放级别
            linear: true,
            easing: (t) => t
          });
          
          onMapLoad();
        }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        {/* 添加中国省份GeoJSON图层 - 根据大学数量设置颜色深度 */}
        {chinaProvincesJson && (
          <Source
            id="provinces"
            type="geojson"
            data={{
              ...chinaProvincesJson,
              features: chinaProvincesJson.features.map((feature: any) => {
                const provinceName = normalizeProvinceName(feature.properties.name);
                return {
                  ...feature,
                  properties: {
                    ...feature.properties,
                    universityCount: feature.properties.universityCount || 0,
                    fillColor: colorScale[provinceName] || (isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'),
                  },
                };
              }),
            }}
          >
            <Layer
              id="provinces-fill"
              type="fill"
              source="provinces"
              paint={{
                'fill-color': ['get', 'fillColor'],
                'fill-opacity': 1,
                'fill-outline-color': isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(30, 58, 138, 0.3)',
              }}
              layout={{
                visibility: 'visible',
              }}
            />
            <Layer
              id="provinces-line"
              type="line"
              source="provinces"
              paint={{
                'line-color': isDark ? '#3b82f6' : '#1e3a8a',
                'line-width': 1,
                'line-opacity': 0.7,
              }}
            />
          </Source>
        )}

        {/* 添加大学标记 */}
        {universities.map((university) => (
          <Marker
            key={university.id}
            longitude={university.coordinates[1]}
            latitude={university.coordinates[0]}
            onClick={(e) => handleMarkerClick(e, university)}
          >
            <div
              className={`w-4 h-4 rounded-full cursor-pointer transform transition-all duration-300 hover:scale-150 ${selectedUniversity?.id === university.id ? 'bg-red-500 ring-2 ring-white dark:ring-gray-800' : 'bg-blue-500'}`}
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
              title={university.name}
            />
          </Marker>
        ))}
      </Map>

      {/* 图例 */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg z-10 max-w-xs backdrop-blur-sm">
        <p className="text-sm font-medium mb-3">省份颜色深浅表示大学数量</p>
        <div className="flex items-center space-x-3">
          <div className="h-4 w-32 bg-gradient-to-r from-blue-100 to-blue-400 dark:from-blue-900 dark:to-blue-600 rounded-sm transition-all duration-300"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            少到多
          </span>
        </div>
      </div>
    </div>
  );
};

export default UniversityMapComponent;