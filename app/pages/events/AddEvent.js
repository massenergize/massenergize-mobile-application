/******************************************************************************
 *                                 AddEvent
 * 
 *      This page is responsible for rendering the screen to add
 *      an event to the selected community.
 * 
 *      Written by: Moizes Almeida and Will Soylemez
 *      Last edited: June 28, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { connect } from "react-redux";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FormControl,
  Input,
  VStack,
  Button,
  Image,
  Radio,
  Modal,
  Center,
  Icon,
} from '@gluestack-ui/themed-native-base';
import { FontAwesomeIcon } from "../../components/icons";
import { Formik } from "formik";
import * as Yup from 'yup';
import { apiCall } from "../../api/functions";
import { setActionWithValue } from "../../config/redux/actions";
import { SET_EVENT_LIST } from "../../config/redux/types";
import { showError, showSuccess } from "../../utils/common";
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from "react-native-image-picker";

/* 
 * This serves as a validation schema to prevent the user to add an
 * event to the selected community if all the required fields 
 * are not filled. 
 */
const validationSchema = Yup.object({
  title: Yup.string().required("Name of event is required"),
  start_date_and_time: Yup.string().required("Start date and time is required"),
  end_date_and_time: Yup.string().required("End date and time is required"),
  description: Yup.string().required("Description is required")
});

const AddEvent = ({
  navigation,
  events,
  user,
  activeCommunity,
  setEvents
}) => {
  /* Saves the community's ID into a variable */
  const community_id = activeCommunity.id;

  /* 
   * Uses local state to determine if the event is in the 
   * process to being added to the community or if it was already added. 
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  /* 
   * Uses local state to save the values of the selected start and end date
   * for the newly added event, as well as it also displays which was the 
   * start and end date on the screen once they were selected by the user.
   */
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  /* 
   * Uses local state to save the information about which is the format 
   * that the event will take place: in-person, online, or both.
   */
  const [format, setFormat] = useState(null);

  /* Uses local state to save the uri of the selected image. */
  const [imageUri, setImageUri] = useState(null);

  /* 
   * Saves the information about the location the event will take 
   * place. This is an optional field completed by the user, 
   * and starts assuming that the event will take place in some 
   * location within the state of Massachusetts.
   */
  let location = {
    "address": null,
    "city": null,
    "country": "US",
    "state": "MA",
    "unit": null,
    "zipcode": null
  }

  /* 
   * Function that handles the selection of an image for the newly 
   * added event.
   */
  const handleSelectImage = () => {
    /* Image settings */
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

  /* Function the handles the change of the start date of the event */
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  /* Function the handles the change of the end date of the event */
  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  /* 
   * Function that handles the action of the user of clicking in the
   * 'Add Event' button.
   */
  const handleSendEvent = (values, actions) => {
    setIsSubmitting(true);

    /* Data that will be sent to the API. */
    const data = {
      community_id: community_id,
      title: values.title,
      start_date_and_time: startDate,
      end_date_and_time: endDate,
      format: format,
      location: location,
      image: imageUri,
      description: values.description
    };

    apiCall("events.add", data).then((response) => {
      setIsSubmitting(false);
      setIsSent(true);

      if (!response.success) {
        showError('An error occurred while adding event. Please try again.');
        console.error('ERROR_ADDING_EVENT: ', response);
        return;
      }

      console.log('EVENT_ADDED: ', response.data);

      /* Add the new event to the redux store */
      setEvents([response.data, ...events]);
      navigation.goBack();
    })
      .catch((error) => {
        console.error('ERROR_ADDING_EVENT: ', error);
        showError('An error occurred while adding an event. Please try again.');
        return;
      });

    actions.resetForm();
  };

  /* Displays the screen to add an event to the selected community */
  return (
    <View bg="white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        px={3}
      >
        <VStack>
          <Text
            bold
            fontSize="lg"
            mt={5}
            style={{
              alignSelf: 'center',
              color: '#64B058'
            }}>
            Create Event Form
          </Text>
          <Formik
            initialValues={{
              title: "",
              start_date_and_time: "",
              end_date_and_time: "",
              format: "",
              location: [],
              image: null,
              description: "",
              external_link: null
            }}
            validationSchema={validationSchema}
            onSubmit={handleSendEvent}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched
            }) => (
              <VStack>
                {/* Event Name */}
                <FormControl
                  mt={5}
                  isRequired
                  isInvalid={errors.title && touched.title}

                >
                  <FormControl.Label style={{ fontSize: 14 }}>
                    Event Name
                  </FormControl.Label>
                  <Input
                    variant="rounded"
                    size="lg"
                    placeholder="Event Name"
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    value={values.title}
                    mt={2}
                  />
                  {
                    errors.title && touched.title ? (
                      <FormControl.ErrorMessage
                        _text={{
                          fontSize: "xs",
                          color: "error.500",
                          fontWeight: 500,
                        }}
                      >
                        {errors.title}
                      </FormControl.ErrorMessage>
                    ) : null
                  }
                </FormControl>

                {/* Start Date */}
                <FormControl
                  mt={5}
                  isRequired
                  isInvalid={
                    errors.start_date_and_time &&
                    touched.start_date_and_time
                  }
                  style={{
                    flex: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: 10
                  }}
                >
                  <FormControl.Label>
                    Start date and time
                  </FormControl.Label>

                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="datetime"
                    display="default"
                    onChange={handleStartDateChange}
                  />
                  {
                    startDate &&
                    <Text ml={5} color="#64B058">
                      Start Date: {startDate
                        .toLocaleString()}
                    </Text>
                  }
                </FormControl>

                {/* End Date */}
                <FormControl
                  mt={5}
                  isRequired
                  isInvalid={
                    errors.end_date_and_time &&
                    touched.end_date_and_time
                  }
                  style={{
                    flex: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: 10,
                  }}
                >
                  <FormControl.Label>
                    End date and time
                  </FormControl.Label>

                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="datetime"
                    display="default"
                    onChange={handleEndDateChange}
                  />
                  {
                    endDate &&
                    <Text ml={5} color="#64B058">
                      End Date: {endDate
                        .toLocaleString()}
                    </Text>
                  }
                </FormControl>

                {/* Event Format */}
                <FormControl
                  mt={5}
                  isInvalid={
                    errors.format &&
                    touched.format
                  }
                >
                  <FormControl.Label>
                    Is this event?
                  </FormControl.Label>
                  <Radio.Group
                    name="format"
                    value={values.format}
                    onChange={(value) => {
                      setFormat(value);
                      handleChange("format")(value);
                    }}
                    onBlur={handleBlur("format")}
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      marginTop: 5
                    }}
                  >
                    <Radio
                      value="in-person"
                      my={1}
                    >
                      In-Person
                    </Radio>
                    <Radio
                      value="online"
                      my={1}
                    >
                      Online
                    </Radio>
                    <Radio
                      value="both"
                      my={1}
                    >
                      Both
                    </Radio>
                  </Radio.Group>
                  {
                    errors.format && touched.format ? (
                      <FormControl.ErrorMessage
                        _text={{
                          fontSize: "xs",
                          color: "error.500",
                          fontWeight: 500,
                        }}
                      >
                        {errors.format}
                      </FormControl.ErrorMessage>
                    ) : null
                  }
                </FormControl>

                {/* Event Link and/or Location */}
                <FormControl
                  mt={5}
                  isInvalid={
                    errors.location &&
                    touched.location
                  }
                >
                  {format === 'online' || format === 'both' ? (
                    <View
                      mb={5}
                    >
                      <FormControl.Label>
                        Link to Join Meeting
                      </FormControl.Label>
                      <Input
                        variant="rounded"
                        size="lg"
                        placeholder="Link to event meeting"
                        value={values.external_link}
                        onChangeText={handleChange("external_link")}
                        onBlur={handleBlur("external_link")}
                        style={{
                          marginTop: 10,
                        }}
                      />
                    </View>
                  ) : null}
                  {format === 'in-person' || format === 'both' ? (
                    <View>
                      <FormControl.Label>
                        Enter Location of Event
                      </FormControl.Label>
                      <Input
                        variant="rounded"
                        size="lg"
                        placeholder="Street Address"
                        value={location.address}
                        style={{
                          marginTop: 10,
                        }}
                      />
                      <Input
                        variant="rounded"
                        size="lg"
                        placeholder="Unit Number"
                        value={location.unit}
                        style={{
                          marginTop: 10,
                        }}
                      />
                      <Input
                        variant="rounded"
                        size="lg"
                        placeholder="City"
                        value={location.city}
                        style={{
                          marginTop: 10,
                        }}
                      />
                      <Input
                        variant="rounded"
                        size="lg"
                        placeholder="State"
                        value={location.state}
                        style={{
                          marginTop: 10,
                        }}
                      />
                      <Input
                        variant="rounded"
                        size="lg"
                        placeholder="Zipcode"
                        value={location.zipcode}
                        style={{
                          marginTop: 10,
                        }}
                      />
                    </View>
                  ) : null}
                </FormControl>

                {/* Event Image */}
                <FormControl
                  mt={5}
                  isInvalid={
                    errors.image && touched.image
                  }
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FormControl.Label
                    _text={{ textAlign: "center" }}
                  >
                    You can add an image to your event.
                    It should be your own picture,
                    or one you are sure is not
                    copyrighted material.
                  </FormControl.Label>
                  <Button
                    style={{
                      width: "50%",
                      marginTop: 10,
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
                          marginBottom: 10
                        }}
                      >
                        <Text
                          mt={5}
                          color="#64B058"
                        >
                          Selected image:
                        </Text>
                        <Image
                          source={imageUri}
                          style={{
                            width: 200,
                            height: 200,
                          }}
                          alt="image"
                        />
                      </View>
                    )
                  }
                </FormControl>

                {/* Event Description */}
                <FormControl
                  mt={3}
                  isRequired
                  isInvalid={
                    errors.description &&
                    touched.description
                  }
                  style={{
                    marginBottom: 10,
                    gap: 10,
                    marginTop: 30,
                  }}
                >
                  <FormControl.Label>
                    Event Description
                  </FormControl.Label>
                  <Input
                    size="lg"
                    borderRadius={25}
                    placeholder="Description"
                    textAlignVertical="top"
                    multiline={true}
                    height={40}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                  />
                  {
                    errors.description && touched.description ? (
                      <FormControl.ErrorMessage
                        _text={{
                          fontSize: "xs",
                          color: "error.500",
                          fontWeight: 500,
                        }}
                      >
                        {errors.description}
                      </FormControl.ErrorMessage>
                    ) : null
                  }
                </FormControl>

                {/* Submit Event */}
                <Button
                  mt={3}
                  mb={10}
                  bg="primary.400"
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  disabled={isSubmitting}
                  onPress={handleSubmit}
                >
                  SUBMIT EVENT
                </Button>
              </VStack>
            )}
          </Formik>
        </VStack>

        {/* 
                  * Modal for congratulating the user after the event 
                  * is added successfully to the community.
                  */}
        <Modal
          isOpen={isSent}
          onClose={() => setIsSent(false)}
        >
          <Modal.Content
            maxWidth="400px"
          >
            <Modal.Body>
              <Center
                mb="5"
              >
                <Icon
                  as={FontAwesomeIcon}
                  name="circle-check"
                  size="90px"
                  color="primary.600"
                />
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  py="5"
                >
                  Event successfully added!
                </Text>
                <Text
                  textAlign="center"
                >
                  People now can check your newly added event!
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
      </ScrollView>
    </View>
  );
}

/* 
 * Transforms the local state of the app into the properties of the 
 * AddEvent function, in which it is got from the API.
 */
const mapStateToProps = state => {
  return {
    events: state.events,
    user: state.user,
    activeCommunity: state.activeCommunity
  };
}

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the AddEvent properties.
 */
const mapDispatchToProps = dispatch => {
  return {
    setEvents: (events) => dispatch(setActionWithValue(SET_EVENT_LIST, events)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEvent);