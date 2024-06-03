/******************************************************************************
 *                            Campaign
 * 
 *      This page is responsible for rendering the campaigns
 *      of each specific community.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: May 31, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { View, Text } from 'react-native'
import React from 'react'
import { Center } from 'native-base'

const Campaigns = () => {
  /* TO-DO */
  /* Displays the campaigns of the community */
  return (
    <Center style={{marginTop: 300}}>
      <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold',}}>
        No campaigns
      </Text>
    </Center>
  )
}

export default Campaigns;