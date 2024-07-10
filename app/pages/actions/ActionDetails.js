/******************************************************************************
 *                            ActionDetails
 * 
 *      This page is responsible for rendering details about
 *      a single action
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 10, 2024
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
} from '@gluestack-ui/themed-native-base';
import Accordion from 'react-native-collapsible/Accordion';
import HTMLParser from "../../utils/HTMLParser";
import ServiceProviderCard from "../service-providers/ServiceProviderCard";
import { useDetails } from "../../utils/hooks";
import { TestimonialCard } from "../testimonials/TestimonialCard";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getActionMetric } from "../../utils/common";
import AuthOptions from "../auth/AuthOptions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchAllUserInfo,
  toggleUniversalModalAction,
  updateUserAction,
} from '../../config/redux/actions';
import MEImage from "../../components/image/MEImage";

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
  const [activeSections, setActiveSections] = useState([]);
  const [isDoneOpen, setIsDoneOpen] = useState(false);
  const [isToDoOpen, setIsToDoOpen] = useState(false);

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
          setIsToDoOpen(false);
        });
      } else {
        updateUserAction("users.actions.todo.add", { action_id, hid: 1 }, (res, error) => {
          if (error) {
            console.error(
              "Failed to add item in To-Do list: ",
              error
            );
          }
          setIsToDoOpen(true);
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
    if (fireAuth) {
      if (actionCompleted()) {
        const rel_id = completedList.find(
          (completed) => completed.action.id === action_id
        ).id;

        updateUserAction("users.actions.remove", { id: rel_id }, (res, error) => {
          if (error) {
            return console.log(
              "Failed to remove item from completed list: ",
              error
            );
          }
        });
      } else {
        updateUserAction("users.actions.completed.add", { action_id, hid: 1 }, (res, error) => {
          setIsDoneOpen(true);
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

  /* Function that renders the Header of the Section in the accordion layout */
  const renderHeader = (section, _, isActive) => {
    return (
      <Box>
        <HStack
          justifyContent="center"
          alignItems="center"
          p={3}
          bg={isActive ? "gray.200" : "white"}
          borderTopRadius={5}
        >
          <Text 
            bold
            color={isActive ? "black" : "green"}
            mr={2}
          >
            {section.title}
          </Text>
          <Ionicons
            name={isActive ? "chevron-up-outline" : "chevron-down-outline"}
            size={20}
            color={isActive ? "black" : "green"}
          />
        </HStack>
      </Box>
    );
  };

  /* Function that renders the content of the section in the accordion layout */
  const renderContent = (section) => {
    return (
      <Box
        p={3}
        bg={"gray.100"}
      >
        {generateSectionContent(section.title)}
      </Box>
    );
  };

  /* Displays the action information in a accordion layout */
  return (
    <View
      height="100%"
      bg="white"
    >
      {/* If the content is still loading, display a Spinner */}
      { isActionLoading ? (
        <Center
          width="100%"
          height="100%"
        >
          <Spinner />
        </Center>
      ) : (
        <ScrollView
          showVerticalScrollIndicator={false}
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
                    onPress={handleCompletedPress}
                  >
                    {actionCompleted() ? "Action Completed!" : "Mark as Done"}
                  </Button>
                </HStack>
                
                {/* Accordion that displays the action information */}
                <Accordion
                  sections={SECTIONS}
                  activeSections={activeSections}
                  renderHeader={renderHeader}
                  renderContent={renderContent}
                  onChange={setActiveSections}
                />
              </VStack>
            </Box>
          </VStack>
          <Container height={20}></Container>
        </ScrollView>
      )}

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