import { FuelType } from "../api";

export function getSpecificEmissionsByFuelType(fuelType: FuelType) {
  if (fuelType === FuelType.Diesel) return 2.33; // kg / l
  if (fuelType === FuelType.Gasoline) return 2.64; // kg / l
  if (fuelType === FuelType.LPG) return 1.64; // kg / l
  if (fuelType === FuelType.CNG) return 2.79; // kg / kg
  return 0;
}
