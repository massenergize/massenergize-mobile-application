import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../../pages/home/HomeScreen';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, View, TouchableOpacity, Image, Button} from 'react-native';
import {ME_ORANGE} from '../../stylesheet';
import AboutUsScreen from '../../pages/about/AboutUsScreen';
import ContactUsScreen from '../../pages/contact-us/ContactUsScreen';

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
    ];
    // // add pages if they are published
    // if (testimonialsSettings.is_published) {
    //   drawerItems.push({
    //     name: "Testimonials",
    //     icon: "chatbox-outline",
    //     dropdown: false,
    //     route: "Testimonials",
    //     dropdownItems: [],
    //   })
    // }
    // if (teamsSettings.is_published) {
    //   drawerItems.push({
    //     name: "Teams",
    //     icon: "people-outline",
    //     dropdown: false,
    //     route: "Teams",
    //     dropdownItems: [],
    //   })
    // }
    // if (vendorsSettings.is_published) {
    //   drawerItems.push({
    //     name: "Service Providers",
    //     icon: "document-text-outline",
    //     dropdown: false,
    //     route: "Service Providers",
    //     dropdownItems: [],
    //   })
    // }
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
              style={{width: '50%', height: '50%', objectFit: 'contain'}}
            />
          </View>
          <View
            style={{padding: 15, paddingLeft: 25, backgroundColor: '#f2f3f5'}}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>
              Wayland Community
            </Text>
          </View>

          {/* Custom Drawer Items */}
          {/*  <DrawerItem
              key={menu?.name}
              label={menu?.name}
              icon={({color, size}) => (
                <Icon name={menu?.icon} size={size} color={color} />
              )}
              onPress={() => navigation.navigate('Community')}
            /> */}
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
                  marginLeft: 10,
                  fontSize: 15,
                }}>
                {menu?.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>
      <View style={{width: '100%'}}>
        <TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: 'green', padding: 13}}>
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
          <TouchableOpacity style={{backgroundColor: ME_ORANGE, padding: 13}}>
            <Text
              style={{
                color: 'white',
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
  return (
    <Drawer.Navigator
      initialRouteName="Community"
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{width: 250}}>
      <Drawer.Screen name="Community" component={HomeScreen} />
      <Drawer.Screen name="About" component={AboutUsScreen} />
      <Drawer.Screen name="Testimonials" component={HomeScreen} />
      <Drawer.Screen name="Teams" component={HomeScreen} />
      <Drawer.Screen name="Service Providers" component={HomeScreen} />
      <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
    </Drawer.Navigator>
  );
};

export default MEDrawerNavigator;
