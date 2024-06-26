/******************************************************************************
 *                            ActionDetails
 * 
 *      This page is responsible for rendering details about
 *      a single action
 * 
 *      Written by: William Soylemez
 *      Last edited: June 6, 2023 (by Moizes Almeida)
 * 
 *****************************************************************************/

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Box,
  Image,
  VStack,
  ScrollView,
  Button,
  Container,
  HStack,
  Spacer,
  Spinner,
  Center,
  Modal,
} from "@gluestack-ui/themed-native-base";

import HTMLParser from "../../utils/HTMLParser";
import ServiceProviderCard from "../service-providers/ServiceProviderCard";
import { useDetails } from "../../utils/hooks";
import { TestimonialCard } from "../testimonials/TestimonialCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getActionMetric } from "../../utils/common";
import { apiCall } from "../../api/functions";
import AuthOptions from '../../pages/auth/AuthOptions';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { fetchAllUserInfo, toggleUniversalModalAction, updateUserAction } from '../../config/redux/actions';
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
  user,
  todoList,
  completedList
}) => {
  const { action_id } = route.params;

  const [activeTab, setActiveTab] = useState("description");
  const [action, isActionLoading] = useDetails("actions.info", {
    action_id: action_id,
  });
  const [isDoneOpen, setIsDoneOpen] = useState(false)
  const [isToDoOpen, setIsToDoOpen] = useState(false)

  // Functions to check if the action is in the user's todo or completed list
  const actionInToDo = () => {
    return todoList?.some((todo) => todo.action.id === action.id);
  }

  const actionCompleted = () => {
    return completedList?.some((completed) => completed.action.id === action.id);
  }

  /* Gets the action-user relation */

  // Handles a todo press, adding/removing the action to the user's todo list
  const handleTodoPress = async () => {
    if (fireAuth) {
      // Action depends on whether the action is already in the user's todo list
      if (actionInToDo()) {
        // Updates the backend, redux, and displays a success message
        const rel_id = todoList.find((todo) => todo.action.id === action_id).id;
        updateUserAction(
          "users.actions.remove",
          { id: rel_id },
          (response, error) => {
            if (error) return console.error("Failed to remove item from todo list:", error);
            setIsToDoOpen(false);
            console.log("Removed " + action.title + " from To-do");
          }
        );

      } else {
        // Updates the backend, redux, and displays a success message
        updateUserAction(
          "users.actions.todo.add",
          { action_id: action_id, hid: 1 },
          (response, error) => {
            if (error) return console.error("Failed to add item to todo list:", error);
            setIsToDoOpen(true);
            console.log("Added " + action.title + " to To-do");
          }
        );
      }
    } else { // if user is not logged in, prompt them to sign in
      toggleModal({
        isVisible: true,
        Component: AuthOptions,
        title: 'How would you like to sign in or Join ?',
      });
    }
  };

  // Handles a completed press, adding/removing the action to the user's
  // completed list
  const handleCompletedPress = async () => {
    if (fireAuth) {
      // Action depends on whether the action is already in the user's completed list
      if (actionCompleted()) {
        // Updates the backend, redux, and displays a success message
        const rel_id = completedList.find((completed) => completed.action.id === action_id).id;
        updateUserAction(
          "users.actions.remove",
          { id: rel_id },
          (response, error) => {
            console.log(response, error);
            if (error) return console.error("Failed to remove item from completed list:", error);
            console.log("Successfully removed item from completed list");
          }
        );
      } else {
        // Updates the backend, redux, and displays a success message
        updateUserAction(
          "users.actions.completed.add",
          { action_id: action_id, hid: 1 },
          (response, error) => {
            setIsDoneOpen(true);
            console.log("Successfully added item to completed list");
          }
        );
      }
    } else { // if user is not logged in, prompt them to sign in
      toggleModal({
        isVisible: true,
        Component: AuthOptions,
        title: 'How would you like to sign in or Join ?',
      });
    }
  };

  // get testimonials related to this action
  const actionTestimonials = (
    testimonialsSettings.is_published
      ? testimonials.filter(testimonial => testimonial.action?.id === action_id)
      : []
  );

  // individual functions to render the context for each tab in the action details page
  const generateDescriptionTab = () => {
    return <HTMLParser htmlString={action.about} baseStyle={textStyle} />;
  };

  const generateStepsTab = () => {
    return (
      <HTMLParser htmlString={action.steps_to_take} baseStyle={textStyle} />
    );
  };

  const generateDeepDiveTab = () => {
    if (action.deep_dive === "") {
      return <Text>No information available.</Text>;
    } else {
      return <HTMLParser htmlString={action.deep_dive} baseStyle={textStyle} />;
    }
  };

  const generateTestimonialsTab = () => {
    return actionTestimonials.length === 0 ? (
      <Text>No testimonials available.</Text>
    ) : (
      actionTestimonials.map((testimonial, index) => {
        return (
          <TestimonialCard
            navigation={navigation}
            data={testimonial}
            key={index}
            picture={testimonial.file != null}
          />
        );
      })
    );
  };

  const generateServiceProvidersTab = () => {
    if (action.vendors.length === 0) {
      return <Text>No associated service providers.</Text>;
    }
    return action.vendors.map((vendor, index) => {
      return (
        <ServiceProviderCard
          id={vendor.id}
          direction="row"
          description=""
          imageURI={vendor.logo.url}
          name={vendor.name}
          navigation={navigation}
          key={index}
        />
      );
    });
  };

  function TabButton({ label, name }) {
    return (
      <Button
        variant={activeTab === name ? "solid" : "outline"}
        onPress={() => setActiveTab(name)}
        mr={2}
      >
        {label}
      </Button>
    );
  }

  // render the appropriate tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return generateDescriptionTab();
      case "steps":
        return generateStepsTab();
      case "deep_dive":
        return generateDeepDiveTab();
      case "testimonials":
        return generateTestimonialsTab();
      case "service_providers":
        return generateServiceProvidersTab();
      default:
        return generateDescriptionTab();
    }
  };

  // Main render function
  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {/* Loading indicator */}
      {isActionLoading ? (
        <Center width="100%" height="100%">
          <Spinner />
        </Center>
      ) : (

        // Main content
        <View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack style={{ flex: 1 }}>

              {/* Header image */}
              <MEImage
                source={{
                  uri: action.image?.url,
                }}
                m={3}
                h={250}
                alt="image"
                resizeMode="contain"
                altComponent={<></>}
              />

              {/* Action details and buttons */}
              <Box bg="white" height="100%" mx={10}>
                <VStack>
                  <Text bold fontSize="2xl" my={10}>
                    {action.title}
                  </Text>
                  <VStack mb={4} >
                    <HStack justifyContent="space-between" width="100%">
                      <Text bold fontSize="lg">
                        Impact
                      </Text>
                      <Text fontSize="lg">
                        {getActionMetric(action, "Impact")}
                      </Text>
                    </HStack>
                    <HStack justifyContent="space-between" width="100%">
                      <Text bold fontSize="lg">
                        Cost
                      </Text>
                      <Text fontSize="lg">{getActionMetric(action, "Cost")}</Text>
                    </HStack>
                  </VStack>
                  <HStack justifyContent="space-between" width="100%" mb={5}>
                    <Button
                      size="md"
                      variant={actionInToDo() ? "outline" : "solid"}
                      key={actionInToDo() ? "todo" : "not_todo"}
                      _text={{
                        color: actionInToDo() ? "green" : "white",
                        fontWeight: "bold",
                      }}
                      onPress={handleTodoPress}>
                      {actionInToDo() ? "Action in To-Do list!" : "Add to To-Do"}
                    </Button>
                    <Button
                      size="md"
                      variant={actionCompleted() ? "outline" : "solid"}
                      key={actionCompleted() ? "completed" : "not_completed"}
                      _text={{
                        color: actionCompleted() ? "primary.600" : "white",
                        fontWeight: "bold",
                      }}
                      onPress={handleCompletedPress}>
                      {actionCompleted() ? "Action Completed!" : "Mark as Done"}
                    </Button>
                  </HStack>

                  {/* Tab buttons */}
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    borderBottomWidth={1}
                    borderBottomColor="grey"
                    pb={5}
                    mb={2}
                  >
                    <TabButton label="Description" name="description" />
                    <TabButton label="Steps" name="steps" />
                    {action.deep_dive !== "" ? (
                      <TabButton label="Deep Dive" name="deep_dive" />
                    ) : null}
                    {(
                      testimonialsSettings.is_published
                      && actionTestimonials.length > 0
                    ) ? (
                      <TabButton label="Testimonials" name="testimonials" />
                    ) : null}
                    {(
                      vendorsSettings.is_published
                      && action.vendors.length > 0
                    ) ? (
                      <TabButton
                        label="Service Providers"
                        name="service_providers"
                      />
                    ) : null}
                    <Container width={5}></Container>
                  </ScrollView>

                  {/* Display the tab content */}
                  <Box>{renderTabContent()}</Box>
                </VStack>
              </Box>
            </VStack>
            <Container height={20}></Container>
          </ScrollView>

          {/* Modal for when the user marks the action as done */}
          <Modal isOpen={isDoneOpen} onClose={() => { }}>
            <Modal.Content maxWidth={400}>
              <Modal.Body>
                <Center mb="5">
                  <Ionicons name={"ribbon-outline"} size={90} color="#64B058" />
                  <Text fontSize="xl" fontWeight="bold" py={2}>
                    Congratulations!
                  </Text>
                  <Text textAlign="center" fontSize="lg">
                    You just completed{" "}
                    <Text bold color="primary.600">
                      {action.title}
                    </Text>
                    !
                  </Text>
                </Center>
                <HStack width="100%" justifyContent={"center"}>

                  {/* Testimonial button temporarily disabled while waiting for user funcitonality */}
                  <Button
                    color={"primary.600"}
                    onPress={() => {
                      setIsDoneOpen(false);
                      navigation.navigate("AddTestimonial", { action_id: action_id });
                    }}
                    mr={3}
                  >
                    Leave a Testimonial
                  </Button>
                  <Button
                    variant={"outline"}
                    px={5}
                    onPress={() => setIsDoneOpen(false)}
                  >
                    Close
                  </Button>
                </HStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>

          {/* Modal for when the user adds the action to their to-do list */}
          <Modal isOpen={isToDoOpen} onClose={() => { }}>
            <Modal.Content maxWidth={400}>
              <Modal.Body>
                <Center mb="5">
                  <Ionicons name={"ribbon-outline"} size={90} color="#64B058" />
                  <Text fontSize="xl" fontWeight="bold" py={2}>
                    Nice!
                  </Text>
                  <Text textAlign="center" fontSize="lg">
                    You just added  <Text bold color="primary.600">{action.title}</Text> to your To-Do list!
                  </Text>
                </Center>
                <HStack width="100%" justifyContent={"center"}>
                  <Button variant={"outline"} px={5} onPress={() => setIsToDoOpen(false)}>
                    Exit
                  </Button>
                </HStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </View>
      )}
    </View>
  );
}

const textStyle = {
  fontSize: "16px",
};

const mapStateToProps = (state) => ({
  testimonials: state.testimonials,
  testimonialsSettings: state.testimonialsPage,
  vendorsSettings: state.vendorsPage,
  fireAuth: state.fireAuth,
  user: state.user,
  todoList: state.userTodo,
  completedList: state.userCompleted,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleModal: toggleUniversalModalAction,
      fetchAllUserInfo: fetchAllUserInfo
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionDetails);