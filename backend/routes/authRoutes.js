const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, updatePassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

// Nuevas rutas para recuperar contraseña
router.post('/verify-email', verifyEmail);
router.put('/update-password', updatePassword); // Usamos PUT porque estamos modificando un dato existente

module.exports = router;