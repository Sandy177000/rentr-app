import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../src/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../src/components/CustomText';

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const SettingItem = ({ title, icon, onPress, showBorder = true }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          borderBottomWidth: showBorder ? 1 : 0,
          borderBottomColor: theme.colors.border
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.settingContent}>
        <Icon name={icon} size={20} color={theme.colors.text.primary} />
        <CustomText style={[styles.settingText, { color: theme.colors.text.primary }]}>{title}</CustomText>
      </View>
      <Icon name="chevron-right" size={14} color={theme.colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <CustomText style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Account</CustomText>
          <SettingItem title="Personal Information" icon="user" onPress={() => { }} />
          <SettingItem title="Payment Methods" icon="credit-card" onPress={() => { }} />
          <SettingItem title="Notifications" icon="bell" onPress={() => { }} showBorder={false} />
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <CustomText style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Preferences</CustomText>
          <SettingItem title="Theme" icon="moon-o" onPress={() => {
            navigation.navigate('Theme');
           }} />
          <SettingItem title="Language" icon="globe" onPress={() => { }} showBorder={false} />
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <CustomText style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Support</CustomText>
          <SettingItem title="Help Center" icon="question-circle" onPress={() => { }} />
          <SettingItem title="Contact Us" icon="envelope" onPress={() => { }} />
          <SettingItem title="Privacy Policy" icon="lock" onPress={() => { }} />
          <SettingItem title="Terms of Service" icon="file-text-o" onPress={() => { }} showBorder={false} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    borderRadius: 12,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginHorizontal: 15,
    marginTop: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
  },
});

export default SettingsScreen; 