import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ColorInput from '../src/components/ColorInput';
import {useTheme} from '../src/theme/ThemeProvider';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {themeColors, themeFonts} from '../src/constants';
import CustomBottomSheet from '../src/components/CustomBottomSheet';
import {processColor} from 'react-native';
import CustomText from '../src/components/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateUser } from '../store/authSlice';

export default function ThemeScreen() {
  const theme = useTheme();
  const user = useSelector(state => state.auth.user);
  const fontsBottomSheetRef = useRef(null);
  const [fontsVisible, setFontsVisible] = useState(false);
  const colorsBottomSheetRef = useRef(null);
  const [colorsVisible, setColorsVisible] = useState(false);
  const dispatch = useDispatch();

  const updateColor = (path, value) => {
    try {

      // Validate color using React Native's built-in processor
      const processed = processColor(value);
      if (typeof processed !== 'number') {
        Alert.alert(
          'Invalid Color',
          'Please enter a valid color name, hex code, or RGB value'
        );
        return;
      } else {
        
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
      }
    } catch (error) {
      Alert.alert('Error changing color:', error.message);
      console.log('Error changing color:', error);
    }
  };

  const updateFont = (key, value) => {
    theme.setCustomTheme(prev => ({
      ...prev,
      font: key,
    }));
  };

  const handleApplyTheme = () => {
    console.log('Applying theme');
    const themeToApply = {...theme.customTheme, ...theme.isDark ? theme.customTheme.darkTheme : theme.customTheme.lightTheme};
    // Create theme object with both light and dark themes
    dispatch(updateUser({...user, theme: themeToApply }));

    // send theme to backend and update user
  };

  return (
    <>
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.button, styles.shadow, {backgroundColor: theme.colors.primary}]}
            onPress={() => theme.setCustomTheme({colors: theme.colors, fonts: theme.fonts})}>
            <Icon name="refresh" size={20} color={theme.colors.text.primary} />
            <CustomText style={[styles.buttonText, {color: theme.colors.text.primary}]}>
              Reset
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.shadow, {backgroundColor: theme.colors.primary}]}
            onPress={handleApplyTheme}>
            <Icon name="save" size={20} color={theme.colors.text.primary} />
            <CustomText style={[styles.buttonText, {color: theme.colors.text.primary}]}>
              Save
            </CustomText>
          </TouchableOpacity>
        </View>

        <View style={[styles.themeToggleContainer, styles.shadow, {backgroundColor: theme.colors.surface}]}>
          <Icon
            name={theme.isDark ? 'moon-o' : 'sun-o'}
            size={24}
            color={theme.colors.text.primary}
          />
          <CustomText style={[styles.themeToggleText, {color: theme.colors.text.primary}]}>
            {theme.isDark ? 'Dark Theme' : 'Light Theme'}
          </CustomText>
          <Switch
            value={theme.isDark}
            onValueChange={theme.toggleTheme}
            thumbColor={theme.colors.primary}
            trackColor={{true: theme.colors.primary + '50', false: '#f4f3f4'}}
          />
        </View>

        <View style={styles.sectionsContainer}>
          <TouchableOpacity
            style={[styles.sectionCard, styles.shadow, {backgroundColor: theme.colors.surface}]}
            onPress={() => setColorsVisible(true)}>
            <View style={styles.sectionHeader}>
              <Icon name="paint-brush" size={15} color={theme.colors.primary} />
              <CustomText style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
                Color Scheme
              </CustomText>
            </View>
            <CustomText style={[styles.sectionSubtitle, {color: theme.colors.text.secondary}]}>
              Tap to customize colors
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionCard, styles.shadow, {backgroundColor: theme.colors.surface}]}
            onPress={() => setFontsVisible(true)}>
            <View style={styles.sectionHeader}>
              <Icon name="font" size={15} color={theme.colors.primary} />
              <CustomText style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
                Typography
              </CustomText>
            </View>
            <View style={styles.fontPreview}>
              <CustomText style={{color: theme.colors.text.secondary, fontFamily: theme.font}}>
                Current Font:{theme.font}
              </CustomText>
            </View>
          </TouchableOpacity>
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
              value={item.path
                .split('.')
                .reduce((acc, part) => acc[part], theme.colors)}
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
            <TouchableOpacity
              style={{padding: 10}}
              onPress={() => {
                updateFont(item.path, item.label);
                setFontsVisible(false);
              }}>
              <CustomText
                style={{
                  color: theme.colors.text.primary,
                  fontFamily: item.path,
                }}>
                {item.label}
              </CustomText>
            </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 15,
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
  },
  sectionCard: {
    padding: 15,
    borderRadius: 10,
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
    padding: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
