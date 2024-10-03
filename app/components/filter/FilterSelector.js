/******************************************************************************
 *                            FilterSelector
 * 
 *      This file contains a generic component that can be used to filter a
 *      given set of data. It should be given a list of filters, each with a
 *      name and a list of options, as well as a filter object and a function
 *      to update the filter.
 * 
 *      Written by: Will Soylemez
 *      Last edited: August 6, 2024
 * 
 * *****************************************************************************/


import { Pressable, Text, View } from "react-native";
import HStack from "../stacks/HStack";
import { IonicIcon } from "../icons";
import React, { useState } from "react";
import MEDropdown from "../dropdown/MEDropdown";
import { VStack } from "@gluestack-ui/themed-native-base";
import { COLOR_SCHEME } from "../../stylesheet";

const Filter = ({ name, children, value, setValue }) => {
  const optionList = React.Children.map(children, (child) => {
    if (child.type.name === FilterSelector.Option.name) {
      return { ...child.props, label: child.props.label ?? child.props.value };
    }
  });

  return (
    <>
      <Text style={{ fontWeight: "bold", marginTop: 20 }}>{name}</Text>
      <MEDropdown
        style={{ marginTop: 10 }}
        title={name}
        options={optionList}
        onChange={setValue}
        value={value}
      />
    </>
  );
}

const Option = ({ value }) => (
  <Text>{value}</Text>
);

/*
  FilterSelector
  To use the filter selector, provide a title and a list of filters (as children).
  Each filter should have a name and a list of options.
  Each option should have a value and an optional label.
  Also provide a filter and a function to update the filter.
*/
const FilterSelector = ({ title, children, filter, handleChangeFilter }) => {
  const [expand, setExpand] = useState(false);

  const filters = React.Children.map(children, (child) => {
    if (child.type.name === FilterSelector.Filter.name) {
      return React.cloneElement(child, {
        value: filter[child.props.name],
        setValue: (newVal) => handleChangeFilter({ ...filter, [child.props.name]: newVal })
      });
    }
    return child;
  });

  return (
    <View style={{ padding: 20 }}>
      <Pressable
        onPress={() => setExpand(!expand)}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <HStack style={{ alignItems: "center", marginTop: 2 }}>
          <IonicIcon
            name={expand ? "chevron-up-outline" : "filter"}
            color="#64B058"
          />
          <Text style={{ marginLeft: 5, color: "#64B058" }}>
            {expand ? "Collapse Filters" : (title ?? "Expand Filters")}
          </Text>
        </HStack>
      </Pressable>
      {expand ? (
        <VStack>
          {filters}
        </VStack>
      ) : (
        // Display the current filter values
        <View flexDirection="row" flexWrap="wrap">
          {Object.entries(filter).map(([key, value]) => (
            (value !== 'All') &&
            <Pressable
              key={key}
              onPress={() => handleChangeFilter({ ...filter, [key]: 'All' })}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 10,
                padding: 8,
                borderColor: COLOR_SCHEME.GREEN,
                borderWidth: 1,
                borderStyle: 'solid',
                margin: 5,
              }}
            >
              <Text style={{ paddingRight: 5 }}>
                {key}: {filters.find((f) => f.props.name === key).props.children.find((o) => o.props.value === value)?.props?.label ?? value}
              </Text>
              <IonicIcon name="close" size={16} color={COLOR_SCHEME.GREEN} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}


FilterSelector.Filter = Filter;
FilterSelector.Option = Option;

export default FilterSelector;