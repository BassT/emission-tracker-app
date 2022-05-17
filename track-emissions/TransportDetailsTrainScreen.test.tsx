import * as ReactNavigationNative from "@react-navigation/native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { startOfDay } from "date-fns";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { ApiContext, FuelType, TransportActivityAPI, TransportMode } from "../api";
import { TransportDetailsTrainScreen } from "./TransportDetailsTrainScreen";

jest.mock("@react-navigation/native");
const ReactNavigationNativeMock = ReactNavigationNative as jest.Mocked<typeof ReactNavigationNative>;
const useFocusEffectMock = jest.fn();
ReactNavigationNativeMock.useFocusEffect = useFocusEffectMock;

describe(TransportDetailsTrainScreen.name, () => {
  it("should handle calculated total emissions properly", async () => {
    const createMock = jest.fn().mockResolvedValue({ activityId: "test-123" });
    const transportActivityAPI = { createTransportActivity: createMock } as unknown as TransportActivityAPI;

    // Render component
    const { getByText, getByTestId } = render(
      <ApiContext.Provider value={{ transportActivityAPI, initialized: true }}>
        <PaperProvider>
          <TransportDetailsTrainScreen
            navigation={{} as any}
            route={{ params: { mode: TransportMode.Train } } as any}
          />
        </PaperProvider>
      </ApiContext.Provider>
    );

    fireEvent.press(getByText(FuelType.Diesel));
    fireEvent.changeText(getByTestId("distance"), "1.0");
    fireEvent.changeText(getByTestId("specific-emissions"), "10.5");
    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      // The `Button` component, which testID `save`, from react-native-paper creates a tree of different native components.
      // We can't check `disabled` or `loading` prop directly, because they're not assigned to the element with testID `save`.
      // To check if the loading indicator, due to the save, disappears, we look at the `accessibilityState.disabled` prop.
      return expect(getByTestId("save").props.accessibilityState.disabled).toBe(false);
    });

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      options: {},
      params: {
        title: "Train ride",
        date: startOfDay(new Date()).toISOString(),
        transportMode: TransportMode.Train,
        totalEmissions: (10.5 * 1) / 1000,
        distance: 1,
        specificEmissions: 10.5,
      },
    });
  });

  it("should handle custom total emissions properly", async () => {
    const createMock = jest.fn().mockResolvedValue({ activityId: "test-123" });
    const transportActivityAPI = { createTransportActivity: createMock } as unknown as TransportActivityAPI;

    // Render component
    const { getByText, getByTestId } = render(
      <ApiContext.Provider value={{ transportActivityAPI, initialized: true }}>
        <PaperProvider>
          <TransportDetailsTrainScreen
            navigation={{} as any}
            route={{ params: { mode: TransportMode.Train } } as any}
          />
        </PaperProvider>
      </ApiContext.Provider>
    );

    fireEvent.changeText(getByTestId("total-emissions"), "10.5");
    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      // The `Button` component, which testID `save`, from react-native-paper creates a tree of different native components.
      // We can't check `disabled` or `loading` prop directly, because they're not assigned to the element with testID `save`.
      // To check if the loading indicator, due to the save, disappears, we look at the `accessibilityState.disabled` prop.
      return expect(getByTestId("save").props.accessibilityState.disabled).toBe(false);
    });

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      options: {},
      params: {
        title: "Train ride",
        date: startOfDay(new Date()).toISOString(),
        transportMode: TransportMode.Train,
        totalEmissions: 10.5,
      },
    });
  });
});
