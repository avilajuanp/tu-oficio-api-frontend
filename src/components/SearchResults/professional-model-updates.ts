// src/entities/Professional.ts

export interface Professional {
  id: number;
  firstName: string;
  lastName: string;
  age?: number;
  phoneNumber: string;
  email: string;
  address: string;
  birthDate?: Date;
  dni: string;
  userName: string;
  password?: string; // Should not be included in API responses
  registrationNumber?: string;
  specialty: string;
  yearsOfExperience: number;
  
  // Geocoding fields
  geo_lat?: number;
  geo_lng?: number;
  
  // Virtual field for frontend use
  geocoded?: {
    lat: number;
    lng: number;
  };
}

// src/repositories/ProfessionalRepository.ts

import { Professional } from '../entities/Professional';
import { db } from '../database/connection';

export class ProfessionalRepository {
  async findAll(): Promise<Professional[]> {
    const professionals = await db.query('SELECT * FROM professionals');
    
    // Map database results to add virtual geocoded field
    return professionals.map(prof => {
      const professional = { ...prof };
      
      // If coordinates exist in the database, add the geocoded property
      if (professional.geo_lat && professional.geo_lng) {
        professional.geocoded = {
          lat: professional.geo_lat,
          lng: professional.geo_lng
        };
      }
      
      return professional;
    });
  }
  
  async findById(id: number): Promise<Professional | null> {
    const [professional] = await db.query('SELECT * FROM professionals WHERE id = ?', [id]);
    
    if (!professional) return null;
    
    // Add geocoded property if coordinates exist
    if (professional.geo_lat && professional.geo_lng) {
      professional.geocoded = {
        lat: professional.geo_lat,
        lng: professional.geo_lng
      };
    }
    
    return professional;
  }
  
  async create(professional: Omit<Professional, 'id'>): Promise<Professional> {
    const result = await db.query(
      'INSERT INTO professionals (firstName, lastName, age, phoneNumber, email, address, birthDate, dni, userName, password, registrationNumber, specialty, yearsOfExperience, geo_lat, geo_lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        professional.firstName, 
        professional.lastName, 
        professional.age,
        professional.phoneNumber,
        professional.email,
        professional.address,
        professional.birthDate,
        professional.dni,
        professional.userName,
        professional.password, // Consider hashing before storing
        professional.registrationNumber,
        professional.specialty,
        professional.yearsOfExperience,
        professional.geo_lat,
        professional.geo_lng
      ]
    );
    
    const newId = result.insertId;
    return this.findById(newId);
  }
  
  async update(professional: Partial<Professional> & { id: number }): Promise<Professional | null> {
    // Create SET clauses dynamically based on provided fields
    const fields = Object.keys(professional).filter(key => key !== 'id' && key !== 'geocoded');
    
    if (fields.length === 0) {
      return this.findById(professional.id);
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => professional[field]);
    
    // Add id to the end of values array for the WHERE clause
    values.push(professional.id);
    
    await db.query(
      `UPDATE professionals SET ${setClause} WHERE id = ?`,
      values
    );
    
    return this.findById(professional.id);
  }
  
  async updateGeocodedCoordinates(id: number, lat: number, lng: number): Promise<void> {
    await db.query(
      'UPDATE professionals SET geo_lat = ?, geo_lng = ? WHERE id = ?',
      [lat, lng, id]
    );
  }
  
  async delete(id: number): Promise<boolean> {
    const result = await db.query('DELETE FROM professionals WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
