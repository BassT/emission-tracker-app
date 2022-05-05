import { TransportMode } from "../api";

export function toHeaderTitle(mode: TransportMode) {
  switch (mode) {
    case TransportMode.Car:
      return "Car details";
    case TransportMode.Train:
      return "Train details";
    default:
      return "Transport details";
  }
}

export function toInitialTitle(mode: TransportMode) {
  switch (mode) {
    case TransportMode.Car:
      return "Car drive";
    case TransportMode.Train:
      return "Train ride";
    default:
      return "";
  }
}
