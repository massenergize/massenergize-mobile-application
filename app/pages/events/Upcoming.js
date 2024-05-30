import {View, Text} from 'react-native';
import React from 'react';

const Upcoming = () => {
  return (
    <View>
      <Text>Upcoming</Text>
    </View>
  );
};

export default Upcoming;
// import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { connect } from 'react-redux';
// import { fetchAllCommunityData } from '../../config/redux/actions';
// import { formatDateString } from '../../components/utils/Utils';
// import Page from '../../components/page/Page';
// import EventCard from './EventCard';


// const Upcoming = ({ communityInfo, events, fetchAllCommunityData }) => {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchAllCommunityData({ community_id: communityInfo.id });
//   }, [fetchAllCommunityData, communityInfo.id]); 

//   const handleEventPress = (eventId) => {
//     navigation.navigate("EventDetails", { eventId });
//   };

//   return (
//     <Page>
// 		{
// 			isLoading ? (
// 				<ActivityIndicator size={"large"} color="#0000ff"/>
// 			) : (
// 				<FlatList 
// 					data={events}
// 					keyExtractor={(item) => item.id.toString()}
// 					renderItem={({ item }) => (
// 						<EventCard 
// 							title={item.title}
// 							date={formatDateString(
// 								new Date(item.start_date_and_time),
// 								new Date(item.end_date_and_time)
// 							)}
// 							location={item.location}
// 							imageUrl={item.image?.url}
// 							canRSVP={item.rsvp_enabled}
// 							onPress={() => handleEventPress(item.id)}
// 						/>
// 					)}
// 				/>
// 			)
// 		}
// 	</Page>
//   );
// };

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 	}
// });

// const mapStateToProps = (state) => ({
// 	communityInfo: state.communityInfo,
// 	events: state.events
// });

// const mapDispatchToProps = {
// 	fetchAllCommunityData,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Upcoming);
