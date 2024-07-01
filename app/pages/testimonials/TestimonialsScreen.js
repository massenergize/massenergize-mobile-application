/******************************************************************************
 *                            TestimonialsScreen
 * 
 *      This page is responsible for rendering a list of testimonials.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 1, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useContext } from "react";
import { 
  Button, 
  Container, 
  View, 
  ScrollView,
  Text
} from "@gluestack-ui/themed-native-base";
import { connect } from "react-redux";
import { TestimonialCard } from "./TestimonialCard";
import { bindActionCreators } from "redux";
import { toggleUniversalModalAction } from "../../config/redux/actions";
import AuthOptions from "../auth/AuthOptions";

function TestimonialsPage({ navigation, testimonials, fireAuth, toggleModal }) {

  /* Renders the Add Testimonial button */
  const renderAddTestimonial = () => {
    return (
      <Button
        title="Add Testimonial"
        onPress={() => {
          if (fireAuth) navigation.navigate("AddTestimonial");
          else {
            toggleModal({
              isVisible: true,
              Component: AuthOptions,
              title: 'How would you like to sign in or Join?',
            });
          }
        }}
        m={5}
        px={10}
        width="50%"
        alignSelf="center"
      >
        Add Testimonial
      </Button>
    );
  }

  /* Displays the list of testimonials */
  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {
        <View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              renderAddTestimonial()
            }
            {
              testimonials.length === 0 ? (
                <View 
                  style={{ 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginTop: 250 
                  }}
                >
                    <Text fontSize="xs"
                      textAlign="center"
                      px={10}
                      color="gray.400"
                    >
                      No testimonials so far. Be the first one!
                    </Text>
                </View>
              ) :
                testimonials.map((item, index) => {
                  return (
                    <TestimonialCard 
                      navigation={navigation} 
                      data={item} 
                      key={index} 
                      picture={item.file != null} 
                    />
                  )
                })
            }
            <Container h={10} />
          </ScrollView>
        </View>
      }
    </View>
  );
}

/* 
 * Transforms the local state of the app into the proprieties of the 
 * TestimonialsPage function, in which it is got from the API.
 */
const mapStateToProps = state => {
  return {
    testimonials: state.testimonials,
    fireAuth: state.fireAuth
  }
}

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the TestimonialsPage proprieties.
 */
const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    toggleModal: toggleUniversalModalAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestimonialsPage);