// src/models/Professional.ts
export interface Professional {
    id: number;
    firstName: string;
    lastName: string;
    age: string;
    phoneNumber: string;
    email: string;
    address: string;
    birthDate: string;
    dni: string;
    userName: string;
    password: string;
    role: string;
    registrationNumber: string;
    specialty: string;
    yearsOfExperience: string;

    // Coordinates from the API
    coordinates: {
        lat: number;
        lng: number;
    };

    // Legacy geocoded field (for backward compatibility)
    geocoded?: {
        lat: number;
        lng: number;
    };
}
