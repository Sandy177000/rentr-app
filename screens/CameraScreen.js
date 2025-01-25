import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';

export default function CameraScreen() {
    const device = useCameraDevice('front')
    const { hasPermission } = useCameraPermission()
  
    if (!hasPermission) return ;
    if (device == null) return ;
    const options = {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
        saveToPhotos: true,
      };
    return (
        <View style={styles.container}> 
            <Camera
                style={styles.preview}
                device={device}
                isActive={true}
            />
            <View style={styles.buttonContainer}>  
                <Text>Select Photo</Text>
                {/* {launchImageLibrary(options)} */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
  },
  preview: {
    width: '100%',
    height: '50%',
    borderRadius: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
  },
});
