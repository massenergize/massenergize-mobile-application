/******************************************************************************
 *                                 AddEvent
 * 
 *      This page is responsible for rendering the screen to add
 *      an event to the selected community.
 * 
 *      Written by: Moizes Almeida and Will Soylemez
 *      Last edited: July 19, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
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
  Select,
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
import { Alert, KeyboardAvoidingView } from "react-native";
import MEDropdown from "../../components/dropdown/MEDropdown";
import ImagePicker from "../../components/imagePicker/ImagePicker";

/* 
 * This serves as a validation schema to prevent the user to add an
 * event to the selected community if all the required fields 
 * are not filled. 
 */
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Name of event is required")
    .min(5, "Name of event must be at least 5 characters"),
  description: Yup.string()
    .required("Description is required"),
  format: Yup.string()
    .required("Event format is required"),
  external_link_type: Yup.string().when('format', {
    is: (value) => value === 'online' || value === 'both',
    then: () => Yup.string().required('Link type is required'),
    otherwise: () => Yup.string().notRequired(),
  }),
  external_link: Yup.string().when('format', {
    is: (value) => value === 'online' || value === 'both',
    then: () => Yup.string().required('External link is required').url('Must be a valid URL'),
    otherwise: () => Yup.string().notRequired(),
  }),
});



const AddEvent = ({
  navigation,
  events,
  user,
  activeCommunity,
  setEvents,
  route
}) => {
  /* Check if we're in edit mode with an event */
  const { event, editMode } = route?.params ?? {};

  /* Saves the community's ID into a variable */
  const community_id = activeCommunity.id;

  /* 
   * Create a new time and set it to be a week away from now and 
   * the time to be at 7pm. 
   */
  const oneWeekAway = new Date();
  oneWeekAway.setDate(oneWeekAway.getDate() + 7);
  oneWeekAway.setHours(19, 0, 0, 0);

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
   * 
   * Set the start time to be a week away from now starting at 7pm and the 
   * end time to be 8pm on the same day.
   */
  const [startDate, setStartDate] = useState(oneWeekAway);
  const [endDate, setEndDate] = useState(new Date(
    oneWeekAway.getTime() + 60 * 60 * 1000
  ));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  /* Uses local state to save the uri of the selected image. */
  const [imageData, setImageData] = useState(null);

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
            onPress: () => { }
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
   * Saves the information about the location the event will take 
   * place. This is an optional field completed by the user, 
   * and starts assuming that the event will take place in some 
   * location within the state of Massachusetts.
   */
  const [location, setLocation] = useState({
    "address": event?.location?.address ?? "",
    "city": event?.location?.city ?? "",
    "country": "US",
    "state": "MA",
    "building": event?.location?.building ?? "",
    "room": event?.location?.room ?? "",
  });

  /* 
   * Function that handles the selection of an image for the newly 
   * added event.
   */
  const handleSelectImage = (newImageData) => {
    /* Image settings */
    setImageData(newImageData);
    setIsFormDirty(true);
  };

  /* Function the handles the change of the start date of the event */
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setIsFormDirty(true);
    }
  };

  /* Function the handles the change of the end date of the event */
  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      setIsFormDirty(true);
    }
  };

  /* Function that handles the user changing location data */
  const handleChangeLocation = (field, value) => {
    setLocation({ ...location, [field]: value });
    setIsFormDirty(true);
  };

  /* 
   * Function that handles the action of the user of clicking in the
   * 'Add Event' button.
   */
  const handleSendEvent = (values, actions) => {
    setIsSubmitting(true);

    /* Data that will be sent to the API. */
    const data = {
      // General info
      community_id: community_id,
      name: values.title,
      start_date_and_time: startDate?.toISOString(),
      end_date_and_time: endDate?.toISOString(),
      ...(imageData ? {image: imageData} : null),
      event_type: values.format,
      description: values.description,

      // Location info
      ...((values.format === 'in-person' || values.format === 'both') ? location : null),

      // Online info
      ...(values.format === 'online' || values.format === 'both' ? {
        external_link_type: values.external_link_type,
        external_link: values.external_link,
      } : null),

      // Existing event if editing
      ...(editMode ? { event_id: event.id } : null)
    };

    console.log(data);

    apiCall(editMode ? "events.update" : "events.add", data)
      .then((response) => {
        setIsSubmitting(false);
        setIsFormDirty(false);

        if (!response.success) {
          showError('An error occurred while adding event. Please try again.');
          console.error('ERROR_ADDING_EVENT: ', response);
          return;
        }

        console.log('EVENT_ADDED');
        setIsSent(true);

        /* Add the new event to the redux store */
        if (editMode) {
          const newEvents = events.map(e => e.id === event.id ? response.data : e);
          setEvents(newEvents);
        } else {
          setEvents([response.data, ...events]);
        }
        actions.resetForm();
      })
      .catch((error) => {
        console.error('ERROR_ADDING_EVENT: ', error);
        showError('An error occurred while adding an event. Please try again.');
        return;
      });

  };

  /* Displays the screen to add an event to the selected community */
  return (
    <View bg="white" height="100%">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
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
                title: event?.name ?? "",
                start_date_and_time: event?.start_date_and_time ?? "",
                end_date_and_time: event?.end_date_and_time ?? "",
                format: event?.event_type ?? "",
                location: location,
                image: null,
                description: event?.description ?? "",
                external_link_type: event?.external_link_type ?? "",
                external_link: event?.external_link ?? "",
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
                      onChangeText={(value) => {
                        handleChange("title")(value);
                        setIsFormDirty(true);
                      }}
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
                      How is this event being hosted?
                    </FormControl.Label>
                    <Radio.Group
                      name="format"
                      value={values.format}
                      onChange={(value) => {
                        handleChange("format")(value);
                        setIsFormDirty(true);
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
                    mx={7}
                    isInvalid={
                      errors.location &&
                      touched.location
                    }
                  >
                    {values.format === 'in-person' || values.format === 'both' ? (
                      <View>
                        <FormControl.Label mt={5}>
                          Enter Location of Event
                        </FormControl.Label>
                        <Input
                          variant="rounded"
                          size="lg"
                          placeholder="Building Name"
                          value={location.building}
                          style={{
                            marginTop: 10,
                          }}
                          onChangeText={
                            (value) => {
                              handleChangeLocation("building", value);
                              setIsFormDirty(true);
                            }
                          }
                        />
                        <Input
                          variant="rounded"
                          size="lg"
                          placeholder="Room"
                          value={location.room}
                          style={{
                            marginTop: 10,
                          }}
                          onChangeText={
                            (value) => {
                              handleChangeLocation("room", value);
                              setIsFormDirty(true);
                            }
                          }
                        />
                        <Input
                          variant="rounded"
                          size="lg"
                          placeholder="Street Address"
                          value={location.address}
                          style={{
                            marginTop: 10,
                          }}
                          onChangeText={
                            (value) => {
                              handleChangeLocation("address", value);
                              setIsFormDirty(true);
                            }
                          }
                        />
                        <Input
                          variant="rounded"
                          size="lg"
                          placeholder="City"
                          value={location.city}
                          style={{
                            marginTop: 10,
                          }}
                          onChangeText={
                            (value) => {
                              handleChangeLocation("city", value);
                              setIsFormDirty(true);
                            }
                          }
                        />
                      </View>
                    ) : null}
                    {values.format === 'online' || values.format === 'both' ? (
                      <View
                        mt={5}
                        gap={2}
                      >
                        <FormControl.Label>
                          Link Information
                        </FormControl.Label>
                        <FormControl
                          isInvalid={
                            errors.external_link &&
                            touched.external_link
                          }
                        >

                          <Input
                            variant="rounded"
                            size="lg"
                            placeholder="Paste link here"
                            value={values.external_link}
                            onChangeText={(value) => {
                              handleChange("external_link")(value);
                              setIsFormDirty(true);
                            }}
                            onBlur={handleBlur("external_link")}
                            style={{
                              marginTop: 10,
                            }}
                          />
                          {
                            errors.external_link && touched.external_link ? (
                              <FormControl.ErrorMessage
                                _text={{
                                  fontSize: "xs",
                                  color: "error.500",
                                  fontWeight: 500,
                                }}
                              >
                                {errors.external_link}
                              </FormControl.ErrorMessage>
                            ) : null
                          }
                        </FormControl>

                        <FormControl
                          isInvalid={
                            errors.external_link_type &&
                            touched.external_link_type
                          }
                        >
                          <Radio.Group
                            name="external_link_type"
                            value={values.external_link_type}
                            onChange={(value) => {
                              handleChange("external_link_type")(value);
                              setIsFormDirty(true);
                            }}
                            onBlur={handleBlur("external_link_type")}
                            style={{
                              flexDirection: 'col',
                              gap: 10,
                              marginTop: 5
                            }}
                          >
                            <Radio
                              value="Join"
                              my={1}
                            >
                              This is a link to join the event
                            </Radio>
                            <Radio
                              value="Registration"
                              my={1}
                            >
                              This is a link to register for the event
                            </Radio>
                          </Radio.Group>
                          {
                            errors.external_link_type && touched.external_link_type ? (
                              <FormControl.ErrorMessage
                                _text={{
                                  fontSize: "xs",
                                  color: "error.500",
                                  fontWeight: 500,
                                }}
                              >
                                {errors.external_link_type}
                              </FormControl.ErrorMessage>
                            ) : null
                          }
                        </FormControl>
                      </View>
                    ) : null}
                  </FormControl>

                  {/* Event Image */}
                  <Text mb={2}>
                    You can add an image to your event.
                    It should be your own picture, or one you are sure is not
                    copyrighted material.
                  </Text>
                  <ImagePicker onChange={handleSelectImage} />

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
                      onChangeText={(value) => {
                        handleChange("description")(value);
                        setIsFormDirty(true);
                      }}
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
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 
        * Modal for congratulating the user after the event 
        * is added successfully to the community.
        */}
      <Modal
        isOpen={isSent}
        onClose={() => setIsSent(false)}
      >
        <Modal.Content
          maxWidth={400}
        >
          <Modal.Body>
            <Center
              mb="5"
            >
              <FontAwesomeIcon
                name="check"
                size={90}
                color="green"
              />
              <Text
                fontSize="lg"
                fontWeight="bold"
                py="5"
              >
                Event successfully {editMode ? 'updated' : 'added'}!
              </Text>
              <Text
                textAlign="center"
              >
                People now can check your newly added event!
              </Text>
            </Center>
            <Button
              colorScheme={"gray"}
              onPress={() => {
                setIsSent(false);
                setIsFormDirty(false);
                navigation.navigate('CommunityPages');
              }}
            >
              Back
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </View >
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