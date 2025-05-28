// src/services/ProfessionalService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with your API URL

export const ProfessionalService = {
    async getAllProfessionals() {
        try {
            const response = await axios.get(`${API_URL}/list-professionals`);
            return response.data;
        } catch (error) {
            console.error('Error fetching professionals:', error);
            throw error;
        }
    },

    async getProfessionalById(id) {
        try {
            const response = await axios.get(`${API_URL}/professional/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching professional with id ${id}:`, error);
            throw error;
        }
    }
};