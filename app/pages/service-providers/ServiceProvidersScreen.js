import React from "react";
import { VStack, Box, Heading, ScrollView, HStack } from "@gluestack-ui/themed-native-base";
import { connect } from "react-redux";

import ServiceProviderCard from "./ServiceProviderCard";
import { View } from "react-native";

function ServiceProvidersPage({ navigation, vendors }) {
  return (
    <View>
      <ScrollView px="5" showsVerticalScrollIndicator={false}>
        <VStack mt="5">
          <Box>
            <Heading>Suggested</Heading>
            {/* render cards horizontally */}
            <ScrollView horizontal={true} my="5">
              {vendors && (
                <HStack>
                  {vendors.map((sProvider, index) => {
                    return (
                      <ServiceProviderCard
                        id={sProvider.id}
                        key={index}
                        direction="column"
                        name={sProvider.name}
                        imageURI={sProvider.logo ? sProvider.logo.url : null}
                        navigation={navigation}
                        my="3"
                        mx="2"
                      />
                    );
                  })}
                </HStack>
              )}
            </ScrollView>
          </Box>
          <Box>
            <Heading>All</Heading>
            {/* render cards vertically */}
            {vendors && (
              <VStack space="3" my="5" mx="2">
                {vendors.map((sProvider, index) => {
                  return (
                    <ServiceProviderCard
                      id={sProvider.id}
                      key={index}
                      direction="row"
                      name={sProvider.name}
                      imageURI={sProvider.logo ? sProvider.logo.url : null}
                      navigation={navigation}
                    />
                  );
                })}
              </VStack>
            )}
          </Box>
        </VStack>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => ({
  vendors: state.vendors,
});

export default connect(mapStateToProps)(ServiceProvidersPage);