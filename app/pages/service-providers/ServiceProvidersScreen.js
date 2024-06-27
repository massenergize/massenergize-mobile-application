/******************************************************************************
 *                            ServiceProviderScreen
 * 
 *      This page is responsible for rendering a list of service providers.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: June 27, 2024
 * 
 *****************************************************************************/

/* Imports and setup */
import React, { useEffect, useState } from "react";
import { 
  VStack, 
  Box, 
  Heading, 
  ScrollView, 
  HStack, 
  Pressable,
  View,
  Text,
  Select,
} from "@gluestack-ui/themed-native-base";
import { connect } from "react-redux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ServiceProviderCard from "./ServiceProviderCard";
import { StyleSheet } from "react-native";

function ServiceProvidersPage({ navigation, vendors, questionnaire }) {
  /*
   * Uses local state to determine wheter the user has or not applied any 
   * filter to the vendors page, or if they selected the 'Apply Filter'
   * button, or what is the filter they applied to the page.
   */
  const [category, setCategory] = useState('All');
  const [expand, setExpand] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  /* Check if any filter is applied */
  useEffect(() => {
    if (category !== 'All') {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [category]);

  /* 
   * Function that filters the vendors according to the user's 
   * filtering action.
   */
  const applyFilter = (vendors) => {
    return vendors.filter(vendor => {
      const vendorTags = vendor.tags.map(tag => tag.name);

      return (category === 'All' || vendorTags.includes(category));
    });
  };

  /* List of suggested vendors based on questionnaire profile */
  const suggestedVendors = vendors.filter(vendor => {
    const vendorTags = vendor.tags.map(tag => tag.name);

    return (
      (questionnaire?.categories.some(category => vendorTags.includes(category)))
    );
  });

  /* Variable that holds the list of filtered vendors */
  const filteredVendors = applyFilter(vendors);

  /* Function that display the filter options for the user */
  function filterOptions() {
    return (
      <View style={styles.filterContainer}>
        <VStack
          space={2}
          style={styles.filterVStack}
        >
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
        </VStack>
      </View>
    );
  }

  /* 
   * Function that displays the list of vendors after the user has set 
   * the filters.
   */
  function VendorsList(vendors, title) {
    return (
      <>
        <Text style={styles.category}>
          {title}
        </Text>

        {
          vendors?.length === 0 && 
          (
            <View>
              <Text
                color="gray.300"
                fontSize="sm"
                textAlign="center"
                mt={5}
              >
                {`No ${title} for now :(`}
              </Text>
            </View>
          )
        }

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
            {vendors.map((vendor, index) => {
              return (
                <ServiceProviderCard
                  id={vendor.id}
                  key={index}
                  direction="column"
                  name={vendor.name}
                  imageURI={vendor.logo ? vendor.logo.url : null}
                  navigation={navigation}
                  my="3"
                  mx="2"
                />
              );
            })}
          </HStack>
        </ScrollView>
      </>
    );
  }

  /* Displays the Service Providers page and the applied filters */
  return (
    <View bg="white" height="100%">
      <ScrollView px="5" showsVerticalScrollIndicator={false}>
        <VStack mt="5">
          {/* Header */}
          <Text style={styles.title}>Vendors</Text>

          {/* Apply Filter Button */}
          <Pressable
            onPress={() => setExpand(!expand)}
            style={styles.expandButton}
          >
            <HStack alignItems="center">
              <Ionicons
                name={
                  expand ? "chevron-up-outline" : "search"
                }
                color="#64B058"
              />

              <Text color="#64B058" ml={2}>
                Apply Filter
              </Text>
            </HStack>
          </Pressable>
          
          {/* Filter Options */}
          {expand && filterOptions()}
          
          {/* 
            * Display filtered vendors, otherwise display a list of the 
            * suggested service providers based on the User's Preferences
            * questionnaire they've filled plus All the vendors offered 
            * to that community.
            */}
          { isFilterApplied ? (
            <View height="100%">
              {VendorsList(filteredVendors, `${category} Vendors`)}
            </View>
          ) : (
            <View>
              {/* Suggested */}
              {
                questionnaire && suggestedVendors.length > 0 &&
                VendorsList(suggestedVendors, "Suggested")
              }

              {/* All Service Providers */}
              <Box>
                <Heading>All</Heading>
                {
                 /* 
                  * Render cards vertically instead of horizontally as in 
                  * the VendorsList function
                  */
                }
                {vendors && (
                  <VStack space="3" my="5" mx="2">
                    {vendors.map((vendor, index) => {
                      return (
                        <ServiceProviderCard
                          id={vendor.id}
                          key={index}
                          direction="row"
                          name={vendor.name}
                          imageURI={vendor.logo ? vendor.logo.url : null}
                          navigation={navigation}
                        />
                      );
                    })}
                  </VStack>
                )}
              </Box>
            </View>
          )}
        </VStack>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  expandButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  filterVStack: {
    alignItems: "center",
  },
  filterSelect: {
    width: "90%",
    marginBottom: 15,
  },
  category: {
    padding: 15,
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: 'center',
    padding: 20,
  },
});

/* 
 * Transforms the local state of the app into the properties of the 
 * ServiceProvidersPage function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    vendors: state.vendors,
    questionnaire: state.questionnaire,
  };
}

export default connect(mapStateToProps)(ServiceProvidersPage);