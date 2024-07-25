/******************************************************************************
 *                              Drawer.js
 * 
 *      This page is responsible for rendering the Drawer menu.
 * 
 *      Written by: Frimpong, William Soylemez, and Moizes Almeida
 *      Last edited: July 25, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../../pages/home/HomeScreen';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { COLOR_SCHEME } from '../../stylesheet';
import AboutUsScreen from '../../pages/about/AboutUsScreen';
import ContactUsScreen from '../../pages/contact-us/ContactUsScreen';
import { FontAwesomeIcon } from '../icons';
import UserProfile from '../../pages/user-profile/UserProfile';
import AuthOptions from '../../pages/auth/AuthOptions';
import { bindActionCreators } from 'redux';
import {
  signOutAction,
  toggleUniversalModalAction,
} from '../../config/redux/actions';
import { connect } from 'react-redux';
import ServiceProvidersScreen from '../../pages/service-providers/ServiceProvidersScreen';
import TestimonialsScreen from '../../pages/testimonials/TestimonialsScreen';
import ImpactPage from '../../pages/home/ImpactPage';

/* Creates the list of goals for the charts to display */
const getGoalsList = (goals) => {
  let goalsList = [];

  /* Don't display a chart if the goal is 0 */
  if (goals?.target_number_of_actions !== 0) {
    goalsList.push({
      nameLong: "Individual Actions Completed",
      nameShort: "Actions",
      goal: goals.target_number_of_actions,
      current: goals.displayed_number_of_actions
    });
  }

  if (goals?.target_number_of_households !== 0) {
    goalsList.push({
      nameLong: "Households Taking Action",
      nameShort: "Households",
      goal: goals.target_number_of_households,
      current: goals.displayed_number_of_households
    });
  }

  if (goals?.target_carbon_footprint_reduction !== 0) {
    goalsList.push({
      nameLong: "Carbon Reduction Impact",
      nameShort: "Carbon",
      goal: goals.target_carbon_footprint_reduction / 133,
      current: (goals.displayed_carbon_footprint_reduction / 133)
    });
  }

  return goalsList;
};

/* Defines the constant that holds the value of the Drawer navigator */
const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({
  navigation,
  toggleModal,
  activeCommunity,
  fireAuth,
  communityInfo,
  signMeOut,
  user,
}) => {
  /* Uses local state to determine whether the dropdown is open or not. */
  const [openDropdown, setOpenDropdown] = useState(null);

  /* Function that defines and returns the items in the Drawer */
  const getDrawerItems = () => {
    /* Creates the constant that will hold the list of goals */
    const goalsList = getGoalsList(communityInfo?.goal || {});

    /* Defines the list of items that will be displayed in the Drawer */
    const drawerItems = [
      {
        name: 'Community',
        icon: 'home-outline',
        dropdown: false,
        route: 'Community',
        dropdownItems: [],
      },
      {
        name: 'About Us',
        icon: 'information-circle-outline',
        dropdown: true,
        dropdownItems: [
          { name: 'Our Story', route: 'About' },
          {
            name: 'Impact',
            route: 'Goals',
            params: {
              community_id: activeCommunity.id,
              goalsList: goalsList,
            }
          },
        ],
      },
      {
        name: 'Testimonials',
        icon: 'chatbox-outline',
        dropdown: false,
        route: 'Testimonials',
        dropdownItems: [],
      },
      {
        name: 'Service Providers',
        icon: 'document-text-outline',
        dropdown: false,
        route: 'Service Providers',
        dropdownItems: [],
      },
    ];

    drawerItems.push({
      name: 'Contact Us',
      icon: 'at-circle-outline',
      dropdown: false,
      route: 'Contact Us',
      dropdownItems: [],
    });

    return drawerItems;
  };

  /* 
   * Function that handles when the user clicks in one of the items 
   * of the Drawer.
   */
  const handlePress = (route, params) => {
    if (route) {
      navigation.navigate(route, params);
    }
  };

  /* Displays the content of the Drawer */
  return (
    <>
      <DrawerContentScrollView>
        <View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* Community Logo */}
            <Image
              source={{ uri: activeCommunity?.logo?.url }} 
              style={{ width: 120, height: 120, resizeMode: 'contain' }} 
            />
          </View>

          {/* User's preferred name */}
          {user?.preferred_name && (
            <View
              style={{
                backgroundColor: COLOR_SCHEME.GREEN,
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 10,
                }}>
                {user.preferred_name}
              </Text>
            </View>
          )}

          {/* Community name */}
          <View
            style={{
              padding: 15,
              backgroundColor: '#f2f3f5',
              marginBottom: 20,
            }}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>
              @{activeCommunity?.name}
            </Text>
          </View>
          
          {/* Displays the items of the Drawer */}
          {getDrawerItems().map(menu => (
            <View key={menu.name}>
              <TouchableOpacity
                style={{
                  padding: 15,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() =>
                  menu.dropdown
                    ? setOpenDropdown(
                        openDropdown === menu.name 
                          ? null 
                          : menu.name
                      )
                    : handlePress(menu.route, menu.params)
                }
              >
                {/* Item's icon */}
                <Icon name={menu.icon} size={24} color="black" />

                {/* Item's name */}
                <Text
                  style={{
                    color: 'black',
                    fontWeight: '500',
                    marginLeft: 20,
                    fontSize: 15,
                  }}>
                  {menu.name}
                </Text>
              </TouchableOpacity>

              {/* Dropdown items */}
              {menu.dropdown && openDropdown === menu.name && (
                <View style={{ paddingLeft: 20 }}>
                  {menu.dropdownItems.map(item => (
                    <TouchableOpacity
                      key={item.name}
                      style={{
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 15,
                        fontWeight: 300,
                      }}
                      onPress={() => handlePress(item.route, item.params)}
                    >
                      {/* Dropdown item's name */}
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: '400',
                          marginLeft: 20,
                          fontSize: 14,
                        }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Sign in / Sign out / Switch Community */}
      <View style={{ width: '100%', marginBottom: 20, padding: 20 }}>
        {/* Sign out button */}
        {user?.preferred_name ? (
          <TouchableOpacity
            onPress={() => signMeOut()}
            style={{
              backgroundColor: 'red',
              borderColor: 'red',
              padding: 12,
              borderRadius: 5,
              borderWidth: 2,
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 13,
                textAlign: 'center',
              }}>
              SIGN OUT
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity /* Sign in Button */
            onPress={() => {
              toggleModal({
                isVisible: true,
                Component: AuthOptions,
                title: 'How would you like to sign in or Join ?',
              });
            }}
            style={{
              backgroundColor: COLOR_SCHEME.GREEN,
              borderColor: COLOR_SCHEME.GREEN,
              padding: 12,
              borderRadius: 5,
              borderWidth: 2,
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 13,
                textAlign: 'center',
              }}>
              LOGIN
            </Text>
          </TouchableOpacity>
        )}

        {/* Switch communities button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CommunitySelectionPage')}
          style={{
            padding: 12,
            borderWidth: 2,
            borderColor: COLOR_SCHEME.GREEN,
            marginTop: 10,
            borderRadius: 5,
          }}>
          <Text
            style={{
              color: COLOR_SCHEME.GREEN,
              fontWeight: 'bold',
              fontSize: 13,
              textAlign: 'center',
            }}>
            SWITCH COMMUNITIES
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

/*------------------------------ NAVIGATOR ------------------------------*/

const MEDrawerNavigator = ({
  toggleModal,
  activeCommunity,
  fireAuth,
  signMeOut,
  user,
  communityInfo,
}) => {
  /* 
   * Function that handles rendering the profile icon at the top right 
   * corner of the Header.
   */
  const renderProfileIcon = ({ navigation }) => {
    const { profile_picture } = user || {};

    /* If the user has uploaded a picture, display it */
    if (profile_picture?.url)
      return (
        <Image
          src={profile_picture?.url}
          style={{
            height: 27,
            width: 27,
            borderRadius: 10000,
            borderWidth: 2,
            borderColor: COLOR_SCHEME.GREEN,
            marginRight: 15,
            objectFit: 'scale-down',
          }}
        />
      );
    
    {/* Otherwise, display a profile icon */}
    return (
      <TouchableOpacity
        style={{ marginRight: 15 }}
        onPress={() => navigation.navigate('Profile')}>
        <FontAwesomeIcon
          name="user-circle"
          size={21}
          color={user ? COLOR_SCHEME.GREEN : 'black'}
        />
      </TouchableOpacity>
    );
  };

  {/* 
    * Function that holds the navigation options of the Header, 
    * such as the Hamburger Menu icon and the profile icon.
    */}
  const options = ({ navigation }) => ({
    /* Access Drawer */
    headerLeft: () => {
      return (
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          onPress={() => navigation.toggleDrawer()}
        >
          <FontAwesomeIcon name="bars" size={21} />
        </TouchableOpacity>
      );
    },

    /* Access user profile */
    headerRight: () => renderProfileIcon({ navigation }),
  });

  /* 
   * Function that holds the option to render the header of the page 
   * without the title of the page in display in the middle.
   */
  const noPageTitleOption = ({ navigation }) => ({
    headerLeft: () => {
      return (
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          onPress={() => navigation.toggleDrawer()}
        >
          <FontAwesomeIcon 
            name="bars"
            size={21}
          />
        </TouchableOpacity>
      );
    },

    headerRight: () => renderProfileIcon({ navigation }),
    headerTitle: "",
  })

  /* Display the Drawer navigator */
  return (
    <Drawer.Navigator
      initialRouteName="Community"
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          toggleModal={toggleModal}
          activeCommunity={activeCommunity}
          fireAuth={fireAuth}
          signMeOut={signMeOut}
          user={user}
          communityInfo={communityInfo}
        />
      )}
      drawerStyle={{ width: 250 }}
    >
      {/* Main Navigation options */}
    
      <Drawer.Screen
        name="Community"
        component={HomeScreen}
        options={options}
      />
      <Drawer.Screen
        name="UserProfile"
        component={UserProfile}
        options={options}
      />
      <Drawer.Screen
        name="About"
        component={AboutUsScreen}
        options={options}
      />
      <Drawer.Screen
        name="Contact Us"
        component={ContactUsScreen}
        options={options}
      />
      <Drawer.Screen
        name="Service Providers"
        component={ServiceProvidersScreen}
        options={options}
      />
      <Drawer.Screen
        name="Testimonials"
        component={TestimonialsScreen}
        options={noPageTitleOption}
      />
      <Drawer.Screen
        name="Goals"
        component={ImpactPage}
        options={noPageTitleOption}
      />
    </Drawer.Navigator>
  );
};

/* 
 * Transforms the local state of the app into the properties of the 
 * Drawer functions, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    user: state.user,
    activeCommunity: state.activeCommunity,
    communityInfo: state.communityInfo,
  };
};

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the Drawer functions properties.
 */
const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    signMeOut: signOutAction,
    toggleModal: toggleUniversalModalAction,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MEDrawerNavigator);