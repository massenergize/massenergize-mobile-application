import { View, Text, StyleSheet } from 'react-native';
import { Input, Button, Select, ScrollView } from '@gluestack-ui/themed-native-base';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MEButton from '../../components/button/MEButton';
import { connect } from 'react-redux';

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

const onSubmit = (values, { setSubmitting }) => {
  // TODO: Add API call to submit testimonial
  setTimeout(() => {
    console.log(values);
    setSubmitting(false);
  }, 1000);
}

const AddTestimonial = ({ navigation, actions }) => {

  return (
    <Formik
      initialValues={{ action: '', name: '', title: '', description: ''}} 
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
        <View style={styles.container}>
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
  };
}

export default connect(mapStateToProps)(AddTestimonial);