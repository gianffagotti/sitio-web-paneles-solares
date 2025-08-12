// Configuración global
const CONFIG = {
    animationDuration: 300
};

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadContactConfig();
    
    initNavigation();
    initContactForm();
    initScrollAnimations();
}); 

// Variable global para almacenar la configuración
let contactConfig = null;

// Función para cargar la configuración de contacto
async function loadContactConfig() {
    try {
        // Cargar directamente el archivo JSON desde Firebase hosting
        const response = await fetch('/contact-config.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        contactConfig = await response.json();
        updateContactInformation();
        return contactConfig;
        
    } catch (error) {
        console.error('Error al cargar configuración de contacto:', error);
        return null;
    }
}

// Función para actualizar la información de contacto en el HTML
function updateContactInformation() {
    if (!contactConfig) return;

    // Actualizar información de la empresa
    updateCompanyInfo();
    
    // Actualizar información de contacto
    updateContactInfo();
    
    // Actualizar redes sociales
    updateSocialLinks();
    
    // Actualizar footer
    updateFooter();
}

// Actualizar información de la empresa
function updateCompanyInfo() {
    const { empresa } = contactConfig;
    
    // Actualizar nombre de la empresa en el logo
    const logoTexts = document.querySelectorAll('.logo span');
    logoTexts.forEach(span => {
        span.textContent = empresa.nombre;
    });
    
    // Actualizar descripción de la empresa
    const companyDescriptions = document.querySelectorAll('.footer-section p');
    if (companyDescriptions[0]) {
        companyDescriptions[0].textContent = empresa.descripcion;
    }
}

// Actualizar información de contacto
function updateContactInfo() {
    const { contacto } = contactConfig;
    
    // Obtener todos los elementos de contacto
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const icon = item.querySelector('i');
        const paragraph = item.querySelector('p');
        
        if (!icon || !paragraph) return;
        
        // Actualizar dirección - buscar por el ícono de ubicación
        if (icon.classList.contains('fa-map-marker-alt')) {
            paragraph.innerHTML = `${contacto.direccion.completa}`;
        }
        
        // Actualizar teléfonos - buscar por el ícono de teléfono
        else if (icon.classList.contains('fa-phone')) {
            paragraph.innerHTML = contacto.telefonos.join('<br>');
        }
        
        // Actualizar emails - buscar por el ícono de email
        else if (icon.classList.contains('fa-envelope')) {
            const emailsHtml = contacto.emails.map(email => 
                `<a href="mailto:${email.direccion}">${email.direccion}</a>`
            ).join('<br>');
            paragraph.innerHTML = emailsHtml;
        }
        
        // Actualizar horarios - buscar por el ícono de reloj
        else if (icon.classList.contains('fa-clock')) {
            paragraph.innerHTML = `Lunes a Viernes: ${contacto.horario.lunesViernes}<br>Sábados: ${contacto.horario.sabado}`;
        }
    });
}

// Actualizar enlaces de redes sociales
function updateSocialLinks() {
    const { redesSociales } = contactConfig;
    const socialLinksContainer = document.querySelector('.social-links');
    
    if (!socialLinksContainer) return;
    
    // Limpiar enlaces existentes
    socialLinksContainer.innerHTML = '';
    
    // Agregar enlaces activos
    Object.entries(redesSociales).forEach(([red, config]) => {
        if (config.activo && red !== 'whatsapp') {
            const link = document.createElement('a');
            link.href = config.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', red.charAt(0).toUpperCase() + red.slice(1));
            
            const icon = document.createElement('i');
            icon.className = `fab fa-${red}`;
            
            link.appendChild(icon);
            socialLinksContainer.appendChild(link);
        }
    });
    
    // Agregar WhatsApp si está activo
    if (redesSociales.whatsapp.activo) {
        const whatsappLink = document.createElement('a');
        whatsappLink.href = `https://wa.me/${redesSociales.whatsapp.numero.replace(/[^0-9]/g, '')}`;
        whatsappLink.target = '_blank';
        whatsappLink.rel = 'noopener noreferrer';
        whatsappLink.setAttribute('aria-label', 'WhatsApp');
        
        const whatsappIcon = document.createElement('i');
        whatsappIcon.className = 'fab fa-whatsapp';
        
        whatsappLink.appendChild(whatsappIcon);
        socialLinksContainer.appendChild(whatsappLink);
    }
}

// Actualizar footer
function updateFooter() {
    const { contacto } = contactConfig;
    
    // Encontrar la sección de contacto en el footer por su título
    const footerSections = document.querySelectorAll('.footer-section');
    let contactSection = null;
    
    footerSections.forEach(section => {
        const h4 = section.querySelector('h4');
        if (h4 && h4.textContent.trim() === 'Contacto') {
            contactSection = section;
        }
    });
    
    if (contactSection) {
        const contactItems = contactSection.querySelectorAll('p');
        
        if (contactItems[0]) {
            contactItems[0].innerHTML = `<i class="fas fa-map-marker-alt"></i> ${contacto.direccion.calle}`;
        }
        
        if (contactItems[1]) {
            contactItems[1].innerHTML = `<i class="fas fa-phone"></i> ${contacto.telefonos[0]}`;
        }
        
        if (contactItems[2]) {
            contactItems[2].innerHTML = `<i class="fas fa-envelope"></i> ${contacto.emails[0].direccion}`;
        }
    }
}

// === NAVEGACIÓN ===

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle del menú hamburguesa
    hamburger?.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        const nextExpanded = !isExpanded;
        hamburger.setAttribute('aria-expanded', String(nextExpanded));
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            navMenu?.classList.remove('active');
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            navMenu?.classList.remove('active');
        }
    });
    
    // Scroll suave para navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Destacar enlace activo según scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollPos = window.scrollY + headerHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        }
    });
}

// === FORMULARIO DE CONTACTO ===

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Envío del formulario
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Validar campos obligatorios
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `El campo ${getFieldLabel(fieldName)} es obligatorio`;
    }
    
    // Validaciones específicas por tipo de campo
    if (value && fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un email válido';
        }
    }
    
    if (value && fieldName === 'telefono') {
        const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un teléfono válido';
        }
    }
    
    if (fieldName === 'nombre' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (fieldName === 'mensaje' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    // Mostrar/ocultar error
    showFieldError(field, isValid ? '' : errorMessage);
    
    return isValid;
}

function getFieldLabel(fieldName) {
    const labels = {
        'nombre': 'Nombre',
        'email': 'Email',
        'telefono': 'Teléfono',
        'mensaje': 'Mensaje'
    };
    return labels[fieldName] || fieldName;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup?.querySelector('.error-message');
    
    if (!formGroup || !errorElement) return;
    
    if (message) {
        formGroup.classList.add('error');
        errorElement.textContent = message;
    } else {
        formGroup.classList.remove('error');
        errorElement.textContent = '';
    }
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup?.classList.contains('error')) {
        showFieldError(field, '');
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

function sanitizeInput(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .trim();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validar formulario
    if (!validateForm(form)) {
        showNotification('Por favor, corrige los errores en el formulario', 'error');
        return;
    }
    
    // Honeypot simple
    const honeypot = form.querySelector('#website');
    if (honeypot && honeypot.value.trim() !== '') {
        showNotification('Solicitud inválida', 'error');
        return;
    }
    
    // Deshabilitar botón y mostrar loading
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        // Recopilar y sanitizar datos del formulario
        const formData = new FormData(form);
        const data = {
            nombre: sanitizeInput(formData.get('nombre') || ''),
            email: sanitizeInput(formData.get('email') || ''),
            telefono: sanitizeInput(formData.get('telefono') || ''),
            mensaje: sanitizeInput(formData.get('mensaje') || ''),
            website: sanitizeInput(formData.get('website') || '')
        };
        
        const endpoint = form.getAttribute('action') || 'https://formspree.io/f/xanbvjzq';
        
        // Enviar datos a Formspree
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification('Gracias, tu mensaje fue enviado. Nos pondremos en contacto contigo pronto.', 'success');
            form.reset();
            // Limpiar errores visuales
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            form.querySelectorAll('.error-message').forEach(error => {
                error.textContent = '';
            });
        } else {
            const result = await response.json().catch(() => ({}));
            const errorMsg = result?.errors?.[0]?.message || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.';
            throw new Error(errorMsg);
        }
        
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        showNotification(
            error.message || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.',
            'error'
        );
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// === SISTEMA DE NOTIFICACIONES ===

function showNotification(message, type = 'success') {
    // Remover notificación anterior si existe
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.className = `notification ${type}`;
        existingNotification.textContent = message;
        existingNotification.classList.add('show');
        setTimeout(() => {
            existingNotification.classList.remove('show');
        }, 5000);
        return;
    }
    
    // Crear nueva notificación si no existe en el DOM
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, CONFIG.animationDuration);
    }, 5000);
}

// === ANIMACIONES DE SCROLL ===

function initScrollAnimations() {
    // Animación del header al hacer scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Animaciones de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos con clase 'fade-in'
    document.querySelectorAll('.benefit-card, .service-card, .contact-info, .contact-form-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// === UTILIDADES ===

// Scroll suave para botones CTA
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]') || e.target.closest('a[href^="#"]')) {
        const link = e.target.matches('a[href^="#"]') ? e.target : e.target.closest('a[href^="#"]');
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
});

// Optimización para dispositivos móviles
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Debug en desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🚀 Sitio web de paneles solares cargado en modo desarrollo');
} 