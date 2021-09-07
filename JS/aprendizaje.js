const lista = [];
const matriz = [];
const filas = 4;
const columnas = 4;

console.log(lista);

for (let i = 0; i < 10; i++) {
   lista.push(i + 1);
}

console.log(lista);

for (let i = 0; i < filas; i++) {
   matriz[i] = Array(columnas).fill(0);
}

console.log(matriz);
