import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@flowkit/shared-ui';
import { Button } from '@flowkit/shared-ui';
import { Progress } from '@flowkit/shared-ui';
import { Alert, AlertDescription } from '@flowkit/shared-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { UserLocation } from './types';

interface CurrentLocationPanelProps {
  userLocation: UserLocation | null;
  isLocating: boolean;
  locationError: string | null;
  onGetLocation: () => void;
}

const CurrentLocationPanel: React.FC<CurrentLocationPanelProps> = ({
  userLocation,
  isLocating,
  locationError,
  onGetLocation
}) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-cyan-700">实时海拔信息</CardTitle>
        <CardDescription>
          获取您当前位置的精确海拔高度和地理坐标
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          {userLocation ? (
            <>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-8 rounded-full shadow-lg">
                <div className="text-5xl font-bold">{userLocation.altitude}</div>
                <div className="text-xl font-light">米</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">纬度</div>
                  <div className="font-medium text-gray-900">{userLocation.latitude.toFixed(6)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">经度</div>
                  <div className="font-medium text-gray-900">{userLocation.longitude.toFixed(6)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">位置</div>
                  <div className="font-medium text-gray-900">{userLocation.city || '未知'}</div>
                </div>
              </div>
              <div className="text-center text-gray-600">
                {userLocation.region && userLocation.country && (
                  <p>{userLocation.region}, {userLocation.country}</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="text-gray-400">
                <FontAwesomeIcon icon={faLocationDot} size="5x" />
              </div>
              <p className="text-gray-600">尚未获取您的位置信息</p>
            </div>
          )}
          
          {locationError && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          onClick={onGetLocation}
          disabled={isLocating}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {isLocating ? (
            <>
              <Progress className="h-2 mr-2" />
              获取位置中...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
              获取当前位置
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CurrentLocationPanel;