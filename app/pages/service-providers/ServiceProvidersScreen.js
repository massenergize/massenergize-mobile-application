/******************************************************************************
 *                            ServiceProviderScreen
 * 
 *      This page is responsible for rendering a list of service providers.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 25, 2024
 * 
 *****************************************************************************/

/* Imports and setup */
import React, { useState } from "react";
import {
  VStack,
  ScrollView,
  HStack,
  View,
  Text,
} from "@gluestack-ui/themed-native-base";
import { connect } from "react-redux";
import ServiceProviderCard from "./ServiceProviderCard";
import { StyleSheet } from "react-native";
import MEInfoModal from "../../components/modal/MEInfoModal";
import FilterSelector from "../../components/filter/FilterSelector";

function ServiceProvidersPage({ navigation, vendors, questionnaire }) {
  /*
   * Uses local state to determine wheter the user has or not applied any 
   * filter to the vendors page, what is the filter they applied to the 
   * page, and the list of filtered vendors.
   */
  const [filter, setFilter] = useState({ Category: 'All' });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState([]);

  /* 
   * Function that filters the vendors according to the user's 
   * filtering action.
   */
  const applyFilter = (newFilter) => {
    setFilter(newFilter);
    const category = newFilter.Category;

    if (category === 'All') {
      setIsFilterApplied(false);
    } else {
      setIsFilterApplied(true);
    }

    const newFilteredVendors = vendors.filter(vendor => {
      const vendorTags = vendor.tags.map(tag => tag.name);

      return (category === 'All' || vendorTags.includes(category));
    });

    setFilteredVendors(newFilteredVendors);
  };

  /* List of suggested vendors based on questionnaire profile */
  const suggestedVendors = vendors.filter(vendor => {
    const vendorTags = vendor.tags.map(tag => tag.name);

    return (
      (questionnaire?.categories.some(
        category => vendorTags.includes(category)
      ))
    );
  });

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

  /* 
   * Function that checks if there is only one card in the list of vendors 
   * and if that card refers to having no service providers currently. 
   */
  function comingSoonCheck(vendors) {
    return vendors.some((vendor) => {
      return vendor.name === "Coming soon!  We're just getting off the ground.";
    });
  }

  /* 
  * If the community doesn't have any service providers or if the only 
  * card in the list of vendors refers to having no service providers 
  * currently, display a message.
  */
  if (vendors.length === 0 || comingSoonCheck(vendors)) {
    return (
      <View height="100%" bg="white">
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack>
            <HStack alignItems="center" justifyContent="center">
              {/* Header */}
              <Text style={styles.title}>Vendors</Text>
              <MEInfoModal>
                <Text
                  color="primary.400"
                  bold
                  fontSize="lg"
                >
                  Vendors
                </Text>
                <Text>
                  This page displays a list of companies in your community that
                  can help you reduce your carbon footprint. You can filter the
                  list by category to find the services you need.
                </Text>

              </MEInfoModal>
            </HStack>
          
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 200
              }}
            >
              <Text
                fontSize="xs"
                textAlign="center"
                px={10}
                color="gray.400"
              >
                No service providers for now...
              </Text>
            </View>
          </VStack>
        </ScrollView>
      </View>
    );
  }


  /* Displays the Service Providers page and the applied filters */
  return (
    <View bg="white" height="100%">
      <ScrollView px="5" showsVerticalScrollIndicator={false}>
        <VStack mt="5">
          <HStack alignItems="center" justifyContent="center">
            {/* Header */}
            <Text style={styles.title}>Vendors</Text>
            <MEInfoModal>
              <Text
                color="primary.400"
                bold
                fontSize="lg"
              >
                Vendors
              </Text>
              <Text>
                This page displays a list of companies in your community that
                can help you reduce your carbon footprint. You can filter the
                list by category to find the services you need.
              </Text>

            </MEInfoModal>
          </HStack>

          {/* Apply Filter Button */}
          <FilterSelector filter={filter} handleChangeFilter={applyFilter}>
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
          </FilterSelector>

          {/* 
            * Display filtered vendors, otherwise display a list of the 
            * suggested service providers based on the User's Preferences
            * questionnaire they've filled plus All the vendors offered 
            * to that community.
            */}
          {isFilterApplied ? (
            <View height="100%">
              {VendorsList(filteredVendors, `${filter.Category} Vendors`)}
            </View>
          ) : (
            <View>
              {/* Suggested */}
              {
                questionnaire && suggestedVendors.length > 0 &&
                VendorsList(suggestedVendors, "Suggested")
              }

              {/* All Service Providers */}
              {vendors && VendorsList(vendors, "All")}
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