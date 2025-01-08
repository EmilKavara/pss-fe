export interface RequestDTO {
    requestId: number;
    rideId: number;
    passengerName: string;
    passengerEmail: string;
    status: string;
  }
  
  export interface RideDTO {
    id: number;
    origin: string;
    destination: string;
    departureTime: string; 
    status: string;
    availableSeats: number;
    driverName: string;
  }

  export interface RideStatusDTO {
    id: number;
    name: string;
    availableSeats: number;
    destination: string;
    departureTime: string;
    driverName: string;
  }

  export interface PlannedRide {
    rideId: number;
    origin: string;
    destination: string;
    departureTime: string; 
    availableSeats: number;
    status: string;
    createdAt: string; 
  }
  
  
  