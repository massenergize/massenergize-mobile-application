/******************************************************************************
 *                            TestimonialsScreen
 * 
 *      This page is responsible for rendering a list of testimonials.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 12, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useEffect, useState } from "react";
import { 
  Button, 
  Container, 
  View, ScrollView, 
  Text, 
  Pressable, 
  HStack, 
  VStack, 
  Select, 
  Heading 
} from "@gluestack-ui/themed-native-base";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleUniversalModalAction } from "../../config/redux/actions";
import AuthOptions from "../auth/AuthOptions";
import { StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TestimonialCard } from "./TestimonialCard";

function TestimonialsPage({ 
  navigation, 
  testimonials, 
  fireAuth, 
  toggleModal, 
  actions 
}) {
  /*
   * Uses local state to determine wheter the user has or not applied any 
   * filter to the testimonials page, if they selected the 
   * 'Filter Testimonials' button, what is the filter they applied to the page,
   * and the list of the filtered testimonials if filter is applied.
   */
  const [expand, setExpand] = useState(false);
  const [filter, setFilter] = useState('All');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);

  /* Check whether any filter is applied */
  useEffect(() => {
    /* If the filter is 'All', then no filter was applied */
    setIsFilterApplied(filter !== 'All');
  }, [filter]);

  /* 
   * Uses local state to get a list of the filtered testimonials once 
   * the user has chosen which filter they want to apply based on the 
   * actions of the community. 
   */
  useEffect(() => {
    const filtered = applyFilter(testimonials);
    setFilteredTestimonials(filtered);
  }, [testimonials, filter, actions]);

  /* 
   * Function that filters the testimonials according to the user's 
   * preferences on the filtering options.
   */
  const applyFilter = (testimonials) => {
    /* If the filter is 'All', then just return all the testimonials */
    if (filter === 'All') {
      return testimonials;
    } else {
      return testimonials.filter(testimonial => {
        /* 
         * Checks if testimonial.action is defined and either an array 
         * or an object.
         */
        if (!testimonial.action || 
            (Array.isArray(testimonial.action) && 
            testimonial.action.length === 0)) {
          /* Filter out testimonials without valid actions */
          return false;
        }
  
        /* Handles both array and object cases for testimonial.action */
        if (Array.isArray(testimonial.action)) {
          /* Case where testimonial.action is an array */
          const actionIds = testimonial.action.map(action => action.id);
          return actionIds.includes(filter);
        } else {
          /* Case where testimonial.action is a single object */
          return testimonial.action.id === filter;
        }
      });
    }
  };  

  /* Function that display the filter options for the user */
  function filterOptions() {
    return (
      <View style={styles.filterContainer}>
        <VStack
          space={2}
          style={styles.filterVStack}
        >
          <Select
            selectedValue={filter}
            onValueChange={(value) => setFilter(value)}
            style={styles.filterSelect}
          >
            <ScrollView>
              {/* 
                * Loops through all the community available actions to 
                * take and display them for the user to use as filters 
                * for the testimonials 
                */}
              <Select.Item label="All" value="All" />
              {actions.map((action, index) => (
                <Select.Item 
                  key={index} 
                  label={action.title} 
                  value={action.id} 
                />
              ))}
            </ScrollView>
          </Select>
        </VStack>
      </View>
    );
  }

  /* 
   * Function that displays the list of testimonials whether the user has set 
   * the filter they want to apply or not.
   */
  function TestimonialsList({ testimonials, title }) {
    /* Ensure testimonials is an array before proceeding */
    if (!Array.isArray(testimonials)) {
      return null;
    }

    /* Display the list of testimonials */
    return (
      <View height="100%">
        <Heading
          mx={5}
          my={3}
        >
          {title}
        </Heading>

        {testimonials.length === 0 ? (
            <Text 
              color="gray.300" 
              fontSize="sm" 
              textAlign="center" 
              mt={5}
            >
              No Testimonials with this filter...{"\n"}
              You can be the first one!
            </Text>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            {/* Given the list of testimonials, loop through all of them 
              * and display them as TestiminalCards.
              */}
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                navigation={navigation}
                data={testimonial}
                key={index}
                picture={testimonial.file != null}
              />
            ))}
          </ScrollView>
        )}
      </View>
    );
  }

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

  /* Displays the testimonials page and the applied filters */
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.title}>Testimonials</Text>

        {/* Filter Testimonials Button */}
        <Pressable
          onPress={() => setExpand(!expand)}
          style={styles.expandButton}
        >
          <HStack alignItems="center">
            <Ionicons
              name={expand ? "chevron-up-outline" : "filter"}
              color="#64B058"
            />
            <Text color="#64B058" ml="2">
              {expand ? "Collapse Filters" : "Filter Testimonials"}
            </Text>
          </HStack>
        </Pressable>

        {/* Filter Options */}
        {expand && filterOptions()}

        {/* 
          * Shows Add Testimonial button whenever the user hasn't 
          * expanded the filtering options.
          */}
        {!expand && renderAddTestimonial()}
        
        {/* 
          * Display filtered testimonials, otherwise display a list of All 
          * testimonials saved to that community.
          */}
        {isFilterApplied ? (
          <TestimonialsList 
            testimonials={filteredTestimonials} 
            title="Filtered Testimonials" 
          />
        ) : (
          /* Checks if there are no testimonials yet in the community */
          testimonials.length === 0 ? (
            <View style={styles.emptyList}>
              <Text 
                color="gray.400" 
                fontSize="sm" 
                textAlign="center" 
                mt={5}
              >
                No testimonials so far. Be the first one!
              </Text>
            </View>
          ) : (
            /* Displays all the testimonials */
            <TestimonialsList testimonials={testimonials} title="All" />
          )
        )}
        <Container h={10} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: 'center',
    padding: 20,
  },
  expandButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  filterContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  filterVStack: {
    alignItems: 'center',
  },
  filterSelect: {
    width: '90%',
    marginBottom: 15,
  },
});

/* 
 * Transforms the local state of the app into the proprieties of the 
 * TestimonialsPage function, in which it is got from the API.
 */
const mapStateToProps = state => ({
  testimonials: state.testimonials,
  fireAuth: state.fireAuth,
  actions: state.actions,
});

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the TestimonialsPage proprieties.
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  toggleModal: toggleUniversalModalAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TestimonialsPage);