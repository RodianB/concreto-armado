//Declaración de funciones de las formulas
function rhoMinimo(resistenciaConcreto, resistenciaAcero) {
   let pMin1 = (0.25 * resistenciaConcreto ** 0.5) / resistenciaAcero;
   let pMin2 = 1.4 / resistenciaAcero;

   return Math.max(pMin1, pMin2);
}

function As(rho, base, altura) {
   return rho * base * altura;
}

function moduloConcreto(resistenciaConcreto) {
   return 4700 * resistenciaConcreto ** 0.5, -2;
}
