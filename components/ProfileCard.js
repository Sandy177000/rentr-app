import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, Modal, Alert, Platform, Linking, ActivityIndicator} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import {updateUser} from '../store/authSlice';
import {userApi} from '../src/apis/user';

const ProfileCard = ({user, theme, styles, navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);


  const ProfilePickerModal = () => {
    return (
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              {backgroundColor: theme.colors.background},
            ]}>
            <Text
              style={[styles.modalTitle, {color: theme.colors.text.primary}]}>
              Update Profile Picture
            </Text>
            <TouchableOpacity
              style={[
                styles.modalButton,
                {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => {
                handleUpdateProfileImage('gallery');
              }}>
              <Text
                style={[
                  styles.modalButtonText,
                  {color: theme.colors.text.primary},
                ]}>
                Pick from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => handleUpdateProfileImage('camera')}>
              <Text
                style={[
                  styles.modalButtonText,
                  {color: theme.colors.text.primary},
                ]}>
                Take a Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => setModalVisible(false)} // Close the modal
            >
              <Text
                style={[
                  styles.modalButtonText,
                  {color: theme.colors.text.primary},
                ]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const handleUpdateProfileImage = async source => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
      saveToPhotos: true,
    };
    setModalVisible(false);

    try {
      let response;
      if (source === 'gallery') {
        response = await launchImageLibrary(options);
      } else if (source === 'camera') {
        response = await launchCamera(options);
      }
      // Handle camera permissions
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
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        console.error('ImagePicker Error:', response);
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }
      if (response.assets && response.assets[0]) {
        console.log('user', user);
        setLoading(true);

        const formData = new FormData();
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('email', user.email);
        formData.append('phone', user.phone);
        formData.append('images', {
          uri: response.assets[0].uri,
          type: response.assets[0].type || 'image/jpeg',
          name: `${user.firstName}_image_0.jpg`,
        });


        const {profileImage} = await userApi.updateUserInfo(formData);
        if(profileImage){
            dispatch(updateUser({...user, profileImage}));
        }
        
      }
    } catch (error) {
      console.error('Error updating profile image:', JSON.stringify(error));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ProfilePickerModal />
    <View style={[styles.header, {backgroundColor: theme.colors.background}]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}
        style={styles.settingsButton}>
        <Icons name="gear" size={24} color={theme.colors.text.primary} />
      </TouchableOpacity>
      <View style={styles.profileImageContainer}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} style={styles.profileImage} />
        ) : (
          <Image
            source={{uri: user.profileImage || '#'}}
            style={styles.profileImage}
          />
        )}
        <TouchableOpacity
          style={[
            styles.editImageButton,
            {backgroundColor: theme.colors.primary, borderColor: theme.colors.primary},
          ]}
          onPress={() => setModalVisible(true)}>
          <Icons name="pencil" size={14} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.name, {color: theme.colors.text.primary}]}>
        {user.firstName} {user.lastName}
      </Text>
    </View>
    </>
  );
};

export default ProfileCard;
