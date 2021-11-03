import { fireEvent, render } from "@testing-library/react-native";
import { startOfDay, startOfWeek } from "date-fns";
import React, { EffectCallback } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { CalcMode, CreateTransportActivityParams, FuelType, TransportActivityAPI, TransportDetails } from "../api";
import { AppContext } from "../AppContext";
import { TransportDetailsScreen } from "./TransportDetailsScreen";
import { TransportMode } from "./TransportMode";
import * as ReactNavigationNative from "@react-navigation/native";

jest.mock("@react-navigation/native");
const ReactNavigationNativeMock = ReactNavigationNative as jest.Mocked<typeof ReactNavigationNative>;
const useFocusEffectMock = jest.fn();
ReactNavigationNativeMock.useFocusEffect = useFocusEffectMock;

describe("TransportDetailsScreen", () => {
  beforeEach(() => {
    useFocusEffectMock.mockImplementationOnce((callback: EffectCallback) => callback());
  });

  it("should create transport activity correctly", async () => {
    // Setup
    const naiveAuthUserId = "123";
    const createTransportActivityMock = jest.fn().mockResolvedValue({ activityId: "test-123" });
    const api: TransportActivityAPI = {
      baseURL: "",
      listTransportAcitivites: function () {
        throw new Error("Function not implemented.");
      },
      createTransportActivity: createTransportActivityMock,
      getTransportActivityDetails: function () {
        throw new Error("Function not implemented.");
      },
      updateTransportActivity: function () {
        throw new Error("Function not implemented.");
      },
      deleteTransportActivity: function () {
        throw new Error("Function not implemented.");
      },
    };
    const navigation: any = {};
    const route: any = { params: { mode: TransportMode.CAR } };

    // Test
    const { getByDisplayValue, getByText } = render(
      <AppContext.Provider value={{ transportActivityAPI: api, naiveAuthUserId }}>
        <PaperProvider>
          <TransportDetailsScreen navigation={navigation} route={route} />
        </PaperProvider>
      </AppContext.Provider>
    );

    fireEvent.changeText(getByDisplayValue("Car drive"), "Title");
    fireEvent.press(getByText("Save"));

    expect(createTransportActivityMock).toHaveBeenCalledTimes(1);
    const params: CreateTransportActivityParams = {
      data: {
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
      },
      options: { naiveAuthUserId },
    };
    expect(createTransportActivityMock).toHaveBeenCalledWith(params);
  });

  it("should update transport activity correctly", async () => {
    // Setup
    const naiveAuthUserId = "user-123";
    const initialDetails: TransportDetails = {
      id: "transport-activity-123",
      calcMode: CalcMode.SpecificEmissions,
      date: startOfDay(new Date()).toISOString(),
      distance: 4,
      fuelType: FuelType.Diesel,
      persons: 1,
      specificEmissions: 4,
      specificFuelConsumption: 0,
      title: "Title",
      totalEmissions: 0.016,
      totalFuelConsumption: 0,
      createdBy: naiveAuthUserId,
      createdAt: startOfWeek(new Date()).toISOString(),
    };
    const newTitle = "New title";
    const newPersons = 2;
    const newTotalEmissions = 0.008;
    const getTransportActivityDetailsMock = jest.fn().mockResolvedValue({ result: initialDetails });
    const updateTransportActivityMock = jest.fn().mockResolvedValue({ ...initialDetails, newTitle, newTotalEmissions });
    const api: TransportActivityAPI = {
      baseURL: "",
      listTransportAcitivites: function () {
        throw new Error("Function not implemented.");
      },
      createTransportActivity: function () {
        throw new Error("Function not implemented.");
      },
      getTransportActivityDetails: getTransportActivityDetailsMock,
      updateTransportActivity: updateTransportActivityMock,
      deleteTransportActivity: function () {
        throw new Error("Function not implemented.");
      },
    };
    const navigation: any = { setOptions: () => {} };
    const route: any = { params: { mode: TransportMode.CAR, transportActivityId: initialDetails.id } };

    // Test
    const { findByDisplayValue, getByDisplayValue, getByText } = render(
      <AppContext.Provider value={{ transportActivityAPI: api, naiveAuthUserId }}>
        <PaperProvider>
          <TransportDetailsScreen navigation={navigation} route={route} />
        </PaperProvider>
      </AppContext.Provider>
    );

    fireEvent.changeText(await findByDisplayValue(initialDetails.title), newTitle);
    fireEvent.changeText(getByDisplayValue(initialDetails.persons.toString()), newPersons.toString());
    fireEvent.press(getByText("Save"));

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
      options: { naiveAuthUserId },
    });
  });
});
