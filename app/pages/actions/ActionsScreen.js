import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import ActionCard from './ActionCard';
import { connect } from 'react-redux';
import { StyleSheet } from "react-native";
import { ScrollView, HStack, Text, Spinner, Center } from "@gluestack-ui/themed-native-base";
import { getActionMetric } from "../../utils/common";

const ActionsScreen = ({navigation, actions}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (actions) {
      setIsLoading(false);
    }
  }, []);

  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>
      <ScrollView>
        {/* Header */}
        <Text style={styles.title}>Actions</Text>

        {isLoading ? (
          <Center flex="1">
            <Spinner />
          </Center>
        ) : (
            <View>
            {/* Currently "All" instead of "Recommended" for v1 (v2 will have filtering) */}
            
            {/* Display all actions */}
            <Text style={styles.category}>All</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <HStack space={2} justifyContent="center" mx={15} marginBottom={15}>
                {actions.map((action, index) => {
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
            
            {/* High impact */}
            <Text style={styles.category}>High Impact</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <HStack space={2} justifyContent="center" mx={15} marginBottom={15}>
                {/* Display all actions with high impact */}
                {actions
                  .filter(
                    (action) => getActionMetric(action, "Impact") === "High"
                  )
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

            {/* Low cost */}
            <Text style={styles.category}>Low Cost</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <HStack space={2} justifyContent="center" mx={15} marginBottom={15}>
                {/* Display all actions with low cost (0 or $) */}
                {actions
                  .filter(
                    (action) =>
                      getActionMetric(action, "Cost") === "$" ||
                      getActionMetric(action, "Cost") === "0"
                  )
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
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    height: "80",
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
  }
});

const mapStateToProps = (state) => {
  return {
    actions: state.actions,
  };
}

export default connect(mapStateToProps)(ActionsScreen);
