/* eslint-disable react-native/no-inline-styles */
// screens/ListItemScreen.js
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Linking,
  ActivityIndicator,
  Text,
  TextInput,
} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import {itemApi} from '../services/api/index';
import Divider from './Divider';
import {colors} from '../theme/theme';
import Toast from 'react-native-toast-message';
import SelectDropdown from 'react-native-select-dropdown';
import {categories} from '../constants';

const NewItemForm = ({setVisible}) => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rentalPeriod: 'daily',
    minimumPeriod: '',
    maximumPeriod: '',
    category: '',
    images: [],
  });
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
      category: 'Category',
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
            category: '',
            images: [],
          });
          setVisible(false);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to list item',
          });
        }
      }
    } catch (error) {
      console.error('Submit error:', JSON.stringify(error));
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error',
      //   text2: JSON.stringify(error),
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        width: '95%',
        height: '85%',
        borderRadius: 10,
        overflow: 'hidden',
      }}>
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {/* Item Details Section */}
        <View style={styles.groupContainer}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Item Details
          </Text>
          <Divider />
          <View style={{gap: 21}}>
            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
                Item Name<Text style={{color: theme.colors.error}}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                  },
                ]}
                value={formData.name}
                onChangeText={value => handleFormChange('name', value)}
                placeholder="Enter item name"
                placeholderTextColor={colors.gray}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
                Description<Text style={{color: theme.colors.error}}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.descriptionInput,
                  {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                  },
                ]}
                value={formData.description}
                onChangeText={value => handleFormChange('description', value)}
                placeholder="Enter item description"
                placeholderTextColor={colors.gray}
                multiline
              />
            </View>
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.groupContainer}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Pricing
          </Text>
          <Divider />
          <View style={{gap: 21}}>
            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
                Price (Rs/day)<Text style={{color: theme.colors.error}}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                  },
                ]}
                value={formData.price}
                onChangeText={value => handleFormChange('price', value)}
                placeholder="Enter price"
                placeholderTextColor={colors.gray}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
                Category<Text style={{color: theme.colors.error}}>*</Text>
              </Text>
              {/* <View
                style={[styles.input, {backgroundColor: theme.colors.surface}]}> */}
                <SelectDropdown
                  data={categories}
                  onSelect={(selectedItem) => handleFormChange('category', selectedItem?.name)}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View
                        style={{
                          height: 50,
                          backgroundColor: theme.colors.surface,
                          borderRadius: 12,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: 12,
                          ...(isOpened && {
                            backgroundColor: theme.colors.surface,
                          }),
                        }}>
                        <Text variant="h4">
                          {selectedItem?.name || 'Select category'}
                        </Text>
                        <Icon
                          name={isOpened ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color={theme.colors.secondary}
                        />
                      </View>
                    );
                  }}
                  renderItem={(selectedItem, index, isSelected) => {
                    return (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          paddingHorizontal: 12,
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 10,
                          ...(isSelected && {
                            backgroundColor: theme.colors.secondary,
                          }),
                        }}>
                        <Text variant="h4">{selectedItem?.name}</Text>
                      </View>
                    );
                  }}
                  dropdownStyle={{
                    backgroundColor: theme.colors.surface,
                    marginTop: 10,
                    borderRadius: 15
                  }}
                />
            </View>
          </View>
        </View>

        {/* Rental Period Section */}
        <View style={styles.groupContainer}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Rental Period
          </Text>
          <Divider />
          <View style={styles.rowLayout}>
            <View style={[styles.inputContainer, {flex: 1}]}>
              <Text
                style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
                Minimum Period (days)
                <Text style={{color: theme.colors.error}}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                  },
                ]}
                value={formData.minimumPeriod}
                onChangeText={value => handleFormChange('minimumPeriod', value)}
                placeholder="Min days"
                placeholderTextColor={colors.gray}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, {flex: 1}]}>
              <Text
                style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
                Maximum Period (days)
                <Text style={{color: theme.colors.error}}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                  },
                ]}
                value={formData.maximumPeriod}
                onChangeText={value => handleFormChange('maximumPeriod', value)}
                placeholder="Max days"
                placeholderTextColor={colors.gray}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Images Section */}
        <View style={{marginBottom: 100}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
              Add Photos
            </Text>
            <View style={styles.imageButtons}>
              <TouchableOpacity
                style={[
                  styles.imageButton,
                  {
                    borderColor: theme.colors.primary,
                    borderWidth: 1,
                    backgroundColor: theme.colors.surface,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                  },
                ]}
                onPress={() => handleImagePicker('camera')}>
                <Icon name="camera" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.imageButton,
                  {
                    borderColor: theme.colors.primary,
                    borderWidth: 1,
                    backgroundColor: theme.colors.surface,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                  },
                ]}
                onPress={() => handleImagePicker('gallery')}>
                <Icon name="image" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <Divider />
          {formData.images?.length > 0 && (
            <View style={styles.imageSection}>
              <ScrollView
                horizontal
                style={styles.imagePreviewContainer}
                showsHorizontalScrollIndicator={false}>
                {formData.images.map((image, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image
                      source={{uri: image.uri}}
                      style={styles.previewImage}
                    />
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
          )}
        </View>
      </ScrollView>
      {/* Buttons */}
      <View
          style={{
            flexDirection: 'row',
            padding: 20,
            position: 'absolute',
            bottom: 0,
            gap: 10,
          }}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {backgroundColor: theme.colors.secondary},
              loading && styles.disabledButton,
            ]}
            onPress={() => setVisible(false)}
            disabled={loading}>
            <Text style={[styles.submitButtonText, {textAlign: 'center'}]}>
              CANCEL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {backgroundColor: theme.colors.primary},
              loading && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={[styles.submitButtonText, {textAlign: 'center'}]}>
                ADD ITEM
              </Text>
            )}
          </TouchableOpacity>
        </View>
    </View>
  );
};

export default NewItemForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  imageSection: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(86, 86, 86, 0.1)',
    borderRadius: 10,
  },
  imageButton: {
    width: 40,
    height: 40,
  },
  imageButtonText: {
    marginLeft: 12,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    padding: 12,
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
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  groupContainer: {
    marginBottom: 24,
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});
