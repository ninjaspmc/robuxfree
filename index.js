const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/capture', (req, res) => {
  const imageData = req.body.image.replace(/^data:image\/\w+;base64,/, "");
  const username = req.body.username;
  const hora = moment.tz('America/Sao_Paulo').format('HH-mm-ss'); 
const data = moment.tz('America/Sao_Paulo').format('DD-MM-YYYY'); 
  const buffer = Buffer.from(imageData, 'base64');
  const filename = `${username}-${data}-${hora}.png`;
  const filePath = path.join(__dirname, 'public/images', filename);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error('Erro ao salvar a imagem:', err);
      return res.status(500).send('Erro ao salvar a imagem.');
    }
    console.log(`Imagem salva: ${filename}`);
    res.send('Imagem capturada com sucesso!');
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/privado/imagens', (req, res) => {
  const dirPath = path.join(__dirname, 'public/images');
  
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).send('Erro ao listar as imagens.');
    }
    
    let html = '<h1>Imagens Capturadas</h1><ul>';
    files.forEach(file => {
      html += `<li><a href="/images/${file}" target="_blank">${file}</a></li>`;
    });
    html += '</ul>';

    res.send(html);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});