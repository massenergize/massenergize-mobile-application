/******************************************************************************
 *                                 AddTeam
 * 
 *      This page is responsible for rendering the screen to add
 *      a team or subteam to the selected community.
 * 
 *      Written by: Moizes Almeida and Will Soylemez
 *      Last edited: July 18, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  VStack,
  FormControl,
  Input,
  Image,
  Button,
  IconButton,
  Icon,
  Select,
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
import { launchImageLibrary } from 'react-native-image-picker';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '../../components/icons';
import MEDropdown from '../../components/dropdown/MEDropdown';
import { KeyboardAvoidingView } from 'react-native';

/* 
 * This serves as a validation schema to prevent the user to add a
 * team or subteam to the selected community if all the required fields 
 * are not filled. 
 */
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
  /* Saves the community's ID into a variable */
  const community_id = activeCommunity.id;

  /* 
   * Uses local state to determine if the team or subteam is in the 
   * process to being added to the community or if it was already added. 
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  /* Uses local state to save the uri of the selected image. */
  const [imageUri, setImageUri] = useState(null);

  /* 
   * Uses local state to save the emails of the admins of the newly 
   * created team or subteam. 
   */
  const [adminsEmails, setAdminsEmails] = useState([user?.email]);

  /* Saves the name of each team in the community */
  const [teamsList, setTeamsList] = useState([]);

  /* Fetch the information from each team/sub-team */
  useEffect(() => {
    if (teams) {
      getTeams();
    }
  }, [teams]);

  /* Gets a list of the name of each team in the community */
  const getTeams = () => {
    const teamNames = teams
      .filter(team => team.team.parent === null)
      .map(team => team.team.name);

    setTeamsList(teamNames);
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

  /* 
   * Function that handles the action of adding an admin to the newly 
   * created team.
   */
  const handleAddAdmin = (email) => {
    if (!adminsEmails.includes(email)) {
      setAdminsEmails([...adminsEmails, email]);
    }
  };

  /* 
   * Function that handles the action of removing an admin to the newly 
   * created team.
   */
  const handleRemoveAdmin = (email) => {
    setAdminsEmails(adminsEmails.filter(e => e !== email));
  };

  /* 
   * Function that handles the action of the user of clicking in the
   * 'Add Team' button.
   */
  const handleSendTeam = (values, actions) => {
    setIsSubmitting(true);

    /* Data that will be sent to the API. */
    const data = {
      community_id: community_id,
      name: values.name,
      tagline: values.tagline,
      admin_emails: adminsEmails,
      description: values.description,
      // image: values.image,
      parent_id: values.parent
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
    <View bg="white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        px={3}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
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
                      onChangeText={handleChange("name")}
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
                      onChangeText={handleChange("tagline")}
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
                      onChangeText={handleChange("admins")}
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

                  {/* Image */}
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
                    <FormControl.Label>
                      Select a logo for your team
                    </FormControl.Label>
                    <Button
                      style={{
                        width: "50%",
                        marginTop: 10
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
                          <Text mt={5} color="#64B058">
                            Selected image:
                          </Text>
                          <Image
                            source={imageUri}
                            style={{
                              width: 200,
                              height: 200,
                            }}
                            alt="teams logo"
                          />
                        </View>
                      )
                    }
                  </FormControl>

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
                        onChange={
                          (itemValue) =>
                            setFieldValue('parent',
                              itemValue)
                        }
                        options={
                          teamsList.map((teamName, index) => ({
                              label: teamName,
                              value: teamName,
                            }))
                        }
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
        </KeyboardAvoidingView>
      </ScrollView>

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

/* 
 * Transforms the local state of the app into the properties of the 
 * AddTeam function, in which it is got from the API.
 */
const mapStateToProps = state => {
  return {
    teams: state.teamsStats,
    activeCommunity: state.activeCommunity,
    user: state.user
  };
}

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the AddTeam properties.
 */
const mapDispatchToProps = dispatch => {
  bindActionCreators({
    fetchAllUserInfo: fetchAllUserInfo,
  }, dispatch);

  return {
    setTeams: (teams) => dispatch(setActionWithValue(SET_TEAMS_STATS, teams)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTeam);