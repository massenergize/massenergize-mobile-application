/******************************************************************************
 *                            ActionDetails
 * 
 *      This page is responsible for rendering details about
 *      a single action
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 18, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState } from "react";
import {
  View,
  Text,
  Box,
  VStack,
  ScrollView,
  Button,
  Container,
  HStack,
  Spinner,
  Center,
  Modal,
  Divider,
} from '@gluestack-ui/themed-native-base';
import Accordion from 'react-native-collapsible/Accordion';
import HTMLParser from "../../utils/HTMLParser";
import ServiceProviderCard from "../service-providers/ServiceProviderCard";
import { useDetails } from "../../utils/hooks";
import { TestimonialCard } from "../testimonials/TestimonialCard";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getActionMetric, showError } from "../../utils/common";
import AuthOptions from "../auth/AuthOptions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchAllUserInfo,
  toggleUniversalModalAction,
  updateUserAction,
} from '../../config/redux/actions';
import MEImage from "../../components/image/MEImage";
import { Alert, Linking, TouchableOpacity } from "react-native";
import { Icon as SocialIcons } from 'react-native-elements';
import Share from 'react-native-share';
import { COLOR_SCHEME } from "../../stylesheet";
import { act } from "react-test-renderer";
import {
  logEventAddCompletedAction,
  logEventAddTodoAction,
  logEventRemoveCompletedAction,
  logEventRemoveTodoAction,
  logEventShareAction
} from "../../api/analytics";
import DateTimePicker from '@react-native-community/datetimepicker';

const ActionDetails = ({
  route,
  navigation,
  testimonials,
  testimonialsSettings,
  vendorsSettings,
  fireAuth,
  toggleModal,
  fetchAllUserInfo,
  todoList,
  completedList,
  communityInfo
}) => {
  /* Saves the action ID passed through the route */
  const { action_id } = route.params;

  /* 
   * Based on the action ID passed through the route, access the action 
   * information in the API.
   */
  const [action, isActionLoading] = useDetails("actions.info", { action_id });

  /* 
   * Uses local state to determine what are the active sections in the
   * acordian layout, if the Modal for when the user completed an action
   * should be opened, and when the user clicks on the "Add to To-Do" 
   * button.
   */
  const [activeSection, setActiveSection] = useState(0);
  const [isDoneOpen, setIsDoneOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  /* We want to track the date the action was completed */
  const [completedDate, setCompletedDate] = useState(new Date());

  /* Function that checks if this action is in the user's to-do list */
  const actionInToDo = () => todoList?.some(
    (todo) => todo.action.id === action_id
  );

  /* Function that checks if the action was previously completed by the user */
  const actionCompleted = () => completedList?.some(
    (completed) => completed.action.id === action_id
  );

  /* 
   * Function that handles when the user clicks in the 'Add to To-Do' button. 
   * If the user had clicked there previously, then it will remove the action 
   * from the user's to-do list, otherwise it is going to add it to the user's
   * to-do list. In case the user is not logged in, it will ask the user to 
   * log in or join before adding an action to their to-do list. 
   */
  const handleTodoPress = async () => {
    if (fireAuth) {
      if (actionInToDo()) {
        const rel_id = todoList.find(
          (todo) => todo.action.id === action_id
        ).id;

        updateUserAction("users.actions.remove", { id: rel_id }, (res, error) => {
          if (error) {
            return console.error(
              "Failed to remove item from To-Do list: ",
              error
            );
          }
          logEventRemoveTodoAction(action_id);
        });
      } else {
        updateUserAction("users.actions.todo.add", { action_id, hid: 1 }, (res, error) => {
          if (error) {
            console.error(
              "Failed to add item in To-Do list: ",
              error
            );
          }
          logEventAddTodoAction(action_id);
        });
      }
    } else {
      toggleModal({
        isVisible: true,
        Component: AuthOptions,
        title: 'How would you like to sign in or Join?'
      });
    }
  };

  /* 
   * Function that handles when the user clicks in the 'Mark as Completed'
   * button. If the user had clicked there previously, then it will remove the
   * action from the user's completed actions list, otherwise it is going to 
   * add it to the user's completed actions list. In case the user is not 
   * logged in, it will ask the user to log in or join before marking an 
   * action as completed. 
   */
  const handleCompletedPress = async () => {
    setIsConfirmationOpen(false);
    if (fireAuth) {
      if (actionCompleted()) {
        const rel_id = completedList.find(
          (completed) => completed.action.id === action_id
        ).id;

        updateUserAction("users.actions.remove", { id: rel_id }, (res, error) => {
          if (error) {
            showError("Error removing action from completed list");
            return console.log(
              "Failed to remove item from completed list: ",
              error
            );
          }
          logEventRemoveCompletedAction(action_id);
        });
      } else {
        const completedDateStr = completedDate.toISOString().split('T')[0];
        setCompletedDate(new Date());
        updateUserAction(
          "users.actions.completed.add",
          { action_id, hid: 1, date_completed: completedDateStr },
          (res, error) => {
            if (error) {
              showError("Error adding action to completed list");
              return console.error(
                "Failed to add item in completed list: ",
                error
              );
            }
            logEventAddCompletedAction(action_id);
            setIsDoneOpen(true);
          }
        );
      }
    } else {
      toggleModal({
        isVisible: true,
        Component: AuthOptions,
        title: 'How would you like to sign in or Join?'
      });
    }
  };

  /* 
   * Variable that holds all the testimonials associated to this action, 
   * if there is any. 
   */
  const actionTestimonials =
    testimonialsSettings.is_published
      ? testimonials.filter(testimonial => testimonial.action?.id === action_id)
      : [];

  /* 
   * Function that, depending on which section the user is on in the 
   * Accordion layout, it will generate different contents for each section 
   * fetching the information from the API.
   */
  const generateSectionContent = (section) => {
    switch (section) {
      case "Description":
        return <HTMLParser
          htmlString={action?.about || ''}
          baseStyle={textStyle}
        />
      case "Steps":
        return <HTMLParser
          htmlString={action?.steps_to_take || ''}
          baseStyle={textStyle}
        />
      case "Deep Dive":
        return action?.deep_dive
          ? <HTMLParser
            htmlString={action.deep_dive}
            baseStyle={textStyle}
          />
          : null;
      case "Testimonials":
        return actionTestimonials.length === 0
          ? null
          : actionTestimonials.map(
            (testimonial, index) => (
              <TestimonialCard
                navigation={navigation}
                data={testimonial}
                key={index}
                picture={testimonial.file != null}
              />
            )
          );
      case "Service Providers":
        return action?.vendors.length === 0
          ? null
          : action.vendors.map(
            (vendor, index) => (
              <ServiceProviderCard
                id={vendor.id}
                direction="row"
                description=""
                imageURI={vendor.logo.url}
                name={vendor.name}
                navigation={navigation}
                key={index}
              />
            )
          );
      default:
        return null;
    }
  };

  /* 
   * Variable that holds all the section the user could access, 
   * including title for the section and a condition for the section 
   * to show up in the page. It filters the available sections for this
   * action based on whether the condition was met.
   */
  const SECTIONS = [
    {
      title: "Description"
    },
    {
      title: "Steps"
    },
    {
      title: "Deep Dive",
      condition: action?.deep_dive !== "",
    },
    {
      title: "Testimonials",
      condition: testimonialsSettings.is_published &&
        actionTestimonials.length > 0,
    },
    {
      title: "Service Providers",
      condition: vendorsSettings.is_published &&
        action?.vendors.length > 0,
    }
  ].filter(section => section.condition !== false);

  /* Function that renders the content of the section in the accordion layout */
  const renderContent = (section) => {
    return (
      <Box
        p={3}
      >
        {generateSectionContent(section.title)}
      </Box>
    );
  };

  /* 
   * Function that renders the Social Icon button that allows the user
   * to share the action.
   */
  const SocialIcon = ({ name, onPress }) => {
    /* Configuration of styling for the button */
    let iconName, colorHex;

    if (name === 'facebook') {
      iconName = 'facebook';
      colorHex = '#3b5998';
    } else if (name === 'linkedin') {
      iconName = 'linkedin';
      colorHex = '#0a66c2';
    } else if (name === 'email') {
      iconName = 'envelope';
      colorHex = '#004f9f';
    }

    /* Calls on the onPress function passed as a parameter to this function */
    const handlePress = () => {
      onPress();
    };

    /* Displays the Social icon button */
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          marginHorizontal: 15,
          paddingBottom: 20,
        }}
      >
        <SocialIcons
          name={iconName}
          type='font-awesome'
          color={colorHex}
          size={30}
        />
      </TouchableOpacity>
    );
  };

  /* 
   * Function that handles displaying the Social Icon buttons for the user
   * to share about the action with others.
   */
  const shareActionButtons = () => {
    /* Creates an array with all the options of sharing for the user */
    const socialIcons = [
      { name: 'facebook', onPress: () => shareAction('facebook') },
      { name: 'linkedin', onPress: () => shareAction('linkedin') },
      { name: 'email', onPress: () => shareAction('email') },
    ];

    /* Renders the Social Icons */
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        {socialIcons.map((icon, index) => (
          <SocialIcon
            key={index}
            name={icon.name}
            onPress={icon.onPress}
          />
        ))}
      </View>
    );
  };

  /* Function that handles the action of pressing in one of the Social Icons */
  const shareAction = async (platform) => {
    /* Update the analytics for the user sharing the action */
    logEventShareAction(action_id, platform);

    /* 
     * Creates the share option for the user, including a title, message,
     * description, and url.
     */
    const shareOptions = {
      title: 'Share Action',
      message: `Check out this cool action: ${action.title}\n\nDescription: ${action.about}\n.`,
      url: `https://community.massenergize.org/${communityInfo.subdomain}/actions/${action_id}`,
      failOnCancel: false,
    };

    /* Share on social media or email or copy to clipboard */
    try {
      if (platform === 'facebook') {
        await Share.shareSingle({
          ...shareOptions,
          social: Share.Social.FACEBOOK,
        });
      } else if (platform === 'linkedin') {
        const linkedInUrl = `https://www.linkedin.com/share/share-offsite/?url=${encodeURIComponent(shareOptions.url)}`;
        Linking.openURL(linkedInUrl);
      } else if (platform === 'email') {
        await Share.open({
          ...shareOptions,
          social: Share.Social.EMAIL,
          email: '',
        });
      }
    } catch (error) {
      console.log('Error sharing action: ', error);
    }
  }

  /* Displays the action information in a accordion layout */
  return (
    <View
      height="100%"
      bg="white"
    >
      {/* If the content is still loading, display a Spinner */}
      {isActionLoading ? (
        <Center
          width="100%"
          height="100%"
        >
          <Spinner />
        </Center>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <VStack
            flex={1}
          >
            {/* 
              * Checks whether the action has an image or not. 
              * Display the image if available, or an empty, 
              * gray box otherwise.
              */}
            {action.image?.url ? (
              <MEImage
                source={{ uri: action.image?.url }}
                m={3}
                h={250}
                alt="action image"
                resizeMode="contain"
                altComponent={<></>}
              />
            ) : (
              <Box
                height={120}
                bg="gray.300"
                borderTopRadius="xl"
              />
            )}

            <Box
              bg="white"
              height="100%"
              mx={5}
            >
              <VStack>
                {/* Action Title */}
                <Text
                  bold
                  fontSize="2xl"
                  my={5}
                >
                  {action.title}
                </Text>

                {/* Action Metrics */}
                <VStack mb={4}>
                  <HStack
                    justifyContent="space-between"
                    width="100%"
                  >
                    {/* Impact data */}
                    <HStack space={2}>
                      <Text bold fontSize="lg">Impact</Text>
                      <Text fontSize="lg">
                        {getActionMetric(action, "Impact")}
                      </Text>
                    </HStack>

                    {/* Cost data */}
                    <HStack space={2}>
                      <Text bold fontSize="lg">Cost</Text>
                      <Text fontSize="lg">
                        {getActionMetric(action, "Cost")}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>

                {/* Action buttons */}
                <HStack
                  justifyContent="space-between"
                  width="100%"
                  mb={5}
                >
                  {/* Add to To-Do List button */}
                  <Button
                    size="md"
                    variant={actionInToDo() ? "outline" : "solid"}
                    key={actionInToDo() ? "todo" : "not_todo"}
                    _text={{
                      color: actionInToDo() ? "green" : "white",
                      fontWeight: "bold"
                    }}
                    onPress={handleTodoPress}
                  >
                    {actionInToDo() ? "Action in To-Do list!" : "Add to To-Do"}
                  </Button>

                  {/* Mark as Completed button */}
                  <Button
                    size="md"
                    variant={actionCompleted() ? "outline" : "solid"}
                    key={actionCompleted() ? "completed" : "not_completed"}
                    _text={{
                      color: actionCompleted() ? "primary.600" : "white",
                      fontWeight: "bold"
                    }}
                    onPress={() => setIsConfirmationOpen(true)}
                  >
                    {actionCompleted() ? "Action Completed!" : "Mark as Done"}
                  </Button>
                </HStack>

                {/* Tab buttons to navigate through the sections */}
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  {SECTIONS.map((section, index) => (
                    <Button
                      onPress={() => setActiveSection(index)}
                      key={index + " " + (activeSection === index)}
                      variant={activeSection === index ? "solid" : "outline"}
                      mr={2}
                    >
                      {section.title}
                    </Button>
                  ))}
                </ScrollView>
                {renderContent(SECTIONS[activeSection])}

                {/* Display the option to share the action with others. */}
                <>
                  <Divider my={4} />

                  <Text
                    fontSize="xs"
                    textAlign="center"
                    px={10}
                    pb={3}
                    color="gray.400"
                  >
                    Share this Action!
                  </Text>

                  {shareActionButtons()}
                </>
              </VStack>
            </Box>
          </VStack>
          <Container height={20}></Container>
        </ScrollView>
      )}

      {/* Modal displayed to confirm action completion */}
      <Modal
        isOpen={isConfirmationOpen}
        onClose={() => { }}
      >
        <Modal.Content maxWidth={400}>
          <Modal.Body>

            <Text
              fontSize="xl"
              fontWeight="bold"
              py={2}
              textAlign="center"
            >
              Confirm
            </Text>

            <Text
              fontSize="md"
              textAlign="center"
              // mb={5}
            >
              Mark action as {actionCompleted() ? "uncompleted" : "done"}?
            </Text>

            {!actionCompleted() && (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 10,
                }}
              >
                <Text
                  mb={2}
                >
                  When did you complete this action?
                </Text>
                <DateTimePicker
                  value={completedDate}
                  onChange={(event, selectedDate) => {
                    setCompletedDate(selectedDate || completedDate);
                  }}
                  mode="date"
                  display="default"
                />
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}
            >
              <Button
                onPress={() => setIsConfirmationOpen(false)}
                colorScheme="red"
              >
                Cancel
              </Button>
              <Button
                onPress={handleCompletedPress}
              >
                Confirm
              </Button>
            </View>
          </Modal.Body>
        </Modal.Content>

      </Modal>

      {/* Modal displayed when the user marks the action as completed */}
      <Modal
        isOpen={isDoneOpen}
        onClose={() => { }}
      >
        <Modal.Content maxWidth={400}>
          <Modal.Body>
            <Center mb="5">
              <Ionicons
                name={"ribbon-outline"}
                size={90}
                color="#64B058"
              />

              <Text
                fontSize="xl"
                fontWeight="bold"
                py={2}
              >
                Congratulations!
              </Text>

              <Text
                fontSize="md"
                textAlign="center"
              >
                This action has been marked as done!
                We are so grateful for your action.
              </Text>
            </Center>
          </Modal.Body>

          <Button.Group
            space={2}
            justifyContent="center"
            pb={2}
          >
            <Button
              onPress={() => {
                setIsDoneOpen(false);
                fetchAllUserInfo();
              }}
            >
              Awesome
            </Button>
          </Button.Group>
        </Modal.Content>
      </Modal>
    </View>
  );
};

const textStyle = {
  fontSize: "16px",
};

/* 
 * Transforms the local state of the app into the proprieties of the 
 * ActionDetails function, in which it is got from the API.
 */
const mapStateToProps = (state) => ({
  testimonials: state.testimonials,
  testimonialsSettings: state.testimonialsPage,
  vendorsSettings: state.vendorsPage,
  fireAuth: state.fireAuth,
  user: state.user,
  todoList: state.userTodo,
  completedList: state.userCompleted,
  communityInfo: state.communityInfo,
});

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the ActionDetails proprieties.
 */
const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleModal: toggleUniversalModalAction,
  fetchAllUserInfo,
  updateUserAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionDetails);