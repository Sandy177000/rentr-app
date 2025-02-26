import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import ColorInput from '../src/components/ColorInput';
import {useTheme} from '../src/theme/ThemeProvider';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {themeColors, themeFonts} from '../src/constants';
import CustomBottomSheet from '../src/components/CustomBottomSheet';
import {processColor} from 'react-native';
import CustomText from '../src/components/common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateUser, updateUserTheme } from '../store/authSlice';
import CustomButton from '../src/components/common/CustomButton';
import Toast from 'react-native-toast-message';
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
    theme.setCustomTheme(prev => ({
      ...prev,
      font: key,
    }));
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
        text1: 'Theme applied successfully',
      });
    } catch (error) { 
      console.log('Error applying theme:', error);
      Toast.show({
        type: 'error',
        text1: 'Error applying theme',
        text2: error.message,
      });
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <CustomButton
        variant="primary"
        type="action"
        onPress={() => theme.setCustomTheme({colors: theme.colors, fonts: theme.fonts})}>
        <Icon name="refresh" size={20} color="#ffffff" />
        <CustomText style={[styles.buttonText, {color: '#ffffff'}]}>
          Reset
        </CustomText>
      </CustomButton>

      <CustomButton
        variant="primary"
        type="action"
        onPress={handleApplyTheme}>
        <Icon name="save" size={20} color="#ffffff" />
        <CustomText style={[styles.buttonText, {color: '#ffffff'}]}>
          Save
        </CustomText>
      </CustomButton>
    </View>
  );

  const renderThemeToggle = () => (
    <View style={[styles.themeToggleContainer, {backgroundColor: theme.colors.surface}]}>
      <Icon
        name={theme.isDark ? 'moon-o' : 'sun-o'}
        size={24}
        color={theme.colors.text.primary}
      />
      <CustomText variant="h4" bold={800} style={{color: theme.colors.text.primary}}>
        {theme.isDark ? 'Dark Theme' : 'Light Theme'}
      </CustomText>
      <Switch
        value={theme.isDark}
        onValueChange={theme.toggleTheme}
        thumbColor={theme.colors.primary}
        trackColor={{true: theme.colors.primary + '50', false: '#f4f3f4'}}
      />
    </View>
  );

  return (
    <>
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        contentContainerStyle={styles.contentContainer}>
        {renderHeader()}
        {renderThemeToggle()}
        
        <View style={styles.sectionsContainer}>
          <CustomButton
            variant="primary"
            type="action"
            style={{backgroundColor: theme.colors.surface, gap: 10}}
            onPress={() => setColorsVisible(true)}>
            <Icon name="paint-brush" size={15} color={theme.colors.primary} />
            <CustomText variant="h4" bold={800} style={{color: theme.colors.text.primary}}>
              Color Scheme
            </CustomText>
          </CustomButton>

          <CustomButton
            variant="primary"
            type="action"
            style={{backgroundColor: theme.colors.surface, gap: 10}}
            onPress={() => setFontsVisible(true)}>
            <Icon name="font" size={15} color={theme.colors.primary} />
            <CustomText variant="h4" bold={800} style={{color: theme.colors.text.primary}}>
              Typography
            </CustomText>
          </CustomButton>
        </View>
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
              variant="primary"
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 10,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  themeToggleText: {
    marginLeft: 10,
  },
  sectionsContainer: {
    marginTop: 20,
    gap: 10,
  },
  sectionCard: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  sectionSubtitle: {
    marginLeft: 10,
  },
  fontPreview: {
    padding: 1,
  },
});
