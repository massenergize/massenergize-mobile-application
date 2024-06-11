/******************************************************************************
 *                            AddTestimonial.js
 * 
 *      This page allows users to add a testimonial for a particular action.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 11, 2024
 * 
 *****************************************************************************/

import { View, Text, StyleSheet } from 'react-native';
import { Input, Button, Select, ScrollView } from '@gluestack-ui/themed-native-base';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MEButton from '../../components/button/MEButton';
import { connect } from 'react-redux';
import { apiCall } from '../../api/functions';
import { showError, showSuccess } from '../../utils/common';
import { set } from '@gluestack-style/react';
import { setActionWithValue } from '../../config/redux/actions';
import { SET_TESTIMONIALS_LIST } from '../../config/redux/types';

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



const AddTestimonial = ({ navigation, actions, user, activeCommunity, testimonials, setTestimonials }) => {

  // Function to handle form submission
  const onSubmit = (values, { setSubmitting }) => {

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
      if (!response.success) {
        showError('An error occurred while adding testimonial. Please try again.');
        console.error('ERROR_ADDING_TESTIMONIAL:', response);
        return;
      }
      showSuccess('Testimonial added successfully.');
      console.log('TESTIMONIAL_ADDED:', response.data);

      // Add the new testimonial to the redux store
      setTestimonials([response.data, ...testimonials]);
      navigation.goBack();
    })
    .catch((error) => {
      console.error('ERROR_ADDING_TESTIMONIAL:', error);
      showError('An error occurred while adding testimonial. Please try again.');
      return;
    });
  }

  return (
    <Formik
      initialValues={{ action: '', name: user.preferred_name, title: '', description: ''}} 
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
        <View style={styles.container}>

          {/* Action select */}
          <Text>Associated Action</Text>
          <Select
            borderRadius={10}
            mb={3}
            selectedValue={values.category}
            minWidth={200}
            accessibilityLabel="Choose Category"
            placeholder="Choose Category"
            onValueChange={(itemValue) => setFieldValue('action', itemValue)}
          >
            <ScrollView>
            {actions.map((action, index) => (
              <Select.Item key={index} label={action.title} value={action.id} />
            ))}
            </ScrollView>
          </Select>

          {/* Name, title, and description */}
          <Text>Name</Text>
          <Input
            variant="rounded"
            size="lg"
            mb={3}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
          />
          {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <Text>Testimonial Title</Text>
          <Input
            variant="rounded"
            size="lg"
            mb={3}
            onChangeText={handleChange('title')}
            onBlur={handleBlur('title')}
            value={values.title}
          />
          {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

          <Text>Testimonial Description</Text>
          <Input
            borderRadius={10}
            size="lg"
            mb={3}
            multiline={true}
            height={40}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
          />
          {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

          {/* Submit button */}
          <MEButton onPress={handleSubmit} loading={isSubmitting}>
            Submit
          </MEButton>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    height: '100%',
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