import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { startOfDay, startOfWeek } from "date-fns";
import React, { EffectCallback } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import {
  ApiContext,
  CalcMode,
  CreateTransportActivityParams,
  FuelType,
  TransportActivityAPI,
  TransportMode,
} from "../api";
import { TransportDetailsCarScreen } from "./TransportDetailsCarScreen";
import * as ReactNavigationNative from "@react-navigation/native";

jest.mock("@react-navigation/native");
const ReactNavigationNativeMock = ReactNavigationNative as jest.Mocked<typeof ReactNavigationNative>;
const useFocusEffectMock = jest.fn();
ReactNavigationNativeMock.useFocusEffect = useFocusEffectMock;

describe(TransportDetailsCarScreen.name, () => {
  beforeEach(() => {
    useFocusEffectMock.mockImplementationOnce((callback: EffectCallback) => callback());
  });

  it("should create transport activity correctly", async () => {
    // Setup
    const createTransportActivityMock = jest.fn().mockResolvedValue({ activityId: "test-123" });
    const transportActivityAPI = {
      createTransportActivity: createTransportActivityMock,
    } as unknown as TransportActivityAPI;
    const navigation: any = {};
    const route: any = { params: { mode: TransportMode.Car } };

    // Test
    const { getByDisplayValue, getByTestId } = render(
      <ApiContext.Provider value={{ transportActivityAPI, initialized: true }}>
        <PaperProvider>
          <TransportDetailsCarScreen navigation={navigation} route={route} />
        </PaperProvider>
      </ApiContext.Provider>
    );

    fireEvent.changeText(getByDisplayValue("Car drive"), "Title");
    fireEvent.press(getByTestId("save"));

    await waitFor(() => {
      // The `Button` component, which testID `save`, from react-native-paper creates a tree of different native components.
      // We can't check `disabled` or `loading` prop directly, because they're not assigned to the element with testID `save`.
      // To check if the loading indicator, due to the save, disappears, we look at the `accessibilityState.disabled` prop.
      return expect(getByTestId("save").props.accessibilityState.disabled).toBe(false);
    });

    expect(createTransportActivityMock).toHaveBeenCalledTimes(1);
    const params: CreateTransportActivityParams = {
      params: {
        calcMode: CalcMode.SpecificEmissions,
        date: startOfDay(new Date()).toISOString(),
        distance: 0,
        fuelType: FuelType.Diesel,
        persons: 1,
        specificEmissions: 0,
        specificFuelConsumption: 0,
        title: "Title",
        totalEmissions: 0,
        totalFuelConsumption: 0,
        transportMode: TransportMode.Car,
      },
      options: {},
    };
    expect(createTransportActivityMock).toHaveBeenCalledWith(params);
  });

  // This test currently throws cryptic errors about "await act()...".
  // There's a pull requests that a explains some of the background: https://github.com/callstack/react-native-testing-library/pull/969.
  it("should update transport activity correctly", async () => {
    // Setup
    const initialDetails = {
      id: "transport-activity-123",
      calcMode: CalcMode.SpecificEmissions,
      date: startOfDay(new Date()).toISOString(),
      distance: 4,
      fuelType: FuelType.Diesel,
      persons: 1,
      specificEmissions: 4,
      specificFuelConsumption: 0,
      title: "Initial title",
      totalEmissions: 0.016,
      totalFuelConsumption: 0,
      createdBy: "f4k3-1d",
      createdAt: startOfWeek(new Date()).toISOString(),
      transportMode: TransportMode.Car,
    };
    const newTitle = "New title";
    const newPersons = 2;
    const newTotalEmissions = 0.008;
    const getTransportActivityDetailsMock = jest.fn().mockResolvedValue({ result: initialDetails });
    const updateTransportActivityMock = jest.fn().mockResolvedValue({ ...initialDetails, newTitle, newTotalEmissions });
    const transportActivityAPI = {
      getTransportActivityDetails: getTransportActivityDetailsMock,
      updateTransportActivity: updateTransportActivityMock,
    } as unknown as TransportActivityAPI;
    const navigation: any = { setOptions: () => undefined };
    const route: any = { params: { mode: TransportMode.Car, transportActivityId: initialDetails.id } };

    // Test
    const { getByDisplayValue, getByTestId } = render(
      <ApiContext.Provider value={{ transportActivityAPI, initialized: true }}>
        <PaperProvider>
          <TransportDetailsCarScreen navigation={navigation} route={route} />
        </PaperProvider>
      </ApiContext.Provider>
    );

    await waitFor(() => expect(getByTestId("title").props.value).toBe(initialDetails.title));

    fireEvent.changeText(getByTestId("title"), newTitle);
    fireEvent.changeText(getByDisplayValue(initialDetails.persons.toString()), newPersons.toString());
    fireEvent.press(getByTestId("save"));

    await waitFor(() => {
      // The `Button` component, which testID `save`, from react-native-paper creates a tree of different native components.
      // We can't check `disabled` or `loading` prop directly, because they're not assigned to the element with testID `save`.
      // To check if the loading indicator, due to the save, disappears, we look at the `accessibilityState.disabled` prop.
      return expect(getByTestId("save").props.accessibilityState.disabled).toBe(false);
    });

    expect(getTransportActivityDetailsMock).toHaveBeenCalledTimes(1);
    expect(updateTransportActivityMock).toHaveBeenCalledTimes(1);
    expect(updateTransportActivityMock).toHaveBeenCalledWith({
      params: {
        id: "transport-activity-123",
        calcMode: CalcMode.SpecificEmissions,
        date: startOfDay(new Date()).toISOString(),
        distance: 4,
        fuelType: FuelType.Diesel,
        persons: newPersons,
        specificEmissions: 4,
        specificFuelConsumption: 0,
        title: newTitle,
        totalEmissions: newTotalEmissions,
        totalFuelConsumption: 0,
      },
      options: {},
    });
  });
});
