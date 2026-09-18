# FB Abogados — Firma Legal & Despacho Jurídico Especializado

> **Sitio Web Institucional y Canal de Enlace Profesional** para la **Lic. Edith Bernal Martínez** (Cédula Profesional SEP: **14200776**) y el **Lic. Miguel Fabián Sánchez** (Cédula Profesional SEP: **14066883**).

![FB Abogados Banner](logo.jpeg)

---

## Descripción del Proyecto

**FB Abogados** es un sitio web institucional y plataforma interactiva desarrollada con tecnologías web estándar (HTML5, CSS3 y JavaScript vanilla), orientada a presentar los servicios profesionales del despacho, facilitar el contacto directo vía WhatsApp y proporcionar un canal preliminar de orientación jurídica.

El sitio incluye un evaluador interactivo y un formulario de contacto directo diseñados para orientar al usuario y canalizar su consulta con el especialista adecuado.

---

## Características Principales

- **Áreas de Práctica Jurídica**:
  - **Derecho Civil**: Demandas, reconvención (contrademanda), usucapión, contratos, controversias sobre propiedad y regularización.
  - **Derecho Familiar**: Divorcios, pensión alimenticia, guarda y custodia, y patrimonio familiar.
  - **Derecho Penal**: Denuncias, querellas, hechos de tránsito, lesiones y asistencia procesal.
  - **Derecho Agrario y Mercantil**: Asuntos ejidales, cobranza judicial/extrajudicial, títulos de crédito y contratos comerciales.

- **Módulo de Validación Técnica y Filtro Anti-Spam (JavaScript)**:
  - **Filtro Anti-Bots & Honeypot**: Campos trampa invisibles para neutralizar envíos automatizados no deseados.
  - **Validación de Identidad**: Exigencia de nombre y apellido completos, detección de caracteres aleatorios (*gibberish*), patrones repetidos, modismos, apodos de burla y albures mexicanos comunes.
  - **Validador de Teléfono**: Verificación de longitud mínima (10 dígitos) y descarte de secuencias genéricas artificiales.
  - **Sanitización de Entradas**: Filtrado de caracteres especiales y prevención de inyecciones de código (XSS).
  - **Filtro de Contenido no Deseado**: Restricción de hipervínculos externos y contenido publicitario ajeno a la consulta legal.
  - **Control de Frecuencia (Throttle)**: Intervalo de enfriamiento entre envíos para prevenir saturación.

- **Integración de Contacto con WhatsApp**:
  - Canalización directa de consultas hacia los números profesionales de los titulares:
    - **Lic. Edith Bernal Martínez**: [+52 729 140 4674](https://wa.me/527291404674)
    - **Lic. Miguel Fabián Sánchez**: [+52 722 393 7718](https://wa.me/527223937718)

- **Documentación legal y privacidad**:
  El proyecto incorpora secciones informativas relacionadas con privacidad, términos de uso y avisos legales, adaptadas al contexto del sitio y sujetas a revisión y aprobación por parte del titular del despacho:
  - **Aviso de Privacidad Integral**: Conforme a los principios de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
  - **Términos y Condiciones de Uso**: Directrices de uso adecuado del portal, delimitación de tiempos de respuesta y protección de propiedad intelectual.
  - **Deslinde de Responsabilidad Legal y Confidencialidad**: Advertencia explícita de que la navegación o envío de mensajes a través del portal no genera por sí misma una relación jurídica formal abogado-cliente.
  - **Consentimiento Informado Previo al Envío**: Mecanismo de casilla de verificación obligatoria no preseleccionada que requiere confirmación expresa de lectura antes de canalizar datos.

- **Diseño Web Responsivo & Optimización**:
  - Paleta visual profesional con acentos oro (`#d4af37`) y fondo oscuro ejecutivo (`#0b0d10`).
  - Tipografías legibles desde Google Fonts (*Cormorant Garamond*, *Montserrat*).
  - Adaptabilidad para smartphones, tablets y pantallas de escritorio.
  - Marcado HTML semántico y metaetiquetas Open Graph (OG) para compartición en plataformas de mensajería y redes sociales.

---

## Arquitectura y Funcionamiento Técnico de los Formularios

Para garantizar la transparencia exigida en materia de privacidad, se documenta el comportamiento técnico del portal:

1. **Sin Almacenamiento en Servidor ni Base de Datos**: El sitio opera íntegramente del lado del cliente (Client-Side). No cuenta con base de datos, backend ni almacenamiento persistente de las consultas en servidores web propios o de terceros.
2. **Sin Cookies de Rastreo Comercial**: No se emplean cookies de analítica invasiva ni píxeles publicitarios de terceros.
3. **Mecanismo de Envío**: Al diligenciar el formulario o evaluador y aceptar la casilla de consentimiento, el sistema formatea el texto de la consulta y genera un hipervínculo seguro de WhatsApp (`https://wa.me/...`), abriendo la aplicación nativa o web del usuario para que éste confirme y envíe voluntariamente su mensaje directamente al abogado titular.

---

## Nota sobre Contenido Legal

> **Nota sobre contenido legal:** Los textos legales incluidos en este proyecto tienen finalidad informativa y de implementación dentro de la interfaz web. Su contenido, aplicación y actualización corresponden al titular del despacho y deberán ser revisados y aprobados por éste antes de utilizarse como documentación oficial.

---

## Datos Profesionales de los Titulares

- **Lic. Edith Bernal Martínez**
  - Cédula Profesional SEP: **14200776**
  - Contacto Directo: [72-91-40-46-74](tel:7291404674) | [WhatsApp](https://wa.me/527291404674)
  - Correo Electrónico: [EBM10012000@GMAIL.COM](mailto:EBM10012000@GMAIL.COM)

- **Lic. Miguel Fabián Sánchez**
  - Cédula Profesional SEP: **14066883**
  - Contacto Directo: [72-23-93-77-18](tel:7223937718) | [WhatsApp](https://wa.me/527223937718)

*(Se requiere validación de estos datos por los titulares previo al uso del sitio como canal oficial).*

---

## Estructura del Repositorio

```
abogados-fb/
├── index.html       # Estructura semántica HTML5, secciones y modal legal
├── styles.css       # Hojas de estilo CSS, diseño responsive y accesibilidad
├── app.js           # Lógica cliente, enrutamiento a WhatsApp y filtros de entrada
├── logo.jpeg        # Logotipo institucional y recurso gráfico para Open Graph / Favicon
└── README.md        # Documentación técnica, legal y operativa del proyecto
```

---

## Despliegue y Configuración de Dominio

### Despliegue Actual (GitHub Pages)
El sitio se encuentra alojado bajo GitHub Pages con certificado SSL/HTTPS activo en la siguiente dirección:
- **URL**: [https://gitalets.github.io/abogados-fb/](https://gitalets.github.io/abogados-fb/)

### Configuración con Dominio Personalizado (Futuro)
En caso de adquirir un dominio propio (por ejemplo, `fbabogados.com.mx`):
1. Configurar los registros DNS tipo CNAME o ALIAS hacia `gitalets.github.io`.
2. En el repositorio de GitHub, acudir a **Settings** > **Pages** e introducir el dominio personalizado.
3. Asegurarse de mantener activada la casilla **Enforce HTTPS**.
4. Actualizar la etiqueta `<meta property="og:url">` en `index.html`.

---

## Checklist de Validación Previo a la Publicación Oficial

Antes de divulgar la plataforma como sitio oficial de **FB Abogados**, es indispensable cumplir los siguientes puntos de verificación con los titulares:

- [ ] **Validación de Identidad y Cédulas**: Ambas titulares/titulares han confirmado que los números de Cédula Profesional SEP (14200776 y 14066883) son exactos y autorizan su mención pública.
- [ ] **Validación de Medios de Contacto**: Confirmación de teléfonos, cuentas de WhatsApp, correos electrónicos y horarios de atención.
- [ ] **Aprobación de Textos Legales**: Revisión y conformidad expresa con el Aviso de Privacidad Integral, los Términos y Condiciones de Uso, y el Deslinde Legal.
- [ ] **Conformidad con la Operativa de Datos**: Ratificación de que el flujo de atención vía WhatsApp se ajusta a lo declarado en el Aviso de Privacidad.
- [ ] **Deslinde del Desarrollador**: El desarrollador web realiza exclusivamente la implementación técnica y de interfaz; no emite dictámenes ni asume responsabilidad por la validez jurídica sustantiva de los textos, la cual corresponde exclusivamente a los titulares del despacho.

---

© 2026 **FB Abogados**. Todos los derechos reservados.
