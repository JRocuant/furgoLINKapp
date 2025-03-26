const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const transportes = {};  // Objeto para almacenar los códigos de transporte y sus pallets
const palletMaximo = {}; // Objeto para almacenar el código de transporte y el pallet máximo

fs.createReadStream(path.join(__dirname, 'RP2.csv'))
  .pipe(csv({ separator: ',' })) // Cambia el separador si es necesario
  .on('data', (data) => {
    // Obtener el código de transporte y el nº de pallet
    const transporte = data['﻿Transporte']; // Asegúrate de que el nombre sea correcto
    const pallet = data['Nº Pallet'];

    // Si el código de transporte aún no está en el objeto, creamos un Set para él
    if (!transportes[transporte]) {
      transportes[transporte] = new Set();
    }

    // Agregar el nº de pallet al Set correspondiente
    transportes[transporte].add(pallet);
  })
  .on('end', () => {
    // Convertir los Sets de cada transporte a un Array
    for (const transporte in transportes) {
      transportes[transporte] = Array.from(transportes[transporte]);

      // Asociar el código de transporte con el pallet máximo
      palletMaximo[transporte] = Math.max(...transportes[transporte]);
    }

    console.log('Archivo CSV procesado correctamente');
    console.log('Transportes:', transportes);  // Imprime todos los códigos de transporte y sus pallets sin repeticiones
    console.log('PalletMaximo:', palletMaximo);  // Imprime el objeto con el pallet máximo para cada transporte
  });
