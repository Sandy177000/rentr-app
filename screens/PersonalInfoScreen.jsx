import { View, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useRef } from 'react'
import ScreenHeader from '../src/components/ScreenHeader'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, updateUserData } from '../store/authSlice'
import { useTheme } from '../src/theme/ThemeProvider'
import CustomText from '../src/components/common/CustomText'
import Icon from 'react-native-vector-icons/FontAwesome'
import Toast from 'react-native-toast-message'

const PersonalInfoScreen = () => {
  const user = useSelector(selectCurrentUser);
  const theme = useTheme();
  const dispatch = useDispatch();
  const originalUserRef = useRef(user); // Store original user for comparison
  
  // Create state for the editable JSON string
  const [jsonText, setJsonText] = useState(JSON.stringify(user, null, 2));
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Function to check if two objects have identical keys (including nested objects)
  const compareKeys = (obj1, obj2, path = '') => {
    // Get all keys from both objects
    const keys1 = obj1 ? Object.keys(obj1) : [];
    const keys2 = obj2 ? Object.keys(obj2) : [];
    
    // Check for missing keys
    const missingKeys = keys1.filter(key => !keys2.includes(key));
    if (missingKeys.length > 0) {
      return {
        valid: false,
        error: `Missing keys: ${missingKeys.map(k => `${path}${k}`).join(', ')}`
      };
    }
    
    // Check for extra keys
    const extraKeys = keys2.filter(key => !keys1.includes(key));
    if (extraKeys.length > 0) {
      return {
        valid: false,
        error: `Extra keys not allowed: ${extraKeys.map(k => `${path}${k}`).join(', ')}`
      };
    }
    
    // Recursively check nested objects
    for (const key of keys1) {
      if (
        obj1[key] && 
        typeof obj1[key] === 'object' && 
        !Array.isArray(obj1[key]) &&
        obj2[key] && 
        typeof obj2[key] === 'object' && 
        !Array.isArray(obj2[key])
      ) {
        const nestedResult = compareKeys(obj1[key], obj2[key], `${path}${key}.`);
        if (!nestedResult.valid) {
          return nestedResult;
        }
      }
    }
    
    return { valid: true };
  };
  
  // Function to validate JSON as user types
  const handleTextChange = (text) => {
    setJsonText(text);
    setValidationError('');
    
    try {
      const parsedJson = JSON.parse(text);
      
      // Validate keys against original user object
      const keyValidation = compareKeys(originalUserRef.current, parsedJson);
      if (!keyValidation.valid) {
        setIsValid(false);
        setValidationError(keyValidation.error);
        return;
      }
      
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
      setValidationError('Invalid JSON format. Please check your syntax.');
    }
  };
  
  // Function to save the edited JSON
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updatedUser = JSON.parse(jsonText);
      
      // Final validation before saving
      const keyValidation = compareKeys(originalUserRef.current, updatedUser);
      if (!keyValidation.valid) {
        setValidationError(keyValidation.error);
        Toast.show({
          type: 'error',
          text1: 'Invalid structure',
          text2: keyValidation.error
        });
        return;
      }
      
    //   await dispatch(updateUserData(updatedUser));
      
      Toast.show({
        type: 'success',
        text1: 'Changes saved successfully',
      });
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Invalid JSON format',
        text2: 'Please fix the formatting errors',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to reset the JSON to original state
  const handleReset = () => {
    setJsonText(JSON.stringify(originalUserRef.current, null, 2));
    setIsValid(true);
    setValidationError('');
  };
  
  return (
    <View style={styles.container}>
      <ScreenHeader title="Personal Information" />
      <ScrollView style={[styles.scrollContainer, { backgroundColor: theme.colors.background }]}>
        {/* <View style={styles.headerContainer}>
          <CustomText 
            variant="h3" 
            style={[styles.header, { color: theme.colors.text.primary }]}
          >
            Edit User Information
          </CustomText>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.resetButton, { backgroundColor: theme.colors.surface }]}
              onPress={handleReset}
            >
              <Icon name="refresh" size={16} color={theme.colors.text.primary} />
              <CustomText 
                variant="h4" 
                style={{color: theme.colors.text.primary}}
              >
                Reset
              </CustomText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: isValid ? theme.colors.primary : theme.colors.secondary,
                  opacity: (isValid && !isSaving) ? 1 : 0.6 
                }
              ]}
              onPress={handleSave}
              disabled={!isValid || isSaving}
            >
              <Icon name={isSaving ? "spinner" : "save"} size={16} color="#FFF" />
              <CustomText 
                variant="h4" 
                style={styles.saveButtonText}
              >
                {isSaving ? "Saving..." : "Save"}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View> */}
        
        <View style={[
          styles.editorContainer, 
          { 
            backgroundColor: theme.colors.surface,
            borderColor: isValid ? theme.colors.border || '#E0E0E0' : theme.colors.error 
          }
        ]}>
          <TextInput
            editable={false}
            style={[
              styles.jsonEditor,
              { color: theme.colors.text.primary, fontFamily: 'monospace' }
            ]}
            value={jsonText}
            onChangeText={handleTextChange}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
        
        {validationError !== '' && (
          <CustomText 
            style={[styles.errorText, { color: theme.colors.error }]}
          >
            {validationError}
          </CustomText>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  editorContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 300,
  },
  jsonEditor: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
  },
  infoText: {
    marginTop: 12,
    fontSize: 12,
    fontStyle: 'italic',
  }
});

export default PersonalInfoScreen