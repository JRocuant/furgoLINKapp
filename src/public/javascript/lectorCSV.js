/*Lector CSV lo estoy construyendo de manera separada debido a que 
es complicado hacerlo de manera directa por la estructura propia del .csv utilizado.
Si se ejecuta este codigo por separado con el archivo .csv en la misma carpeta entregará la primera y segunda columna 
(transporte y pallet)
*/
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const results = [];
let isHeader = true;

fs.createReadStream(path.join(__dirname, 'RP2.csv'))
  .pipe(csv({ separator: ',' })) // Cambia el separador si es necesario
  .on('data', (data) => {
    if (isHeader) {
      isHeader = false; // Desactivar después de procesar la primera línea
      console.log('Encabezados:', Object.keys(data)); // Imprime los encabezados del archivo CSV
    } else {
      // Solo almacenar las primeras dos columnas
      const filteredData = {
        Transporte: data['﻿Transporte'],
        'Nº Pallet': data['Nº Pallet'],
      };
      results.push(filteredData);
    }
  })
  .on('end', () => {
    console.log('Archivo CSV procesado correctamente');
    console.log(results);
  });