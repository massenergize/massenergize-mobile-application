/******************************************************************************
 *                            Campaign
 * 
 *      This page is responsible for rendering the campaigns
 *      of each specific community.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 3, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { View, Text } from 'react-native'
import React from 'react'
import { Center } from '@gluestack-ui/themed-native-base'

const Campaigns = () => {
  /* TO-DO */
  /* Displays the campaigns of the community */
  return (
    <Center style={{marginTop: 300}}>
      <Text style={{color: '#64B058', fontSize: 18, fontWeight: 'bold',}}>
        No campaigns
      </Text>
    </Center>
  )
}

export default Campaigns;