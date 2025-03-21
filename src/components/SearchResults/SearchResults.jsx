import React, { useState } from "react";
import styled from "styled-components";
import { ScrollToTop } from '../ScrollToTop/ScrollToTop';
import { Navbar } from '../Navbar/Navbar';
import { Footer } from '../Footer/Footer';

export const SearchResults = () => {
  const data = [
    {
      image: "../img/cerrajero.jpeg",
      title: "Cerrajero",
      subTitle: "Soy un cerrajero experimentado que se especializa en solucionar problemas de cerrajería. Brindo servicios confiables de apertura, reparación y reemplazo de cerraduras para garantizar la seguridad de mis clientes",
      duration: "Calificación",
    },
    {
      image: "../img/gasista.jpeg",
      title: "Gasista",
      subTitle: "Soy un gasista con experiencia en instalación y mantenimiento de sistemas de gas para tu tranquilidad y seguridad.",
      duration: "Calificación",
    },
  ];

  const [active, setActive] = useState(1);

  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <Section id="recommend">
        <div className="title">
          <h2>Profesionales cerca de tu búsqueda.</h2>
        </div>
        <br />
        <br />
        <div className="destinations">
          <div className="destinations-left">
            {data.map((destination, index) => {
              return (
                <div className="destination-container" key={index}>
                  <div className="destination">
                    <img src={destination.image} alt="" />
                    <h3>{destination.title}</h3>
                    <p>{destination.subTitle}</p>
                    <div className="info">
                      <img src="../img/calificacion.svg" alt="" />
                      <h4>{destination.duration}</h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="map">
            <img src="" alt="" />
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
    background-image: url("../img/mapa.jpg");
    background-size: cover;
    padding: 2.5%;
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
};
`