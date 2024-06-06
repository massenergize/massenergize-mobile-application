/******************************************************************************
 *                       ImpactPage
 * 
 *      This page is responsible for rendering the community's
 *      impact page through graphs and lists. This page is
 *      displayed whenever the user clicks to see more about the
 *      impact of the community through the CommunityHomeScreen.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 5, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
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
import { ActivityIndicator } from "react-native-paper";

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
    const { goalsList } = route.params;
    const { community_id } = route.params;
    
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
    const [impactData, isImpactLoading] = useDetails('graphs.actions.completed', { community_id });
    const [actionsCompleted, isActionsLoading] = useDetails('communities.actions.completed', { community_id });

    /* 
     * While the information about the community's impact and completed 
     * actions hasn't loaded, display an activity indicator
     */
    if (!impactData || !actionsCompleted) {
        return (
            <Center flex="1">
              <Spinner/>
            </Center>
        );
    }

    /* Displays the information about the community's impact */
    return (
        <View>
            <ScrollView>
                <VStack alignItems="center" space={3} bg="white">
                    <Text bold fontSize="xl" mt={2}>Goals</Text>
                    {
                        /* Shows the community's available goals */
                        goalsList.map((goal, index) => <BigPieChart goal={goal} color={colors[index]} key={index}/>)
                    }
                    <Text bold fontSize="xl" mb={2} mt={10}>Number of Actions Completed</Text>
                    <HStack width="100%">
                        <Spacer />
                        {/* Toggle between action chart and action list */}
                        <Center>
                            <Ionicons
                                name={"bar-chart-outline"}
                                color={actionDisplay == "chart" ? '#64B058' : 'black'}
                                padding={5}
                                size={24}
                                onPress={() => setActionDisplay('chart')}
                            />
                        </Center>
                        <Center pr={3}>
                            <Ionicons
                                name={"list-outline"}
                                color={actionDisplay == "list" ? '#64B058' : 'black'}
                                padding={5} E
                                size={24}
                                onPress={() => setActionDisplay('list')}
                            />
                        </Center>
                    </HStack>
                    {
                        (actionDisplay == "chart")
                        ?
                        <ActionsChart graphData={impactData.data} />
                        :
                        <ActionsList listData={actionsCompleted} />
                    }
                </VStack>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    noInfoContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      noInfoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#64B058',
      },
      activity: {
        alignSelf: 'center',
        marginTop: 300
      },
});