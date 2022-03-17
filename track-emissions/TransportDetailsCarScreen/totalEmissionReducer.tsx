import { CalcMode, FuelType, TransportDetails } from "../../api";
import { getSpecificEmissionsByFuelType } from "../FuelType";

export function totalEmissionReducer(
  state: TotalEmissionReducerState,
  action: TotalEmissionReducerAction
): TotalEmissionReducerState {
  switch (action.type) {
    case "initialize":
      return {
        ...state,
        distance: action.payload.distance,
        specificEmissions: action.payload.specificEmissions,
        fuelType: action.payload.fuelType,
        specificFuelConsumption: action.payload.specificFuelConsumption,
        totalFuelConsumption: action.payload.totalFuelConsumption,
        totalEmissions: action.payload.totalEmissions,
        calcMode: action.payload.calcMode,
        persons: action.payload.persons,
      };
    case "setDistance":
      if (state.calcMode === CalcMode.SpecificFuel) {
        return {
          ...state,
          distance: action.payload.distance,
          totalEmissions: calculateTotalEmissions({
            ...state,
            distance: action.payload.distance,
          }),
          totalFuelConsumption: (state.specificFuelConsumption / 100) * action.payload.distance,
        };
      } else if (state.calcMode === CalcMode.SpecificEmissions) {
        return {
          ...state,
          distance: action.payload.distance,
          totalEmissions: calculateTotalEmissions({
            ...state,
            distance: action.payload.distance,
          }),
        };
      }
      return state;
    case "setSpecificEmissions":
      if (state.calcMode === CalcMode.SpecificEmissions) {
        return {
          ...state,
          specificEmissions: action.payload.specificEmissions,
          totalEmissions: calculateTotalEmissions({
            ...state,
            specificEmissions: action.payload.specificEmissions,
          }),
        };
      }
      return { ...state };
    case "setFuelType":
      return {
        ...state,
        fuelType: action.payload.fuelType,
        totalEmissions: calculateTotalEmissions({
          ...state,
          fuelType: action.payload.fuelType,
        }),
      };
    case "setSpecificFuelConsumption":
      return {
        ...state,
        specificFuelConsumption: action.payload.specificFuelConsumption,
        totalEmissions: calculateTotalEmissions({
          ...state,
          specificFuelConsumption: action.payload.specificFuelConsumption,
        }),
      };
    case "setTotalFuelConsumption":
      return {
        ...state,
        totalFuelConsumption: action.payload.totalFuelConsumption,
        totalEmissions: calculateTotalEmissions({
          ...state,
          totalFuelConsumption: action.payload.totalFuelConsumption,
        }),
      };
    case "setCalcMode":
      return {
        ...state,
        calcMode: action.payload.calcMode,
        totalEmissions: calculateTotalEmissions({ ...state, calcMode: action.payload.calcMode }),
      };
    case "setPersons":
      return {
        ...state,
        persons: action.payload.persons,
        totalEmissions: calculateTotalEmissions({ ...state, persons: action.payload.persons }),
      };
    default:
      return state;
  }
}

function calculateTotalEmissions({
  calcMode,
  specificEmissions,
  distance,
  totalFuelConsumption,
  fuelType,
  specificFuelConsumption,
  persons,
}: {
  calcMode: CalcMode;
  specificEmissions: number;
  distance: number;
  totalFuelConsumption: number;
  fuelType: FuelType;
  specificFuelConsumption: number;
  persons: number;
}) {
  switch (calcMode) {
    case CalcMode.SpecificEmissions:
      return ((specificEmissions / 1000) * distance) / persons;
    case CalcMode.TotalFuel:
      return (totalFuelConsumption * getSpecificEmissionsByFuelType(fuelType)) / persons;
    case CalcMode.SpecificFuel:
      return ((specificFuelConsumption / 100) * distance * getSpecificEmissionsByFuelType(fuelType)) / persons;
    default:
      return 0;
  }
}

export interface TotalEmissionReducerState {
  distance: number;
  specificEmissions: number;
  fuelType: FuelType;
  specificFuelConsumption: number;
  totalFuelConsumption: number;
  totalEmissions: number;
  calcMode: CalcMode;
  persons: number;
}

interface EmissionReducertSetDistanceAction {
  type: "setDistance";
  payload: {
    distance: number;
  };
}

interface EmissionReducerSetSpecificEmissionsAction {
  type: "setSpecificEmissions";
  payload: {
    specificEmissions: number;
  };
}

interface EmissionReducerSetFuelTypeAction {
  type: "setFuelType";
  payload: {
    fuelType: FuelType;
  };
}

interface EmissionReducerSetSpecificFuelConsumptionAction {
  type: "setSpecificFuelConsumption";
  payload: {
    specificFuelConsumption: number;
  };
}

interface EmissionReducerSetTotalFuelConsumptionAction {
  type: "setTotalFuelConsumption";
  payload: {
    totalFuelConsumption: number;
  };
}

interface EmissionReducerSetCalcModeAction {
  type: "setCalcMode";
  payload: {
    calcMode: CalcMode;
  };
}

interface EmissionReducerSetPersonsAction {
  type: "setPersons";
  payload: {
    persons: number;
  };
}

interface EmissionReducerInitializeAction {
  type: "initialize";
  payload: TransportDetails;
}

export type TotalEmissionReducerAction =
  | EmissionReducerInitializeAction
  | EmissionReducertSetDistanceAction
  | EmissionReducerSetSpecificEmissionsAction
  | EmissionReducerSetFuelTypeAction
  | EmissionReducerSetSpecificFuelConsumptionAction
  | EmissionReducerSetTotalFuelConsumptionAction
  | EmissionReducerSetCalcModeAction
  | EmissionReducerSetPersonsAction;
