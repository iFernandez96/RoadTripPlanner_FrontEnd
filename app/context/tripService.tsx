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
async addVehicleToStint(stintId:number,vehicleData1: vehicleData1): Promise<Trip> {
      try {
  const token = authService.getToken();

        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }
        const response = await fetch(`${this.baseUrl}/stints/${stintId}/vehicles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(vehicleData1),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add vehicle to stint');
        }

        return await response.json();
      } catch (error) {
        console.error('Error in addVehicleToStint:', error);
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
async addVehicle(vehicleData:vehicleData): Promise<vehicle> {
      try {
  const token = authService.getToken();

        if (!token) {
          throw new Error('Authentication required. Please log in first.');
        }

        const response = await fetch(`${this.baseUrl}/vehicles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(vehicleData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add vehicle ');
        }

        return await response.json();
      } catch (error) {
        console.error('Error in addVehicle:', error);
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

        const userInfo = data.map((item: User) => ({id: item.user_id, username: item.username,fullname:item.fullname}));
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
        return userData;
      } catch (error) {
        console.error('Error in getUserById:', error);
        throw error;
      }
    }
async getVehicles(): Promise<vehicleData[]> {
    try {
  const token = authService.getToken();

      if (!token) {
        throw new Error('Authentication required. Please log in first.');
      }

      const response = await fetch(`${this.baseUrl}/vehicles/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch vehicles details');
      }
      const vehicleData = await response.json();
      return vehicleData;
    } catch (error) {
      console.error(`Error in getVehicles):`, error);
      throw error;
    }
  }
  async getTimelineById(TripId: number): Promise<timeline[]> {
        try {
    const token = authService.getToken();

          if (!token) {
            throw new Error('Authentication required. Please log in first.');
          }

          const response = await fetch(`${this.baseUrl}/trips/${TripId}/timeline`, {
           headers: {
                       'Authorization': `Bearer ${token}`
                     }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch timeline');
          }

          const data = await response.json();
          const timeline = data;
          return timeline;
        } catch (error) {
          console.error('Error in timeline:', error);
          throw error;
        }
      }
  async getMe(): Promise<Me[]> {
          try {
      const token = authService.getToken();

            if (!token) {
              throw new Error('Authentication required. Please log in first.');
            }

            const response = await fetch(`${this.baseUrl}/users/me`, {
             headers: {
                         'Authorization': `Bearer ${token}`
                       }
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to fetch me');
            }

            const Me = await response.json();
            return Me;
          } catch (error) {
            console.error('Error  me:', error);
            throw error;
          }
        }
      async getSuggestedLocations(params: {
        lat?: number;
        lng?: number;
        locationId?: number;
        radius?: number;
        limit?: number;
      }): Promise<any[]> {
        try {
          const token = authService.getToken();
      
          if (!token) {
            throw new Error('Authentication required. Please log in first.');
          }
      
          const queryParams = new URLSearchParams();
          if (params.lat !== undefined) queryParams.append('lat', params.lat.toString());
          if (params.lng !== undefined) queryParams.append('lng', params.lng.toString());
          if (params.locationId !== undefined) queryParams.append('locationId', params.locationId.toString());
          if (params.radius !== undefined) queryParams.append('radius', params.radius.toString());
          if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
      
          const response = await fetch(`${this.baseUrl}/locations/suggested?${queryParams.toString()}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch suggested locations');
          }
      
          return await response.json();
        } catch (error) {
          console.error('Error in getSuggestedLocations:', error);
          throw error;
        }
      }
      async DeleteTripByID(tripId: number): Promise<TripDeletion> {
          try {
        const token = authService.getToken();

            if (!token) {
              throw new Error('Authentication required. Please log in first.');
            }

            const response = await fetch(`${this.baseUrl}/trips/${tripId}`, {
              method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
            });

            if (!response.ok) {
              throw new Error('Failed to delete trip');
            }

            return await response;
          } catch (error) {
            console.error(`Error in delete trip : (${tripId}):`, error);
            throw error;
          }
        }
    async UpdateUserByID(userId: number,userData:userData): Promise<UserUpdate> {
              try {
            const token = authService.getToken();

                if (!token) {
                  throw new Error('Authentication required. Please log in first.');
                }

                const response = await fetch(`${this.baseUrl}/users/${userId}`, {
                  method: 'PATCH',
                                     headers: {
                                       'Content-Type': 'application/json',
                                       'Authorization': `Bearer ${token}`
                                     },
                                     body: JSON.stringify(userData),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || 'Failed to update user');
                }

                return await response.json();
              } catch (error) {
                console.error(`Error in delete trip : (${userId}):`, error);
                throw error;
              }
            }
        async discoverNearby(params: {
                query: string;
                stopId?: number;
                locationId?: number;
                radius?: number;
                limit?: number;
              }): Promise<any[]> {
                const token = authService.getToken();

                const response = await fetch(`${this.baseUrl}/locations/discover-nearby`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    query: params.query,
                    stopId: params.stopId,
                    locationId: params.locationId,
                    radius: params.radius || 1000,
                    limit: params.limit || 10
                  }),
                });

                if (!response.ok) {
                  const errText = await response.text();
                  console.error('Backend response:', errText);
                  throw new Error('Failed to fetch nearby locations');
                }

                const data = await response.json();
                return data.locations || [];
              }
}

const tripService = new TripService();
export default tripService;
