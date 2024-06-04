import React, { useContext } from "react";
import { Container } from "@gluestack-ui/themed-native-base";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";

import { TestimonialCard } from "./TestimonialsCard.js";

function TestimonialsPage({ navigation, testimonials }) {

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {
        <View>
          <ScrollView showsVerticalScrollIndicator={false}>
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
    testimonials: state.testimonials
  }
}

export default connect(mapStateToProps)(TestimonialsPage);