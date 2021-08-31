export enum TransportMode {
  CAR,
  TRAIN,
  MOTORBIKE,
  AIRPLANE,
}

export function toHeaderTitle(mode: TransportMode) {
  switch (mode) {
    case TransportMode.CAR:
      return "Car details";
    case TransportMode.TRAIN:
      return "Train details";
    case TransportMode.MOTORBIKE:
      return "Motorbike details";
    case TransportMode.AIRPLANE:
      return "Airplane details";
    default:
      return "Transport details";
  }
}

export function toInitialTitle(mode: TransportMode) {
  switch (mode) {
    case TransportMode.CAR:
      return "Car drive";
    case TransportMode.TRAIN:
      return "Train ride";
    case TransportMode.MOTORBIKE:
      return "Motorbike ride";
    case TransportMode.AIRPLANE:
      return "Airplane flight";
    default:
      return "";
  }
}
