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
      const token = "";

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
async addFriendToTrip(tripId:tripId,friendData:friendData): Promise<Addition> {
    try {
      const token = "";

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
  async getTripById(tripId: number): Promise<Trip> {
    try {
      const token = "";

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
      const token = "";

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
      const token = "";

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
      const token = "";

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
async getUsersIds(): Promise<number[]> {
      try {
      const token = "";

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
}

const tripService = new TripService();
export default tripService;