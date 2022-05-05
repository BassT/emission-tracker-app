import React, { createContext, useContext, useEffect, useState } from "react";
import { Auth, AuthContext } from "./auth/AuthContext";

export const ApiContext = createContext<{ transportActivityAPI: TransportActivityAPI; initialized: boolean }>({
  transportActivityAPI: {} as TransportActivityAPI,
  initialized: false,
});

export function ApiContextProvider({ baseURL, children }: { baseURL: string; children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const [initialized, setInitialized] = useState(
    typeof transportActivityApi.auth !== "undefined" && typeof transportActivityApi.baseURL !== "undefined"
  );

  useEffect(() => {
    if (auth !== transportActivityApi.auth) {
      transportActivityApi.auth = auth;
    }
    if (baseURL !== transportActivityApi.baseURL) {
      transportActivityApi.baseURL = baseURL;
    }
    setInitialized(
      typeof transportActivityApi.auth !== "undefined" && typeof transportActivityApi.baseURL !== "undefined"
    );
  }, [auth, baseURL]);

  return (
    <ApiContext.Provider value={{ transportActivityAPI: transportActivityApi, initialized }}>
      {children}
    </ApiContext.Provider>
  );
}

interface Options {
  calledAfterRefresh?: boolean;
}

const UNAUTHORIZED_ERROR_MESSAGE = "UNAUTHORIZED. Token refresh didn't work.";

export class TransportActivityAPI {
  constructor(public baseURL?: string, public auth?: Auth) {}

  async listTransportAcitivites({
    params,
    options,
  }: {
    params: {
      totalEmissions?: boolean;
      title?: boolean;
      date?: boolean;
      transportMode?: boolean;
      dateAfter?: Date;
      sortBy?: "date";
      sortDirection?: "ASC" | "DESC";
    };
    options: Options;
  }): Promise<{
    result?: Array<ListResultItem>;
    errors?: Error[];
  }> {
    if (typeof this.auth === "undefined") {
      return { errors: [{ message: "auth undefined" }] };
    }
    if (typeof this.baseURL === "undefined") {
      return { errors: [{ message: "baseUrl undefined" }] };
    }
    let searchParams: string[] = [];
    if (params.totalEmissions) {
      searchParams = [...searchParams, "totalEmissions=true"];
    }
    if (params.title) {
      searchParams = [...searchParams, "title=true"];
    }
    if (params.date) {
      searchParams = [...searchParams, "date=true"];
    }
    if (params.transportMode) {
      searchParams = [...searchParams, "transportMode=true"];
    }
    if (params.dateAfter) {
      searchParams = [...searchParams, `dateAfter=${params.dateAfter.toISOString()}`];
    }
    if (params.sortBy) {
      searchParams = [...searchParams, `sortBy=${params.sortBy}`];
    }
    if (params.sortDirection) {
      searchParams = [...searchParams, `sortDirection=${params.sortDirection}`];
    }
    const response = await fetch(`${this.baseURL}?${searchParams.join("&")}`, {
      method: "GET",
      headers: generateAuthHeaders(this.auth),
    });
    if (!response.ok) {
      if (response.status === STATUS_CODE.UNAUTHORIZED) {
        if (options.calledAfterRefresh) {
          return { errors: [{ message: UNAUTHORIZED_ERROR_MESSAGE }] };
        } else {
          if (await this.auth.refreshTokenOrLogOut()) {
            return this.listTransportAcitivites({ params, options: { ...options, calledAfterRefresh: true } });
          }
        }
      }
      return { errors: await response.json() };
    }
    return { result: await response.json() };
  }

  async createTransportActivity({
    params,
    options,
  }: CreateTransportActivityParams): Promise<{ activityId?: string; errors?: Error[] }> {
    if (typeof this.auth === "undefined") {
      return { errors: [{ message: "auth undefined" }] };
    }
    if (typeof this.baseURL === "undefined") {
      return { errors: [{ message: "baseUrl undefined" }] };
    }
    const response = await fetch(`${this.baseURL}`, {
      method: "POST",
      headers: { ...generateAuthHeaders(this.auth), "content-type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      if (response.status === STATUS_CODE.UNAUTHORIZED) {
        if (options.calledAfterRefresh) {
          return { errors: [{ message: UNAUTHORIZED_ERROR_MESSAGE }] };
        } else {
          if (await this.auth.refreshTokenOrLogOut()) {
            return this.createTransportActivity({ params, options: { ...options, calledAfterRefresh: true } });
          }
        }
      }
      return { errors: await response.json() };
    }
    return { activityId: extractIdOfCreatedObject(response.headers.get("location")) };
  }

  async getTransportActivityDetails({ params, options }: { params: { id: string }; options: Options }): Promise<{
    result?: TransportDetails;
    errors?: Error[];
  }> {
    if (typeof this.auth === "undefined") {
      return { errors: [{ message: "auth undefined" }] };
    }
    if (typeof this.baseURL === "undefined") {
      return { errors: [{ message: "baseUrl undefined" }] };
    }
    const response = await fetch(`${this.baseURL}/${params.id}`, {
      headers: { ...generateAuthHeaders(this.auth), accept: "application/json" },
    });
    if (!response.ok) {
      if (response.status === STATUS_CODE.UNAUTHORIZED) {
        if (options.calledAfterRefresh) {
          return { errors: [{ message: UNAUTHORIZED_ERROR_MESSAGE }] };
        } else {
          if (await this.auth.refreshTokenOrLogOut()) {
            return this.getTransportActivityDetails({ params, options: { ...options, calledAfterRefresh: true } });
          }
        }
      }
      return { errors: await response.json() };
    }
    return { result: await response.json() };
  }

  async updateTransportActivity({
    params,
    options,
  }: {
    params: UpdateTransportActivityParams;
    options: Options;
  }): Promise<{ result?: TransportDetails; errors?: Error[] }> {
    if (typeof this.auth === "undefined") {
      return { errors: [{ message: "auth undefined" }] };
    }
    if (typeof this.baseURL === "undefined") {
      return { errors: [{ message: "baseUrl undefined" }] };
    }
    const response = await fetch(`${this.baseURL}/${params.id}`, {
      method: "PUT",
      headers: { ...generateAuthHeaders(this.auth), "content-type": "application/json" },
      body: JSON.stringify({
        title: params.title,
        date: params.date,
        distance: params.distance,
        specificEmissions: params.specificEmissions,
        fuelType: params.fuelType,
        specificFuelConsumption: params.specificFuelConsumption,
        totalFuelConsumption: params.totalFuelConsumption,
        calcMode: params.calcMode,
        persons: params.persons,
        capacityUtilization: params.capacityUtilization,
        totalEmissions: params.totalEmissions,
      }),
    });
    if (!response.ok) {
      if (response.status === STATUS_CODE.UNAUTHORIZED) {
        if (options.calledAfterRefresh) {
          return { errors: [{ message: UNAUTHORIZED_ERROR_MESSAGE }] };
        } else {
          if (await this.auth.refreshTokenOrLogOut()) {
            return this.getTransportActivityDetails({ params, options: { ...options, calledAfterRefresh: true } });
          }
        }
      }
      return { errors: await response.json() };
    }
    return { result: await response.json() };
  }

  async deleteTransportActivity({
    params,
    options,
  }: {
    params: { id: string };
    options: Options;
  }): Promise<{ errors?: Error[] }> {
    if (typeof this.auth === "undefined") {
      return { errors: [{ message: "auth undefined" }] };
    }
    if (typeof this.baseURL === "undefined") {
      return { errors: [{ message: "baseUrl undefined" }] };
    }
    const response = await fetch(`${this.baseURL}/${params.id}`, {
      method: "DELETE",
      headers: { ...generateAuthHeaders(this.auth), accept: "application/json" },
    });
    if (!response.ok) {
      if (response.status === STATUS_CODE.UNAUTHORIZED) {
        if (options.calledAfterRefresh) {
          return { errors: [{ message: UNAUTHORIZED_ERROR_MESSAGE }] };
        } else {
          if (await this.auth.refreshTokenOrLogOut()) {
            return this.getTransportActivityDetails({ params, options: { ...options, calledAfterRefresh: true } });
          }
        }
      }
      return { errors: await response.json() };
    }
    return {};
  }
}

function generateAuthHeaders(auth: Auth) {
  let headers: { [prop: string]: string } = {};
  if (auth.tokenInfo?.accessToken) {
    headers = { ...headers, authorization: `Bearer ${auth.tokenInfo.accessToken}` };
  }
  return headers;
}

export interface CreateTransportActivityParams {
  params: {
    title: string;
    date: string;
    totalEmissions: number;
    distance?: number;
    specificEmissions?: number;
    fuelType?: FuelType;
    specificFuelConsumption?: number;
    totalFuelConsumption?: number;
    calcMode?: CalcMode;
    persons?: number;
    transportMode?: TransportMode;
    capacityUtilization?: number;
  };
  options: Options;
}

interface UpdateTransportActivityParams {
  id: string;
  title: string;
  date: string;
  distance?: number;
  specificEmissions?: number;
  fuelType?: FuelType;
  specificFuelConsumption?: number;
  totalFuelConsumption?: number;
  calcMode?: CalcMode;
  persons?: number;
  capacityUtilization?: number;
  totalEmissions: number;
}

export interface ListResultItem {
  id: string;
  totalEmissions?: number;
  title?: string;
  date?: string;
  transportMode?: TransportMode;
}

export interface TransportDetails {
  id: string;
  title: string;
  date: string;
  totalEmissions: number;
  distance?: number;
  specificEmissions?: number;
  fuelType?: FuelType;
  specificFuelConsumption?: number;
  totalFuelConsumption?: number;
  calcMode?: CalcMode;
  persons?: number;
  capacityUtilization?: number;
  transportMode?: TransportMode;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export function extractIdOfCreatedObject(location: string | null): string {
  return location?.split("/").pop() ?? "";
}

/**
 * @example
 * {
 *   instancePath: "",
 *   message: "must have required property 'title'"
 * }
 * @example
 * {
 *   instancePath: "/date",
 *   message: "must match format \"date-time\""
 * }
 * @example
 * {
 *   instancePath: "/specificEmissions",
 *   message: "must be number"
 * }
 */
export interface Error {
  instancePath?: string;
  message: string;
}

export enum CalcMode {
  SpecificEmissions = "SpecificEmissions",
  TotalFuel = "TotalFuel",
  SpecificFuel = "SpecificFuel",
}

export enum FuelType {
  Diesel = "Diesel",
  Gasoline = "Gasoline",
  LPG = "LPG",
  CNG = "CNG",
}

export enum TransportMode {
  Car = "Car",
  Train = "Train",
}

enum STATUS_CODE {
  UNAUTHORIZED = 401,
}

const transportActivityApi = new TransportActivityAPI();
