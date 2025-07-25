import { Location } from "./Location";

export interface Geofence extends Location {
    radius: number
    name: string
    id: number
}