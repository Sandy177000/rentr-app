import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import ColorInput from '../src/components/ColorInput';
import {useTheme} from '../src/theme/ThemeProvider';
import {useDispatch, useSelector} from 'react-redux';
import {colors, themeColors, themeFonts} from '../src/constants';
import CustomBottomSheet from '../src/components/CustomBottomSheet';
import {processColor} from 'react-native';
import CustomText from '../src/components/common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import {updateUser, updateUserTheme} from '../store/authSlice';
import CustomButton from '../src/components/common/CustomButton';
import Toast from 'react-native-toast-message';
import {darkTheme, lightTheme} from '../src/theme/theme';

export default function ThemeScreen() {
  const theme = useTheme();
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  
  const fontsBottomSheetRef = useRef(null);
  const colorsBottomSheetRef = useRef(null);
  const [fontsVisible, setFontsVisible] = useState(false);
  const [colorsVisible, setColorsVisible] = useState(false);

  const updateColor = (path, value) => {
    try {
      const processed = processColor(value);
      if (typeof processed !== 'number') {
        Alert.alert(
          'Invalid Color',
          'Please enter a valid color name, hex code, or RGB value'
        );
        return;
      }

      theme.setCustomTheme(prev => {
        if (path.includes('.')) {
          const [parent, child] = path.split('.');
          return {
            ...prev,
            colors: {
              ...prev.colors,
              [parent]: {
                ...prev.colors[parent],
                [child]: value,
              },
            },
          };
        }
        return {
          ...prev,
          colors: {
            ...prev.colors,
            [path]: value,
          },
        };
      });
    } catch (error) {
      Alert.alert('Error changing color:', error.message);
      console.log('Error changing color:', error);
    }
  };

  const updateFont = (key) => {
    try {
      theme.setCustomTheme(prev => ({
        ...prev,
        font: key,
      }));
      Toast.show({
        type: 'success',
        text1: 'Font changed successfully',
      });
    } catch (error) {
      console.log('Error changing font:', error);
      Toast.show({
        type: 'error',
        text1: 'Error Changing font',
      });
    }
  };

  const handleApplyTheme = async () => {
    try {
      const {isDark} = theme;
      let themeToApply;
      if(isDark) {
        themeToApply = {
          lightTheme: user.theme.lightTheme,
          darkTheme: theme.customTheme,
        };
      } else {
        themeToApply = {
          darkTheme: user.theme.darkTheme,
          lightTheme: theme.customTheme,
        };
      }
      dispatch(updateUser({...user, theme: themeToApply}));
      await dispatch(updateUserTheme(themeToApply)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Theme Saved successfully',
      });
    } catch (error) { 
      console.log('Error applying theme:', error);
      Toast.show({
        type: 'error',
        text1: 'Error Saving theme',
        text2: error.message,
      });
    }
  };

  const handleResetTheme = async () => {
    try {
      const themeToApply =  {
          lightTheme: lightTheme,
          darkTheme: darkTheme,
      };
      dispatch(updateUser({...user, theme: themeToApply}));
      await dispatch(updateUserTheme(themeToApply)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Theme Reset successfully',
      });
    } catch (error) {
      console.log('Error resetting theme:', error);
      Toast.show({
        type: 'error',
        text1: 'Error Resetting theme',
        text2: error.message,
      });
    }
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer, {backgroundColor: theme.colors.surface}]}>
    
        <CustomButton
          variant="secondary"
          type="action"
          style={styles.headerButton}
          onPress={handleResetTheme}>
          <Icon name="refresh" size={16} color={theme.colors.text.primary} />
          <CustomText variant="h4" style={{color: theme.colors.text.primary}}>Reset</CustomText>
        </CustomButton>

        <CustomButton
          variant="primary"
          type="action"
          style={styles.headerButton}
          onPress={handleApplyTheme}>
          <Icon name="save" size={16} color={colors.white} />
          <CustomText variant="h4" style={{color: colors.white}}>Save</CustomText>
        </CustomButton>
    </View>
  );

  const renderThemeToggle = () => (
    <View style={[styles.themeToggleContainer, {backgroundColor: theme.colors.surface}]}>
      <View style={styles.themeToggleLeft}>
        <Icon
          name={theme.isDark ? 'moon-o' : 'sun-o'}
          size={24}
          color={theme.colors.text.primary}
        />
        <CustomText variant="h4" bold={600} style={{color: theme.colors.text.primary}}>
          {theme.isDark ? 'Dark Theme' : 'Light Theme'}
        </CustomText>
      </View>
      <Switch
        value={theme.isDark}
        onValueChange={theme.toggleTheme}
        thumbColor={theme.colors.primary}
        trackColor={{true: theme.colors.primary + '50', false: '#f4f3f4'}}
      />
    </View>
  );

  const renderCustomizationSection = () => (
    <View style={styles.customizationContainer}>
      <CustomText 
        variant="h4" 
        bold={600} 
        style={[styles.sectionTitle, {color: theme.colors.text.primary}]}
      >
        Customization
      </CustomText>
      
      <View style={styles.customizationButtons}>
        <CustomButton
          variant="secondary"
          type="action"
          style={[styles.customizationButton, {backgroundColor: theme.colors.surface}]}
          onPress={() => setColorsVisible(true)}>
          <Icon name="paint-brush" size={20} color={theme.colors.primary} />
          <CustomText style={{color: theme.colors.text.primary}}>
            Color Scheme
          </CustomText>
        </CustomButton>

        <CustomButton
          variant="secondary"
          type="action"
          style={[styles.customizationButton, {backgroundColor: theme.colors.surface}]}
          onPress={() => setFontsVisible(true)}>
          <Icon name="font" size={20} color={theme.colors.primary} />
          <CustomText style={{color: theme.colors.text.primary}}>
            Typography
          </CustomText>
        </CustomButton>
      </View>
    </View>
  );

  return (
    <>
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        contentContainerStyle={styles.contentContainer}>
        {renderThemeToggle()}
        {renderCustomizationSection()}
        {renderHeader()}
      </ScrollView>

      {colorsVisible && (
        <CustomBottomSheet
          bottomSheetRef={colorsBottomSheetRef}
          theme={theme}
          data={themeColors}
          title="Colors"
          showCloseButton={true}
          renderItem={({item}) => (
            <ColorInput
              key={item.path}
              label={item.label}
              value={item.path.split('.').reduce((acc, part) => acc[part], theme.colors)}
              path={item.path}
              onChangeColor={updateColor}
            />
          )}
          visible={colorsVisible}
          setVisible={setColorsVisible}
        />
      )}

      {fontsVisible && (
        <CustomBottomSheet
          bottomSheetRef={fontsBottomSheetRef}
          theme={theme}
          data={themeFonts}
          title="Fonts"
          showCloseButton={true}
          renderItem={({item}) => (
            <CustomButton
              variant=""
              type="action"
              style={{padding: 10}}
              onPress={() => {
                updateFont(item.path);
                setFontsVisible(false);
              }}>
              <CustomText
                style={{
                  color: theme.colors.text.primary,
                  fontFamily: item.path,
                }}>
                {item.label}
              </CustomText>
            </CustomButton>
          )}
          visible={fontsVisible}
          setVisible={setFontsVisible}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  themeToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customizationContainer: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  customizationButtons: {
    gap: 12,
  },
  customizationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
});
