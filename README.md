# 🌞 Sitio Web de Paneles Solares

Un sitio web moderno y responsivo para una empresa de paneles solares, desarrollado con Node.js, Express y vanilla JavaScript. Incluye formulario de contacto funcional con envío de emails.

## ✨ Características

- **Diseño Responsivo**: Se adapta perfectamente a todos los dispositivos
- **SPA (Single Page Application)**: Navegación fluida sin recarga de página
- **Formulario de Contacto**: Envío de emails con validación completa
- **Animaciones Suaves**: Transiciones y efectos visuales atractivos
- **Navegación Inteligente**: Scroll suave y menú hamburguesa para móviles
- **Código Moderno**: ES6+, CSS Grid, Flexbox y animaciones CSS

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución
- **Express.js**: Framework web minimalista
- **Nodemailer**: Envío de emails
- **CORS**: Habilitación de peticiones cross-origin
- **dotenv**: Manejo de variables de entorno

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Grid y Flexbox
- **JavaScript ES6+**: Funcionalidad interactiva
- **Font Awesome**: Iconografía profesional

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 14 o superior)
- **npm** (viene incluido con Node.js)
- Una cuenta de email para configurar SMTP

## ⚡ Instalación Rápida

### 1. Clonar o descargar el proyecto
```bash
# Si tienes git instalado
git clone <url-del-repositorio>
cd sitio-web-paneles-solares

# O simplemente descomprime la carpeta del proyecto
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar el archivo .env con tus credenciales
```

### 4. Configurar el archivo .env

Edita el archivo `.env` con tu configuración de email:

```bash
# Configuración del servidor
PORT=3000

# Configuración SMTP (ejemplo con Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion

# Email destino para los mensajes
CONTACT_EMAIL=contacto@tu-empresa.com
```

### 5. Iniciar el servidor
```bash
# Modo producción
npm start

# Modo desarrollo (con auto-reload)
npm run dev
```

### 6. Abrir en el navegador
```
http://localhost:3000
```

## 📧 Configuración de Email

### Gmail
1. Activa la **verificación en dos pasos** en tu cuenta
2. Genera una **contraseña de aplicación**:
   - Ve a Configuración de Google → Seguridad
   - Busca "Contraseñas de aplicaciones"
   - Genera una nueva contraseña
   - Úsala en `SMTP_PASS`

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
```

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=tu_email@outlook.com
SMTP_PASS=tu_contraseña
```

### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=tu_email@yahoo.com
SMTP_PASS=tu_contraseña
```

## 🗂️ Estructura del Proyecto

```
sitio-web-paneles-solares/
├── 📁 public/              # Archivos estáticos del frontend
│   ├── index.html          # Página principal
│   ├── styles.css          # Estilos CSS
│   └── script.js           # JavaScript del cliente
├── 📄 server.js            # Servidor Express
├── 📄 package.json         # Configuración npm
├── 📄 env.example          # Ejemplo de variables de entorno
├── 📄 .env                 # Variables de entorno (crear)
└── 📄 README.md           # Este archivo
```

## 🎨 Secciones del Sitio Web

### 🏠 Inicio
- Hero section con llamada a la acción
- Presentación de la empresa
- Botones de navegación principales

### 💡 Beneficios
- 6 beneficios principales de la energía solar
- Iconografía representativa
- Diseño en grid responsivo

### 🔧 Servicios
- Evaluación gratuita
- Instalación profesional
- Soporte y mantenimiento
- Presentación alternada de servicios

### 📞 Contacto
- Información de contacto completa
- Formulario funcional con validaciones
- Envío automático de emails
- Notificaciones en tiempo real

## 📱 Características del Frontend

### Navegación
- ✅ Scroll suave entre secciones
- ✅ Menú hamburguesa para móviles
- ✅ Destacado de sección activa
- ✅ Navegación accesible

### Formulario de Contacto
- ✅ Validación en tiempo real
- ✅ Campos obligatorios marcados
- ✅ Validación de formato de email
- ✅ Mensajes de error personalizados
- ✅ Estado de envío visual
- ✅ Notificaciones de éxito/error

### Animaciones
- ✅ Entrada suave de elementos
- ✅ Efectos hover interactivos
- ✅ Transiciones fluidas
- ✅ Animación del icono hero

## 🛠️ Scripts Disponibles

```bash
# Iniciar en modo producción
npm start

# Iniciar en modo desarrollo (requiere nodemon)
npm run dev

# Instalar nodemon globalmente (opcional)
npm install -g nodemon
```

## 🔒 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `SMTP_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Puerto SMTP | `587` |
| `SMTP_USER` | Usuario email | `tu_email@gmail.com` |
| `SMTP_PASS` | Contraseña email | `contraseña_app` |
| `CONTACT_EMAIL` | Email destino | `contacto@empresa.com` |

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que Node.js esté instalado: `node --version`
- Instala las dependencias: `npm install`
- Revisa que el puerto 3000 esté libre

### Los emails no se envían
- Verifica la configuración SMTP en `.env`
- Para Gmail, usa contraseña de aplicación
- Revisa la consola del servidor para errores

### El sitio no carga correctamente
- Verifica que `public/` contenga todos los archivos
- Revisa la consola del navegador para errores
- Asegúrate de que el servidor esté ejecutándose

## 📦 Dependencias

### Producción
- `express`: ^4.18.2 - Framework web
- `cors`: ^2.8.5 - Middleware CORS
- `nodemailer`: ^6.9.7 - Envío de emails
- `dotenv`: ^16.3.1 - Variables de entorno

### Desarrollo
- `nodemon`: ^3.0.1 - Auto-reload del servidor

## 🌐 Deployment

### Heroku
```bash
# Crear app en Heroku
heroku create tu-app-paneles-solares

# Configurar variables de entorno
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=tu_email@gmail.com
heroku config:set SMTP_PASS=tu_contraseña
heroku config:set CONTACT_EMAIL=contacto@empresa.com

# Deploy
git push heroku main
```

### Otros proveedores
Asegúrate de configurar las variables de entorno en tu plataforma de hosting.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔥 Próximas Mejoras

- [ ] Panel de administración
- [ ] Base de datos para almacenar contactos
- [ ] Sistema de citas online
- [ ] Calculadora de ahorros solares
- [ ] Blog integrado
- [ ] Multi-idioma
- [ ] PWA (Progressive Web App)

---

**¿Necesitas ayuda?** 

- 📧 Email: soporte@tu-empresa.com
- 📱 WhatsApp: +52 (55) 1234-5678
- 🌐 Sitio web: https://tu-empresa.com

---

Desarrollado con ❤️ para un futuro más sostenible 🌱
