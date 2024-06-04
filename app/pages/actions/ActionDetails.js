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
// import { TestimonialCard } from "../TestimonialsPage/TestimonialsCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getActionMetric } from "../../utils/common";
import { apiCall } from "../../api/functions";
import AuthOptions from '../../pages/auth/AuthOptions';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { test, toggleUniversalModalAction } from '../../config/redux/actions';
import MEImage from "../../components/image/MEImage";

const ActionDetails = ({
  route,
  navigation,
  testimonials,
  testimonialsSettings,
  vendorsSettings,
  fireAuth,
  toggleModal,
}) => {
  const { action_id } = route.params;
  const [activeTab, setActiveTab] = useState("description");

  const [action, isActionLoading] = useDetails("actions.info", {
    action_id: action_id,
  });

  const [isDoneOpen, setIsDoneOpen] = useState(false)
  const [isToDoOpen, setIsToDoOpen] = useState(false)
  const [completedActions, setCompletedActions] = useState([])
  const [toDoActions, setToDoActions] = useState([])
  const [userEmail, setUserEmail] = useState("");

  apiCall("users.info").then((json) => {
    if (json.success) {
      setUserEmail(json.data.email);
      console.log("Fetched email: ", userEmail, " Completed")
    } else {
      console.log("User Info Failed");
      console.log(json);
      // if (callBackFn) callBackFn(null, json.error);
    }
  });

  const handleAddToDo = async (email) => {
    try {

      const response = await apiCall('users.actions.todo.add', { action_id: action_id, hid: 1 });
      if (response.success) {
        // Update the todoList in context with the new item
        console.log("Added object to", email);
        setToDoActions([...toDoActions, response.data]);
      } else {
        console.log('Failed to add item to todo list:', response.error);
      }
    } catch (error) {
      console.log('API Error:', error);
    }
    console.log("Added object to", email);
  };

  const handleCompleted = async (email) => {
    try {
      
      const response = await apiCall('users.actions.completed.add', { action_id: action_id, hid: 1 });
      if (response.success) {
        // Update the todoList in context with the new item
        console.log("Completed object to", email);
        setCompletedActions([...toDoActions, response.data]);
      } else {
        console.log('Failed to add item to todo list:', response.error);
      }
    } catch (error) {
      console.log('API Error:', error);
    }
    console.log("Completed object to", email);
  };
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

  // for the testimonials associated with this action
  const [actionTestimonials, setActionTestimonials] = useState([]);

  // get testimonials related to this action
  const getTestimonials = () => {
    if (testimonialsSettings.is_published) {
      const relatedTestimonials = [];
      for (let i = 0; i < testimonials.length; i++) {
        if (testimonials[i].action?.id === action_id) {
          relatedTestimonials.push(testimonials[i]);
        }
      }
      console.log(relatedTestimonials);
      setActionTestimonials(relatedTestimonials);
    }
  };

  // only retrieve associated testimonials once
  useEffect(() => {
    getTestimonials();
  }, []);

  const generateTestimonialsTab = () => {
    return actionTestimonials.length === 0 ? (
      <Text>No testimonials available.</Text>
    ) : (
      actionTestimonials.map((testimonial, index) => {
        return (
          // <TestimonialCard
          //   navigation={navigation}
          //   data={testimonial}
          //   key={index}
          //   picture={testimonial.file != null}
          // /> TODO: uncomment this when testimonials implemented
          <Text>Testimonial</Text>
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

  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>
      {isActionLoading ? (
        <Center width="100%" height="100%">
          <Spinner size="lg" />
        </Center>
      ) : (
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
                      variant="solid"
                      _text={{
                        color: "white",
                        fontWeight: "bold",
                      }}
                      onPress={() => {
                        if (fireAuth) {
                          handleAddToDo(userEmail, action);
                          setIsToDoOpen(true);
                          toDoActions.push({ name: action });
                          console.log("Added " + action.title + " to To-do");
                        }
                        else 
                        {
                          toggleModal({
                            isVisible: true,
                            Component: AuthOptions,
                            title: 'How would you like to sign in or Join ?',
                          });
                        }
                      }}>
                      Add to To-Do
                    </Button>
                    <Button
                      size="md"
                      variant="solid"
                      _text={{
                        color: "white",
                        fontWeight: "bold",
                      }}
                      onPress={() => {
                        if (fireAuth) { // Replace "condition" with your actual condition
                          handleCompleted(userEmail, action);
                          setIsDoneOpen(true);
                          completedActions.push({name: action});
                          console.log("Added " + action.title + " Completed");
                        }
                        else 
                        {
                          toggleModal({
                            isVisible: true,
                            Component: AuthOptions,
                            title: 'How would you like to sign in or Join ?',
                          });
                        }
                      }}>
                      Done
                    </Button>
                  </HStack>
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
                    {/* {testimonialsSettings.is_published ? (
                      <TabButton label="Testimonials" name="testimonials" />
                    ) : null} TODO: uncomment when testimonials implemented*/}
                    {(vendorsSettings.is_published && action.vendors.length > 0) ? (
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
          <Modal isOpen={isDoneOpen} onClose={() => {}}>
            <Modal.Content maxWidth="400px">
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
                    onPress={() => {setIsDoneOpen(false), navigation.navigate("addTestimonial")}} 
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
      
          <Modal isOpen={isToDoOpen} onClose={() => {}}>
            <Modal.Content maxWidth="400px">
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
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {toggleModal: toggleUniversalModalAction},
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionDetails);