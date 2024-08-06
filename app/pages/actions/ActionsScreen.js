/******************************************************************************
 *                            ActionsScreen
 * 
 *      This page displays all action cards in a horizontal scroll view. It
 *      is also possible to filter the actions by what you are, category, 
 *      impact, and cost.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 18, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState, useEffect } from 'react';
import ActionCard from './ActionCard';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView } from "react-native";
import {
  View,
  HStack,
  Text,
  Spinner,
  Center,
  VStack,
  Select,
  Pressable,
} from "@gluestack-ui/themed-native-base";
import { getActionMetric, getSuggestedActions } from "../../utils/common";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MEButton from '../../components/button/MEButton';
import { border } from 'native-base/lib/typescript/theme/styled-system';
import { BorderlessButton } from 'react-native-gesture-handler';
import MEDropdown from '../../components/dropdown/MEDropdown';
import MEInfoModal from '../../components/modal/MEInfoModal';
import FilterSelector from '../../components/filter/FilterSelector';

const ActionsScreen = ({ navigation, actions, questionnaire }) => {
  /*
   * Uses local state to determine wheter the user has or not applied any 
   * filter to the actions page, or if they selected the 'Expand Filters'
   * button, or what are the filters they applied to the page.
   */
  const [filter, setFilter] = useState({
    Category: "All",
    Role: "All",
    Impact: "All",
    Cost: "All"
  });
  const [expand, setExpand] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [filteredActions, setFilteredActions] = useState([]);


  /* Function that filters the actions according to the user's preferences */
  const applyFilter = (newFilter) => {

    if (newFilter.Role === 'All' &&
      newFilter.Category === 'All' &&
      newFilter.Impact === 'All' &&
      newFilter.Cost === 'All'
    ) {
      setIsFilterApplied(false);
    } else {
      setIsFilterApplied(true);
    }
    setFilter(newFilter);

    const newFilteredActions = actions.filter(action => {
      const actionTags = action.tags.map(tag => tag.name);

      return (newFilter.Role === 'All' || actionTags.includes(newFilter.Role)) &&
        (newFilter.Category === 'All' || actionTags.includes(newFilter.Category)) &&
        (newFilter.Impact === 'All' || actionTags.includes(newFilter.Impact)) &&
        (newFilter.Cost === 'All' || actionTags.includes(newFilter.Cost));
    });

    setFilteredActions(newFilteredActions);
  };

  /* List of suggested actions based on questionnaire profile */
  const suggestedActions = getSuggestedActions(questionnaire, actions);



  /* Displays the actions page and the applied filters */
  return (
    <View style={styles.container}>
      <ScrollView>


        {/* Header */}
        <HStack justifyContent="center" alignItems="center">
          <Text style={styles.title}>Actions</Text>
          <MEInfoModal>
            <Text
              bold
              color="primary.400"
              fontSize="lg"
            >
              Actions
            </Text>
            <Text>
              Actions are a central part of the community, representing the
              ways that a community member can directly work towards their
              carbon reduction goals. Actions are categorized by their impact
              and cost. You can filter the actions by your role as well as
              action category, impact, and cost.
            </Text>
          </MEInfoModal>
        </HStack>

        {/* Action filter */}
        <FilterSelector filter={filter} handleChangeFilter={applyFilter}>
          <FilterSelector.Filter name="Role">
            <FilterSelector.Option value="All" />
            <FilterSelector.Option value="Student" />
            <FilterSelector.Option value="Homeowner" />
            <FilterSelector.Option value="Renter" />
            <FilterSelector.Option value="Condo" />
            <FilterSelector.Option value="Business" />
          </FilterSelector.Filter>
          <FilterSelector.Filter name="Category">
            <FilterSelector.Option value="All" />
            <FilterSelector.Option value="Transportation" />
            <FilterSelector.Option value="Home Energy" />
            <FilterSelector.Option value="Waste & Recycling" />
            <FilterSelector.Option value="Food" />
            <FilterSelector.Option value="Activism & Education" />
            <FilterSelector.Option value="Solar" />
            <FilterSelector.Option value="Land, Soil, & Water" />
          </FilterSelector.Filter>
          <FilterSelector.Filter name="Impact">
            <FilterSelector.Option value="All" />
            <FilterSelector.Option value="High" />
            <FilterSelector.Option value="Medium" />
            <FilterSelector.Option value="Low" />
          </FilterSelector.Filter>
          <FilterSelector.Filter name="Cost">
            <FilterSelector.Option value="All" />
            <FilterSelector.Option value="0" />
            <FilterSelector.Option value="$" />
            <FilterSelector.Option value="$$" />
            <FilterSelector.Option value="$$$" />
          </FilterSelector.Filter>
        </FilterSelector>

        {/* Display loading spinner if actions are not loaded */}
        {!actions ? (
          <Center flex="1">
            <Spinner />
          </Center>
        ) : (
          <View>
            {isFilterApplied ? (
              /* Display filtered actions */
              <View>
                {
                  filteredActions.length === 0 ? (
                    <View>
                      <Text style={styles.category}>Filtered Actions</Text>
                      <Text
                        fontSize="xs"
                        textAlign="center"
                        px={10}
                        color="gray.400"
                        mt={10}
                      >
                        No actions were found with the filters...
                      </Text>
                    </View>
                  ) : (
                    ActionList(filteredActions, "Filtered Actions")
                  )
                }
              </View>
            ) : (
              /* 
               * Display all actions categorized by "All", "High Impact", 
               * and "Low Cost".
               */
              <View>
                {/* Suggested */}
                {
                  !isFilterApplied && !expand && (
                    <View width="100%" alignItems="center" justifyContent="center">
                      <MEButton
                        title="Update action preferences"
                        asLink
                        onPress={() => navigation.navigate("Questionnaire")}
                        style={{ margin: 15 }}
                      >
                        Update user preferences
                      </MEButton>
                    </View>
                  )
                }
                {
                  questionnaire &&
                  suggestedActions.length > 0 &&
                  suggestedActions.length < actions.length &&
                  ActionList(suggestedActions, "Suggested")
                }

                {/* All Actions */}
                {ActionList(actions, "All")}

                {/* High Impact */}
                {
                  ActionList(
                    actions
                      .filter(action => getActionMetric(action, "Impact") === "High"),
                    "High Impact")
                }


                {/* Low Cost */}
                {
                  ActionList(
                    actions
                      .filter(action => getActionMetric(action, "Cost") === "$"
                        || getActionMetric(action, "Cost") === "0"),
                    "Low Cost")
                }

              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );

  /* 
   * Function that displays the list of actions after the user has set 
   * the filters.
   */
  function ActionList(actions, title) {
    return (
      <>
        <Text style={styles.category}>{title}</Text>
        <ScrollView
          horizontal={true}
          persistentScrollbar={true}
          showsHorizontalScrollIndicator={false}
        >
          <HStack
            space={2}
            justifyContent="center"
            mx={15}
            marginBottom={15}
          >
            <Ionicons
              name="chevron-forward"
              size={40}
              color="#64B058"
              style={{ alignSelf: 'center' }}
            />
            {actions
              .map((action, index) => {
                return (
                  <ActionCard
                    key={index}
                    navigation={navigation}
                    id={action.id}
                    title={action.title}
                    imgUrl={action.image?.url}
                    impactMetric={getActionMetric(action, "Impact")}
                    costMetric={getActionMetric(action, "Cost")}
                  />
                );
              })}
            <Ionicons
              name="chevron-back"
              size={40}
              color="#64B058"
              style={{ alignSelf: 'center' }}
            />
          </HStack>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white'
  },
  category: {
    padding: 15,
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
  expandButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
  },
  appliedFilter: {
    borderRadius: 10,
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1,
    borderStyle: 'solid',
    margin: 5,
  },
});

/* 
 * Transforms the local state of the app into the properties of the 
 * ActionsScreen function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    actions: state.actions,
    questionnaire: state.questionnaire
  };
}

export default connect(mapStateToProps)(ActionsScreen);