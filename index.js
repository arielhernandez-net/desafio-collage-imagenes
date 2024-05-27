const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: 'El archivo supera el límite de 5MB',
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'formulario.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'collage.html'));
});


app.post('/imagen', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    const file = req.files.target_file;
    const position = req.body.posicion;
    const ext = path.extname(file.name);

    const newFileName = `imagen-${position}${ext}`;
    const uploadPath = path.join(__dirname, 'public', 'imgs', newFileName);

    file.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.get('/deleteImg/:nombre', (req, res) => {
    const imageName = req.params.nombre;
    const imagePath = path.join(__dirname, 'public', 'imgs', imageName);

    fs.unlink(imagePath, (err) => {
        if (err) {
            return res.status(500).send('Error al eliminar la imagen.');
        }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
