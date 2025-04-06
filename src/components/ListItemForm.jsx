/* eslint-disable react-native/no-inline-styles */
// screens/ListItemScreen.js
import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import {itemApi} from '../apis/item';
import {useNavigation} from '@react-navigation/native';
import CustomText from './common/CustomText';
import CustomTextInputField from './common/CustomTextInputField';
import Divider from './Divider';
import CustomButton from './common/CustomButton';
import globalStyles from '../theme/global.styles';
import {createItemFormConfig} from '../utils/form/createItem';
import {colors} from '../theme/theme';
import Toast from 'react-native-toast-message';

export const ListItemForm = ({setVisible}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const initialFormData = React.useMemo(() => {
    const formFields = {};
    createItemFormConfig.forEach(group => {
      group.fields.forEach(field => {
        formFields[field.key] = field.props.defaultValue || '';
      });
    });
    return formFields;
  }, []);

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagePicker = async type => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
      saveToPhotos: true,
    };

    try {
      let response;
      if (type === 'camera') {
        response = await ImagePicker.launchCamera(options);
        if (response.errorCode === 'others') {
          Toast.show({
            type: 'info',
            text1: 'Camera Permission Required',
            text2: 'Please click on this to enable camera access.',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          });
          return;
        }
      } else {
        response = await ImagePicker.launchImageLibrary(options);
      }

      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        console.error('ImagePicker Error:', response);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.errorMessage || 'Failed to pick image',
        });
        return;
      }

      if (response.assets && response.assets[0]) {
        handleFormChange('images', [...formData.images, response.assets[0]]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to pick image: ${error.message}`,
      });
    }
  };

  const removeImage = index => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    handleFormChange('images', newImages);
  };

  const handleSubmit = async () => {
    const requiredFields = {
      name: 'Item Name',
      description: 'Item Description',
      price: 'Price',
      minimumPeriod: 'Minimum Rental Period',
      maximumPeriod: 'Maximum Rental Period',
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: `Please enter ${label}`,
        });
        return;
      }
    }

    if (formData.images.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please add at least one image',
      });
      return;
    }

    setLoading(true);
    try {
      const submitFormData = new FormData();
      formData.images.forEach((image, index) => {
        submitFormData.append('images', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: `${formData.name}_image_${index}.jpg`,
        });
      });
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('price', formData.price);
      submitFormData.append('rentalPeriod', formData.rentalPeriod);
      submitFormData.append('minimumPeriod', formData.minimumPeriod);
      submitFormData.append('maximumPeriod', formData.maximumPeriod);
      submitFormData.append('category', formData.category);

      if (submitFormData) {
        const response = await itemApi.createItem(submitFormData);
        if (response.item) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Item listed successfully',
          });
          setFormData({
            name: '',
            description: '',
            price: '',
            rentalPeriod: 'daily',
            minimumPeriod: '',
            maximumPeriod: '',
            images: [],
          });
          setVisible(false);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to list item',
          });
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Submit error:', JSON.stringify(error));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: JSON.stringify(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const renderInput = field => {
      switch(field.type){
      case 'text':
      case 'number':
        return (
          <CustomTextInputField
            {...field}
            value={formData[field.key]}
            onChangeText={value => handleFormChange(field.key, value)}
            placeholderColor={colors.gray}
            />
        );
      default:
        return null;
    }
  };

  const renderGroup = group => (
    <View key={group.id} style={styles.groupContainer}>
      <CustomText variant="h4">{group.title}</CustomText>
      <Divider />
      <View style={[group.layout === 'row' && styles.rowLayout, {gap:21}]}>
        {group.fields.map(field => renderInput(field))}
      </View>
    </View>
  );

  return (
    <>
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {createItemFormConfig.map(group => renderGroup(group))}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <CustomText
            variant="body"
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text.primary,
              },
            ]}>
            Add Photos
          </CustomText>

          <View style={styles.imageButtons}>
            <CustomButton
              type="action"
              style={[
                styles.imageButton,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: 1,
                  padding: 0,
                  margin: 0,
                },
              ]}
              onPress={() => handleImagePicker('camera')}>
              <Icon name="camera" size={16} color={theme.colors.primary} />
            </CustomButton>
            <CustomButton
              type="action"
              style={[
                styles.imageButton,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: 1,
                  padding: 0,
                  margin: 0,
                },
              ]}
              onPress={() => handleImagePicker('gallery')}>
              <Icon name="image" size={16} color={theme.colors.primary} />
            </CustomButton>
          </View>
        </View>
        <Divider />
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            style={styles.imagePreviewContainer}
            showsHorizontalScrollIndicator={false}>
            {formData.images.map((image, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{uri: image.uri}} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}>
                  <Icon
                    name="times-circle"
                    size={24}
                    color={theme.colors.error}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 10}}>
        <CustomButton
          type="action"
          variant="secondary"
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={() => setVisible(false)}
          disabled={loading}>
            <View>
              <CustomText variant="h3" style={{color: colors.white}} bold={800}>
                CANCEL
              </CustomText>
            </View>
        </CustomButton>
        <CustomButton
          type="action"
          variant="primary"
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <View>
              <CustomText variant="h3" style={{color: colors.white}} bold={800}>
                LIST ITEM
              </CustomText>
            </View>
          )}
        </CustomButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  sectionTitle: {
    fontWeight: '600',
    padding: 10,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  imageButton: {
    width: 40,
    height: 40,
    ...globalStyles.borderRadius,
  },
  imageButtonText: {
    marginLeft: 12,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 80,
  },
  imagePreview: {
    marginRight: 16,
    position: 'relative',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  input: {
    borderWidth: 0,
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  periodInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  submitButton: {flex: 1},
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
  groupContainer: {
    marginBottom: 24,
  },
  fieldsContainer: {
    padding: 16,
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    marginLeft: 4,
  },
});
