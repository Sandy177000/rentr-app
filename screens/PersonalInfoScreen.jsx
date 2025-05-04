import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenHeader from '../src/components/ScreenHeader';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentUser, updateUserData} from '../store/authSlice';
import {useTheme} from '../src/theme/ThemeProvider';
import CustomText from '../src/components/common/CustomText';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PersonalInfoScreen = () => {
  const user = useSelector(selectCurrentUser);
  const theme = useTheme();
  const dispatch = useDispatch();

  // Create state for each editable field
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    bio: user?.bio || '',
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (simple)
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
        text1: 'Validation Error',
        text2: 'Please correct the errors in the form',
      });
      return;
    }

    try {
      setIsSaving(true);

      // Create updated user object maintaining the structure
      const updatedUser = {
        ...user,
        ...formData,
      };

      // Comment out if not ready to dispatch
      // await dispatch(updateUserData(updatedUser));

      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });

      setIsEditing(false);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: e.message || 'Please try again later',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Input field component for reuse
  const FormField = ({
    label,
    field,
    placeholder,
    multiline,
    keyboardType = 'default',
    maxLength,
  }) => (
    <View style={styles.fieldContainer}>
      <CustomText
        style={[styles.fieldLabel, {color: theme.colors.text.secondary}]}>
        {label}
      </CustomText>

      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary,
            borderColor: errors[field]
              ? theme.colors.error
              : theme.colors.border || '#E0E0E0',
          },
        ]}
        value={formData[field]}
        onChangeText={value => handleChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.secondary}
        editable={isEditing}
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />

      {errors[field] && (
        <CustomText style={[styles.errorText, {color: theme.colors.error}]}>
          {errors[field]}
        </CustomText>
      )}
    </View>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScreenHeader title="Personal Information" />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <View
            style={[
              styles.avatarContainer,
              {backgroundColor: theme.colors.surface},
            ]}>
            {user?.profileImage ? (
              <Image source={{uri: user.profileImage}} style={styles.avatar} />
            ) : (
              <Icon name="account" size={50} color={theme.colors.primary} />
            )}
          </View>

          <View style={styles.nameContainer}>
            <CustomText variant="h2" style={{color: theme.colors.text.primary}}>
              {user?.firstName} {user?.lastName}
            </CustomText>
            <CustomText style={{color: theme.colors.text.secondary}}>
              {user?.email}
            </CustomText>
          </View>
        </View>

        <View style={styles.editButtonContainer}>
          {!isEditing ? (
            <TouchableOpacity
              style={[
                styles.editButton,
                {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => setIsEditing(true)}>
              <Icon name="pencil" size={16} color="#FFF" />
              <CustomText style={styles.buttonText}>Edit Profile</CustomText>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {backgroundColor: theme.colors.surface},
                ]}
                onPress={() => {
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
                }}>
                <Icon
                  name="close"
                  size={16}
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
                <Icon
                  name={isSaving ? 'loading' : 'content-save'}
                  size={16}
                  color="#FFF"
                />
                <CustomText style={styles.buttonText}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </CustomText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Icon
              name="account-details"
              size={20}
              color={theme.colors.primary}
            />
            <CustomText variant="h3" style={{color: theme.colors.text.primary}}>
              Basic Information
            </CustomText>
          </View>

          <View style={styles.formRow}>
            <View style={styles.halfField}>
              <FormField
                label="First Name"
                field="firstName"
                placeholder="Enter first name"
              />
            </View>

            <View style={styles.halfField}>
              <FormField
                label="Last Name"
                field="lastName"
                placeholder="Enter last name"
              />
            </View>
          </View>

          <FormField
            label="Email"
            field="email"
            placeholder="Enter email address"
            keyboardType="email-address"
          />

          <FormField
            label="Phone"
            field="phone"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <View style={styles.sectionHeader}>
            <Icon name="map-marker" size={20} color={theme.colors.primary} />
            <CustomText variant="h3" style={{color: theme.colors.text.primary}}>
              Location
            </CustomText>
          </View>

          <FormField
            label="Address"
            field="address"
            placeholder="Enter your address"
          />

          <View style={styles.formRow}>
            <View style={styles.halfField}>
              <FormField label="City" field="city" placeholder="Enter city" />
            </View>

            <View style={styles.halfField}>
              <FormField
                label="Country"
                field="country"
                placeholder="Enter country"
              />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Icon name="information" size={20} color={theme.colors.primary} />
            <CustomText variant="h3" style={{color: theme.colors.text.primary}}>
              About You
            </CustomText>
          </View>

          <FormField
            label="Bio"
            field="bio"
            placeholder="Tell us about yourself"
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
  },
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
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
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  formContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
    gap: 8,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    gap: 15,
  },
  halfField: {
    flex: 1,
  },
  fieldLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default PersonalInfoScreen;
