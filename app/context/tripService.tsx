import authService from './authService';

interface TripData {
  [key: string]: any;
}

interface User {
  id: number;
  username: string;
}

interface Trip {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_location: string;
  end_location: string;
  stops?: string[];
  notes?: string;
  friends?: string[];
  supplies?: string;
  [key: string]: any;
}

class TripService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://roadtrip-planner-api-ddd2dd6834e8.herokuapp.com';
  }


  async createTrip(tripData: TripData): Promise<Trip> {
    try {
  const token = authService.getToken();

      if (!token) {
        throw new Error('Authentication required. Please log in first.');
      }

      const response = await fetch(`${this.baseUrl}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tripData),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create trip');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in createTrip:', error);
      throw error;
    }
  }
  async createStint(stintData: stintData): Promise<Trip> {
      try {
  const token = authService.getToken();

        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }

        const response = await fetch(`${this.baseUrl}/stints`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(stintData),
        });
        console.log(response);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create initial stint');
        }

        return await response.json();
      } catch (error) {
        console.error('Error in createStint:', error);
        throw error;
      }
    }
async createStop(stopData: stopData): Promise<Trip> {
      try {
  const token = authService.getToken();

        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }

        const response = await fetch(`${this.baseUrl}/stops`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(stopData),
        });
        console.log(response);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create initial stint');
        }

        return await response.json();
      } catch (error) {
        console.error('Error in createStop:', error);
        throw error;
      }
    }
async addFriendToTrip(tripId:tripId,friendData:friendData): Promise<Addition> {
    try {
  const token = authService.getToken();

      if (!token) {
        throw new Error('Authentication required. Please log in first.');
      }

      const response = await fetch(`${this.baseUrl}/trips/${tripId}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(friendData),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create trip');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in createTrip:', error);
      throw error;
    }
  }
  async addSupplyToTrip(tripId:tripId,supplyData:supplyData): Promise<Addition> {
      try {
  const token = authService.getToken();

        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }

        const response = await fetch(`${this.baseUrl}/trips/${tripId}/supplies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(supplyData),
        });
        console.log(response);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to addSupplyToTrip ');
        }

        return await response.json();
      } catch (error) {
        console.error('Error in addSupplyToTrip:', error);
        throw error;
      }
    }
  async getTripById(tripId: number): Promise<Trip> {
    try {
  const token = authService.getToken();

      if (!token) {
        throw new Error('Authentication required. Please log in first.');
      }

      const response = await fetch(`${this.baseUrl}/trips/${tripId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch trip details');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in getTripById(${tripId}):`, error);
      throw error;
    }
  }

  async getMultipleTrips(tripIds: number[]): Promise<Trip[]> {
    try {
  const token = authService.getToken();

      if (!token) {
        throw new Error('Authentication required. Please log in first.');
      }

      const tripPromises = tripIds.map(id => this.getTripById(id));
      const trips = await Promise.all(tripPromises);

      return trips;
    } catch (error) {
      console.error('Error in getMultipleTrips:', error);
      throw error;
    }
  }

  async getUsersTripsId(): Promise<number[]> {
    try {
  const token = authService.getToken();

      if (!token) {
        throw new Error('Authentication required. Please log in first.');
      }

      const response = await fetch(`${this.baseUrl}/trips/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user trips');
      }

      const data = await response.json();

      const tripIds = data.map((item: TripId) => item.trip_id);

      return tripIds;
    } catch (error) {
      console.error('Error in getUsersTripsId:', error);
      throw error;
    }
  }

  async getUsersIds(): Promise<number[]> {
      try {
  const token = authService.getToken();

        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }

        const response = await fetch(`${this.baseUrl}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user trips');
        }

        const data = await response.json();
        console.log(data)

        const userInfo = data.map((item: User) => ({id: item.user_id, username: item.username}));
        console.log(userInfo)
        return userInfo;
      } catch (error) {
        console.error('Error in getUsersTripsId:', error);
        throw error;
      }
    }
async getLocationCoord(location: location): Promise<LocationCoord[]> {
      try {
  const token = authService.getToken();

        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }

        const response = await fetch(`${this.baseUrl}/locations/geocode`, {
          method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(location),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user trips');
        }

        const data = await response.json();
        const LocationCoord = data;
        console.log(LocationCoord);
        return LocationCoord;
      } catch (error) {
        console.error('Error in getLocationCoord:', error);
        throw error;
      }
    }
async getSuppliesById(TripId: number): Promise<suppliesData[]> {
      try {
  const token = authService.getToken();

        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }

        const response = await fetch(`${this.baseUrl}/trips/${TripId}/supplies`, {
         headers: {
                     'Authorization': `Bearer ${token}`
                   }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch supplies');
        }

        const data = await response.json();
        const suppliesData = data;
        console.log(suppliesData);
        return suppliesData;
      } catch (error) {
        console.error('Error in getSuppliesById:', error);
        throw error;
      }
    }
async getParticipantsById(TripId: number): Promise<participantsData[]> {
      try {
  const token = authService.getToken();

        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }

        const response = await fetch(`${this.baseUrl}/trips/${TripId}/participants`, {
         headers: {
                     'Authorization': `Bearer ${token}`
                   }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch participants');
        }

        const data = await response.json();
        const participantsData = data;
        console.log(participantsData);
        return participantsData;
      } catch (error) {
        console.error('Error in getParticipantsById:', error);
        throw error;
      }
    }
async getUserById(UserId: number): Promise<userData[]> {
      try {
  const token = authService.getToken();

        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }

        const response = await fetch(`${this.baseUrl}/users/${UserId}`, {
         headers: {
                     'Authorization': `Bearer ${token}`
                   }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch userData');
        }

        const data = await response.json();
        const userData = data;
        console.log(userData);
        return userData;
      } catch (error) {
        console.error('Error in getUserById:', error);
        throw error;
      }
    }
}

const tripService = new TripService();
export default tripService;
