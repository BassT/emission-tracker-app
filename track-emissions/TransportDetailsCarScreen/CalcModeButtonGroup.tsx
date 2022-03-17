import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { CalcMode } from "../../api";
import { TotalEmissionReducerState, TotalEmissionReducerAction } from "./totalEmissionReducer";

export function CalcModeButtonGroup({
  totalEmissionsReducerState,
  dispatchTotalEmissionsReducerAction,
}: {
  totalEmissionsReducerState: TotalEmissionReducerState;
  dispatchTotalEmissionsReducerAction: React.Dispatch<TotalEmissionReducerAction>;
}) {
  return (
    <View style={{ display: "flex", flexDirection: "row", marginBottom: 8, marginTop: 16 }}>
      <Button
        compact
        mode={totalEmissionsReducerState.calcMode === CalcMode.SpecificEmissions ? "contained" : "outlined"}
        style={{ width: "33%" }}
        labelStyle={{ fontSize: 8 }}
        onPress={() =>
          dispatchTotalEmissionsReducerAction({
            type: "setCalcMode",
            payload: { calcMode: CalcMode.SpecificEmissions },
          })
        }
      >
        Specific emission
      </Button>
      <Button
        compact
        mode={totalEmissionsReducerState.calcMode === CalcMode.TotalFuel ? "contained" : "outlined"}
        style={{ width: "33%" }}
        labelStyle={{ fontSize: 8 }}
        onPress={() =>
          dispatchTotalEmissionsReducerAction({
            type: "setCalcMode",
            payload: { calcMode: CalcMode.TotalFuel },
          })
        }
      >
        Total fuel
      </Button>
      <Button
        compact
        mode={totalEmissionsReducerState.calcMode === CalcMode.SpecificFuel ? "contained" : "outlined"}
        style={{ width: "33%" }}
        labelStyle={{ fontSize: 8 }}
        onPress={() =>
          dispatchTotalEmissionsReducerAction({
            type: "setCalcMode",
            payload: { calcMode: CalcMode.SpecificFuel },
          })
        }
      >
        Specific fuel
      </Button>
    </View>
  );
}
