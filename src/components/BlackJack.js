import React, { useState, useEffect } from 'react';
import Carta from './Carta';
import cartas from './ImagenesCartas';
import './BlackJack.css';
import parteAtras from "../images/cards/back_of_card.png";

function BlackJack() {
  const [cartasJugador, setCartasJugador] = useState([]);
  const [cartasCrupier, setCartasCrupier] = useState([]);
  const [puntuacionJugador, setPuntuacionJugador] = useState(0);
  const [puntuacionCrupier, setPuntuacionCrupier] = useState(0);
  const [finJuego, setFinJuego] = useState(false);
  const [mazoBarajado, setMazoBarajado] = useState([]);

  // Función para barajar las cartas
  const barajarCartas = () => {
    const cartasBarajadas = [...cartas];
    for (let i = cartasBarajadas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartasBarajadas[i], cartasBarajadas[j]] = [cartasBarajadas[j], cartasBarajadas[i]];
    }
    setMazoBarajado(cartasBarajadas);
    return cartasBarajadas;
  };

  // Función para calcular la puntuación de una mano
  const calcularPuntuacion = (cartas) => {
    let puntuacion = 0;
    let contadorAses = 0;

    cartas.forEach((carta) => {
      puntuacion += carta.value[0];
      if (carta.value.includes(1)) {
        contadorAses++;
      }
    });

    while (puntuacion > 21 && contadorAses > 0) {
      puntuacion -= 10;
      contadorAses--;
    }

    return puntuacion;
  };

  // Función para iniciar el juego
  const iniciarJuego = () => {
    const mazoBarajado = barajarCartas();
    const cartasJugadorInicial = [mazoBarajado.pop()];
    const cartasCrupierInicial = [mazoBarajado.pop(), { value: [0], img: parteAtras }];

    setCartasJugador(cartasJugadorInicial);
    setCartasCrupier(cartasCrupierInicial);

    setPuntuacionJugador(calcularPuntuacion(cartasJugadorInicial));
    setPuntuacionCrupier(calcularPuntuacion(cartasCrupierInicial));

    setFinJuego(false);
  };

  // Función para que el jugador pida una carta
  const pedirCarta = () => {
    const nuevasCartasJugador = [...cartasJugador];
    const nuevaCarta = mazoBarajado.pop();
    nuevasCartasJugador.push(nuevaCarta);

    setCartasJugador(nuevasCartasJugador);
    const nuevaPuntuacionJugador = calcularPuntuacion(nuevasCartasJugador);
    setPuntuacionJugador(nuevaPuntuacionJugador);

    if (nuevaPuntuacionJugador === 21 && nuevasCartasJugador.length === 2) {
      setFinJuego(true); // Si el jugador tiene un Blackjack con las dos primeras cartas, finaliza el juego automáticamente
    } else if (nuevaPuntuacionJugador > 21) {
      setFinJuego(true); // Si la puntuación del jugador supera 21, finaliza el juego automáticamente
    }
  };


  // Función para que el crupier juegue su turno
  const turnoCrupier = () => {
    let nuevasCartasCrupier = [...cartasCrupier];
    let nuevaPuntuacionCrupier = puntuacionCrupier;

    // Eliminar la carta oculta del crupier
    nuevasCartasCrupier.pop();

    // Calcular la puntuación solo con las cartas visibles
    nuevaPuntuacionCrupier = calcularPuntuacion(nuevasCartasCrupier);

    while (nuevaPuntuacionCrupier < 17) {
      const nuevaCarta = mazoBarajado.pop();
      nuevasCartasCrupier.push(nuevaCarta);

      nuevaPuntuacionCrupier = calcularPuntuacion(nuevasCartasCrupier);
    }

    setCartasCrupier(nuevasCartasCrupier);
    setPuntuacionCrupier(nuevaPuntuacionCrupier);
    setFinJuego(true);
  };

  // Función para determinar el resultado del juego
  const determinarResultado = () => {
    if (puntuacionJugador === 21 && cartasJugador.length === 2 && puntuacionCrupier !== 21) {
      return '¡Jugador gana con Blackjack!';
    } else if (puntuacionCrupier === 21 && cartasCrupier.length === 2 && puntuacionJugador !== 21) {
      return '¡Crupier gana con Blackjack!';
    } else if (puntuacionJugador > 21) {
      return '¡Crupier gana!';
    } else if (puntuacionCrupier > 21) {
      return '¡Jugador gana!';
    } else if (puntuacionJugador > puntuacionCrupier) {
      return '¡Jugador gana!';
    } else if (puntuacionJugador < puntuacionCrupier) {
      return '¡Crupier gana!';
    } else {
      return 'Empate';
    }
  };

  useEffect(() => {
    iniciarJuego();
  }, []);

  return (
    <div className="border-image-container">
      <div className="table-container">
      <div className="blackjack">
        <div className="filas">
          <div className="crupier">
            <h2>♣️ Crupier ♣️</h2>
            <div className="cartas">
              {cartasCrupier.map((carta, index) => (
                <Carta key={index} img={carta.img} />
              ))}
            </div>
            <p>Puntuación: {puntuacionCrupier}</p>
          </div>
          <div className="jugador">
            <h2>♣️ Jugador ♣️</h2>
            <div className="cartas">
              {cartasJugador.map((carta, index) => (
                <Carta key={index} img={carta.img} />
              ))}
            </div>
            <p>Puntuación: {puntuacionJugador}</p>
          </div>
        </div>
        <div className="acciones">
          <button onClick={pedirCarta} disabled={finJuego}>Pedir carta</button>
          <button onClick={turnoCrupier} disabled={finJuego}>Plantarse</button>
          {finJuego && <p>{determinarResultado()}</p>}
          {finJuego && <button onClick={iniciarJuego}>Nueva partida</button>}
        </div>
      </div>
      </div>
    </div>
  );
}

export default BlackJack;
