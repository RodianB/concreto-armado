//Importación de Modulos
// import "formulas.js";

//----------------------- VARIABLES ------------------//
const captura = function () {
   //Dimensiones (m)
   let b = document.querySelector("#baseV").value, //0.3
      h = 0.5,
      d = document.querySelector("#peralteEfV").value; //0.342

   //Esfuerzos (MPa)
   let fcc = document.querySelector("#resistenciaCV").value, //21.1
      fy = document.querySelector("#resistenciaAV").value; //240

   // Modulos de elasticidad (Mpa)
   let Ec = 21600,
      Es = 200000,
      n = document.querySelector("#nV").value; //9.3

   // Momento máx kN.m
   let M = document.querySelector("#momentoMaxV").value; //35

   // Incremento inicial
   let X = 0.001;

   //---------------------- FUNCIONES -----------------------//

   const redondear = function (numero, decimales) {
      return Number(numero.toFixed(decimales));
   };

   const redondearCifrasSig = function (numero, numeroCifras) {
      let numeroStr = numero.toString().replace(".", "").split("");
      let posicion = 0;

      for (let i = 0; i < numeroStr.length; i++) {
         if (numeroStr[i] !== "0") {
            break;
         }
         posicion += 1;
      }

      let redondeo = Number(numero.toFixed(posicion + numeroCifras - 1));

      return redondeo;
   };

   const calcRhoMinimo = function (resistenciaConcreto, resistenciaAcero) {
      let pMin1 = (0.25 * resistenciaConcreto ** 0.5) / resistenciaAcero;
      let pMin2 = 1.4 / resistenciaAcero;

      return Math.max(pMin1, pMin2);
   };

   const calcAs = function (rho, base, peralteEfectivo) {
      return rho * base * peralteEfectivo;
   };

   const calcAsMinimo = function (resistenciaConcreto, resistenciaAcero, b, d) {
      let AsMin_1 =
         ((0.25 * resistenciaConcreto ** 0.5) / resistenciaAcero) *
         (b * 100 * (d * 100));
      let AsMin_2 = (1.4 * b * 100 * d * 100) / resistenciaAcero;

      return Math.max(AsMin_1, AsMin_2);
   };

   const calcModuloConcreto = function (resistenciaConcreto) {
      return (4700 * resistenciaConcreto ** 0.5).toFixed(-2);
   };

   const calcVariables = function (rho) {
      let k = -n * rho + ((n * rho) ** 2 + 2 * n * rho) ** (1 / 2),
         j = 1 - k / 3,
         fc = ((fy * 1000) / 2 / n) * (k / (1 - k)),
         K = (fc * k * j) / 2;

      return {
         k: k,
         j: j,
         fc: fc,
         K: K,
      };
   };

   const calcMomentoC = function (rho) {
      v = calcVariables(rho);

      return v.K * b * d ** 2;
   };

   //Funciones del programa
   const seguirDividiendo = function (Momentoi, MomentoActual) {
      let dividir = false;

      if (Math.abs(Momentoi - MomentoActual) < 0.001) {
         dividir = true;
      }
      return dividir;
   };

   //----------------------- PROGRAMA -----------------------//

   //Esfuerzos admisibles
   let fc = 0.45 * fcc,
      fs = 0.5 * fy;

   // Cuantía inicial para el cálculo
   let p = 0.001;

   // Cuantía y As mínima
   let pMin = calcRhoMinimo(fcc, fs),
      AsMin = calcAsMinimo(fcc, fy, b, d);

   //Ejecución del programa

   let continuar = true;
   while (continuar) {
      //Variables que guardan el momento con la cuantia inicial de 0.001 y con un incremento
      let Mi = calcMomentoC(p),
         MiX = calcMomentoC(p + X);

      //Comprueba si el momento calculado por tabulación es muy cercano al definido
      if (!seguirDividiendo(M, Mi)) {
         //Si aun no es cercano, se comprueba si el momento0 está entre los momentos adyacentes (Mc1 y Mc2) y si es asi el incremento X disminuye en 10
         if (M > Mi && M < MiX) {
            X = X / 10;
         }
         //Si no está entre ambos momentos (Mc1 y Mc2), la cuantía va aumentando en el incremento X
         else {
            p = p + X;
         }
      }
      // Cuando el momento calculado es muy cercano al definido,  se extraen los parametros para ese valor de cuantía y el ciclo se acaba
      else {
         let variables = calcVariables(p);
         continuar = false;
      }
   }

   //Calculo del área del acero con la cuantia calculada anteriormente
   let As = calcAs(p, b, d);

   // Condición de cuantía minima
   if (p < pMin) {
      console.log(
         `El p calculado ${p.toFixed(6)} es menor al minimo ${pMin.toFixed(
            6
         )}, por tanto \n p = ${pMin.toFixed(6)}`
      );
   } else {
      console.log(`p = ${p.toFixed(6)}`);
   }

   // Imprime As y M convertidos y redondeados
   console.log(`As = ${(As * 10000).toFixed(4)} cm2
M = ${calcMomentoC(p).toFixed(4)} kN.m`);

   // Pruebas

   const divAnswer = document.querySelector("#answer");
   divAnswer.textContent = redondearCifrasSig(p, 4);
};
