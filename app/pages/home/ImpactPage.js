/******************************************************************************
 *                       ImpactPage
 * 
 *      This page is responsible for rendering the community's
 *      impact page through graphs and lists. This page is
 *      displayed whenever the user clicks to see more about the
 *      impact of the community through the CommunityHomeScreen.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 19, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { 
    Dimensions, 
    ScrollView, 
    StyleSheet, 
    Modal, 
    TouchableOpacity 
} from "react-native";
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
import { 
    BigPieChart, 
    ActionsChart, 
    ActionsList 
} from "../../utils/Charts";
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
     * or in form of chart, and whether or not to display the informative
     * modal about the graphs.
     */
    const [ actionDisplay, setActionDisplay ] = useState('chart');
    const [isModalVisible, setIsModalVisible] = useState(false);

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
                        p={3}
                        bg="white"
                    >
                        {/* 
                          * Infomative icon for the user to get to know 
                          * more about what the graphs represent about 
                          * the impact of the community.
                          */}
                        <HStack 
                            width="100%" 
                            justifyContent="flex-end" 
                            pr={3} 
                            pt={3}
                        >
                            <TouchableOpacity 
                                onPress={() => setIsModalVisible(true)}
                            >
                                <Ionicons 
                                    name="information-circle-outline" 
                                    size={24} 
                                    color="green" 
                                />
                            </TouchableOpacity>
                        </HStack>
                        
                        {/* 
                          * Displays the donut charts of the completed actions
                          * compared to the goals set by the community 
                          */}
                        <Text 
                            bold 
                            fontSize="xl" 
                            mt={2}
                        >
                            Goals
                        </Text>
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
                                    padding={5}
                                    size={24}
                                    onPress={() => setActionDisplay('list')}
                                />
                            </Center>
                        </HStack>
                        
                        {/* 
                          * Depending on wheter it is in chart or list, 
                          * displays either a graph informing about the 
                          * completed actions or a list with all the 
                          * completed actions of the community.
                          */}
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
                            : <ActionsList listData={actionsCompleted} />
                        }
                    </VStack>
                </ScrollView>
            )}
            
            {/* Info Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {/* Close Icon */}
                        <TouchableOpacity 
                            onPress={() => setIsModalVisible(false)} 
                            style={styles.closeIcon}
                        >
                            <Ionicons 
                                name="close" 
                                size={24} 
                                color="black" 
                            />
                        </TouchableOpacity>

                        {/* Modal body */}
                        <ScrollView>
                            <Text 
                                bold 
                                color="primary.400" 
                                fontSize="md"
                            >
                                Data shown in the Actions graph comes 
                                from two sources:
                            </Text>

                            <Text 
                                ml={4}
                            >
                                - Actions reported by community members
                            </Text>
                            <Text 
                                ml={4}
                            >
                                - Actions from State or Partner databases or 
                                previous community programs
                            </Text>

                            <Text 
                                mt={3}
                                bold 
                                color="primary.400" 
                                fontSize="md"
                            >
                                Data shown in the "donut" graphs is calculated 
                                using guidance from the Community Admin:
                            </Text>

                            <Text
                                ml={1.5}
                            >
                                The Actions graph is an estimate of the 
                                number of actions taken by community members. 
                                It includes:
                            </Text>
                            <Text 
                                ml={4}
                            >
                                - Actions reported by community members
                            </Text>
                            <Text 
                                ml={4}
                            >
                                - Actions from State or Partner databases 
                                or previous community members
                            </Text>

                            <Text
                                ml={1.5}
                            >
                                The Households graph is an estimate of the 
                                number of households that have taken action. 
                                It includes:
                            </Text>
                            <Text 
                                ml={4}
                            >
                                - Households reporting actions on this website
                            </Text>
                            <Text 
                                ml={4}
                            >
                                - Households that installed solar arrays 
                                from the State database
                            </Text>
                            <Text 
                                ml={4}
                            >
                                - Households that participated in previous 
                                community programs
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    chartContainer: {
        width: Dimensions.get("window").width - 40,
        paddingHorizontal: 20,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    closeIcon: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
});
