export interface User {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
    rideHistory?: Array<{
      rideId: number;
      startLocation: string;
      destination: string;
      departureTime: string;
      status: string;
    }>;
  }
  