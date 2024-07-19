/******************************************************************************
 *                            AddTestimonial.js
 * 
 *      This page allows users to add a testimonial for a particular action.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 19, 2024
 * 
 *****************************************************************************/

import { StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { 
  View,
  Input, 
  Button, 
  Select, 
  ScrollView, 
  Text, 
  Image, 
  Modal, 
  Center, 
  Icon 
} from '@gluestack-ui/themed-native-base';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { apiCall } from '../../api/functions';
import { showError, showSuccess } from '../../utils/common';
import { setActionWithValue } from '../../config/redux/actions';
import { SET_TESTIMONIALS_LIST } from '../../config/redux/types';
import { launchImageLibrary } from 'react-native-image-picker';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '../../components/icons';
import MEDropdown from '../../components/dropdown/MEDropdown';

/* 
 * This serves as a validation schema to prevent the user to add a
 * testimonial to the selected community unless all the required fields 
 * are filled. 
 */
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Must be at least 3 characters')
    .required('Required'),
  title: Yup.string()
    .min(8, 'Must be at least 8 characters')
    .required('Required'),
  description: Yup.string()
    .min(20, 'Must be at least 20 characters')
    .required('Required'),
});


const AddTestimonial = ({ 
  navigation, 
  actions, 
  user, 
  activeCommunity, 
  testimonials, 
  setTestimonials,
  route
}) => {
  /* If given a testimonial, it will be in edit mode */
  const { testimonial, editMode } = route?.params ?? {};
  const testimonialAction = actions.find(
    action => testimonial?.action &&
      action.id === testimonial.action.id
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  /* Uses local state to save the uri of the selected image */
  const [imageUri, setImageUri] = useState(testimonial?.file?.url ?? null);
  
  /* 
   * Uses local state to determine whether some text or input field 
   * was changed in the form.
   */
  const [isFormDirty, setIsFormDirty] = useState(false);
  
  /* 
   * If the user by accident or on purpose leaves the form page and
   * they modified any input or text field in the page, they will be
   * warned that the information they entered will be lost if they 
   * leave, so they can stay in the page if it was a mistake or they
   * can leave the page and lose the information they entered previously. 
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isFormDirty) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to leave this page?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {}
          },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, isFormDirty]);

  /* 
   * Function that handles the selection of an image for the newly 
   * added event.
   */
  const handleSelectImage = () => {
    /* Image Settings */
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 500,
      maxWidth: 500,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImageUri(source);
        setIsFormDirty(true);
      }
    });
  };

  /* 
   * Function that handles the action of the user of clicking in the
   * 'Add Testimonial' button.
   */
  const onSubmit = (values, { setSubmitting }) => {
    setIsSubmitting(true);

    /* Data that will be sent to the API. */
    const data = {
      user_email: user.email,
      action_id: values.action || '--',
      // vendor_id: '--', maybe make this work someday
      // other_vendor: '--',
      preferred_name: values.name,
      title: values.title,
      body: values.description,
      community_id: activeCommunity.id,
      rank: 0,
      ...(editMode && { testimonial_id: testimonial.id }),
    };

    apiCall(editMode ? 'testimonials.update' : 'testimonials.add', data)
    .then((response) => {
      setIsSubmitting(false);
      setIsSent(true);
      setIsFormDirty(false);

      if (!response.success) {
        showError('An error occurred while adding testimonial. Please try again.');
        console.error('ERROR_ADDING_TESTIMONIAL:', response);
        return;
      }
      showSuccess(`Testimonial ${editMode ? 'edited' : 'added' } successfully.`);
      console.log('TESTIMONIAL_ADDED');

      /* Add the new testimonial to the redux store */
      if (editMode) {
        setTestimonials(testimonials.map(t => t.id === testimonial.id ? response.data : t));
      } else {
        setTestimonials([response.data, ...testimonials]);
      }
      navigation.navigate('Testimonials');
    })
    .catch((error) => {
      console.error('ERROR_ADDING_TESTIMONIAL:', error);
      showError('An error occurred while adding testimonial. Please try again.');
      return;
    });
  }

  /* Displays the form to create a new testimonial */
  return (
    <View bg="white" height="100%">
      <ScrollView
        showsVerticalScrollIndicator={false}
        px={3}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <Formik
            initialValues={{ 
              action: testimonialAction ?? '',
              name: testimonial?.preferred_name ?? user.preferred_name, 
              title: testimonial?.title ?? '',
              image: null,
              description: testimonial?.body ?? '',
            }} 
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ 
              handleChange, 
              handleBlur, 
              handleSubmit, 
              setFieldValue, 
              values, 
              errors, 
              touched, 
              isSubmitting 
            }) => (
              <View style={styles.container}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                >
                  <Text 
                    bold 
                    fontSize="lg" 
                    mb={5}
                    style={{
                      alignSelf: 'center', 
                      color: '#64B058'
                  }}>
                    Create Testimonial Form
                  </Text>

              {/* Action select */}
              <Text mb={2}>Associated Action</Text>
              <MEDropdown
                borderRadius={10}
                mb={3}
                selectedValue={values.category}
                minWidth={200}
                onChange={
                  (itemValue) => {
                    setFieldValue('action', itemValue);
                    setIsFormDirty(true);
                  }
                }
                options={actions.map((action, index) => (
                  {label: action.title, value: action.id}
                ))}
              />

                  {/* Name */}
                  <Text mb={2}>Name</Text>
                  <Input
                    placeholder="Your name..."
                    variant="rounded"
                    size="lg"
                    mb={3}
                    onChangeText={(value) => {
                      handleChange("name")(value);
                      setIsFormDirty(true);
                    }}
                    onBlur={handleBlur('name')}
                    value={values.name}
                  />
                  {touched.name && 
                  errors.name && 
                  <Text style={styles.error}>
                    {errors.name}
                  </Text>
                  }
                  
                  {/* Title */}
                  <Text mb={2}>Testimonial Title</Text>
                  <Input
                    variant="rounded"
                    size="lg"
                    mb={3}
                    onChangeText={(value) => {
                      handleChange("title")(value);
                      setIsFormDirty(true);
                    }}
                    onBlur={handleBlur('title')}
                    value={values.title}
                    placeholder="Add a Title"
                  />
                  {touched.title && errors.title && 
                  <Text style={styles.error}>{errors.title}</Text>
                  }
                  
                  {/* Image */}
                  <Text mb={2}>
                    You can add an image to your testimonial. 
                    It should be your own picture, or one you are sure is not 
                    copyrighted material.
                  </Text>
                  <Button
                    style={{
                      width: "50%",
                      marginTop: 10,
                      alignSelf: 'center'
                    }}
                    onPress={handleSelectImage}
                  >
                    Select Image
                  </Button>
                  {
                    imageUri && (
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10,
                          marginBottom: 10,
                        }}
                      >
                        <Text mt={5} color="#64B058">
                          Selected image:
                        </Text>
                        <Image
                          source={imageUri}
                          style={{
                            width: 200,
                            height: 200,
                          }}
                          alt="testimonial image"
                        />
                      </View>
                    )
                  }

                  {/* Description */}
                  <Text mt={5} mb={2}>Testimonial Description</Text>
                  <Input
                    borderRadius={10}
                    size="lg"
                    mb={3}
                    multiline={true}
                    height={40}
                    onChangeText={(value) => {
                      handleChange("description")(value);
                      setIsFormDirty(true);
                    }}
                    onBlur={handleBlur('description')}
                    value={values.description}
                    placeholder="Your story..."
                  />
                  {touched.description && errors.description && 
                  <Text style={styles.error}>{errors.description}</Text>
                  }

                  {/* Submit button */}
                  <Button
                    mt={3}
                    mb={10}
                    bg="primary.400"
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    disabled={isSubmitting}
                    onPress={handleSubmit}
                  >
                    ADD TESTIMONIAL
                  </Button>
                </ScrollView>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </ScrollView>

      {/* <Modal
        isOpen={isSent}
        onClose={() => setIsSent(false)}
      >
        <Modal.Content maxWidth={400}>
          <Modal.Body>
            <Center mb="5">
              <Icon
                as={FontAwesomeIcon}
                name="circle-cleck"
                size="90px"
                color="primary.600"
              />
              <Text
                fontSize="lg"
                fontWeight="bold"
                py="5"
              >
                Testimonial successfully added!
              </Text>
              <Text textAlign="center">
                People can now check your newly added testimonial!
              </Text>
            </Center>
            <Button
              colorScheme={"gray"}
              onPress={() => setIsSent(false)}
            >
              Back
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

const mapStateToProps = state => {
  return {
    actions: state.actions,
    user: state.user,
    activeCommunity: state.activeCommunity,
    testimonials: state.testimonials,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setTestimonials: (testimonials) => dispatch(setActionWithValue(SET_TESTIMONIALS_LIST, testimonials)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTestimonial);