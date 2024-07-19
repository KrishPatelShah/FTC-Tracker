import React, { useState } from 'react';
  import { Dimensions, StyleSheet } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
  import AntDesign from '@expo/vector-icons/AntDesign';

  type DropDownProps={
    marginTop : number
    marginBottom : number
  }

  const data = [
    { label: 'Region 1', value: '1' },
    { label: 'Region 2', value: '2' },
    { label: 'Region 3', value: '3' },
    { label: 'Region 4', value: '4' },
    { label: 'Region 5', value: '5' },
    { label: 'Region 6', value: '6' },
    { label: 'Region 7', value: '7' },
    { label: 'Region 8', value: '8' },
  ];

  const windowHeight = Dimensions.get('window').height;

  const CustomDropDown: React.FC<DropDownProps> = ({marginTop, marginBottom}) => {
    const [value, setValue] = useState('');

    return (
      <Dropdown
        style={[styles.dropdown, {marginTop: marginTop, marginBottom: marginBottom}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={windowHeight/2.5}
        labelField="label"
        valueField="value"
        placeholder="Select region"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.value);
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