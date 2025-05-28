import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ScrollToTop } from '../ScrollToTop/ScrollToTop';
import { Navbar } from '../Navbar/Navbar';
import { Footer } from '../Footer/Footer';
import axios from 'axios';
import L from 'leaflet';
import { ProfessionalService } from '../../services/ProfessionalService';
import { ClientService } from '../../services/ClientService';
import { useAuth } from '../../context/AuthContext';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red marker icon for client location
const clientIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map center changes
function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export const SearchResults = () => {
  const { isLoggedIn, user } = useAuth();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [mapCenter, setMapCenter] = useState([-32.8908, -68.8272]); // Default to Mendoza, Argentina
  const [clientLocation, setClientLocation] = useState(null);

  // Get client location if logged in
  useEffect(() => {
    console.log('Authentication status:', { isLoggedIn, user });

    if (isLoggedIn && user && user.coordinates) {
      console.log('Using client coordinates from login data:', user.coordinates);
      const { lat, lng } = user.coordinates;
      setClientLocation([lat, lng]);
      setMapCenter([lat, lng]); // Center map on client location
      console.log('Client location and map center set');
    } else {
      console.log('Not setting client location because:', {
        isLoggedIn,
        hasUser: !!user,
        hasCoordinates: user ? !!user.coordinates : false
      });
    }
  }, [isLoggedIn, user]);

  // Fetch professionals data
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const data = await ProfessionalService.getAllProfessionals();
        setProfessionals(data);

        // If client location is not available and we have professionals with coordinates, 
        // center the map on the first one
        if (!clientLocation && data.length > 0 && data[0].coordinates) {
          setMapCenter([data[0].coordinates.lat, data[0].coordinates.lng]);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch professionals data');
        setLoading(false);
        console.error('Error fetching professionals:', err);
      }
    };

    fetchProfessionals();
  }, [clientLocation]);

  // Handle click on a professional card
  const handleCardClick = (professional) => {
    setSelectedProfessional(professional);
    if (professional.coordinates) {
      setMapCenter([professional.coordinates.lat, professional.coordinates.lng]);
    }
  };

  // Placeholder image if professional doesn't have one
  const getImage = (professional) => {
    // Map profession/specialty to images
    const imageMap = {
      "Cerrajero": "../img/cerrajero.jpeg",
      "Gasista": "../img/gasista.jpeg",
      // Add more mappings as needed
    };

    return imageMap[professional.specialty] || "../img/default-professional.jpeg";
  };

  // Rating placeholder - in real app, calculate from reviews
  const getRating = (professional) => {
    return "⭐".repeat(Math.floor(3 + Math.random() * 3)); // Random 3-5 stars for demo
  };

  if (loading) return <div>Loading professionals...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <Section id="recommend">
        <div className="title">
          <h2>Profesionales cerca de tu búsqueda</h2>
        </div>
        <br />
        <br />
        <div className="destinations">
          <div className="destinations-left">
            {professionals.map((professional, index) => (
              <div 
                className="destination-container" 
                key={index}
                onClick={() => handleCardClick(professional)}
              >
                <div className={`destination ${selectedProfessional === professional ? 'selected' : ''}`}>
                  <img src={getImage(professional)} alt={professional.specialty} />
                  <h3>{professional.firstName} {professional.lastName}</h3>
                  <h4>{professional.specialty}</h4>
                  <p>{professional.address}</p>
                  <div className="info">
                    <div className="rating">{getRating(professional)}</div>
                    <div className="experience">{professional.yearsOfExperience} años de experiencia</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="map">
            <MapContainer 
              center={mapCenter} 
              zoom={13} 
              style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Update map center when selected professional changes */}
              <ChangeMapView center={mapCenter} />

              {console.log('Rendering map with client location from login data:', clientLocation)}

              {/* Add markers for each professional */}
              {professionals.map((professional, index) => {
                // Skip professionals without coordinates
                if (!professional.coordinates) return null;

                // Check if this professional has the same coordinates as the logged-in user
                // If so, we'll still show their marker but with a different key to avoid conflicts
                const isSameLocation =
                  isLoggedIn &&
                  user &&
                  user.coordinates &&
                  clientLocation &&
                  Math.abs(professional.coordinates.lat - user.coordinates.lat) < 0.0001 &&
                  Math.abs(professional.coordinates.lng - user.coordinates.lng) < 0.0001;

                return (
                  <Marker
                    key={`professional-${index}`}
                    position={[professional.coordinates.lat, professional.coordinates.lng]}
                    eventHandlers={{
                      click: () => {
                        setSelectedProfessional(professional);
                      },
                    }}
                  >
                    <Popup>
                      <div>
                        <h3>{professional.firstName} {professional.lastName}</h3>
                        <p><strong>{professional.specialty}</strong></p>
                        <p>{professional.address}</p>
                        <p>Teléfono: {professional.phoneNumber}</p>
                        <p>Experiencia: {professional.yearsOfExperience} años</p>
                        {isSameLocation && <p><strong>Esta es también tu ubicación como usuario</strong></p>}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Add client location marker if logged in and location available - rendered last to be on top */}
              {isLoggedIn && clientLocation && (
                <Marker
                  key="client-location"
                  position={clientLocation}
                  icon={clientIcon}
                  zIndexOffset={1000} // Ensure this marker is on top
                >
                  <Popup>
                    <div>
                      <h3>Tu ubicación</h3>
                      <p>Esta es tu ubicación proporcionada al iniciar sesión</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </Section>
      <Footer />
    </div>
  );
};

const Section = styled.section`
  padding: 1rem 0;
  .title {
    text-align: center;
  }
  .destinations {
    display: flex;
    justify-content: stretch;
  }
  .destinations-left {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .destination-container {
    margin-bottom: 2rem;
  }
  .destination {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: #8338ec14;
    border-radius: 1rem;
    transition: 0.3s ease-in-out;
    &:hover {
      transform: translateX(0.4rem) translateY(-1rem);
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }
    img {
      width: 100%;
    }
    .info {
      display: flex;
      align-items: center;
      .services {
        display: flex;
        gap: 0.3rem;
        img {
          border-radius: 1rem;
          background-color: #4d2ddb84;
          width: 2rem;
          padding: 0.3rem 0.4rem;
        }
      }
    }
  }
  .map {
    width: 70%;
    border: 2px solid #000;
    border-radius: 1rem;
    //background-image: url("../img/mapa.jpg");
    //background-size: cover;
    //padding: 2.5%;
    margin-top:1%;
    margin-right:4%;
    margin-left:4%;
  }
  @media screen and (max-width: 768px) {
    .destinations {
      flex-direction: column;
      align-items: center;
    }
    .destinations-left {
      width: 100%;
    }
    .map {
      width: 100%;
      margin-top: 1rem;
    }
  }
}
`
