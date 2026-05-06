const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro real en MongoDB
exports.register = async (req, res) => {
    const { nombre, apellidos, correo, dni, celular, password } = req.body;

    try {
        // 1. Verificar si el correo ya existe
        const existingUser = await User.findOne({ correo });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        // 2. Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Guardar en MongoDB
        const newUser = new User({
            nombre, apellidos, correo, dni, celular, password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

// Login real
exports.login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // 1. Buscar al usuario
        const user = await User.findOne({ correo });
        if (!user) return res.status(404).json({ message: "Correo o contraseña incorrectos" });

        // 2. Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Correo o contraseña incorrectos" });

        // 3. Generar Token JWT (Asegúrate de tener un JWT_SECRET en tu archivo .env)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secreto_super_seguro', { expiresIn: '1d' });

        // 4. Enviar datos al frontend
        res.json({
            message: `¡Bienvenido de nuevo, ${user.nombre}!`,
            token,
            user: { id: user._id, nombre: user.nombre, correo: user.correo }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};