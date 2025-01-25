// screens/ListItemScreen.js
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  Image,
  ScrollView,
  Alert,
  Platform,
  Linking
} from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import { itemApi } from '../src/apis/item';
import { useNavigation } from '@react-navigation/native';

export const ListItemScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rentalPeriod: 'daily',
    minimumPeriod: '',
    maximumPeriod: '',
    images: []
  });
  const [loading, setLoading] = useState(false);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImagePicker = async (type) => {
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
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Open Settings', 
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                }
              }
            ]
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

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    handleFormChange('images', newImages);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || 
        !formData.minimumPeriod || !formData.maximumPeriod) {
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

      formData.images.forEach((image, index) => {
        submitFormData.append('images', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: `${formData.name}_image_${index}.jpg`,
        });
      });

      if(submitFormData) {
        const response = await itemApi.createItem(submitFormData);
        console.log(response);
        if(response.item) {
          Alert.alert('Success', 'Item listed successfully', [
            { text: 'OK', onPress: () => {}}
          ]);
          setFormData({
            name: '',
            description: '',
            price: '',
            rentalPeriod: 'daily',
            minimumPeriod: '',
            maximumPeriod: '',
            images: []
          });
        } else {
          Alert.alert('Error', 'Failed to list item', [
            { text: 'OK', onPress: () => navigation.goBack() }
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
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.imageSection}>
        <View style={styles.imageButtons}>
          <TouchableOpacity 
            style={[styles.imageButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleImagePicker('camera')}
          >
            <Icon name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.imageButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.imageButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleImagePicker('gallery')}
          >
            <Icon name="image" size={20} color="#FFFFFF" />
            <Text style={styles.imageButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal style={styles.imagePreviewContainer}>
          {formData.images.map((image, index) => (
            <View key={index} style={styles.imagePreview}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Icon name="times-circle" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          borderColor: theme.colors.text.secondary
        }]}
        placeholder="Item Name"
        placeholderTextColor={theme.colors.text.secondary}
        value={formData.name}
        onChangeText={(value) => handleFormChange('name', value)}
      />

      <TextInput
        style={[styles.input, styles.descriptionInput, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          borderColor: theme.colors.text.secondary
        }]}
        placeholder="Description"
        value={formData.description}
        onChangeText={(value) => handleFormChange('description', value)}
        multiline
        numberOfLines={4}
        placeholderTextColor={theme.colors.text.secondary}
      />

      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          borderColor: theme.colors.text.secondary
        }]}
        placeholder="Price per day"
        value={formData.price}
        onChangeText={(value) => handleFormChange('price', value)}
        keyboardType="numeric"
        placeholderTextColor={theme.colors.text.secondary}
      />

      <View style={styles.periodInputs}>
        <TextInput
          style={[styles.input, styles.halfInput, {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary,
            borderColor: theme.colors.text.secondary
          }]}
          placeholder="Minimum Period"
          value={formData.minimumPeriod}
          onChangeText={(value) => handleFormChange('minimumPeriod', value)}
          keyboardType="numeric"
          placeholderTextColor={theme.colors.text.secondary}
        />

        <TextInput
          style={[styles.input, styles.halfInput, {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary,
            borderColor: theme.colors.text.secondary
          }]}
          placeholder="Maximum Period"
          value={formData.maximumPeriod}
          onChangeText={(value) => handleFormChange('maximumPeriod', value)}
          keyboardType="numeric"
          placeholderTextColor={theme.colors.text.secondary}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, 
          { backgroundColor: theme.colors.primary },
          loading && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Listing...' : 'List Item'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
  },
  imageButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imagePreview: {
    marginRight: 10,
    position: 'relative',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  periodInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});