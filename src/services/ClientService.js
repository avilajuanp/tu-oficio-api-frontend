// src/services/ClientService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Same API URL as in ProfessionalService

export const ClientService = {
    async getClientCoordinates(clientId) {
        try {
            const response = await axios.get(`${API_URL}/client/${clientId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching client coordinates for client ${clientId}:`, error);
            throw error;
        }
    }
};