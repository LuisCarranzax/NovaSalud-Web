const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro real en MongoDB
exports.register = async (req, res) => {
    const { nombre, apellidos, correo, dni, celular, password } = req.body;

    try {
        const existingUser = await User.findOne({ correo });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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
        const user = await User.findOne({ correo });
        if (!user) return res.status(404).json({ message: "Correo o contraseña incorrectos" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Correo o contraseña incorrectos" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secreto_super_seguro', { expiresIn: '1d' });

        res.json({
            message: `¡Bienvenido de nuevo, ${user.nombre}!`,
            token,
            user: { id: user._id, nombre: user.nombre, correo: user.correo }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión" });
    }

    
};

// Verificar si el correo existe (Paso 1)
exports.verifyEmail = async (req, res) => {
    try {
        const { correo } = req.body;
        const user = await User.findOne({ correo });
        
        if (!user) {
            return res.status(404).json({ message: "No existe una cuenta con este correo." });
        }
        
        res.status(200).json({ message: "Correo verificado correctamente." });
    } catch (error) {
        res.status(500).json({ message: "Error al verificar el correo." });
    }
};

// Actualizar la contraseña (Paso 2)
exports.updatePassword = async (req, res) => {
    try {
        const { correo, newPassword } = req.body;
        
        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Buscar al usuario por correo y actualizar su contraseña
        await User.findOneAndUpdate({ correo }, { password: hashedPassword });
        
        res.status(200).json({ message: "Contraseña actualizada con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la contraseña." });
    }
};