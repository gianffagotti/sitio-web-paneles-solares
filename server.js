const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Utilidad para escapar HTML en contenidos de usuario
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Función para cargar la configuración de contacto
function loadContactConfig() {
  try {
    const configPath = path.join(__dirname, 'public', 'contact-config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error al cargar configuración de contacto:', error);
    return null;
  }
}

// Middlewares
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('No permitido por CORS'));
  }
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Límite de rate para el endpoint de contacto
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas solicitudes, inténtalo más tarde.' }
});

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
    const configPath = path.join(__dirname, 'public', 'contact-config.json');
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
app.post('/contacto', contactLimiter, async (req, res) => {
  try {
    const { nombre, email, telefono = '', mensaje, website } = req.body; // "website" = honeypot

    // Antispam básico por honeypot
    if (website && website.trim() !== '') {
      return res.status(400).json({ success: false, message: 'Solicitud inválida' });
    }

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        success: false,
        message: 'Los campos Nombre, Email y Mensaje son obligatorios'
      });
    }

    // Validar longitudes mínimas
    if (String(nombre).trim().length < 2) {
      return res.status(400).json({ success: false, message: 'El nombre es demasiado corto' });
    }
    if (String(mensaje).trim().length < 10) {
      return res.status(400).json({ success: false, message: 'El mensaje es demasiado corto' });
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

    const safeNombre = escapeHtml(String(nombre).trim());
    const safeEmail = escapeHtml(String(email).trim());
    const safeTelefono = escapeHtml(String(telefono).trim());
    const safeMensaje = escapeHtml(String(mensaje).trim()).replace(/\n/g, '<br>');

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
            <p><strong>Nombre:</strong> ${safeNombre}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            ${safeTelefono ? `<p><strong>Teléfono:</strong> ${safeTelefono}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6;">${safeMensaje}</p>
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

// Ruta para recargar la configuración de contacto desde el archivo (sin recibir body)
app.put('/api/config', (req, res) => {
  try {
    const configPath = path.join(__dirname, 'public', 'contact-config.json');
    
    // Verificar que el archivo de configuración existe
    if (!fs.existsSync(configPath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo de configuración no encontrado'
      });
    }
    
    // Leer y parsear la configuración actual del archivo
    const configData = fs.readFileSync(configPath, 'utf8');
    const currentConfig = JSON.parse(configData);
    
    // Validar estructura mínima requerida
    if (!currentConfig.empresa || !currentConfig.contacto || !currentConfig.redesSociales) {
      return res.status(400).json({
        success: false,
        message: 'El archivo de configuración no tiene la estructura requerida (empresa, contacto, redesSociales)'
      });
    }
    
    // Devolver la configuración actualizada
    res.json({
      success: true,
      message: 'Configuración recargada correctamente desde el archivo',
      data: currentConfig
    });
    
  } catch (error) {
    console.error('Error al recargar configuración:', error);
    
    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: 'Error de sintaxis en el archivo JSON de configuración'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al recargar la configuración'
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