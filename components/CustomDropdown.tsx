import React, { useState } from 'react';
  import { Dimensions, StyleSheet } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
  import AntDesign from '@expo/vector-icons/AntDesign';

  type DropDownProps={
    marginTop : number
    marginBottom : number
    dropdownValue : string
    setDropDownValue : (item: string) => void
    dropdownData : {label : string, value : string}[]
  }

  

  const windowHeight = Dimensions.get('window').height;

  const CustomDropDown: React.FC<DropDownProps> = ({marginTop, marginBottom, dropdownValue, setDropDownValue, dropdownData}) => {
    

    return (
      <Dropdown
        style={[styles.dropdown, {marginTop: marginTop, marginBottom: marginBottom}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={dropdownData}
        search
        maxHeight={windowHeight/2.5}
        labelField="label"
        valueField="value"
        placeholder="Select region"
        searchPlaceholder="Search..."
        value={dropdownValue}
        onChange={item => {
          setDropDownValue(item.value);
        }}
      />
    );
  };

  //renderLeftIcon={() => (
  // <AntDesign style={styles.icon} color="white" name="Safety" size={20} />
  //)}

  export default CustomDropDown;

  const styles = StyleSheet.create({
    dropdown: {
     backgroundColor: '#191919',
      width: '90%',
      height: 50,
      borderBottomWidth: 0.5,
      borderRadius: 10,
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 22,
      color: 'grey',
      marginLeft: 10,
    },
    selectedTextStyle: {
      fontSize: 22,
      color: 'grey',
      marginLeft: 10,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 18,
    },
  });