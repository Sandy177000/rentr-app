import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../src/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../src/components/common/CustomText';
import CustomButton from '../src/components/common/CustomButton';
import { colors } from '../src/theme/theme';
import globalStyles from '../src/theme/global.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      dispatch(logout());
      navigation.replace('Login');
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setLoading(false);
    }
  };

  const SettingItem = ({ title, icon, onPress, showBorder = true }) => (
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
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <CustomText variant="h4" bold={600} style={{ color: theme.colors.text.secondary }}>Account</CustomText>
          <SettingItem title="Personal Information" icon="user" onPress={() => { }} />
          <SettingItem title="Notifications" icon="bell" onPress={() => { }} showBorder={false} />
          <SettingItem title="Module" icon="list" onPress={() => { }} />
        </View>
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <CustomText variant="h4" bold={600} style={{ color: theme.colors.text.secondary }}>Preferences</CustomText>
          <SettingItem title="Theme" icon="moon-o" onPress={() => {
            navigation.navigate('Theme');
           }} />
          <SettingItem title="Language" icon="globe" onPress={() => { }} showBorder={false} />
        </View>
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <CustomText variant="h4" bold={600} style={{ color: theme.colors.text.secondary }}>Support</CustomText>
          <SettingItem title="Help Center" icon="question-circle" onPress={() => { }} />
          <SettingItem title="Contact Us" icon="envelope" onPress={() => { }} />
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
    padding: 5,
  },
  section: {
    marginBottom: 20,
    ...globalStyles.borderRadius,
    overflow: 'hidden',
    padding: 8,
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
});

export default SettingsScreen;
