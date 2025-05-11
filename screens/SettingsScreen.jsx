import React, {useState, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../src/theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../src/components/common/CustomText';
import CustomButton from '../src/components/common/CustomButton';
import {colors} from '../src/theme/theme';
import {useDispatch, useSelector} from 'react-redux';
import {logout, selectCurrentUser} from '../store/authSlice';
import {resetItems, selectNearByRadius, setNearByRadius} from '../store/itemsSlice';
import Toast from 'react-native-toast-message';
import {authStorage} from '../src/services';
import ScreenHeader from '../src/components/ScreenHeader';
import Slider from '@react-native-community/slider';

// Setting Item Component
const SettingItem = ({title, icon, iconType = 'fontawesome', onPress, right, hasDivider = true}) => {
  const theme = useTheme();
  
  return (
    <>
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.settingLeft}>
          {iconType === 'fontawesome' ? (
            <Icon
              name={icon}
              size={16}
              color={theme.colors.text.primary}
              style={styles.itemIcon}
            />
          ) : (
            <MaterialIcon
              name={icon}
              size={20}
              color={theme.colors.text.primary}
              style={styles.itemIcon}
            />
          )}
          {title && <CustomText variant="h4" style={{color: theme.colors.text.primary}}>
            {title}
          </CustomText>}
        </View>
        
        {right ? (
          right
        ) : onPress ? (
          <Icon
            name="chevron-right"
            size={14}
            color={theme.colors.text.secondary}
          />
        ) : null}
      </TouchableOpacity>
      
      {hasDivider && (
        <View 
          style={[
            styles.divider, 
            {backgroundColor: theme.colors.text.secondary + '20'}
          ]} 
        />
      )}
    </>
  );
};

// Section Header Component
const SectionHeader = ({title, icon}) => {
  const theme = useTheme();
  
  return (
    <View style={styles.sectionHeader}>
      {icon && (
        <Icon
          name={icon}
          size={14}
          color={theme.colors.primary}
          style={{marginRight: 8}}
        />
      )}
      <CustomText
        variant="h4"
        bold={600}
        style={{color: theme.colors.text.secondary}}
      >
        {title}
      </CustomText>
    </View>
  );
};

// Settings Section Component
const SettingsSection = ({title, icon, children}) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
      {title && <SectionHeader title={title} icon={icon} />}
      {children}
    </View>
  );
};

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectCurrentUser);
  const nearByRadius = useSelector(selectNearByRadius);
  const isAdmin = user?.admin;

  // Handler for logging out
  const handleLogout = async () => {
    try {
      setLoading(true);
      await authStorage.clearAuth();
      dispatch(logout());
      dispatch(resetItems());
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (err) {
      console.error('Error during logout:', err);
      Toast.show({
        type: 'error',
        text1: 'Error during logout',
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler for contact us
  const handleContactUs = useCallback(async () => {
    const url = 'https://www.linkedin.com/in/sandesh-yele-9b6a121bb/';
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        const email = 'sandeshyele2000@gmail.com';
        const subject = 'Contact Us';
        const body = 'Hello, I would like to contact you regarding your app.';
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        await Linking.openURL(mailtoUrl);
      }
    } catch (error) {
      Alert.alert(
        'Cannot Open Link',
        'Please try again later or contact support directly at sandeshyele2000@gmail.com',
        [{text: 'OK'}],
      );
    }
  }, []);

  // Slider for nearby radius
  const renderRadiusSlider = () => (
    <View style={styles.sliderContainer}>
      <Slider
        value={nearByRadius}
        onSlidingComplete={value => dispatch(setNearByRadius(value))} // fix this
        minimumValue={1000}
        maximumValue={10000}
        step={1000}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.text.secondary + '30'}
        thumbTintColor={theme.colors.primary}
        style={styles.slider}
      />
      <View style={styles.sliderLabels}>
        <CustomText variant="h5" style={{color: theme.colors.text.secondary}}>
          1km
        </CustomText>
        <CustomText variant="h5" style={{color: theme.colors.text.secondary}}>
          10km
        </CustomText>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <ScreenHeader title={'Settings'} />
      
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Settings */}
        <SettingsSection title="Account" icon="user-circle">
          <SettingItem
            title="Personal Information"
            icon="user"
            onPress={() => navigation.navigate('PersonalInfo')}
          />
          <SettingItem 
            title="Notifications" 
            icon="bell" 
            onPress={() => {}} 
            hasDivider={false}
          />
        </SettingsSection>

        {/* Theme Settings */}
        <SettingsSection title="Appearance" icon="paint-brush">
          <SettingItem
            title="Dark Mode"
            icon={theme.isDark ? "moon-o" : "sun-o"}
            hasDivider={false}
            right={
              <Switch
                value={theme.isDark}
                onValueChange={theme.toggleTheme}
                thumbColor={theme.colors.primary}
                trackColor={{
                  true: theme.colors.primary + '50', 
                  false: '#f4f3f4'
                }}
              />
            }
          />
          
          {isAdmin && (
            <SettingItem
              title="Theme Editor"
              icon="palette"
              iconType="material"
              onPress={() => navigation.navigate('Theme')}
              hasDivider={false}
            />
          )}
        </SettingsSection>

        {/* Location Settings */}
        <SettingsSection title="Nearby Search" icon="map-marker">
          {renderRadiusSlider()}
        </SettingsSection>

        {/* Support & Help */}
        <SettingsSection title="Support" icon="question-circle">
          <SettingItem
            title="Contact Us"
            icon="envelope"
            onPress={handleContactUs}
            hasDivider={false}
          />
        </SettingsSection>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <CustomButton 
            variant="primary" 
            type="action" 
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <View style={styles.logoutButtonContent}>
                <Icon name="sign-out" size={18} color={colors.white} />
                <CustomText 
                  variant="h4" 
                  style={{color: colors.white}} 
                  bold={600}
                >
                  LOG OUT
                </CustomText>
              </View>
            )}
          </CustomButton>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  section: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 24,
    marginRight: 12,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginLeft: 52,
    marginRight: 16,
  },
  sliderContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  slider: {
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 40,
  },
  logoutButton: {
    borderRadius: 30,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default SettingsScreen;
