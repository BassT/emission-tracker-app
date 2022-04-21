import React from "react";
import { Button } from "react-native-paper";
import { FuelType } from "../../api";
import { TotalEmissionReducerState, TotalEmissionReducerAction } from "./totalEmissionReducer";

export function FuelTypeButton({
  fuelType,
  totalEmissionsReducerState,
  dispatchTotalEmissionsReducerAction,
}: {
  fuelType: FuelType;
  totalEmissionsReducerState: TotalEmissionReducerState;
  dispatchTotalEmissionsReducerAction: React.Dispatch<TotalEmissionReducerAction>;
}) {
  return (
    <Button
      mode={totalEmissionsReducerState.fuelType === fuelType ? "contained" : "outlined"}
      onPress={() =>
        dispatchTotalEmissionsReducerAction({
          type: "setFuelType",
          payload: { fuelType: fuelType },
        })
      }
    >
      {fuelType}
    </Button>
  );
}
