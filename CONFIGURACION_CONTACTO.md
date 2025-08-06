# Configuración de Contacto y Redes Sociales

Este proyecto ahora incluye un sistema de configuración parametrizada para toda la información de contacto y redes sociales.

## 📁 Archivo de Configuración

La configuración se encuentra en `config/contact-config.json` y contiene toda la información de contacto, empresa y redes sociales que se muestra en el sitio web.

## 🔧 Estructura de la Configuración

```json
{
  "empresa": {
    "nombre": "SolarTech",
    "descripcion": "Líder en soluciones de energía solar...",
    "slogan": "Energía limpia para tu hogar"
  },
  "contacto": {
    "direccion": {
      "calle": "Av. Principal 123",
      "ciudad": "Ciudad Solar",
      "codigoPostal": "12345",
      "pais": "México",
      "completa": "Av. Principal 123, Ciudad Solar, CP 12345, México"
    },
    "telefonos": [
      "+52 (55) 1234-5678",
      "+52 (55) 8765-4321"
    ],
    "emails": [
      {
        "tipo": "general",
        "direccion": "contacto@solartech.mx"
      },
      {
        "tipo": "ventas", 
        "direccion": "ventas@solartech.mx"
      }
    ],
    "horario": {
      "lunesViernes": "8:00 - 18:00",
      "sabado": "9:00 - 14:00",
      "domingo": "Cerrado"
    }
  },
  "redesSociales": {
    "facebook": {
      "url": "https://facebook.com/solartech",
      "activo": true
    },
    "instagram": {
      "url": "https://instagram.com/solartech", 
      "activo": true
    },
    "twitter": {
      "url": "https://twitter.com/solartech",
      "activo": true
    },
    "linkedin": {
      "url": "https://linkedin.com/company/solartech",
      "activo": true
    },
    "youtube": {
      "url": "https://youtube.com/@solartech",
      "activo": false
    },
    "whatsapp": {
      "numero": "+5215512345678",
      "activo": true
    }
  },
  "configuracion": {
    "mostrarWhatsapp": true,
    "mostrarHorarios": true,
    "emailPrincipal": "contacto@solartech.mx"
  }
}
```

## 🚀 Cómo Actualizar la Configuración

### Método 1: Editar el Archivo Directamente

1. Abre el archivo `config/contact-config.json`
2. Modifica los valores según tus necesidades
3. Guarda el archivo
4. Reinicia el servidor o recarga la página web

### Método 2: Usar la API (Programático)

Puedes actualizar la configuración usando la API REST:

```javascript
// Ejemplo de actualización via API
const nuevaConfig = {
  empresa: {
    nombre: "Mi Empresa Solar",
    descripcion: "Nueva descripción de la empresa"
    // ... resto de la configuración
  }
  // ... resto de los campos
};

fetch('/api/config', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(nuevaConfig)
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Configuración actualizada correctamente');
  }
});
```

## 📡 APIs Disponibles

### GET /api/config
Obtiene la configuración actual de contacto y redes sociales.

**Respuesta:**
```json
{
  "success": true,
  "data": { /* configuración completa */ }
}
```

### PUT /api/config
Actualiza la configuración de contacto y redes sociales.

**Body:** Objeto JSON con la nueva configuración
**Respuesta:**
```json
{
  "success": true,
  "message": "Configuración actualizada correctamente"
}
```

## ⚙️ Funcionalidades

### Información que se Actualiza Automáticamente

- **Nombre de la empresa** en el logo y títulos
- **Descripción de la empresa** en el footer
- **Dirección completa** en la sección de contacto y footer
- **Teléfonos** (se pueden tener múltiples números)
- **Emails** con diferentes tipos (general, ventas, etc.)
- **Horarios de atención**
- **Enlaces de redes sociales** (solo se muestran los activos)
- **WhatsApp** con enlace directo al chat
- **Email de destino** para el formulario de contacto

### Control de Visibilidad

Puedes controlar qué elementos mostrar usando las opciones en `configuracion`:

- `mostrarWhatsapp`: Mostrar/ocultar enlace de WhatsApp
- `mostrarHorarios`: Mostrar/ocultar horarios de atención
- `emailPrincipal`: Email que recibirá los mensajes del formulario

### Redes Sociales Soportadas

- Facebook
- Instagram  
- Twitter
- LinkedIn
- YouTube
- WhatsApp

Cada red social tiene una configuración `activo` que permite mostrarla u ocultarla sin eliminar la URL.

## 🔄 Actualización Automática

El sitio web carga automáticamente la configuración al cargar la página y actualiza todos los elementos correspondientes. No es necesario modificar el código HTML manualmente.

## 🛠️ Desarrollo

Si necesitas agregar nuevos campos o funcionalidades:

1. Actualiza la estructura en `config/contact-config.json`
2. Modifica las funciones en `public/script.js` para manejar los nuevos campos
3. Actualiza el servidor en `server.js` si es necesario

## 📝 Notas Importantes

- ⚠️ **Respaldo**: Siempre haz una copia de seguridad del archivo de configuración antes de hacer cambios importantes
- 🔄 **Caché**: Algunos navegadores pueden cachear la configuración. Si no ves los cambios inmediatamente, usa Ctrl+F5 para forzar la recarga
- 📧 **Emails**: El email principal se usa tanto para mostrar en el sitio como para recibir los mensajes del formulario de contacto
- 🔗 **URLs**: Asegúrate de usar URLs completas (con https://) en las redes sociales
- 📱 **WhatsApp**: El número debe incluir código de país sin signos (+52 se convierte en 52) 