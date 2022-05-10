import { FuelType, TrainType } from "../../api";

export function totalEmissionsTrainReducer(
  state: TotalEmissionsTrainReducerState,
  action: TotalEmissionsTrainReducerAction
): TotalEmissionsTrainReducerState {
  switch (action.type) {
    case "initialize":
      return {
        ...state,
        ...action.payload,
      };
    case "setDistance":
      return {
        ...state,
        distance: action.payload.distance,
        totalEmissions: calculateTotalEmissions({
          ...state,
          distance: action.payload.distance,
        }),
      };
    case "setSpecificEmissions":
      return {
        ...state,
        specificEmissions: action.payload.specificEmissions,
        totalEmissions: calculateTotalEmissions({
          ...state,
          specificEmissions: action.payload.specificEmissions,
        }),
      };
    case "setFuelType": {
      const specificEmissions =
        state.trainType && action.payload.fuelType
          ? getSpecificEmissions({ trainType: state.trainType, fuelType: action.payload.fuelType })
          : state.specificEmissions;
      return {
        ...state,
        fuelType: action.payload.fuelType,
        specificEmissions,
        totalEmissions: calculateTotalEmissions({ specificEmissions, distance: state.distance }),
      };
    }
    case "setTrainType": {
      const specificEmissions =
        state.fuelType && action.payload.trainType
          ? getSpecificEmissions({ trainType: action.payload.trainType, fuelType: state.fuelType })
          : state.specificEmissions;
      return {
        ...state,
        trainType: action.payload.trainType,
        specificEmissions,
        totalEmissions: calculateTotalEmissions({ specificEmissions, distance: state.distance }),
      };
    }
    case "setTotalEmissions":
      return {
        ...state,
        totalEmissions: action.payload.totalEmissions,
      };
    default:
      return state;
  }
}

function calculateTotalEmissions({ specificEmissions, distance }: { specificEmissions: number; distance: number }) {
  return (specificEmissions / 1000) * distance;
}

export interface TotalEmissionsTrainReducerState {
  distance: number;
  specificEmissions: number;
  trainType: TrainType | null;
  fuelType: FuelType.Electricity | FuelType.Diesel | null;
  totalEmissions: number;
}

interface EmissionReducerSetDistanceAction {
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

interface EmissionReducerSetTotalEmissionsAction {
  type: "setTotalEmissions";
  payload: {
    totalEmissions: number;
  };
}

interface EmissionReducerSetFuelTypeAction {
  type: "setFuelType";
  payload: {
    fuelType: FuelType.Electricity | FuelType.Diesel | null;
  };
}

interface EmissionReducerSetTrainTypeAction {
  type: "setTrainType";
  payload: {
    trainType: TrainType | null;
  };
}

interface EmissionReducerInitializeAction {
  type: "initialize";
  payload: TotalEmissionsTrainReducerState;
}

export type TotalEmissionsTrainReducerAction =
  | EmissionReducerInitializeAction
  | EmissionReducerSetDistanceAction
  | EmissionReducerSetSpecificEmissionsAction
  | EmissionReducerSetFuelTypeAction
  | EmissionReducerSetTrainTypeAction
  | EmissionReducerSetTotalEmissionsAction;

export function getSpecificEmissions({
  fuelType,
  trainType,
}: {
  fuelType: FuelType.Electricity | FuelType.Diesel;
  trainType: TrainType;
}) {
  let kgPerPassengerKm = 0;
  if (fuelType === FuelType.Electricity) {
    if (trainType === TrainType.Local) {
      kgPerPassengerKm = 0.0546; // kg/passenger-km (see also https://www.probas.umweltbundesamt.de/php/prozessdetails.php?id={F9C83447-3994-4B54-B7D7-A5E6B81C725E})
    }
    if (trainType === TrainType.LongDistance) {
      kgPerPassengerKm = 0.00948; // kg/passenger-km (see also https://www.probas.umweltbundesamt.de/php/prozessdetails.php?id={A4FFA0CD-2550-4435-BBDE-00C6F1A0B22F})
    }
  } else if (fuelType === FuelType.Diesel) {
    if (trainType === TrainType.Local) {
      kgPerPassengerKm = 0.0713; // kg/passenger-km (see also https://www.probas.umweltbundesamt.de/php/prozessdetails.php?id={08984DE8-B8F1-46C1-824B-910FD9E8A023})
    }
    if (trainType === TrainType.LongDistance) {
      kgPerPassengerKm = 0.044; // kg/passenger-km (see also https://www.probas.umweltbundesamt.de/php/prozessdetails.php?id={968DDFF4-52FF-4C77-8F1D-F21DD202C11C})
    }
  }
  return kgPerPassengerKm * 1000; // g/passenger-km
}
