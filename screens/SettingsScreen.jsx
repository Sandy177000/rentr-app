import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../src/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../src/components/common/CustomText';
import CustomButton from '../src/components/common/CustomButton';
import { colors } from '../src/theme/theme';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { resetItems } from '../store/itemsSlice';
import Toast from 'react-native-toast-message';
import { authStorage } from '../src/services';
import ScreenHeader from '../src/components/ScreenHeader';

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authStorage.clearAuth();
      dispatch(logout());
      dispatch(resetItems());
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
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

  const handleContactUs = async () => {
    const url = 'https://www.linkedin.com/in/sandesh-yele-9b6a121bb/';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      const email = 'sandeshyele2000@gmail.com';
      const subject = 'Contact Us';
      const body = 'Hello, I would like to contact you regarding your app.';
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const canMail = await Linking.openURL(mailtoUrl);
      if (!canMail) {
        Alert.alert(
          'Cannot Open Link',
          'Please try again later or contact support directly at sandeshyele2000@gmail.com',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const SettingItem = ({ title, icon, onPress}) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
      ]}
      onPress={onPress}
    >
        <Icon name={icon} size={15} color={theme.colors.text.primary} style={{width: 20, marginRight: 10}}/>
        <CustomText variant="h4" style={[{ color: theme.colors.text.primary }]}>{title}</CustomText>
      <Icon name="chevron-right" size={14} color={theme.colors.text.secondary} style={{marginLeft: 'auto'}} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title={"Settings"}/>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <CustomText variant="h4" bold={600} style={{ color: theme.colors.text.secondary }}>Account</CustomText>
          <SettingItem title="Personal Information" icon="user" onPress={() => { }} />
          <SettingItem title="Notifications" icon="bell" onPress={() => { }} />
        </View>
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <SettingItem title="Theme" icon="moon-o" onPress={() => {
            navigation.navigate('Theme');
           }} />
        </View>
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <SettingItem title="Contact Us" icon="envelope" onPress={handleContactUs} />
        </View>
        <CustomButton variant="primary" type="action" onPress={handleLogout}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <View>
              <CustomText variant="h3" style={{color: colors.white}} bold={800}>
                LOG OUT
              </CustomText>
            </View>
          )}
        </CustomButton>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
  },
  section: {
    marginBottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
    padding: 15,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
    marginHorizontal: 15,
    marginTop: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButton: {
    padding: 15,
  },
  contactButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default SettingsScreen;
