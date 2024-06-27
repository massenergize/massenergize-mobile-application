/******************************************************************************
 *                            ActionsScreen
 * 
 *      This page displays all action cards in a horizontal scroll view. It
 *      is also possible to filter the actions by what you are, category, 
 *      impact, and cost.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: June 25, 2023
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState, useEffect } from 'react';
import ActionCard from './ActionCard';
import { connect } from 'react-redux';
import { StyleSheet } from "react-native";
import {
  View,
  ScrollView,
  HStack,
  Text,
  Spinner,
  Center,
  VStack,
  Select,
  Pressable,
} from "@gluestack-ui/themed-native-base";
import { getActionMetric } from "../../utils/common";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MEButton from '../../components/button/MEButton';

const ActionsScreen = ({ navigation, actions, questionnaire }) => {
  /*
   * Uses local state to determine wheter the user has or not applied any 
   * filter to the actions page, or if they selected the 'Expand Filters'
   * button, or what are the filters they applied to the page.
   */
  const [userType, setUserType] = useState('All');
  const [category, setCategory] = useState('All');
  const [impact, setImpact] = useState('All');
  const [cost, setCost] = useState('All');
  const [expand, setExpand] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  /* Check if any filter is applied */
  useEffect(() => {
    if (userType !== 'All' ||
      category !== 'All' ||
      impact !== 'All' ||
      cost !== 'All') {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [userType, category, impact, cost]);

  /* Function that filters the actions according to the user's preferences */
  const applyFilter = (actions) => {
    return actions.filter(action => {
      const actionTags = action.tags.map(tag => tag.name);

      return (userType === 'All' || actionTags.includes(userType)) &&
        (category === 'All' || actionTags.includes(category)) &&
        (impact === 'All' || actionTags.includes(impact)) &&
        (cost === 'All' || actionTags.includes(cost));
    });
  };

  /* List of suggested actions based on questionnaire profile */
  const suggestedActions = actions.filter(action => {
    const actionTags = action.tags.map(tag => tag.name);

    return (
      (questionnaire?.categories.some(category => actionTags.includes(category))) &&
      (questionnaire?.type === 'All' || actionTags.includes(questionnaire.type)) &&
      (questionnaire?.impact === 'All' || actionTags.includes(questionnaire.impact)) &&
      (questionnaire?.cost === 'All' || actionTags.includes(questionnaire.cost))
    );
  });


  /* Variable that holds the list of filtered actions */
  const filteredActions = applyFilter(actions);

  /* Displays the actions page and the applied filters */
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <Text style={styles.title}>Actions</Text>

        {/* Expand Filter Button */}
        <Pressable
          onPress={() => setExpand(!expand)}
          style={styles.expandButton}
        >
          <HStack mt={2} alignItems="center">
            <Ionicons
              name={
                expand ? "chevron-up-outline" : "search"
              }
              color="#64B058"
            />
            <Text color="#64B058" ml={2}>
              Expand Filters
            </Text>
          </HStack>
        </Pressable>

        {/* Filter Options */}
        {expand && filterOptions()}

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
                {ActionList(filteredActions, "Filtered Actions")}
              </View>
            ) : (
              /* 
               * Display all actions categorized by "All", "High Impact", 
               * and "Low Cost".
               */
              <View>
                {/* Suggested */}
                {questionnaire && suggestedActions.length > 0 &&
                  ActionList(suggestedActions, "Suggested")
                }
                <View width="100%" alignItems="center" justifyContent="center">
                  <MEButton
                    title="Update action preferences"
                    asLink
                    onPress={() => navigation.navigate("Questionnaire")}
                    style={{ margin: 15 }}
                  >
                    Update action preferences
                  </MEButton>
                </View>

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

  function filterOptions() {
    return <View style={styles.filterContainer}>
      <VStack
        space={2}
        style={styles.filterVStack}
      >
        <Text>I am a...</Text>
        <Select
          selectedValue={userType}
          onValueChange={(value) => setUserType(value)}
          style={styles.filterSelect}
        >
          <Select.Item label="All" value="All" />
          <Select.Item label="Student" value="Student" />
          <Select.Item label="Homeowner" value="Homeowner" />
          <Select.Item label="Renter" value="Renter" />
          <Select.Item label="Condo" value="Condo" />
          <Select.Item label="Business" value="Business" />
        </Select>

        <Text>Category</Text>
        <Select
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
          style={styles.filterSelect}
        >
          <Select.Item label="All" value="All" />
          <Select.Item label="Transportation" value="Transportation" />
          <Select.Item label="Home Energy" value="Home Energy" />
          <Select.Item label="Waste & Recycling" value="Waste & Recycling" />
          <Select.Item label="Food" value="Food" />
          <Select.Item label="Activism & Education" value="Activism & Education" />
          <Select.Item label="Solar" value="Solar" />
          <Select.Item label="Land, Soil, & Water" value="Land, Soil, & Water" />
        </Select>

        <Text>Impact</Text>
        <Select
          selectedValue={impact}
          onValueChange={(value) => setImpact(value)}
          style={styles.filterSelect}
        >
          <Select.Item label="All" value="All" />
          <Select.Item label="High" value="High" />
          <Select.Item label="Medium" value="Medium" />
          <Select.Item label="Low" value="Low" />
        </Select>

        <Text>Cost</Text>
        <Select
          selectedValue={cost}
          onValueChange={(value) => setCost(value)}
          style={styles.filterSelect}
        >
          <Select.Item label="All" value="All" />
          <Select.Item label="0" value="0" />
          <Select.Item label="$" value="$" />
          <Select.Item label="$$" value="$$" />
          <Select.Item label="$$$" value="$$$" />
        </Select>
      </VStack>
    </View>;
  }

  function ActionList(actions, title) {
    return (
      <>
        <Text style={styles.category}>{title}</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <HStack
            space={2}
            justifyContent="center"
            mx={15}
            marginBottom={15}
          >
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
  }
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