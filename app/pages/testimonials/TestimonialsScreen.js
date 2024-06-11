/******************************************************************************
 *                            TestimonialsScreen
 * 
 *      This page is responsible for rendering a list of testimonials.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 5, 2023
 * 
 *****************************************************************************/


import React, { useContext } from "react";
import { Button, Container } from "@gluestack-ui/themed-native-base";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";

import { TestimonialCard } from "./TestimonialCard";
import MEButton from "../../components/button/MEButton";
import { bindActionCreators } from "redux";
import { toggleUniversalModalAction } from "../../config/redux/actions";
import AuthOptions from "../auth/AuthOptions";

function TestimonialsPage({ navigation, testimonials, fireAuth, toggleModal }) {

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {
        <View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Button title="Add Testimonial" onPress={() => {
              if (fireAuth) navigation.navigate("AddTestimonial");
              else {
                toggleModal({
                  isVisible: true,
                  Component: AuthOptions,
                  title: 'How would you like to sign in or Join ?',
                });
              }}}
              m={5}
            >
              Add Testimonial
            </Button>
            {
              testimonials.map((item, index) => {
                return (
                  <TestimonialCard navigation={navigation} data={item} key={index} picture={item.file != null} />
                )
              })
            }
            <Container h={10} />
          </ScrollView>
          {/* Button to create a new testimonial - waiting on dashboard/user context */}
          {/* <Button bg="primary.400" size="lg" onPress={() => props.navigation.navigate("welcome")} position="absolute" bottom={2} right={2}>ADD TESTIMONIAL</Button> */}
          {/* <Pressable onPress={() => navigation.navigate("addTestimonial")} position="absolute" bottom={5} right={5}>
            <Box p={4} bg="primary.400" borderRadius="full" alignItems="center" justifyContent="center">
              <Ionicons name={"add-outline"} color="white" size={30}/>
            </Box>
          </Pressable> */}
        </View>
      }
    </View>
  );
}

const mapStateToProps = state => {
  return {
    testimonials: state.testimonials,
    fireAuth: state.fireAuth
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    toggleModal: toggleUniversalModalAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestimonialsPage);