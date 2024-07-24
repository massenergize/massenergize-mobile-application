import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  VStack,
  FormControl,
  Input,
  Button,
  IconButton,
  Icon,
  Modal,
  Center
} from '@gluestack-ui/themed-native-base';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { apiCall } from '../../api/functions';
import { showError } from '../../utils/common';
import {
  fetchAllUserInfo,
  setActionWithValue
} from '../../config/redux/actions';
import { SET_TEAMS_STATS } from '../../config/redux/types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '../../components/icons';
import MEDropdown from '../../components/dropdown/MEDropdown';
import { Alert, KeyboardAvoidingView } from 'react-native';
import ImagePicker from '../../components/imagePicker/ImagePicker';

const validationSchema = Yup.object({
  name: Yup.string().required("Name of Team is required"),
  tagline: Yup.string().required("Tagline of Team is required"),
  description: Yup.string().required("Description is required")
});

const AddTeam = ({
  navigation,
  teams,
  activeCommunity,
  user,
  setTeams
}) => {
  const community_id = activeCommunity.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [adminsEmails, setAdminsEmails] = useState([user?.email]);
  const [teamsList, setTeamsList] = useState([]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  
  useEffect(() => {
    if (teams) {
      getTeams();
    }
  }, [teams]);

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

  const getTeams = () => {
    const teamNames = teams
      .filter(team => team.team.parent === null)
      .map(team => ({ label: team.team.name, value: team.team.id })); // Changed here
  
    setTeamsList(teamNames);
  }  

  const handleSelectImage = (newImageData) => {
    setImageData(newImageData);
    setIsFormDirty(true);
  };

  const handleAddAdmin = (email) => {
    if (!adminsEmails.includes(email)) {
      setAdminsEmails([...adminsEmails, email]);
      setIsFormDirty(true);
    }
  };

  const handleRemoveAdmin = (email) => {
    setAdminsEmails(adminsEmails.filter(e => e !== email));
    setIsFormDirty(true);
  };

  const handleSendTeam = (values, actions) => {
    setIsSubmitting(true);
  
    const data = {
      community_id: community_id,
      name: values.name,
      tagline: values.tagline,
      admin_emails: adminsEmails,
      description: values.description,
      logo: imageData,
      parent_id: values.parent ? parseInt(values.parent, 10) : null  // Ensure parent_id is a number
    };
  
    apiCall("teams.add", data)
      .then((response) => {
        setIsSubmitting(false);
  
        if (!response.success) {
          showError('An error occurred while adding team. Please try again.');
          console.log('ERROR_ADDING_TEAM: ', response);
          return;
        }
  
        setIsSent(true);
        console.log('TEAM_ADDED: ', response.data);
        setIsFormDirty(false);
      })
      .catch((error) => {
        console.error('ERROR_ADDING_TEAM: ', error);
        showError('An error occurred while adding team. Please try again.');
        return;
      });
  
    actions.resetForm();
  };
  

  /* Displays the form to create a new team */
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
              }}
            >
              Create Team
            </Text>

            <Formik
              initialValues={{
                name: "",
                tagline: "",
                description: "",
                admins: [],
                image: null,
                parent: null
              }}
              validationSchema={validationSchema}
              onSubmit={handleSendTeam}
            >
              {({
                handleChange,
                handleBlur,
                setFieldValue,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <VStack>
                  {/* Name */}
                  <FormControl
                    mt={5}
                    isRequired
                    isInvalid={errors.name && touched.name}
                  >
                    <FormControl.Label>
                      Name
                    </FormControl.Label>
                    <Input
                      variant="rounded"
                      size="lg"
                      placeholder="What your team will be known by..."
                      onChangeText={(value) => {
                        handleChange("name")(value);
                        setIsFormDirty(true);
                      }}
                      onBlur={handleBlur("name")}
                      value={values.name}
                      style={{
                        marginTop: 10,
                      }}
                    />
                    {
                      errors.name && touched.name ? (
                        <FormControl.ErrorMessage
                          _text={{
                            fontSize: "xs",
                            color: "error.500",
                            fontWeight: 500
                          }}
                        >
                          {errors.name}
                        </FormControl.ErrorMessage>
                      ) : null
                    }
                  </FormControl>

                  {/* Tagline */}
                  <FormControl
                    mt={5}
                    isRequired
                    isInvalid={
                      errors.tagline && touched.tagline
                    }
                  >
                    <FormControl.Label>
                      Tagline
                    </FormControl.Label>
                    <Input
                      mt={2}
                      size="lg"
                      borderRadius={25}
                      placeholder="A catchy slogan for your team..."
                      textAlignVertical="top"
                      multiline={true}
                      height={10}
                      onChangeText={(value) => {
                        handleChange("tagline")(value);
                        setIsFormDirty(true);
                      }}
                      onBlur={handleBlur("tagline")}
                      value={values.tagline}
                    />
                    {
                      errors.tagline && touched.tagline ? (
                        <FormControl.ErrorMessage
                          _text={{
                            fontSize: "xs",
                            color: "error.500",
                            fontWeight: 500,
                          }}
                        >
                          {errors.tagline}
                        </FormControl.ErrorMessage>
                      ) : null
                    }
                  </FormControl>

                  {/* Admins */}
                  <FormControl
                    mt={5}
                    isInvalid={errors.admins && touched.admins}
                  >
                    <FormControl.Label>
                      Add team admins here with their emails
                    </FormControl.Label>
                    <Input
                      size="lg"
                      borderRadius={25}
                      placeholder="Enter an admin email and click <Add>..."
                      onChangeText={(value) => {
                        handleChange("admins")(value);
                        setIsFormDirty(true);
                      }}
                      onBlur={handleBlur("admins")}
                      value={values.admins}
                      style={{
                        marginTop: 10,
                        width: '80%',
                      }}
                    />
                    <Button
                      style={{
                        width: '30%',
                        marginTop: 15,
                      }}
                      onPress={() => handleAddAdmin(values.admins)}
                    >
                      Add
                    </Button>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                      }}
                    >
                      {
                        adminsEmails.map(email => (
                          <View
                            key={email}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 25,
                              backgroundColor: 'white',
                            }}
                            shadow={3}
                          >
                            <Text
                              pl={3}
                            >
                              {email}
                            </Text>
                            <IconButton
                              icon={<Icon as={FontAwesomeIcon} name="close" />}
                              onPress={() => handleRemoveAdmin(email)}
                            />
                          </View>
                        ))
                      }
                    </View>
                  </FormControl>

                  {/* Description */}
                  <FormControl
                    mt={5}
                    isRequired
                    isInvalid={
                      errors.description &&
                      touched.description
                    }
                  >
                    <FormControl.Label>
                      Description
                    </FormControl.Label>
                    <Input
                      mt={3}
                      size="lg"
                      borderRadius={25}
                      placeholder="Describe your team. Who are you and what brings you together?..."
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

                  <Text mt={7} mb={3} fontWeight="300" textAlign="center">
                    Select a logo for your team
                  </Text>
                  <ImagePicker onChange={handleSelectImage} />

                  {/* Parent */}
                  {
                    teamsList.length !== 0 ? (
                      <FormControl
                        mt={5}
                        isInvalid={
                          errors.parent && touched.parent
                        }
                        style={{
                          gap: 10
                        }}
                      >
                        <FormControl.Label>
                          Parent Team
                        </FormControl.Label>
                        <Text>
                          You can pick a parent team to
                          which all of your members'
                          actions will also
                          automatically contribute
                        </Text>
                        <MEDropdown
                          mt={2}
                          borderRadius={10}
                          mb={3}
                          selectedValue={values.parent}
                          minWidth={200}
                          accessibilityLabel="Choose Category"
                          placeholder="Choose which team is the parent team"
                          onChange={(itemValue) => {
                            setFieldValue('parent', itemValue);
                            setIsFormDirty(true);
                          }}
                          options={teamsList}
                        />
                      </FormControl>
                    ) : null}

                  {/* Submit Team */}
                  <Button
                    mt={5}
                    mb={10}
                    bg="primary.400"
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    disabled={isSubmitting}
                    onPress={handleSubmit}
                  >
                    ADD TEAM
                  </Button>
                </VStack>
              )}
            </Formik>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 
        * Modal for congratulating the user after the team or 
        * subteam is added successfully to the community.
        */}
      <Modal
        isOpen={isSent}
        onClose={() => setIsSent(false)}
      >
        <Modal.Content maxWidth={400}>
          <Modal.Body>
            <Center mb="5">
              <Icon
                as={FontAwesomeIcon}
                name="check-circle"
                size="lg"
                color="primary.600"
              />
              <Text
                fontSize="lg"
                fontWeight="bold"
                py="5"
              >
                Team successfully added!
              </Text>
              <Text textAlign="center">
                People now can join your team!
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

const mapStateToProps = state => {
  return {
    teams: state.teamsStats,
    activeCommunity: state.activeCommunity,
    user: state.user
  };
}

const mapDispatchToProps = dispatch => {
  bindActionCreators({
    fetchAllUserInfo: fetchAllUserInfo,
  }, dispatch);

  return {
    setTeams: (teams) => dispatch(setActionWithValue(SET_TEAMS_STATS, teams)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTeam);
