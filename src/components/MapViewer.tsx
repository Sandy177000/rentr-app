import React, {useState, useEffect, useRef, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import CustomModal from './common/CustomModal';
import OpenStreetMap from './OpenStreetMap';
import {useTheme} from '../theme/ThemeProvider';
import Geolocation from '@react-native-community/geolocation';
import {TLocation} from './types';
import CustomText from './common/CustomText';
import {getLocationName} from '../utils/utils';
import {colors} from '../theme/theme';

type MapViewerProps = {
  showMap: boolean;
  setShowMap: (visible: boolean) => void;
  onLocationSelect: (location: TLocation) => void;
  initialLocation?: TLocation;
};

// Using memo to prevent unnecessary re-renders
const MapViewer = memo(
  ({
    showMap,
    setShowMap,
    onLocationSelect,
    initialLocation,
  }: MapViewerProps) => {
    const theme = useTheme();
    // Store location in a ref to reduce re-renders
    const locationRef = useRef<TLocation>(
      initialLocation || {latitude: 0, longitude: 0, address: ''},
    );
    // State only for UI updates
    const [location, setLocation] = useState<TLocation>(locationRef.current);
    const [isLoading, setIsLoading] = useState(true);
    const [isMapRendered, setIsMapRendered] = useState(false);
    const isInitialMount = useRef(true);

    // Handle location change with minimal re-renders
    const handleLocationChange = (newLocation: TLocation) => {
      locationRef.current = newLocation;
      setLocation(newLocation);
    };

    // Confirm location with visual feedback
    const handleConfirm = async () => {
      setIsLoading(true);
      const locationName = await getLocationName(
        locationRef.current.latitude,
        locationRef.current.longitude,
      );
      onLocationSelect({...locationRef.current, address: locationName});
      setIsLoading(false);
      setShowMap(false);
    };

    // Handle modal close with cleanup
    const handleClose = () => {
      setShowMap(false);
    };

    // Handle back button
    useEffect(() => {
      if (!showMap) return;

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (showMap) {
            handleClose();
            return true;
          }
          return false;
        },
      );

      return () => backHandler.remove();
    }, [showMap]);

    // Get location data
    useEffect(() => {
      if (!showMap) {
        if (!isInitialMount.current) {
          // Reset only when closing after first open
          setIsMapRendered(false);
        }
        return;
      }

      isInitialMount.current = false;
      // If already rendered with valid coords, don't reload
      if (isMapRendered && locationRef.current.latitude !== 0) {
        return;
      }

      // Check for initial location
      if (initialLocation && initialLocation.latitude !== 0) {
        locationRef.current = initialLocation;
        setLocation(initialLocation);
        setIsLoading(false);
        setIsMapRendered(true);
        return;
      }

      // Otherwise load location
      setIsLoading(true);

      const cancelToken = {isCancelled: false};

      Geolocation.getCurrentPosition(
        position => {
          if (cancelToken.isCancelled) {
            return;
          }

          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          locationRef.current = newLocation;
          setLocation(newLocation);
          setIsLoading(false);
          setIsMapRendered(true);
        },
        () => {
          if (cancelToken.isCancelled) {
            return;
          }

          // Default location (Mumbai)
          const defaultLocation = {
            latitude: -1,
            longitude: -1,
          };

          locationRef.current = defaultLocation;
          setLocation(defaultLocation);
          setIsLoading(false);
          setIsMapRendered(true);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 15000,
        },
      );

      // Cleanup function
      return () => {
        cancelToken.isCancelled = true;
      };
    }, [showMap, initialLocation]);

    // Clean up when unmounting
    useEffect(() => {
      return () => {
        if (!showMap) {
          setIsMapRendered(false);
        }
      };
    }, [showMap]);

    if (!showMap) {
      return null;
    }

    return (
      <CustomModal showModal={showMap}>
        <View
          style={[
            styles.container,
            {backgroundColor: theme.colors.background},
          ]}>
          <Text style={[styles.header, {color: theme.colors.text.primary}]}>
            Select Location
          </Text>

          <View style={styles.mapContainer}>
            {!isLoading ? (
              <OpenStreetMap
                latitude={location.latitude}
                longitude={location.longitude}
                height="100%"
                isDraggable={true}
                onLocationSelect={handleLocationChange}
                zoom={14}
              />
            ) : (
              <View
                style={[
                  styles.loadingContainer,
                  {backgroundColor: theme.colors.background},
                ]}>
                <CustomText
                  variant="h4"
                  style={{color: theme.colors.text.secondary}}>
                  Loading map...
                </CustomText>
              </View>
            )}
          </View>

          <View style={styles.instructionContainer}>
            <Text
              style={[
                styles.instruction,
                {color: theme.colors.text.secondary},
              ]}>
              Tap on the map to set your location
            </Text>

            {!isLoading && (
              <View style={styles.coordinatesContainer}>
                <Text
                  style={[
                    styles.coordinatesText,
                    {color: theme.colors.text.primary},
                  ]}>
                  Lat: {location.latitude.toFixed(6)}
                </Text>
                <Text
                  style={[
                    styles.coordinatesText,
                    {color: theme.colors.text.primary},
                  ]}>
                  Long: {location.longitude.toFixed(6)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleClose} style={styles.button}>
              <CustomText
                variant="h4"
                style={{color: theme.colors.text.primary}}>
                CANCEL
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              style={[
                styles.button,
                styles.confirmButton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}>
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <CustomText variant="h4" style={{color: colors.white}}>
                  CONFIRM
                </CustomText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '70%',
    width: '90%',
    borderRadius: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  mapContainer: {
    height: '60%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  instruction: {
    textAlign: 'center',
    marginBottom: 8,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 8,
  },
  coordinatesText: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  confirmButton: {
    flex: 2,
  },
});

export default MapViewer;
