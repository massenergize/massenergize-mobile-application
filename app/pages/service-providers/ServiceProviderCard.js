import { Flex, Image, Pressable, Box, Text } from '@gluestack-ui/themed-native-base';
import React, { useState } from "react";

const styles = {
  rSPImageSize: 100,
  cSPImageSize: 128,
  SPNameSize: ["sm", "lg"],
};


export default function ServiceProviderCard({
  id,
  direction, // "row" or "column"
  name,
  imageURI,
  onPress,
  navigation,
  ...props
}) {
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ServiceProviderDetails", { vendor_id: id })
        // console.log("service provider details", id)
      }
    >
      <Flex
        backgroundColor="white"
        flexDirection={direction}
        alignItems={direction === "row" ? "center" : "baseline"}
        borderRadius="xl"
        p="2"
        shadow="2"
        {...props}
      >
        {/* image */}
        { (imageURI !== '' && imageLoaded) ? 
          (<Image
            source={{ uri: imageURI }}
            alt="service provider's image"
            resizeMode="contain"
            size={
              direction === "row" ? styles.rSPImageSize : styles.cSPImageSize
            }
            alignSelf="center"
            onError={() => setImageLoaded(false)}
          /> ) : (
            <Box
              size={
                direction === "row" ? styles.rSPImageSize : styles.cSPImageSize
              }
              backgroundColor="gray.200"
            />
          )
        }
        <Box
          width={direction === "row" ? "60%" : "40"}
          pl={direction === "row" && "3"}
          pt={direction === "column" && "3"}
        >
          {/* name */}
          {direction === "row" ? (
            <Text fontWeight="bold" fontSize={styles.SPNameSize}>
              {name}
            </Text>
          ) : (
            <Text fontWeight="bold">{name.slice(0, 20) + "..."}</Text>
          )}
        </Box>
      </Flex>
    </Pressable>
  );
}

