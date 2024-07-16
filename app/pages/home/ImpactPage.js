/******************************************************************************
 *                       ImpactPage
 * 
 *      This page is responsible for rendering the community's
 *      impact page through graphs and lists. This page is
 *      displayed whenever the user clicks to see more about the
 *      impact of the community through the CommunityHomeScreen.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 16, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
    VStack,
    HStack,
    Text,
    Spacer,
    Center,
    View,
    Spinner,
} from '@gluestack-ui/themed-native-base';
import Ionicons from "react-native-vector-icons/Ionicons";
import { BigPieChart, ActionsChart, ActionsList } from "../../utils/Charts";
import { useDetails } from "../../utils/hooks";

/* Defines the colors of the three charts of the impact of the community */
const colors = [
    "#DC4E34",
    "#64B058",
    "#000000"
];

export default function ImpactPage({ route, navigation }) {
    /* 
     * Gets the goalsList and community_id parameters through the route 
     * component 
     */
    const { goalsList, community_id } = route.params;
    
    /* 
     * Uses the local state to determine which component of the Action 
     * graphs are currently being displayed: either in form of graph 
     * or in form of chart.
     */
    const [ actionDisplay, setActionDisplay ] = useState('chart');

    /* 
     * Retrieves from the API the information about the impact of the 
     * community and all the community's completed action to create 
     * informative impact graphs 
     */
    const [impactData, isImpactLoading] = useDetails(
        'graphs.actions.completed', 
        { community_id }
    );
    const [actionsCompleted, isActionsLoading] = useDetails(
        'communities.actions.completed', 
        { community_id }
    );

    /* Displays the information about the community's impact */
    return (
        <View height="100%" bg="white">
            {/* 
              * While the information about the community's impact and 
              * completed actions hasn't loaded, display an activity indicator
              */}
            {!impactData || !actionsCompleted ? (
                <Center flex="1">
                    <Spinner/>
                </Center>
            ) : (
                <ScrollView>
                    <VStack 
                        alignItems="center" 
                        space={3} 
                        bg="white"
                    >
                        {/* 
                          * Displays the donut charts of the completed actions
                          * compared to the goals set by the community 
                          */}
                        <Text bold fontSize="xl" mt={2}>Goals</Text>
                        {
                            /* Shows the community's available goals */
                            goalsList.map((goal, index) => 
                                <BigPieChart 
                                    goal={goal} 
                                    color={colors[index]} 
                                    key={index}
                                />
                            )
                        }

                        {/* 
                          * Displays the Actions data either as a graph chart
                          * or as a list 
                          */}
                        <Text 
                            bold 
                            fontSize="xl" 
                            mb={2} 
                            mt={10}
                        >
                            Number of Actions Completed
                        </Text>

                        <HStack width="100%">
                            <Spacer />

                            {/* Toggle between action chart and action list */}
                            <Center>
                                <Ionicons
                                    name={"bar-chart-outline"}
                                    color={actionDisplay === "chart" 
                                            ? '#64B058' 
                                            : 'black'
                                    }
                                    padding={5}
                                    size={24}
                                    onPress={() => setActionDisplay('chart')}
                                />
                            </Center>

                            <Center pr={3}>
                                <Ionicons
                                    name={"list-outline"}
                                    color={actionDisplay === "list" 
                                            ? '#64B058' 
                                            : 'black'
                                    }
                                    padding={5} E
                                    size={24}
                                    onPress={() => setActionDisplay('list')}
                                />
                            </Center>
                        </HStack>
                        
                        {
                            (actionDisplay === "chart")
                                ? (
                                    <View
                                        style={styles.chartContainer}
                                        mb={10}
                                        mr={6}
                                    >
                                        <ActionsChart 
                                            graphData={impactData.data}
                                        />
                                    </View>
                                )
                            :
                            <ActionsList listData={actionsCompleted} />
                        }
                    </VStack>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    chartContainer: {
        width: Dimensions.get("window").width - 40,
        paddingHorizontal: 20,
    }
});