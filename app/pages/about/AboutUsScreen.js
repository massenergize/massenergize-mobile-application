/******************************************************************************
 *                            AboutUsScreen
 * 
 *      This page is responsible for rendering the AboutUs page of the 
 *      mobile app. In case when the page can't load the information 
 *      about a community, it just displays 'loading'.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 11, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import HTMLParser from '../../utils/HTMLParser';

const AboutUsScreen = ({ 
  communityInfo, 
  aboutUsInfo,
}) => {
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
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
      >
        <View style={styles.container}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.imageContainer}
          >
            {/* 
              * Loops through the images available in the aboutUsPage 
              * data from the API and display them as a scroll view, 
              * and in case it doesnt have any available then displays 
              * the community logo. 
              */}
            {
              aboutUsInfo.images?.length > 0 
                ? aboutUsInfo.images.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image.url }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  ))
                : <Image
                    source={{ uri: communityInfo.logo.url }}
                    style={styles.image}
                    resizeMode="contain"
                  />
            }
          </ScrollView>
          
          {/* Community name */}
          <Text style={styles.communityName}>
            {communityInfo.name}
          </Text>
          
          {/* About Us Description / Our Story */}
          <HTMLParser 
            htmlString={aboutUsInfo.description} 
            baseStyle={styles.textStyle} 
          />
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    height: 200,
    width: 300,
    marginHorizontal: 5,
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
 * Transforms the local state of the app into the properties of the 
 * AboutUsScreen function, in which it is got from the API.
 */
const mapStateToProps = (state) => ({
  communityInfo: state.communityInfo,
  aboutUsInfo: state.aboutUsPage,
});

export default connect(mapStateToProps)(AboutUsScreen);