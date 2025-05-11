import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenHeader from '../src/components/ScreenHeader';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentUser, updateUserData} from '../store/authSlice';
import {useTheme} from '../src/theme/ThemeProvider';
import CustomText from '../src/components/common/CustomText';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define types for user data
interface UserData {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  profileImage?: string;
  [key: string]: any; // For any additional properties
}

// Define types for form data
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  bio: string;
}

// Define types for form errors
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  [key: string]: string | undefined;
}

// Define types for the form field props
interface FormFieldProps {
  label: string;
  field: keyof FormData;
  placeholder: string;
  icon: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  maxLength?: number;
}

const PersonalInfoScreen: React.FC = () => {
  const user = useSelector(selectCurrentUser) as UserData;
  const theme = useTheme();
  const dispatch = useDispatch();

  // Create state for form data
  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    bio: user?.bio || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Update form data if user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  // Handle field changes
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (formData.firstName.trim() === '') {
      newErrors.firstName = 'First name is required';
    }

    if (formData.lastName.trim() === '') {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^[0-9+\s()-]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Please fix the errors',
        text2: 'Some fields need your attention',
      });
      return;
    }

    try {
      setIsSaving(true);

      // Create updated user object maintaining the structure
      const updatedUser: UserData = {
        ...user,
        ...formData,
      };

      // Dispatch the update action
      await dispatch(updateUserData(updatedUser) as any);

      Toast.show({
        type: 'success',
        text1: 'Profile updated',
        text2: 'Your information has been saved',
      });

      setIsEditing(false);
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: e.message || 'Please try again later',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form to original user data
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || '',
      bio: user?.bio || '',
    });
    setErrors({});
  };

  // Input field component
  const FormField: React.FC<FormFieldProps> = ({
    label,
    field,
    placeholder,
    icon,
    multiline = false,
    keyboardType = 'default',
    maxLength,
  }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.labelContainer}>
        <Icon
          name={icon}
          size={18}
          color={theme.colors.primary}
          style={styles.fieldIcon}
        />
        <CustomText
          variant="h5"
          bold={600}
          style={{color: theme.colors.text.secondary}}>
          {label}
        </CustomText>
      </View>

      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary,
            borderColor: errors[field]
              ? theme.colors.error
              : isEditing 
                ? theme.colors.primary + '40'
                : theme.colors.text.secondary + '20',
            borderWidth: isEditing ? 1.5 : 1,
          },
        ]}
        value={formData[field]}
        onChangeText={(value) => handleChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.secondary + '80'}
        editable={isEditing}
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />

      {errors[field] && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={14} color={theme.colors.error} />
          <CustomText style={[styles.errorText, {color: theme.colors.error}]}>
            {errors[field]}
          </CustomText>
        </View>
      )}
    </View>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScreenHeader title="Personal Information" />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
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
              <CustomText variant="h2" bold={700} style={{color: theme.colors.text.primary}}>
                {user?.firstName} {user?.lastName}
              </CustomText>
              <CustomText style={{color: theme.colors.text.secondary}}>
                {user?.email}
              </CustomText>
            </View>
          </View>

          {/* Edit/Save Buttons */}
          <View style={styles.editButtonContainer}>
            {!isEditing ? (
              <TouchableOpacity
                style={[
                  styles.editButton,
                  {backgroundColor: theme.colors.primary},
                ]}
                onPress={() => setIsEditing(true)}>
                <Icon name="pencil" size={18} color="#FFF" />
                <CustomText style={styles.buttonText}>Edit Profile</CustomText>
              </TouchableOpacity>
            ) : (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    { 
                      backgroundColor: 'transparent',
                      borderColor: theme.colors.text.secondary + '40',
                      borderWidth: 1,
                    },
                  ]}
                  onPress={handleCancel}>
                  <Icon
                    name="close"
                    size={18}
                    color={theme.colors.text.primary}
                  />
                  <CustomText style={{color: theme.colors.text.primary}}>
                    Cancel
                  </CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    {
                      backgroundColor: theme.colors.primary,
                      opacity: isSaving ? 0.7 : 1,
                    },
                  ]}
                  onPress={handleSave}
                  disabled={isSaving}>
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Icon name="content-save" size={18} color="#FFF" />
                      <CustomText style={styles.buttonText}>
                        Save Changes
                      </CustomText>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Form Container */}
        <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <View style={styles.sectionHeader}>
            <Icon name="account-details" size={22} color={theme.colors.primary} />
            <CustomText variant="h3" bold={600} style={{color: theme.colors.text.primary}}>
              Basic Information
            </CustomText>
          </View>

          <View style={styles.formRow}>
            <View style={styles.halfField}>
              <FormField
                label="First Name"
                field="firstName"
                placeholder="Enter first name"
                icon="account"
              />
            </View>

            <View style={styles.halfField}>
              <FormField
                label="Last Name"
                field="lastName"
                placeholder="Enter last name"
                icon="account-box"
              />
            </View>
          </View>

          <FormField
            label="Email"
            field="email"
            placeholder="Enter email address"
            icon="email"
            keyboardType="email-address"
          />

          <FormField
            label="Phone"
            field="phone"
            placeholder="Enter phone number"
            icon="phone"
            keyboardType="phone-pad"
          />
        </View>

        {/* Location Section */}
        <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <View style={styles.sectionHeader}>
            <Icon name="map-marker" size={22} color={theme.colors.primary} />
            <CustomText variant="h3" bold={600} style={{color: theme.colors.text.primary}}>
              Location
            </CustomText>
          </View>

          <FormField
            label="Address"
            field="address"
            placeholder="Enter your address"
            icon="home"
          />

          <View style={styles.formRow}>
            <View style={styles.halfField}>
              <FormField 
                label="City" 
                field="city" 
                placeholder="Enter city" 
                icon="city"
              />
            </View>

            <View style={styles.halfField}>
              <FormField
                label="Country"
                field="country"
                placeholder="Enter country"
                icon="earth"
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <View style={styles.sectionHeader}>
            <Icon name="information" size={22} color={theme.colors.primary} />
            <CustomText variant="h3" bold={600} style={{color: theme.colors.text.primary}}>
              About You
            </CustomText>
          </View>

          <FormField
            label="Bio"
            field="bio"
            placeholder="Tell us about yourself"
            icon="text"
            multiline
            maxLength={300}
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
    paddingBottom: 30,
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
    marginBottom: 16,
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
  editButtonContainer: {
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 15,
  },
  halfField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
  },
});

export default PersonalInfoScreen;
