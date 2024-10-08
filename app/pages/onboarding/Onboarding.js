/******************************************************************************
 *                            Onboarding
 * 
 *      This page is responsible for rendering the onboarding pages
 *      for when the user accesses the app for the first time.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 19, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState } from "react";
import {
  Box,
  Heading,
  Flex,
  Circle,
  Button,
  AspectRatio,
  HStack
} from '@gluestack-ui/themed-native-base';
import HTMLParser from "../../utils/HTMLParser";
import { ImageBackground } from "@gluestack-ui/themed";
import { DONE_ONBOARDING } from "../../utils/values";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* Creates each step of the onboarding pages the user is going to see */
const STEPS = [
  {
    title: "Take Local Climate Action",
    description: "<p><strong>MassEnergize</strong> works with community organizers and local leaders to scale household and community-level climate actions.</p>",
  },
  {
    title: "Witness Your Impact",
    description: "<p><strong>MassEnergize</strong> offers you access to compelling and inspirational data, presenting the number of households actively engaged in diverse actions.</p>",
  },
  {
    title: "Collaborate With Your Neighbor",
    description: "<p><strong>Access</strong> a diverse range of climate actions tailored to your community.</p>",
  },
  {
    title: "Find A Community Near You",
    description:
      "<p><strong>Connect</strong> with local communities to foster social connections, promote engagement, and achieve one common goal: <strong>take climate actions</strong>.</p>",
  },
];

export default function OnboardingPage({ navigation }) {
  /*
   * Uses local state to determine the current step that the user is
   * currently on plus the background image to display.
   */
  const [currentStep, setCurrentStep] = useState(0);
  const [currentImage, setCurrentImage] = useState(1);

  /* 
   * Function to handle when the user clicks on the button to go to 
   * the next step.
   */
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentImage(currentImage + 1);
    } else {
      finishOnboarding();
    }
  };

  /* 
   * Function to handle when the user clicks on the button to go to 
   * the previous step.
   */
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentImage(currentImage - 1);
    }
  };

  /* Array of images to be displayed in the background of each step */
  const images = {
    1: require("../../assets/intro-step-1.png"),
    2: require("../../assets/intro-step-2.png"),
    3: require("../../assets/intro-step-3.png"),
    4: require("../../assets/intro-step-4.png"),
  };

  /* Function to navigate to the next page after the onboarding is done */
  const finishOnboarding = () => {
    AsyncStorage.setItem(DONE_ONBOARDING, "true");
    navigation.navigate("CommunitySelectionPage");
  };

  /* Displays the onboarding pages */
  return (
    <Box width="100%" flex="1">
      {/* Skip Button */}
      { currentStep < STEPS.length - 1 ? (
        <Button
          position="absolute"
          variant="ghost"
          top="10"
          right="5"
          zIndex={1}
          _text={{
            fontWeight: "bold",
            color: "white",
            fontSize: "lg",
          }}
          onPress={finishOnboarding}
        >
          Skip
        </Button>
      ) : null}

      {/* Background Image */}
      <AspectRatio>
        <ImageBackground
          source={images[currentImage]}
          alt={`step ${currentImage}`}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </AspectRatio>

      {/* Background Overlay */}
      <Box
        width="100%"
        height="100%"
        position="absolute"
        backgroundColor="primary.400"
        opacity={0.3}
      ></Box>

      {/* Main */}
      <Box
        position="absolute"
        width="100%"
        height="55%"
        bottom="0"
        pt="10"
        borderTopRadius="30"
        backgroundColor="white"
        alignItems="center"
        style={{
          shadowColor: "#000",
          shadowRadius: 5,
          shadowOpacity: 0.2,
          shadowOffset: {
            width: 0,
            height: -10,
          },
        }}
      >
        <Flex
          flexDirection="column"
          flex="1"
          width="100%"
          px="6"
        >
          {/* Title */}
          <Heading
            fontSize={["sm", "2xl"]}
            alignSelf="center"
            color="primary.600"
            textAlign="center"
          >
            {STEPS[currentStep].title}
          </Heading>

          {/* Description */}
          <Box flexGrow="1" justifyContent="center">
            <HTMLParser
              htmlString={STEPS[currentStep].description}
              baseStyle={textStyle}
            />
          </Box>
          <Box mb="5">
            {/* Dots */}
            <HStack
              space="5"
              alignSelf="center"
              mb="5"
              display={["none", "block"]}
            >
              {STEPS.map((_, index) => {
                return (
                  <Circle
                    key={index}
                    mr="0.5"
                    size="5"
                    backgroundColor={
                      index === currentStep ? "primary.400" : "muted.200"
                    }
                  />
                );
              })}
            </HStack>

            {/* Buttons Group */}
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              width="100%"
            >
              <Button
                size="lg"
                variant="ghost"
                _text={{
                  fontWeight: "bold"
                }}
                onPress={handlePrev}
                colorScheme={currentStep === 0 ? "muted" : "primary"}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button
                size="lg"
                variant="solid"
                _text={{ fontWeight: "bold" }}
                onPress={handleNext}
              >
                {currentStep === STEPS.length - 1 ? "Get Started" : "Next"}
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

const textStyle = {
  textAlign: "center",
  color: "#a3a3a3",
  fontSize: "16px",
  lineHeight: "2em",
  alignSelf: "center",
};
