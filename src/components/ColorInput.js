import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import ColorPicker, {
  Panel1,
  Preview,
  HueSlider
} from 'reanimated-color-picker';
import { useTheme } from '../theme/ThemeProvider';
import CustomText from './common/CustomText';
const ColorInput = ({ label, value, path, onChangeColor }) => {
  const theme = useTheme();
  const [pickerVisible, setPickerVisible] = useState(false);
  const pickerHeight = useState(new Animated.Value(0))[0];

  const togglePicker = () => {
    Animated.timing(pickerHeight, {
      toValue: pickerVisible ? 0 : 300,
      duration: 300,
      useNativeDriver: false
    }).start();
    setPickerVisible(!pickerVisible);
  };

  const handleColorChange = (color) => {
    onChangeColor(path, color.hex);
  };

  const handleTextInputChange = (text) => {
    try {
      onChangeColor(path, text);
    } catch (error) {
      console.log('Error changing color:', error);
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={[styles.label, { color: theme.colors.text.primary }]}>
        {label}
      </CustomText>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text.primary,
            }
          ]}
          value={value}
          onChangeText={handleTextInputChange}
          placeholderTextColor={theme.colors.text.secondary}
        />
        
        <TouchableOpacity 
          onPress={togglePicker}
          accessibilityLabel={`Open color picker for ${label.toLowerCase()}`}
        >
          <View 
            style={[
              styles.colorPreview, 
              { 
                backgroundColor: value,
                borderColor: theme.colors.border 
              }
            ]} 
          />
        </TouchableOpacity>
      </View>

      <Animated.View style={{ height: pickerHeight, overflow: 'hidden'}}>
        <ColorPicker
          style={styles.picker}
          value={value}
          onComplete={handleColorChange}
        >
          <HueSlider />
          <Preview />
          <Panel1 />
        </ColorPicker>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  label: {
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1
  },
  picker: {
    width: '100%',
    paddingTop: 16,
    gap: 12
  }
});

export default ColorInput;
