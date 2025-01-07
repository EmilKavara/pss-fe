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
    time: string;       // Pretpostavljam da je ovo string sa vremenom vožnje
    route: string;      // Ruta vožnje
    // Dodaj ostale potrebne propertije prema strukturi podataka koji dolaze sa servera
  }
  
  