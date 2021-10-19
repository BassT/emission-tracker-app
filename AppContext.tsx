import { createContext } from "react";
import { TransportActivityAPI } from "./api";

export const appContextDefault = {
  transportActivityAPI: new TransportActivityAPI(
    "https://emission-tracker-api.azurewebsites.net/api/transport-activity"
  ),
  naiveAuthUserId: "123",
};

export const AppContext = createContext(appContextDefault);
