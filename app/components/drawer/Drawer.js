import React, {useRef} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../../pages/home/HomeScreen';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

import {Text, View, TouchableOpacity, Image, Button} from 'react-native';
import {COLOR_SCHEME, ME_ORANGE} from '../../stylesheet';
import AboutUsScreen from '../../pages/about/AboutUsScreen';
import ContactUsScreen from '../../pages/contact-us/ContactUsScreen';
import Login from '../../pages/auth/Login';
import {FontAwesomeIcon} from '../icons';
import {useNavigation} from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation}) => {
  const getDrawerItems = () => {
    // drawerItem object
    // name: name of the drawer item to be displayed in the sidebar
    // icon: icon to be displayed next to the name
    // dropdown: boolean to determine if the drawer item is a dropdown (if a dropdown, there is no route)
    // route: route to navigate to when the drawer item is clicked
    // dropdownItems: array of drawerItem objects to be displayed in the dropdown (dropDown items do not have icons)
    // currently all dropdown items are empty because we only had one page in each of the dropdowns
    // the dropdown items we would have are "About Us" and "Resources"

    // Community and About Us are displayed by default

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
        dropdown: false,
        route: 'About',
        dropdownItems: [],
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
            <Image
              src="https://massenergize-prod-files.s3.amazonaws.com/media/energizewayland_resized.jpg"
              alt="Community Logo"
              style={{width: 120, height: 120, objectFit: 'contain'}}
            />
          </View>
          <View
            style={{
              padding: 15,
              paddingLeft: 25,
              backgroundColor: '#f2f3f5',
              marginBottom: 20,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>
              Wayland Community
            </Text>
          </View>

          {getDrawerItems().map(menu => (
            <TouchableOpacity
              key={menu?.name}
              style={{
                padding: 15,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate(menu?.route)}>
              <Icon name={menu?.icon} size={24} color="black" />
              <Text
                style={{
                  color: 'black',
                  fontWeight: '500',
                  marginLeft: 20,
                  fontSize: 15,
                }}>
                {menu?.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>
      <View style={{width: '100%', marginBottom: 20, padding: 20}}>
        <TouchableOpacity>
          <TouchableOpacity
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
                fontSize: 15,
                textAlign: 'center',
              }}>
              LOGIN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              // backgroundColor: ME_ORANGE,
              padding: 12,
              borderWidth: 2,
              borderColor: ME_ORANGE,
              marginTop: 10,
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: ME_ORANGE,
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
              }}>
              SWITCH COMMUNITIES
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </>
  );
};

const MEDrawerNavigator = ({}) => {
  const options = ({navigation}) => ({
    headerLeft: () => {
      return (
        <TouchableOpacity
          style={{marginLeft: 15}}
          onPress={() => navigation.toggleDrawer()}>
          <FontAwesomeIcon name="bars" size={21} />
        </TouchableOpacity>
      );
    },

    headerRight: () => {
      return (
        <TouchableOpacity style={{marginRight: 15}}>
          <FontAwesomeIcon name="user-circle" size={21} />
        </TouchableOpacity>
      );
    },
  });

  return (
    <Drawer.Navigator
      initialRouteName="Community"
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{width: 250}}>
      <Drawer.Screen options={options} name="Login" component={Login} />
      <Drawer.Screen
        options={options}
        name="Community"
        component={HomeScreen}
      />
      <Drawer.Screen options={options} name="About" component={AboutUsScreen} />
      <Drawer.Screen
        options={options}
        name="Testimonials"
        component={HomeScreen}
      />
      <Drawer.Screen options={options} name="Teams" component={HomeScreen} />
      <Drawer.Screen
        options={options}
        name="Service Providers"
        component={HomeScreen}
      />
      <Drawer.Screen
        options={options}
        name="Contact Us"
        component={ContactUsScreen}
      />
    </Drawer.Navigator>
  );
};

export default MEDrawerNavigator;
