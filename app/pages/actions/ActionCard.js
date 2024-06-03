import React, { useState, useEffect } from "react";
import { Text, Pressable } from "react-native";
import { Box, Heading, Image, Stack } from "@gluestack-ui/themed-native-base";

const ActionCard = ({
  navigation,
  id,
  title,
  imgUrl,
  impactMetric = "Low",
  costMetric = "0",
  ...props
}) => {
  const [imageValid, setImageValid] = useState(true);

  useEffect(() => {
    setImageValid(true);
  }, [imgUrl]);

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("ActionDetails", { action_id: id });
        console.log("ActionCard Pressed");
      }}
      {...props}
    >
      <Box bg="white" borderRadius="xl" shadow={2} width={180} {...props}>
        <Box>
          {imgUrl && imageValid ? (
            <Image
              source={{ uri: imgUrl }}
              alt="image"
              borderTopRadius="xl"
              resizeMode="cover"
              height={120}
              bg="gray.300"
              onError={() => setImageValid(false)}
            />
          ) : (
            <Box height={120} bg="gray.300" borderTopRadius="xl" />
          )}
        </Box>
        <Stack p={3} space={3}>
          <Stack space={2}>
            <Heading size="sm" isTruncated={true} noOfLines={1}>
              {title ? title : "Action Title"}
            </Heading>
            <Text fontSize="xs" fontWeight="500">
              {`${impactMetric} Impact | ${costMetric}`}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Pressable>
  );
}

export default React.memo(ActionCard);
