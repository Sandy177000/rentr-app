// screens/ListItemScreen.js
import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import {itemApi} from '../apis/item';
import {useNavigation} from '@react-navigation/native';
import CustomText from './CustomText';
import Divider from './Divider';
export const ListItemForm = ({setVisible}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rentalPeriod: 'daily',
    minimumPeriod: '',
    maximumPeriod: '',
    images: [],
    category: 'others',
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
          Alert.alert(
            'Camera Permission Required',
            'Please enable camera access in your device settings.',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Open Settings',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ],
          );
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
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }

      if (response.assets && response.assets[0]) {
        handleFormChange('images', [...formData.images, response.assets[0]]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
    }
  };

  const removeImage = index => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    handleFormChange('images', newImages);
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.minimumPeriod ||
      !formData.maximumPeriod
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    setLoading(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('price', formData.price);
      submitFormData.append('rentalPeriod', formData.rentalPeriod);
      submitFormData.append('minimumPeriod', formData.minimumPeriod);
      submitFormData.append('maximumPeriod', formData.maximumPeriod);
      submitFormData.append('category', formData.category);

      formData.images.forEach((image, index) => {
        submitFormData.append('images', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: `${formData.name}_image_${index}.jpg`,
        });
      });

      if (submitFormData) {
        const response = await itemApi.createItem(submitFormData);
        if (response.item) {
          Alert.alert('Success', 'Item listed successfully', [
            {text: 'OK', onPress: () => {}},
          ]);
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
          Alert.alert('Error', 'Failed to list item', [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
        }
      }
    } catch (error) {
      console.error('Submit error:', JSON.stringify(error));
      Alert.alert(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CustomText
        variant="h3"
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.text.primary,
            borderBottomColor: theme.colors.primary,
          },
        ]}>
        Item Details
      </CustomText>
      < Divider />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary,
            borderColor: 'transparent',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 2,
          },
        ]}
        placeholder="Item Name"
        placeholderTextColor={theme.colors.text.secondary}
        value={formData.name}
        onChangeText={value => handleFormChange('name', value)}
      />

      <TextInput
        style={[
          styles.input,
          styles.descriptionInput,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary,
            borderColor: 'transparent',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 2,
          },
        ]}
        placeholder="Description"
        value={formData.description}
        onChangeText={value => handleFormChange('description', value)}
        multiline
        numberOfLines={4}
        placeholderTextColor={theme.colors.text.secondary}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary,
            borderColor: 'transparent',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 2,
          },
        ]}
        placeholder="Price per day"
        value={formData.price}
        onChangeText={value => handleFormChange('price', value)}
        keyboardType="numeric"
        placeholderTextColor={theme.colors.text.secondary}
      />

      <View style={styles.periodInputs}>
        <TextInput
          style={[
            styles.input,
            styles.halfInput,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
              borderColor: 'transparent',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.2,
              shadowRadius: 2,
            },
          ]}
          placeholder="Minimum Period"
          value={formData.minimumPeriod}
          onChangeText={value => handleFormChange('minimumPeriod', value)}
          keyboardType="numeric"
          placeholderTextColor={theme.colors.text.secondary}
        />

        <TextInput
          style={[
            styles.input,
            styles.halfInput,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
              borderColor: 'transparent',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.2,
              shadowRadius: 2,
            },
          ]}
          placeholder="Maximum Period"
          value={formData.maximumPeriod}
          onChangeText={value => handleFormChange('maximumPeriod', value)}
          keyboardType="numeric"
          placeholderTextColor={theme.colors.text.secondary}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          alignItems: 'center',
        }}>
        <CustomText
          variant="h3"
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text.primary,
            },
          ]}>
          Add Photos
        </CustomText>

        <View style={styles.imageButtons}>
          <TouchableOpacity
            style={[
              styles.imageButton,
              {borderColor: theme.colors.primary, borderWidth: 1},
            ]}
            onPress={() => handleImagePicker('camera')}>
            <Icon name="camera" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.imageButton,
              {borderColor: theme.colors.primary, borderWidth: 1},
            ]}
            onPress={() => handleImagePicker('gallery')}>
            <Icon name="image" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
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

      <TouchableOpacity
        style={[
          styles.submitButton,
          {backgroundColor: theme.colors.primary},
          loading && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={loading}>
        <CustomText style={styles.submitButtonText}>
          {loading ? 'Listing...' : 'List Item'}
        </CustomText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    width: 30,
    height: 30,
    justifyContent: 'center',
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
  halfInput: {
    width: '48%',
  },
  submitButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
