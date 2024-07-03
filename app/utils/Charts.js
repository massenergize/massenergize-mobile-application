/******************************************************************************
 *                            Charts
 * 
 *      This page is responsible for defining some functions
 *      that are going to be used to display graphs and charts
 *      of the actions completed by each community.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 2, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React from "react";
import {
    VStack,
    HStack,
    Text,
    Container,
    View
} from "@gluestack-ui/themed-native-base";
import { Dimensions } from 'react-native';
import { 
    VictoryPie, 
    VictoryContainer, 
    VictoryBar, 
    VictoryChart, 
    VictoryTheme, 
    VictoryAxis, 
    VictoryGroup, 
    VictoryLegend 
} from 'victory-native';

/* 
 *                              SmallChart
 * 
 * Description: Small pie charts that are part of the goal card;
 * Input:       Goal - for the goal in numbers set by the community;
 *              Color - for the styling color of the chart;
 * Output:      A Small Chart with the information of the actions completed
 *              by the commmunity.
 */
function SmallChart({ goal, color }) {
    return (
      <VStack alignItems="center">
        <Text bold fontSize="lg">{goal.nameShort}</Text>
        <VictoryPie 
            data={[{x: "current", y: goal.current}, {x: "remaining", y: goal.goal - goal.current}]} 
            containerComponent={<VictoryContainer disableContainerEvents standalone={false} responsive={true}/>}
            innerRadius={Dimensions.get('window').width / 15}
            height={Dimensions.get('window').width / 3.5}
            width={Dimensions.get('window').width / 3.5}
            padding={10}
            labels={() => null} 
            colorScale={[color, "#f2f2f2"]}/>
        {
            goal.nameShort === "Trees"
            ? <Text fontSize="md">{(goal.current < 10000) ? goal.current.toFixed(1) : (goal.current / 1000).toFixed(1) + "k" } / {(goal.goal < 10000) ? goal.goal.toFixed(1) : (goal.goal / 1000).toFixed(1) + "k"}</Text>
            : <Text fontSize="md">{(goal.current < 10000) ? goal.current : (goal.current / 1000).toFixed(1) + "k" } / {(goal.goal < 10000) ? goal.goal : (goal.goal / 1000) + "k"}</Text>
        }
      </VStack>
    )
}

/* 
 *                              BigPieChart
 * 
 * Description: Pie charts that are displayed on the impact page - more 
 *              detailed than the smaller pie charts;
 * Input:       Goal - for the goal in numbers set by the community;
 *              Color - for the styling color of the chart;
 * Output:      A Pie Chart with the information of the actions completed
 *              by the commmunity.
 */
function BigPieChart({ goal, color }) {
    return (
        <HStack alignItems="center">
            <VictoryPie 
                data={[{x: "current", y: goal.current}, {x: "remaining", y: goal.goal - goal.current}]} 
                containerComponent={<VictoryContainer standalone={false} responsive={true}/>}
                innerRadius={Dimensions.get('window').width / 12}
                height={Dimensions.get('window').width / 2.7}
                width={Dimensions.get('window').width / 2.7}
                padding={10}
                labels={() => null} 
                colorScale={[color, "#f2f2f2"]}/>
            <Container width={Dimensions.get('window').width - (Dimensions.get('window').width / 2.5)}>
                <VStack>
                    <Text bold fontSize="lg">{goal.nameLong}</Text>
                    <Text fontSize="md">{(goal.nameShort === "Trees") ? goal.current.toFixed(1) : goal.current} / {(goal.nameShort === "Trees") ? goal.goal.toFixed(1) : goal.goal} {goal.nameShort}</Text>
                    <Text fontSize="sm">({(goal.current / goal.goal * 100).toFixed(1)}% of Goal)</Text>
                </VStack>
            </Container>
        </HStack>
    )
}

/* Category names to be displayed in the chart */
const updatedNames = {
    "Waste & Recycling": "Waste &\nRecycling",
    "Transportation": "Transportation",
    "Solar": "Solar",
    "Land, Soil & Water": "Land, Soil &\nWater",
    "Home Energy": "Home Energy",
    "Food": "Food",
    "Activism & Education": "Activism &\nEducation"
}

/* 
 *                              ActionsChart
 * 
 * Description: Bar chart that is displayed on the impact page;
 * Input:       graphData - Usually a set of information based on 'updateNames'
 *              that tells how many actions of each category the community
 *              has completed;
 * Output:      A Bar Chart with the information of the actions completed
 *              by the commmunity.
 */
function ActionsChart({ graphData }) {
    const getData = () => {
        for (let i = 0; i < graphData.length; i++) {
            if (updatedNames[graphData[i].name] !== undefined)
                graphData[i].name = updatedNames[graphData[i].name];
        }
        return graphData;
    }

    return (
        <VStack alignItems="center">
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={10}
                padding={{top: 40, right: 20, bottom: 30, left:110}}
                >
                <VictoryAxis dependentAxis />
                <VictoryAxis style={{ 
                    // tickLabels: { fill:"transparent"} 
                }} />
                <VictoryGroup offset={10}>
                    <VictoryBar
                        data={getData()}
                        x="name"
                        y="reported_value"
                        horizontal={true}
                        style={{ data: { fill: "#DC4E34", fillOpacity: 0.5 }, labels: {fontSize: 15}}}
                        barRatio={0.9}
                    />
                    <VictoryBar
                        data={getData()}
                        x="name"
                        y="value"
                        horizontal={true}
                        style={{ data: { fill: "#DC4E34", fillOpacity: 0.9 }, labels: {fontSize: 15}}}
                        barRatio={0.9}
                    />
                </VictoryGroup>
                <VictoryLegend x={110} y={0}
                    centerTitle
                    orientation="horizontal"
                    gutter={20}
                    style={{ border: { stroke: "black" }, title: {fontSize: 20 } }}
                    data={[
                    { name: "Value", symbol: { fill: "#DC4E34", type: "square", fillOpacity: 0.9 } },
                    { name: "Reported Value", symbol: { fill: "#DC4E34", type: "square", fillOpacity: 0.5 } },
                    ]}
                />
            </VictoryChart>
            <Container h={10}/>
        </VStack>
    )
}

/* 
 *                          TeamActionsChart
 * 
 * Description: Bar chart that is displayed on the team page;
 * Input:       graphData - Usually a set of information based on 'updateNames'
 *              that tells how many actions of each category the community
 *              has completed;
 * Output:      A Bar Chart with the information of the actions completed
 *              by the team in that commmunity.
 */
function TeamActionsChart({ graphData }) {
    const getData = () => {
        for (let i = 0; i < graphData.length; i++) {
            if (updatedNames[graphData[i].name] !== undefined)
                graphData[i].name = updatedNames[graphData[i].name];
        }
        return graphData;
    }

    return (
        <VStack alignItems="center">
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={10}
                padding={{top: 40, right: 20, bottom: 30, left:110}}
                >
                <VictoryAxis dependentAxis />
                <VictoryAxis style={{ 
                    // tickLabels: { fill:"transparent"} 
                }} />
                <VictoryBar
                    data={getData()}
                    x="name"
                    y="value"
                    horizontal={true}
                    style={{ data: { fill: "#DC4E34", fillOpacity: 0.9 }, labels: {fontSize: 15}}}
                    barRatio={0.7}
                />
                <VictoryLegend x={110} y={0}
                    centerTitle
                    orientation="horizontal"
                    gutter={20}
                    style={{ border: { stroke: "black" }, title: {fontSize: 20 } }}
                    data={[
                    { name: "Actions", symbol: { fill: "#DC4E34", type: "square", fillOpacity: 0.9 } },
                    ]}
                />
            </VictoryChart>
            <Container h={10}/>
        </VStack>
    )
}

/* 
 *                              ActionsList
 * 
 * Description: List of actions with their category, carbon saving, and 
 *              number of times done displayed on the impact page;
 * 
 * Input:       listData - Usually a set of information that tells how many 
 *              actions of each category the community
 *              has completed;
 * 
 * Output:      A List of actions with the information of the actions completed
 *              by the team in that commmunity.
 */
function ActionsList({ listData = [] }) {
    return (
      <View width="100%" ml={3} p={3}>
        {
            listData !== null && listData.length !== 0 ? (
                <View>
                    <HStack 
                        width="100%" 
                        alignItems="center" 
                        justifyContent="space-between" 
                        mb={2}
                    >
                        <Text 
                            bold 
                            fontSize="sm" 
                            width="25%" 
                            textAlign="center"
                        >
                            Actions
                        </Text>

                        <Text 
                            bold 
                            ontSize="sm" 
                            width="30%" 
                            textAlign="center"
                        >
                            Category
                        </Text>

                        <Text 
                            bold 
                            fontSize="sm" 
                            width="25%" 
                            textAlign="center"
                        >
                            Carbon Saving
                        </Text>

                        <Text 
                            bold 
                            fontSize="sm" 
                            width="20%" 
                            textAlign="center"
                        >
                            # Done
                        </Text>
                    </HStack>

                    { listData.map((action, index) => (
                            <HStack 
                                width="100%" 
                                alignItems="center" 
                                justifyContent="space-between" 
                                mb={4} 
                                key={index}
                            >
                                <Text 
                                    bold 
                                    fontSize="sm" 
                                    width="25%" 
                                    textAlign="left" 
                                    color="#64B058"
                                >
                                    {action.name}
                                </Text>

                                <Text 
                                    fontSize="sm" 
                                    width="30%" 
                                    textAlign="center"
                                >
                                    {action.category}
                                </Text>

                                <Text 
                                    fontSize="sm" 
                                    width="25%" 
                                    textAlign="center"
                                >
                                    {action.carbon_total}
                                </Text>

                                <Text 
                                    fontSize="sm" 
                                    width="20%" 
                                    textAlign="center"
                                >
                                    {action.done_count}
                                </Text>
                            </HStack>
                        ))
                    }
                </View>
            ) : (
                <Text 
                    fontSize="xs"
                    textAlign="center"
                    px={10}
                    color="gray.400"
                    mt={5}
                    mx={3}
                >
                    Sorry, for some reason we could not load the list of 
                    actions that people in this community have taken...
                </Text>
            )
        } 
      </View>
    );
}

export { SmallChart, BigPieChart, ActionsChart, TeamActionsChart, ActionsList }
