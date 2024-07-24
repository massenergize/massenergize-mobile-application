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
import MEDropdown from "../../components/dropdown/MEDropdown";
import MEInfoModal from "../../components/modal/MEInfoModal";
import FilterSelector from "../../components/filter/FilterSelector";

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
  const [filter, setFilter] = useState({ Action: 'All' });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);


  /* 
   * Function that filters the testimonials according to the user's 
   * preferences on the filtering options.
   */
  const applyFilter = (newFilter) => {
    setFilter(newFilter);

    /* If the filter is 'All', then just return all the testimonials */
    if (newFilter.Action === 'All') {
      setIsFilterApplied(false);
    } else {
      setIsFilterApplied(true);
    }
    const newFilteredTestimonials = testimonials.filter(testimonial => {
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
        return actionIds.includes(newFilter.Action);
      } else {
        /* Case where testimonial.action is a single object */
        return testimonial.action.id === newFilter.Action;
      }
    });

    setFilteredTestimonials(newFilteredTestimonials);
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
        <HStack justifyContent="center" alignItems="center">
          <Text style={styles.title}>Testimonials</Text>
          <MEInfoModal>
            <Text
              color="primary.400"
              bold
              fontSize="lg"
            >
              Testimonials
            </Text>
            <Text>
              Testimonials are a great way to share your experiences about
              taking action with the community. Read what others
              have to say and share your own story.
            </Text>

          </MEInfoModal>
        </HStack>

        {/* Filter Testimonials Button */}
        <FilterSelector filter={filter} handleChangeFilter={applyFilter}>
          <FilterSelector.Filter name="Action">
            <FilterSelector.Option value="All" />
            {
              /* Filter by Action */
              actions.map((action, index) => (
                <FilterSelector.Option
                  key={index}
                  value={action.id}
                  label={action.title}
                />
              ))
            }
          </FilterSelector.Filter>
        </FilterSelector>

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