/******************************************************************************
 *                            AddTestimonial.js
 * 
 *      This page allows users to add a testimonial for a particular action.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 21, 2024 (by Moizes Almeida)
 * 
 *****************************************************************************/

import { StyleSheet } from 'react-native';
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
import MEButton from '../../components/button/MEButton';
import { connect } from 'react-redux';
import { apiCall } from '../../api/functions';
import { showError, showSuccess } from '../../utils/common';
import { set } from '@gluestack-style/react';
import { setActionWithValue } from '../../config/redux/actions';
import { SET_TESTIMONIALS_LIST } from '../../config/redux/types';
import { launchImageLibrary } from 'react-native-image-picker';
import { useState } from 'react';
import { FontAwesomeIcon } from '../../components/icons';

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
  setTestimonials 
}) => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  /* Uses local state to save the uri of the selected image */
  const [imageUri, setImageUri] = useState(null);

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
      rank: 0
    };

    apiCall('testimonials.add', data)
    .then((response) => {
      setIsSubmitting(false);
      setIsSent(true);

      if (!response.success) {
        showError('An error occurred while adding testimonial. Please try again.');
        console.error('ERROR_ADDING_TESTIMONIAL:', response);
        return;
      }
      showSuccess('Testimonial added successfully.');
      console.log('TESTIMONIAL_ADDED');

      /* Add the new testimonial to the redux store */
      setTestimonials([response.data, ...testimonials]);
      navigation.goBack();
    })
    .catch((error) => {
      console.error('ERROR_ADDING_TESTIMONIAL:', error);
      showError('An error occurred while adding testimonial. Please try again.');
      return;
    });
  }

  /* Displays the form to create a new testimonial */
  return (
    <View>
      <Formik
        initialValues={{ 
          action: '', 
          name: user.preferred_name, 
          title: '', 
          image: null,
          description: ''}} 
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
              <Select
                borderRadius={10}
                mb={3}
                selectedValue={values.category}
                minWidth={200}
                accessibilityLabel="Choose Action"
                placeholder="Choose Action..."
                onValueChange={(itemValue) => setFieldValue('action', itemValue)}
              >
                <ScrollView>
                {actions.map((action, index) => (
                  <Select.Item key={index} label={action.title} value={action.id} />
                ))}
                </ScrollView>
              </Select>

              {/* Name */}
              <Text mb={2}>Name</Text>
              <Input
                placeholder="Your name..."
                variant="rounded"
                size="lg"
                mb={3}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
              
              {/* Title */}
              <Text mb={2}>Testimonial Title</Text>
              <Input
                variant="rounded"
                size="lg"
                mb={3}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                placeholder="Add a Title"
              />
              {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}
              
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
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder="Your story..."
              />
              {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

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

      <Modal
        isOpen={isSent}
        onClose={() => setIsSent(false)}
      >
        <Modal.Content maxWidth="400px">
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
      </Modal>
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