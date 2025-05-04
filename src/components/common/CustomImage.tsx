import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { placeholderImage } from '../../constants';

type CustomImageProps = {
  source: string;
  style: any;
  overlay?: boolean;
  placeholder?: string;
  showLoading?: boolean;
}
const CustomImage = ({source, style, overlay, placeholder, showLoading = true}: CustomImageProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const theme = useTheme();
  return (
    <>
      <FastImage
        source={{uri: source || placeholder || placeholderImage}}
        style={style}
        resizeMode={FastImage.resizeMode.cover}
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
        onError={() => setImageLoading(false)}
      />
      {showLoading && imageLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      {overlay && <View style={styles.imageContainer}/>}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
});

export default CustomImage;