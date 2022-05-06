export function totalEmissionsTrainReducer(
  state: TotalEmissionsTrainReducerState,
  action: TotalEmissionsTrainReducerAction
): TotalEmissionsTrainReducerState {
  switch (action.type) {
    case "initialize":
      return {
        ...state,
        distance: action.payload.distance,
        specificEmissions: action.payload.specificEmissions,
        totalEmissions: action.payload.totalEmissions,
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
    case "setTotalEmissions":
      return {
        ...state,
        specificEmissions: calculateSpecificEmissions({ ...state, totalEmissions: action.payload.totalEmissions }),
        totalEmissions: action.payload.totalEmissions,
      };
    default:
      return state;
  }
}

function calculateSpecificEmissions({
  totalEmissions,
  distance,
}: {
  totalEmissions: number;
  distance: number;
}): number {
  return (totalEmissions / distance) * 1000;
}

function calculateTotalEmissions({ specificEmissions, distance }: { specificEmissions: number; distance: number }) {
  return (specificEmissions / 1000) * distance;
}

export interface TotalEmissionsTrainReducerState {
  distance: number;
  specificEmissions: number;
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

interface EmissionReducerInitializeAction {
  type: "initialize";
  payload: TotalEmissionsTrainReducerState;
}

export type TotalEmissionsTrainReducerAction =
  | EmissionReducerInitializeAction
  | EmissionReducerSetDistanceAction
  | EmissionReducerSetSpecificEmissionsAction
  | EmissionReducerSetTotalEmissionsAction;
