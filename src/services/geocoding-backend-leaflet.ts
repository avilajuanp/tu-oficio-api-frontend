// src/services/GeocodingService.ts

import axios from 'axios';

interface GeocodingResult {
  lat: number;
  lng: number;
}

export class GeocodingService {
  // Using Nominatim OpenStreetMap geocoding service (free)
  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
      const encodedAddress = encodeURIComponent(address);
      // Nominatim requires a user agent with contact info according to their usage policy
      const headers = {
        'User-Agent': 'YourAppName contact@youremail.com' // Replace with your app name and email
      };
      
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;
      
      const response = await axios.get(url, { headers });
      
      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }
}

// IMPORTANT: Respect Nominatim Usage Policy:
// 1. No more than 1 request per second
// 2. Include a User-Agent identifying your application and a contact email
// 3. Cache results when possible

// Example usage in ProfessionalService.ts:

import { GeocodingService } from './GeocodingService';

export class ProfessionalService {
  private geocodingService: GeocodingService;
  
  constructor() {
    this.geocodingService = new GeocodingService();
  }
  
  async getAll() {
    // Fetch professionals from database
    const professionals = await this.professionalRepository.findAll();
    
    // Add geocoded coordinates for each professional with rate limiting
    for (const professional of professionals) {
      if (professional.address) {
        // Check if we already have geocoded data in our database first
        if (!professional.geocoded) {
          const geocoded = await this.geocodingService.geocodeAddress(professional.address);
          if (geocoded) {
            professional.geocoded = geocoded;
            
            // Save the geocoded coordinates to database for future use
            await this.professionalRepository.updateGeocodedCoordinates(
              professional.id, 
              geocoded.lat, 
              geocoded.lng
            );
          }
          
          // Rate limiting - wait 1 second between requests (Nominatim policy)
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    return professionals;
  }
  
  // Other methods...
}
