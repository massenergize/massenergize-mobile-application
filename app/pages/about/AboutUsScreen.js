/******************************************************************************
 *                            AboutUsScreen
 * 
 *      This page is responsible for rendering the AboutUs page of the 
 *      mobile app. In case when the page can't load the information 
 *      about a community, it just displays 'loading'.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: May 29, 2024
 * 
 *****************************************************************************/
 
/* Imports and set up */
import React, { useEffect } from 'react';
import { View, Image, ScrollView, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import HTMLParser from '../../components/htmlparser/HTMLParser';
import { fetchAllCommunityData } from '../../config/redux/actions';


const AboutUsScreen = ({ communityInfo, aboutUsInfo, fetchAllCommunityData }) => {
  /* Fetch community information from API */
  useEffect(() => {
    fetchAllCommunityData({ community_id: communityInfo.id });
  }, [fetchAllCommunityData, communityInfo.id]);

  /* If the community info isn't provided, just display 'Loading' */
  if (!communityInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  /* Display the community's aboutUs information from API */
  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: communityInfo.logo.url }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.communityName}>{communityInfo.name}</Text>
          <HTMLParser htmlString={aboutUsInfo.description} baseStyle={styles.textStyle} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  container: {
    alignItems: 'center',
    margin: 7,
  },
  imageContainer: {
    maxHeight: 200,
    width: '100%',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  communityName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
  textStyle: {
    fontSize: 16,
  },
});

/* 
 * Transforms the local state of the app into the proprieties of the 
 * AboutUsScreen function, in which it is got from the API.
 */
const mapStateToProps = (state) => ({
  communityInfo: state.communityInfo,
  aboutUsInfo: state.aboutUsPage,
});

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the AboutUsScreen proprieties.
 */
const mapDispatchToProps = {
  fetchAllCommunityData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutUsScreen);
