const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Función para cargar la configuración de contacto
function loadContactConfig() {
    try {
        const configPath = path.join(__dirname, 'config', 'contact-config.json');
        const configData = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('Error al cargar configuración de contacto:', error);
        return null;
    }
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    // No fallar en certificados inválidos o autofirmados
    rejectUnauthorized: false
  }
});

// Ruta principal - servir el SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para servir la configuración de contacto
app.get('/api/config', (req, res) => {
  try {
    const configPath = path.join(__dirname, 'config', 'contact-config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error al cargar configuración:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar la configuración'
    });
  }
});

// Ruta para manejar el formulario de contacto
app.post('/contacto', async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        success: false,
        message: 'Los campos Nombre, Email y Mensaje son obligatorios'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }

    // Cargar configuración para obtener información de contacto
    const config = loadContactConfig();
    const empresa = config?.empresa?.nombre || 'SolarTech';
    const emailDestino = config?.configuracion?.emailPrincipal || process.env.CONTACT_EMAIL || process.env.SMTP_USER;

    // Configurar el email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: emailDestino,
      subject: `📧 Nuevo contacto desde el sitio web - ${empresa}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5530; border-bottom: 2px solid #4CAF50;">Nuevo Mensaje de Contacto</h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Datos del Cliente:</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6;">${mensaje.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e8; border-radius: 5px; text-align: center;">
            <p style="margin: 0; color: #2c5530; font-size: 14px;">
              Este mensaje fue enviado desde el formulario de contacto del sitio web de ${empresa}.
            </p>
          </div>
        </div>
      `
    };

    // Enviar el email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.'
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor. Por favor, inténtalo más tarde.'
    });
  }
});

// Ruta para actualizar la configuración de contacto (solo POST)
app.put('/api/config', (req, res) => {
  try {
    const newConfig = req.body;
    
    // Validar que se proporcione una configuración válida
    if (!newConfig || typeof newConfig !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Configuración inválida'
      });
    }

    // Validar estructura mínima requerida
    if (!newConfig.empresa || !newConfig.contacto || !newConfig.redesSociales) {
      return res.status(400).json({
        success: false,
        message: 'La configuración debe incluir empresa, contacto y redesSociales'
      });
    }

    const configPath = path.join(__dirname, 'config', 'contact-config.json');
    
    // Crear directorio config si no existe
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Guardar la nueva configuración
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    
    res.json({
      success: true,
      message: 'Configuración actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la configuración'
    });
  }
});

// Manejo de rutas no encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
  console.log(`📁 Sirviendo archivos estáticos desde: ${path.join(__dirname, 'public')}`);
  
  // Verificar configuración de email
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  Advertencia: Variables de entorno SMTP no configuradas. El envío de emails no funcionará.');
  }
}); 