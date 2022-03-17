import React from "react";
import { TextInput } from "react-native-paper";
import { TotalEmissionReducerAction } from "./totalEmissionReducer";

export function SpecificEmissionsDetailsInput({
  specificEmissions,
  setSpecificEmissions,
  dispatchTotalEmissionsReducerAction,
  distance,
  setDistance,
}: {
  specificEmissions: string;
  setSpecificEmissions: React.Dispatch<React.SetStateAction<string>>;
  dispatchTotalEmissionsReducerAction: React.Dispatch<TotalEmissionReducerAction>;
  distance: string;
  setDistance: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
  return (
    <>
      <TextInput
        label="Specific emissions"
        value={specificEmissions}
        onChangeText={(text) => {
          setSpecificEmissions(text);
          if (!isNaN(parseFloat(text)))
            dispatchTotalEmissionsReducerAction({
              type: "setSpecificEmissions",
              payload: { specificEmissions: parseFloat(text) },
            });
        }}
        keyboardType="numeric"
        selectTextOnFocus
        right={<TextInput.Affix text="g CO2 / km" />}
        error={isNaN(parseFloat(specificEmissions))}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Distance"
        value={distance}
        onChangeText={(text) => {
          setDistance(text);
          if (!isNaN(parseFloat(text)))
            dispatchTotalEmissionsReducerAction({
              type: "setDistance",
              payload: { distance: parseFloat(text) },
            });
        }}
        keyboardType="numeric"
        selectTextOnFocus
        right={<TextInput.Affix text="km" />}
        error={isNaN(parseFloat(distance))}
        style={{ marginBottom: 8 }}
      />
    </>
  );
}
