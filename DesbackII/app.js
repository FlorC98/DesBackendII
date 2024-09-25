const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const sessionRoutes = require('./routes/sessions.js');

const app = express();
const PORT = 8080;

// Middleware para parsear solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configurar sesiones
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas de vistas
app.get('/', (req, res) => {
  res.render('home', { title: 'Home Page' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Registro de Usuario' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
});

app.get('/current', (req, res) => {
  res.render('current', { title: 'Usuario Actual' });
});

// Usar las rutas de sesiones
app.use('/api/sessions', sessionRoutes);

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/DesbackII', {})
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Página no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
