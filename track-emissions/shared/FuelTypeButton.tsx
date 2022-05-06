import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Button } from "react-native-paper";
import { FuelType } from "../../api";

export function FuelTypeButton({
  fuelType,
  selectedFuelType,
  onChange,
  style,
}: {
  fuelType: FuelType;
  selectedFuelType: FuelType;
  onChange: (fuelType: FuelType) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Button
      mode={selectedFuelType === fuelType ? "contained" : "outlined"}
      onPress={() => onChange(fuelType)}
      style={style}
    >
      {fuelType}
    </Button>
  );
}
