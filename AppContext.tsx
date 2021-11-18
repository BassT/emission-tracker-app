import { createContext } from "react";
import { TransportActivityAPI } from "./api";
import { TokenInfo } from "./auth/TokenInfo";

export const appContextDefault = {
  transportActivityAPI: new TransportActivityAPI(
    // "https://emission-tracker-api.azurewebsites.net/api/transport-activity"
    "http://192.168.2.33:3000/api/transport-activity"
  ),
  naiveAuthUserId: "123",
  tokenInfo: undefined,
  setTokenInfo: () => {
    throw new Error("Not yet implemented");
  },
};

export const AppContext = createContext<{
  transportActivityAPI: TransportActivityAPI;
  naiveAuthUserId?: string;
  tokenInfo?: TokenInfo;
  setTokenInfo: (tokenInfo?: TokenInfo) => void;
}>(appContextDefault);
