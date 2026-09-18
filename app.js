/* ==========================================================================
   FB ABOGADOS - SISTEMA DE VALIDACIÓN TÉCNICA Y CANALIZACIÓN A WHATSAPP
   Firma Legal: Lic. Edith Bernal Martínez (Céd. Prof. 14200776)
                Lic. Miguel Fabián Sánchez (Céd. Prof. 14066883)
   ========================================================================== */

/* ==========================================================================
   MÓDULO DE VALIDACIÓN TÉCNICA Y FILTRO ANTI-SPAM (FILTROS DE ENTRADA Y CONTROL)
   ========================================================================== */
const UltraSecurityEngine = (() => {
    // Marca de tiempo del momento exacto en que el usuario cargó la página
    const pageLoadTime = Date.now();

    /**
     * 1. SANITIZACIÓN Y DESINFECCIÓN DE TEXTO (ANTI-SQLi Y ANTI-XSS)
     */
    const sanitizeText = (input) => {
        if (typeof input !== 'string') return '';
        
        let cleaned = input
            // Remueve caracteres de control invisibles y nulos
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            // Neutraliza intentos de inyección de comandos o SQL
            .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|UNION|TRUNCATE)\b)/gi, '')
            .replace(/(--|\/\*|\*\/|;|--\s*)/g, '');

        // Mapa de reemplazo seguro para evitar Cross-Site Scripting (XSS)
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;'
        };
        return cleaned.replace(/[&<>"'/]/g, (m) => map[m]);
    };

    /**
     * 2. DETECTOR DE NOMBRES FALSOS Y TECLAZOS ALEATORIOS (GIBBERISH FILTER)
     */
    const isFakeName = (name) => {
        if (!name || name.trim().length < 3) return true;
        const cleanName = name.trim().toLowerCase();

        // Lista de nombres genéricos o falsos comunes
        const fakeKeywords = ['test', 'prueba', 'admin', 'fake', 'nombre', 'asdf', 'qwerty', 'aaaa', 'zzzz', '1234'];
        if (fakeKeywords.some(keyword => cleanName.includes(keyword))) return true;

        // Detecta más de 3 caracteres idénticos consecutivos (ej. "Juuuuuan", "aaaaa")
        if (/(.)\1{3,}/i.test(cleanName)) return true;

        // Detecta teclazos de consonantes sin vocales (ej. "sdfghjkl")
        const hasVowels = /[aeiouáéíóú]/i.test(cleanName);
        if (!hasVowels && cleanName.length > 4) return true;

        return false;
    };

    /**
     * 3. DETECTOR DE TELÉFONOS FALSOS O SECUENCIAS INVÁLIDAS
     */
    const isFakePhone = (phone) => {
        if (!phone) return true;
        const cleanDigits = phone.replace(/[^\d]/g, '');

        // Valida longitud (debe tener entre 10 y 15 dígitos)
        if (cleanDigits.length < 10 || cleanDigits.length > 15) return true;

        // Bloquea secuencias repetidas como 0000000000, 1111111111, 9999999999
        if (/^(\d)\1{9,}$/.test(cleanDigits)) return true;

        // Bloquea secuencias progresivas falsas comunes
        const fakeSequences = ['1234567890', '0987654321', '1231231231', '0123456789', '9876543210'];
        if (fakeSequences.some(seq => cleanDigits.includes(seq))) return true;

        return false;
    };

    /**
     * 4. FILTRO ANTI-PUBLICIDAD Y ENLACES MALICIOSOS (SPAM DETECTOR)
     */
    const isSpamContent = (text) => {
        if (!text) return false;
        const cleanText = text.toLowerCase();

        // Detecta si intentan enviar enlaces o URLs externas en la consulta legal
        const urlPattern = /(https?:\/\/|www\.|ftp:\/\/|[a-z0-9-]+\.(com|net|org|ru|cn|xyz|top|site|online|tk|info))/i;
        if (urlPattern.test(cleanText)) return true;

        // Palabras clave de spam comercial/casino/cripto
        const spamKeywords = [
            'casino', 'bitcoin', 'crypto', 'viagra', 'seo', 'backlinks', 
            'prestamo inmediato', 'ganar dinero', 'investment', 'telegram', 
            'whatsapp bot', 'subscriptores', 'seguidores'
        ];
        if (spamKeywords.some(word => cleanText.includes(word))) return true;

        return false;
    };

    /**
     * 5. VALIDACIÓN DE EMAIL RIGUROSA
     */
    const isValidEmail = (email) => {
        if (!email) return false;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email.trim());
    };

    /**
     * 6. DETECTOR DE TIEMPO HUMANO (ANTI-BOT TIEMPO MÍNIMO)
     */
    const isSubmittedTooFast = (minSeconds = 3.5) => {
        const elapsed = (Date.now() - pageLoadTime) / 1000;
        return elapsed < minSeconds; // Si se envía en menos de 3.5 segundos es un bot
    };

    /**
     * 7. CONTROL DE ENVIOS CONTINUOS (THROTTLE ENFRIAMIENTO DE 5 SEGUNDOS)
     */
    const submissionCooldowns = new Map();
    const isThrottled = (formId, cooldownMs = 5000) => {
        const now = Date.now();
        const lastSubmit = submissionCooldowns.get(formId) || 0;
        if (now - lastSubmit < cooldownMs) {
            return true;
        }
        submissionCooldowns.set(formId, now);
        return false;
    };

    return {
        sanitizeText,
        isFakeName,
        isFakePhone,
        isSpamContent,
        isValidEmail,
        isSubmittedTooFast,
        isThrottled
    };
})();

// Teléfonos oficiales de WhatsApp
const PHONE_LIC_EDITH = "527291404674";  // Lic. Edith Bernal Martínez
const PHONE_LIC_MIGUEL = "527223937718"; // Lic. Miguel Fabián Sánchez

// Inicialización de lógica interactiva
document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. AÑO DINÁMICO EN FOOTER
       ---------------------------------------------------------------------- */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }

    /* ----------------------------------------------------------------------
       2. NAVEGACIÓN MÓVIL
       ---------------------------------------------------------------------- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    /* ----------------------------------------------------------------------
       3. DIAGNÓSTICO CON SELECCIÓN DE ABOGADO Y ENRUTAMIENTO DINÁMICO
       ---------------------------------------------------------------------- */
    const diagnosticForm = document.getElementById('diagnosticForm');
    if (diagnosticForm) {
        diagnosticForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Trampa Honeypot: Si el campo invisible fue llenado, se bloquea silenciosamente (es un bot)
            const honeypotVal = document.getElementById('diagnostic_hp_check')?.value;
            if (honeypotVal && honeypotVal.trim() !== '') {
                console.warn('Bot detectado vía Honeypot.');
                return;
            }

            // Verificación de tiempo de interacción humano
            if (UltraSecurityEngine.isSubmittedTooFast()) {
                alert('Por favor tómate un momento para revisar las opciones antes de enviar.');
                return;
            }

            // Control de envíos repetidos
            if (UltraSecurityEngine.isThrottled('diagnosticForm')) {
                alert('Por favor espera 5 segundos antes de realizar otra evaluación.');
                return;
            }

            // Verificación de consentimiento de privacidad y deslinde legal
            const diagnosticTermsCheck = document.getElementById('acceptDiagnosticTerms');
            if (diagnosticTermsCheck && !diagnosticTermsCheck.checked) {
                alert('Debes confirmar que has leído y aceptas el Aviso de Privacidad y el Deslinde Legal antes de enviar tu evaluación.');
                diagnosticTermsCheck.focus();
                return;
            }

            // Extracción y sanitización
            const preferred = document.querySelector('input[name="preferredLawyer"]:checked')?.value || 'edith';
            const rawMateria = document.querySelector('input[name="materia"]:checked')?.value || 'No especificada';
            const rawEstado = document.querySelector('input[name="estado"]:checked')?.value || 'No especificado';
            const rawDesc = document.getElementById('caseDescription')?.value || 'Sin detalles adicionales';

            const cleanMateria = UltraSecurityEngine.sanitizeText(rawMateria);
            const cleanEstado = UltraSecurityEngine.sanitizeText(rawEstado);
            const cleanDesc = UltraSecurityEngine.sanitizeText(rawDesc);

            // Filtro anti-spam en descripción
            if (UltraSecurityEngine.isSpamContent(cleanDesc)) {
                alert('Tu mensaje contiene enlaces o palabras no permitidas. Por favor ingresa únicamente los detalles de tu consulta legal.');
                return;
            }

            // Selección de número de destino y nombre del abogado
            let targetPhone = PHONE_LIC_EDITH;
            let targetLawyerName = "Lic. Edith Bernal Martínez";

            if (preferred === 'miguel') {
                targetPhone = PHONE_LIC_MIGUEL;
                targetLawyerName = "Lic. Miguel Fabián Sánchez";
            } else if (preferred === 'cualquiera') {
                targetPhone = PHONE_LIC_EDITH;
                targetLawyerName = "FB Abogados";
            }

            const message = `*NUEVA CONSULTA DESDE SITIO WEB (FB ABOGADOS)*%0A%0A` +
                            `📌 *Materia:* ${encodeURIComponent(cleanMateria)}%0A` +
                            `⚖️ *Estado del Caso:* ${encodeURIComponent(cleanEstado)}%0A` +
                            `📝 *Detalles:* ${encodeURIComponent(cleanDesc)}%0A%0A` +
                            `Solicito una evaluación y propuesta de representación dirigida a ${encodeURIComponent(targetLawyerName)}.`;

            const waUrl = `https://wa.me/${targetPhone}?text=${message}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

    /* ----------------------------------------------------------------------
       4. FORMULARIO DE CONTACTO CON SELECCIÓN DE ABOGADO Y ENRUTAMIENTO
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Trampa Honeypot para Bots
            const hpValue = document.getElementById('contact_hp_check')?.value;
            if (hpValue && hpValue.trim() !== '') {
                console.warn('Bot de spam interceptado.');
                return;
            }

            // 2. Verificación de velocidad de envío humano (Anti-Bot)
            if (UltraSecurityEngine.isSubmittedTooFast()) {
                alert('Por favor tómate un momento para revisar tus datos antes de enviar.');
                return;
            }

            // 2.5 Validación de Aceptación de Términos y Aviso de Privacidad
            const legalTermsCheck = document.getElementById('acceptLegalTerms');
            if (legalTermsCheck && !legalTermsCheck.checked) {
                alert('Debes confirmar que has leído y aceptas el Aviso de Privacidad y Términos Legales antes de enviar tu consulta.');
                legalTermsCheck.focus();
                return;
            }

            // 3. Control de enfriamiento (Anti-Flood)
            if (UltraSecurityEngine.isThrottled('contactForm')) {
                alert('Por favor espera 5 segundos antes de realizar otro envío.');
                return;
            }

            // 4. Captura de datos
            const lawyerChoice = document.getElementById('contactLawyerSelect')?.value || 'edith';
            const rawName = document.getElementById('clientName')?.value || '';
            const rawPhone = document.getElementById('clientPhone')?.value || '';
            const rawEmail = document.getElementById('clientEmail')?.value || '';
            const rawMessage = document.getElementById('clientMessage')?.value || '';

            // 5. Sanitización inicial
            const cleanName = UltraSecurityEngine.sanitizeText(rawName);
            const cleanPhone = rawPhone.replace(/[^\d]/g, '');
            const cleanEmail = rawEmail.trim() ? UltraSecurityEngine.sanitizeText(rawEmail) : 'No proporcionado';
            const cleanMsg = UltraSecurityEngine.sanitizeText(rawMessage);

            // 6. VALIDACIÓN RIGUROSA DE NOMBRE REAL
            if (UltraSecurityEngine.isFakeName(cleanName)) {
                alert('Por favor ingresa tu nombre y apellido reales (sin caracteres repetidos o teclazos de prueba).');
                document.getElementById('clientName')?.focus();
                return;
            }

            // 7. VALIDACIÓN RIGUROSA DE TELÉFONO REAL
            if (UltraSecurityEngine.isFakePhone(rawPhone)) {
                alert('Por favor ingresa un número de teléfono o WhatsApp válido de 10 dígitos (ej. 7221234567).');
                document.getElementById('clientPhone')?.focus();
                return;
            }

            // 8. VALIDACIÓN DE EMAIL (SI SE PROPORCIONÓ)
            if (rawEmail.trim() && !UltraSecurityEngine.isValidEmail(rawEmail)) {
                alert('El correo electrónico ingresado no tiene un formato válido (ejemplo: cliente@correo.com).');
                document.getElementById('clientEmail')?.focus();
                return;
            }

            // 9. VALIDACIÓN ANTI-SPAM / ENLACES PUBLICITARIOS EN MENSAJE
            if (UltraSecurityEngine.isSpamContent(cleanMsg)) {
                alert('El mensaje no puede contener enlaces de internet o publicidad. Por favor redacta tu duda legal.');
                document.getElementById('clientMessage')?.focus();
                return;
            }

            // 10. Selección de Abogado y Teléfono
            let targetPhone = PHONE_LIC_EDITH;
            let targetLawyerName = "Lic. Edith Bernal Martínez";

            if (lawyerChoice === 'miguel') {
                targetPhone = PHONE_LIC_MIGUEL;
                targetLawyerName = "Lic. Miguel Fabián Sánchez";
            } else if (lawyerChoice === 'cualquiera') {
                targetPhone = PHONE_LIC_EDITH;
                targetLawyerName = "FB Abogados";
            }

            // 11. MENSAJE FINAL COMPROBADO Y AUTÉNTICO
            const message = `*SOLICITUD DE ASESORÍA AUTÉNTICA - FB ABOGADOS*%0A%0A` +
                            `👤 *Cliente:* ${encodeURIComponent(cleanName)}%0A` +
                            `📞 *Teléfono:* ${encodeURIComponent(cleanPhone)}%0A` +
                            `✉️ *Correo:* ${encodeURIComponent(cleanEmail)}%0A` +
                            `💬 *Detalles del Caso:* ${encodeURIComponent(cleanMsg)}%0A%0A` +
                            `Solicito orientación legal directa dirigida a: ${encodeURIComponent(targetLawyerName)}.`;

            const waUrl = `https://wa.me/${targetPhone}?text=${message}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

    /* ----------------------------------------------------------------------
       5. EFECTO DE SOMBRA EN LA BARRA DE NAVEGACIÓN
       ---------------------------------------------------------------------- */
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.8)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        }
    });

    /* ----------------------------------------------------------------------
       6. CONTROLADOR DEL MODAL LEGAL Y POLÍTICAS DE PRIVACIDAD
       ---------------------------------------------------------------------- */
    const legalModal = document.getElementById('legalModal');
    const closeLegalBtn = document.getElementById('closeLegalModal');
    const acceptLegalBtn = document.getElementById('acceptLegalModalBtn');
    const legalTabBtns = document.querySelectorAll('.legal-tab-btn');
    const legalTabPanes = document.querySelectorAll('.legal-tab-pane');

    const switchLegalTab = (tabName) => {
        legalTabBtns.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        legalTabPanes.forEach(pane => {
            if (pane.id === `legalTab-${tabName}`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    };

    const openLegalModal = (tabName = 'privacidad') => {
        if (!legalModal) return;
        switchLegalTab(tabName);
        legalModal.classList.add('active');
        legalModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLegalModal = () => {
        if (!legalModal) return;
        legalModal.classList.remove('active');
        legalModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Triggers de apertura distribuidos en la landing page
    document.querySelectorAll('.trigger-legal-modal').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const tabTarget = trigger.dataset.tab || 'privacidad';
            openLegalModal(tabTarget);
        });
    });

    // Pestañas interiores del modal
    legalTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabTarget = btn.dataset.tab;
            if (tabTarget) switchLegalTab(tabTarget);
        });
    });

    // Acciones de cierre
    if (closeLegalBtn) closeLegalBtn.addEventListener('click', closeLegalModal);
    if (acceptLegalBtn) acceptLegalBtn.addEventListener('click', closeLegalModal);

    // Cierre al dar clic fuera del contenido
    if (legalModal) {
        legalModal.addEventListener('click', (e) => {
            if (e.target === legalModal) {
                closeLegalModal();
            }
        });
    }

    // Cierre mediante la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && legalModal && legalModal.classList.contains('active')) {
            closeLegalModal();
        }
    });
});
