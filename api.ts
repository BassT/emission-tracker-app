export class TransportActivityAPI {
  constructor(public baseURL: string) {}

  async listTransportAcitivites({
    params,
    options,
  }: {
    params: { totalEmissions?: boolean; title?: boolean; date?: boolean; dateAfter?: Date };
    options: { naiveAuthUserId: string };
  }): Promise<{
    result?: Array<ListResultItem>;
    errors?: Error[];
  }> {
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
    if (params.dateAfter) {
      searchParams = [...searchParams, `dateAfter=${params.dateAfter.toISOString()}`];
    }
    const response = await fetch(`${this.baseURL}?${searchParams.join("&")}`, {
      method: "GET",
      headers: { "x-naive-auth": options.naiveAuthUserId },
    });
    if (response.ok) return { result: await response.json() };
    return { errors: await response.json() };
  }

  async createTransportActivity({
    data,
    options: { naiveAuthUserId },
  }: CreateTransportActivityParams): Promise<{ activityId?: string; errors?: Error[] }> {
    const response = await fetch(`${this.baseURL}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-naive-auth": naiveAuthUserId },
      body: JSON.stringify(data),
    });
    if (response.ok) return { activityId: extractIdOfCreatedObject(response.headers.get("location")) };
    return { errors: await response.json() };
  }

  async getTransportActivityDetails({
    params,
    options,
  }: {
    params: { id: string };
    options: { naiveAuthUserId: string };
  }): Promise<{
    result?: TransportDetails;
    errors?: Error[];
  }> {
    const response = await fetch(`${this.baseURL}/${params.id}`, {
      headers: { accept: "application/json", "x-naive-auth": options.naiveAuthUserId },
    });
    if (response.ok) return { result: await response.json() };
    return { errors: await response.json() };
  }

  async updateTransportActivity({
    params,
    options,
  }: {
    params: {
      id: string;
      title: string;
      date: string;
      distance: number;
      specificEmissions: number;
      fuelType: FuelType;
      specificFuelConsumption: number;
      totalFuelConsumption: number;
      calcMode: CalcMode;
      persons: number;
      totalEmissions: number;
    };
    options: { naiveAuthUserId: string };
  }): Promise<{ result?: TransportDetails; errors?: Error[] }> {
    const response = await fetch(`${this.baseURL}/${params.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json", "x-naive-auth": options.naiveAuthUserId },
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
        totalEmissions: params.totalEmissions,
      }),
    });
    if (response.ok) return { result: await response.json() };
    return { errors: await response.json() };
  }

  async deleteTransportActivity({
    params,
    options,
  }: {
    params: { id: string };
    options: { naiveAuthUserId: string };
  }): Promise<{ errors?: Error[] }> {
    const response = await fetch(`${this.baseURL}/${params.id}`, {
      method: "DELETE",
      headers: { accept: "application/json", "x-naive-auth": options.naiveAuthUserId },
    });
    if (response.ok) return {};
    return { errors: await response.json() };
  }
}

export interface CreateTransportActivityParams {
  data: {
    title: string;
    date: string;
    distance: number;
    specificEmissions: number;
    fuelType: FuelType;
    specificFuelConsumption: number;
    totalFuelConsumption: number;
    totalEmissions: number;
    calcMode: CalcMode;
    persons: number;
  };
  options: {
    naiveAuthUserId: string;
  };
}

export interface ListResultItem {
  id: string;
  totalEmissions?: number;
  title?: string;
  date?: string;
}

export interface TransportDetails {
  id: string;
  title: string;
  date: string;
  distance: number;
  specificEmissions: number;
  fuelType: FuelType;
  specificFuelConsumption: number;
  totalFuelConsumption: number;
  calcMode: CalcMode;
  persons: number;
  totalEmissions: number;
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
  instancePath: string;
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
}
