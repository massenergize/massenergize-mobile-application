/******************************************************************************
 *                           Questionnaire
 * 
 *      This page is responsible for rendering the screen to set
 *      the user's preferences for the recommended actions sections.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 25, 2024 (by Will Soylemez)
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
} from '@gluestack-ui/themed-native-base';
import { StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setQuestionnaireInfo } from "../../config/redux/actions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUESTIONNAIRE_DATA } from "../../utils/values";

const Questionnaire = ({
  navigation,
  questionnaire,
  setQuestionnaireInfo
}) => {
  /*
   * Uses local state to determine whether the user has selected 
   * the options for their preferences for the type, categories they
   * would like to see in recommendations, impact and cost of actions.
   */
  const [selectedType, setSelectedType] = useState(questionnaire?.type || "");
  const [selectedCategory, setSelectedCategory] = useState(questionnaire?.categories || []);
  const [selectedImpact, setSelectedImpact] = useState(questionnaire?.impact || "");
  const [selectedCost, setSelectedCost] = useState(questionnaire?.cost || "");

  /* List of options to show up in the questionnaire */
  const types = ["Homeowner", "Renter", "Business", "Condo", "Student"];
  const categories = [
    "Transportation", "Home Energy", "Waste & Recycling",
    "Food", "Activism & Education", "Solar",
    "Land, Soil, & Water"
  ];
  const impacts = ["Low", "Medium", "High"];
  const costs = ["0", "$", "$$", "$$$"];

  /* 
   * Function responsible to handle the action of the user of 
   * selecting and de-selecting a category from the questionnaire.
   */
  const toggleCategory = (category) => {
    if (selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.filter(item => item !== category));
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
  };

  /* 
   * Function that checks if the user has chosen all the required 
   * options for the questionnaire. 
   */
  const isFormComplete = () => {
    return true; // New plan is to just let the user submit any amount of preferences
    return selectedType &&
      selectedCategory.length > 0 &&
      selectedImpact &&
      selectedCost;
  }

  const submitPreferences = () => {
    const data = {
      type: selectedType,
      categories: selectedCategory,
      impact: selectedImpact,
      cost: selectedCost
    };
    setQuestionnaireInfo(data);
    AsyncStorage.setItem(QUESTIONNAIRE_DATA, JSON.stringify(data))
      .then(() => {
        navigation.goBack();
      })
      .catch(e => console.log("ERROR_SAVING_QUESTIONNAIRE_DATA", e.toString()));
  }

  /* Displays the Questionnaire for the user's preferences */
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Set User's Preferences</Text>

        {/* I am a ... */}
        <Text style={styles.sectionTitle}>I am a ...</Text>
        <View style={styles.optionsContainer}>
          {types.map(type => (
            <TouchableOpacity
              key={type}
              style={
                [styles.option,
                selectedType === type && styles.selectedOption]
              }
              onPress={() => setSelectedType(type === selectedType ? "" : type)}
            >
              <Text
                style={
                  selectedType === type ? styles.selectedText
                    : styles.optionText
                }
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.optionsContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={
                [styles.option,
                selectedCategory.includes(category) &&
                styles.selectedOption]
              }
              onPress={() => toggleCategory(category)}
            >
              <Text
                style={selectedCategory.includes(category) ?
                  styles.selectedText : styles.optionText}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Impact */}
        <Text style={styles.sectionTitle}>Impact</Text>
        <View style={styles.optionsContainer}>
          {impacts.map(impact => (
            <TouchableOpacity
              key={impact}
              style={
                [styles.option,
                selectedImpact === impact &&
                styles.selectedOption]
              }
              onPress={() => setSelectedImpact(impact === selectedImpact ? "" : impact)}
            >
              <Text
                style={selectedImpact === impact ?
                  styles.selectedText : styles.optionText}
              >
                {impact}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cost */}
        <Text style={styles.sectionTitle}>Cost</Text>
        <View style={[styles.optionsContainer, styles.lastOptionContainer]}>
          {costs.map(cost => (
            <TouchableOpacity
              key={cost}
              style={
                [styles.option, selectedCost === cost &&
                  styles.selectedOption]
              }
              onPress={() => setSelectedCost(cost === selectedCost ? "" : cost)}
            >
              <Text
                style={selectedCost === cost ?
                  styles.selectedText : styles.optionText}
              >
                {cost}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Submit Button */}
      {
        isFormComplete() && (
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={submitPreferences}
          >
            <Text style={styles.proceedText}>Submit Preferences</Text>
          </TouchableOpacity>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // marginTop: 40,
  },
  scroll: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  lastOptionContainer: {
    marginBottom: 80,
    paddingBottom: 40
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  optionText: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
    color: "#fff",
  },
  proceedButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  proceedText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => {
  return {
    questionnaire: state.questionnaire
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setQuestionnaireInfo: setQuestionnaireInfo,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Questionnaire);