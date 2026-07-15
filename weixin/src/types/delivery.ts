export interface Store {
  id: number;
  name: string;
  address: string;
  lat: number;
  long: number;
}

export type FulfillmentType = "pickup" | "delivery";
