import React, {memo, useRef, useState, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import {useTheme} from '../theme/ThemeProvider';
import { TLocation } from './types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isAndroid } from '../utils/utils';

type OpenStreetMapProps = {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: number | string;
  isDraggable?: boolean;
  onLocationSelect?: (location: TLocation) => void;
};

const OpenStreetMap = memo(
  ({
    latitude,
    longitude,
    zoom = 13,
    height = 300,
    isDraggable = true,
    onLocationSelect,
  }: OpenStreetMapProps) => {
    const theme = useTheme();
    const webViewRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentZoom, setCurrentZoom] = useState(zoom);

    // Very simple HTML - fewer features = better performance
    const mapHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body, html { margin: 0; padding: 0; height: 100%; }
    #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css">
  <script>
    var map, marker;
    
    function initMap() {
      map = L.map('map', {
        attributionControl: false,
        zoomControl: false,
        dragging: ${isDraggable}
      }).setView([${latitude}, ${longitude}], ${currentZoom});
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      
      marker = L.marker([${latitude}, ${longitude}], {
        draggable: ${isDraggable}
      }).addTo(map);
      
      map.on('zoomend', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'zoom',
          zoom: map.getZoom()
        }));
      });
      
      if (${isDraggable}) {
        marker.on('dragend', function() {
          var pos = marker.getLatLng();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'location',
            latitude: pos.lat,
            longitude: pos.lng
          }));
        });
        
        map.on('click', function(e) {
          marker.setLatLng(e.latlng);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'location',
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          }));
        });
      }
      
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'ready'}));
    }
    
    function zoomMap(level) {
      if (map) {
        map.setZoom(level);
      }
    }
    
    document.addEventListener('DOMContentLoaded', initMap);
  </script>
</body>
</html>
  `;

    const handleMessage = (event: {nativeEvent: {data: string}}) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === 'ready') {
          setIsLoading(false);
          return;
        }

        if (data.type === 'zoom') {
          setCurrentZoom(data.zoom);
          return;
        }

        if (data.type === 'location' && onLocationSelect) {
          onLocationSelect({
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
      } catch (e) {
        // Silent error handling
      }
    };

    const handleZoomIn = () => {
      const newZoom = Math.min(18, currentZoom + 1);
      setCurrentZoom(newZoom);
      webViewRef.current?.injectJavaScript(`zoomMap(${newZoom}); true;`);
    };

    const handleZoomOut = () => {
      const newZoom = Math.max(1, currentZoom - 1);
      setCurrentZoom(newZoom);
      webViewRef.current?.injectJavaScript(`zoomMap(${newZoom}); true;`);
    };

    // Critical: Clean up WebView when component unmounts
    useEffect(() => {
      return () => {
        if (webViewRef.current) {
          if (isAndroid()) {
            webViewRef.current.clearCache(true);
          }
          webViewRef.current = null;
        }
      };
    }, []);

    return (
      <View style={[styles.container, {height}]}>
        <WebView
          ref={webViewRef}
          source={{html: mapHTML}}
          style={styles.webView}
          onMessage={handleMessage}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          bounces={false}
          startInLoadingState={true}
          overScrollMode="never"
          onLoadEnd={() => setIsLoading(false)}
          // Important: These minimize memory usage
          injectedJavaScriptBeforeContentLoaded={`
          window.isActive = true;
          true;
        `}
          injectedJavaScript={`
          window.isActive = true;
          true;
        `}
        />

        {!isLoading && (
          <View style={styles.zoomControls}>
            <TouchableOpacity 
              style={[styles.zoomButton, {backgroundColor: theme.colors.primary}]} 
              onPress={handleZoomIn}
            >
              <Icon name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.zoomButton, {backgroundColor: theme.colors.primary}]} 
              onPress={handleZoomOut}
            >
              <Icon name="remove" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {isLoading && (
          <View
            style={[
              styles.loaderContainer,
              {backgroundColor: theme.colors.background},
            ]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 8,
    position: 'relative'
  },
  webView: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomControls: {
    position: 'absolute',
    right: 10,
    bottom: 40,
    flexDirection: 'column',
    gap: 10,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  }
});

export default OpenStreetMap;
