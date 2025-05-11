import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import React from 'react';
import ScreenHeader from '../src/components/ScreenHeader';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../store/authSlice';
import {useTheme} from '../src/theme/ThemeProvider';
import CustomText from '../src/components/common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';

// Define types for user data
interface UserData {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  [key: string]: any;
}

const PersonalInfoScreen: React.FC = () => {
  const user = useSelector(selectCurrentUser) as UserData;
  const theme = useTheme();

  // Simple info display component
  const InfoItem = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoContent}>
        <CustomText 
          style={[styles.infoLabel, {color: theme.colors.text.secondary}]}
        >
          {label}
        </CustomText>
        <CustomText 
          style={[styles.infoValue, {color: theme.colors.text.primary}]}
        >
          {value || 'Not provided'}
        </CustomText>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScreenHeader title="Personal Information" />

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <View style={styles.profileSection}>
            <View
              style={[
                styles.avatarContainer,
                { 
                  backgroundColor: theme.isDark 
                    ? theme.colors.background 
                    : theme.colors.primary + '15' 
                },
              ]}>
              {user?.profileImage ? (
                <Image source={{uri: user.profileImage}} style={styles.avatar} />
              ) : (
                <Icon name="account" size={50} color={theme.colors.primary} />
              )}
            </View>

            <View style={styles.nameContainer}>
              <CustomText 
                variant="h2" 
                bold={700} 
                style={{color: theme.colors.text.primary}}
              >
                {user?.firstName} {user?.lastName}
              </CustomText>
              <CustomText style={{color: theme.colors.text.secondary}}>
                {user?.email}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Basic Information Card */}
        <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <View style={styles.sectionHeader}>
            <Icon name="info-circle" size={20} color={theme.colors.primary} />
            <CustomText 
              variant="h3" 
              bold={600} 
              style={{color: theme.colors.text.primary}}
            >
              Personal Details
            </CustomText>
          </View>

          <InfoItem 
            label="First Name" 
            value={user?.firstName || ''} 
            icon="account" 
          />
          
          <InfoItem 
            label="Last Name" 
            value={user?.lastName || ''} 
            icon="account-box" 
          />
          
          <InfoItem 
            label="Email" 
            value={user?.email || ''} 
            icon="mail-box" 
          />
          
          <InfoItem 
            label="Phone" 
            value={user?.phone || ''} 
            icon="phone" 
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 8,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nameContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  }
});

export default PersonalInfoScreen;
