import { ScrollView, Text, View, Pressable } from "react-native";
import { toggleUniversalModalAction } from "../../config/redux/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { IonicIcon } from "../icons";
import { useState } from "react";

const MEDropdown = ({
  options,
  value,
  onChange,
  toggleModal,
  title,
  style
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fix empty props
  onChange = onChange ?? (() => null);
  value = value ?? null;

  // Check that all options have a unique value
  if (options) {
    const values = options.map(option => option.value);
    if (values.length !== new Set(values).size) {
      console.error("MEDropdown: Duplicate values found in options");
      return null;
    }
  }

  const renderOptions = () => (
    <ScrollView>
      {options?.map(option => (
        <Pressable
          onPress={() => {
            onChange(option.value);
            setIsOpen(false);
            toggleModal({ isVisible: false });
          }}
          key={option.value}
        >
          <View
            style={{
              paddingVertical: 15,
              paddingHorizontal: 30,
              width: "100%",
              backgroundColor: value === option.value ? "lightgrey" : "white",
              marginVertical: 5,
            }}
          >
            <Text>{option.label}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );

  return (
    <Pressable
      onPress={() => {
        setIsOpen(true);
        toggleModal({
          isVisible: true,
          Component: renderOptions,
          title: title ?? "Select an option",
          onClose: () => setIsOpen(false),
        });
      }}
      style={{
        padding: 10,
        borderWidth: 1,
        borderColor: "lightgrey",
        borderRadius: 5,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        ...style,
      }}
    >
      <Text>{value ? options.find(option => option.value === value).label : "Select an option"}</Text>
      <Text>{isOpen}</Text>
      <IonicIcon name={isOpen ? "chevron-up" : "chevron-down"} size={20} />
    </Pressable>
  );
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleModal: toggleUniversalModalAction,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(MEDropdown);