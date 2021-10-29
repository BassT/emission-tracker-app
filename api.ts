export interface ListResultItem {
  id: string;
  totalEmissions?: number;
  title?: string;
  date?: string;
}

export class TransportActivityAPI {
  constructor(private baseURL: string) {}

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
  }: {
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
    options: { naiveAuthUserId: string };
  }): Promise<{ activityId?: string; errors?: Error[] }> {
    const response = await fetch(`${this.baseURL}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-naive-auth": naiveAuthUserId },
      body: JSON.stringify(data),
    });
    if (response.ok) return { activityId: extractIdOfCreatedObject(response.headers.get("location")) };
    return { errors: await response.json() };
  }

  getTransportActivityDetails() {
    throw new Error("Not yet implemented");
  }
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
interface Error {
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
