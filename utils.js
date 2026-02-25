/**
 * UTILIDADES JAVASCRIPT COMPARTIDAS - CERVASA SAS
 * Funciones reutilizables para validación, manejo de formularios y UI
 */

// ============================================
// VALIDACIONES
// ============================================

/**
 * Valida formato de cédula colombiana
 * @param {string} cedula - Número de cédula
 * @returns {boolean}
 */
function validarCedula(cedula) {
  const cedulaLimpia = cedula.replace(/\D/g, '');
  return cedulaLimpia.length >= 7 && cedulaLimpia.length <= 11;
}

/**
 * Valida formato de correo electrónico
 * @param {string} email - Dirección de correo
 * @returns {boolean}
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida fortaleza de contraseña
 * Mínimo 6 caracteres, al menos 1 número
 * @param {string} contrasena - Contraseña a validar
 * @returns {boolean}
 */
function validarContrasena(contrasena) {
  return contrasena.length >= 6 && /\d/.test(contrasena);
}

/**
 * Valida nombre (mínimo 3 caracteres)
 * @param {string} nombre - Nombre a validar
 * @returns {boolean}
 */
function validarNombre(nombre) {
  const nombreLimpio = nombre.trim();
  return nombreLimpio.length >= 3;
}

// ============================================
// MANEJO DE FORMULARIOS
// ============================================

/**
 * Configura el toggle de visibilidad de contraseña
 * @param {string} inputId - ID del input de contraseña
 * @param {string} toggleId - ID del ícono toggle
 */
function setupPasswordToggle(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);

  if (!input || !toggle) return;

  toggle.addEventListener('click', function () {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
  });
}

/**
 * Muestra mensaje de error en formulario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {HTMLElement} elementoMensaje - Elemento donde mostrar el mensaje
 */
function mostrarError(mensaje, elementoMensaje) {
  if (!elementoMensaje) return;
  elementoMensaje.textContent = '❌ ' + mensaje;
  elementoMensaje.className = 'form-message error';
}

/**
 * Muestra mensaje de éxito en formulario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {HTMLElement} elementoMensaje - Elemento donde mostrar el mensaje
 */
function mostrarExito(mensaje, elementoMensaje) {
  if (!elementoMensaje) return;
  elementoMensaje.textContent = '✓ ' + mensaje;
  elementoMensaje.className = 'form-message success';
}

/**
 * Muestra mensaje informativo en formulario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {HTMLElement} elementoMensaje - Elemento donde mostrar el mensaje
 */
function mostrarInfo(mensaje, elementoMensaje) {
  if (!elementoMensaje) return;
  elementoMensaje.textContent = 'ℹ ' + mensaje;
  elementoMensaje.className = 'form-message info';
}

/**
 * Limpia mensaje de formulario
 * @param {HTMLElement} elementoMensaje - Elemento a limpiar
 */
function limpiarMensaje(elementoMensaje) {
  if (!elementoMensaje) return;
  elementoMensaje.innerHTML = '';
  elementoMensaje.className = 'form-message';
}

/**
 * Obtiene datos del formulario como objeto
 * @param {HTMLFormElement} formulario - Elemento form
 * @returns {Object} Objeto con los datos del formulario
 */
function obtenerDatosFormulario(formulario) {
  const formData = new FormData(formulario);
  const datos = {};
  
  for (let [key, value] of formData) {
    datos[key] = value.trim();
  }
  
  return datos;
}

/**
 * Habilita o deshabilita un formulario
 * @param {HTMLFormElement} formulario - Elemento form
 * @param {boolean} habilitado - true para habilitar, false para deshabilitar
 */
function habilitarFormulario(formulario, habilitado = true) {
  const inputs = formulario.querySelectorAll('input, textarea, select, button');
  inputs.forEach(input => {
    input.disabled = !habilitado;
  });
}

// ============================================
// ALMACENAMIENTO LOCAL
// ============================================

/**
 * Guarda datos en localStorage
 * @param {string} clave - Clave para guardar
 * @param {any} valor - Valor a guardar (se convierte a JSON)
 */
function guardarEnLocal(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
    return false;
  }
}

/**
 * Obtiene datos de localStorage
 * @param {string} clave - Clave a buscar
 * @returns {any} Valor guardado o null si no existe
 */
function obtenerDelLocal(clave) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : null;
  } catch (error) {
    console.error('Error al obtener de localStorage:', error);
    return null;
  }
}

/**
 * Elimina datos de localStorage
 * @param {string} clave - Clave a eliminar
 */
function eliminarDelLocal(clave) {
  try {
    localStorage.removeItem(clave);
    return true;
  } catch (error) {
    console.error('Error al eliminar de localStorage:', error);
    return false;
  }
}

/**
 * Limpia todo localStorage (usar con cuidado)
 */
function limpiarLocal() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
    return false;
  }
}

// ============================================
// UTILIDADES DE SESIÓN
// ============================================

/**
 * Simula login de usuario
 * @param {Object} usuario - Datos del usuario
 */
function loginUsuario(usuario) {
  const usuarioConFecha = {
    ...usuario,
    loginTime: new Date().toISOString()
  };
  guardarEnLocal('usuarioActual', usuarioConFecha);
}

/**
 * Obtiene usuario actual de sesión
 * @returns {Object|null} Datos del usuario o null
 */
function obtenerUsuarioActual() {
  return obtenerDelLocal('usuarioActual');
}

/**
 * Simula logout de usuario
 */
// Determina la ruta correcta hacia la página de sesión considerando
// si la página actual está dentro de la carpeta 'Zona_admin'.
function _obtenerRutaSesion() {
  try {
    var path = window.location.pathname || '';
    // Normalizamos a minúsculas para evitar problemas con mayúsculas
    var lower = path.toLowerCase();
    if (lower.indexOf('/zona_admin/') !== -1 || lower.endsWith('/zona_admin')) {
      return '../sesion.html';
    }
  } catch (e) {
    console.warn('No se pudo determinar la ruta de sesión, usando por defecto');
  }
  return 'sesion.html';
}

function logoutUsuario() {
  eliminarDelLocal('usuarioActual');
  window.location.href = _obtenerRutaSesion();
}

/**
 * Verifica si hay usuario en sesión
 * @returns {boolean}
 */
function hayUsuarioEnSesion() {
  return obtenerUsuarioActual() !== null;
}

/**
 * Requiere autenticación para acceder a página
 * @param {string} urlRedireccion - URL a redirigir si no está autenticado
 */
function requiereAutenticacion(urlRedireccion) {
  if (typeof urlRedireccion === 'undefined') {
    urlRedireccion = _obtenerRutaSesion();
  }
  if (!hayUsuarioEnSesion()) {
    window.location.href = urlRedireccion;
  }
}

// ============================================
// UTILIDADES DE DOM
// ============================================

/**
 * Muestra un elemento
 * @param {string|HTMLElement} selector - Selector CSS o elemento
 */
function mostrar(selector) {
  const elemento = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (elemento) elemento.style.display = '';
}

/**
 * Oculta un elemento
 * @param {string|HTMLElement} selector - Selector CSS o elemento
 */
function ocultar(selector) {
  const elemento = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (elemento) elemento.style.display = 'none';
}

/**
 * Alterna visibilidad de un elemento
 * @param {string|HTMLElement} selector - Selector CSS o elemento
 */
function alternar(selector) {
  const elemento = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (elemento) elemento.style.display = elemento.style.display === 'none' ? '' : 'none';
}

/**
 * Agrega clase a elemento
 * @param {string|HTMLElement} selector - Selector CSS o elemento
 * @param {string} clase - Nombre de la clase
 */
function agregarClase(selector, clase) {
  const elemento = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (elemento) elemento.classList.add(clase);
}

/**
 * Elimina clase de elemento
 * @param {string|HTMLElement} selector - Selector CSS o elemento
 * @param {string} clase - Nombre de la clase
 */
function eliminarClase(selector, clase) {
  const elemento = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (elemento) elemento.classList.remove(clase);
}

// ============================================
// UTILIDADES DE RED
// ============================================

/**
 * Realiza petición fetch POST
 * @param {string} url - URL del servidor
 * @param {Object} datos - Datos a enviar
 * @returns {Promise}
 */
async function enviarDatos(url, datos) {
  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      throw new Error(`HTTP error! status: ${respuesta.status}`);
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Error en enviarDatos:', error);
    throw error;
  }
}

/**
 * Realiza petición fetch GET
 * @param {string} url - URL del servidor
 * @returns {Promise}
 */
async function obtenerDatos(url) {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`HTTP error! status: ${respuesta.status}`);
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Error en obtenerDatos:', error);
    throw error;
  }
}

// ============================================
// UTILIDADES DE NOTIFICACIONES
// ============================================

/**
 * Muestra notificación emergente (toast)
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo: 'success', 'error', 'info', 'warning'
 * @param {number} duracion - Duración en ms (0 para permanente)
 */
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.textContent = mensaje;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;

  const colores = {
    success: 'background: #28a745;',
    error: 'background: #dc3545;',
    warning: 'background: #ffc107; color: #333;',
    info: 'background: #17a2b8;'
  };

  toast.style.cssText += colores[tipo] || colores.info;

  document.body.appendChild(toast);

  if (duracion > 0) {
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duracion);
  }
}


function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  
  if (navLinks) {
    navLinks.classList.toggle('nav-active');
    console.log("Menú alternado"); // Para que verifiques en consola que funciona
  } else {
    console.error("No se encontró el elemento .nav-links");
  }
}