
// ========================================
// LOADING SCREEN
// ========================================
window.addEventListener('load', function () {
    setTimeout(function () {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 2500);
});
let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 4;

loadMoreBtn.onclick = () => {
    let boxes = [...document.querySelectorAll('.box-container .box')];
    for (var i = currentItem; i < currentItem + 4; i++) {
        if (boxes[i]) {
            boxes[i].style.display = 'inline-block';
        }
    }
    currentItem += 4;
    if (currentItem >= boxes.length) {
        loadMoreBtn.style.display = 'none';
    }
}

//carrito 

const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const procesarPagoBtn = document.getElementById('procesar-pago');
const totalCarrito = document.getElementById('total-carrito');

// Agregar event listener para ofertas
const ofertas = document.querySelector('.ofertas-content');

cargarEventListeners();
function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    if (ofertas) {
        ofertas.addEventListener('click', comprarElemento);
    }
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    procesarPagoBtn.addEventListener('click', procesarPago);
}

function comprarElemento(e) {
    e.preventDefault();

    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);

        // Visual feedback
        e.target.textContent = '✓ Agregado';
        e.target.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            e.target.textContent = 'Agregar al carrito';
            e.target.style.backgroundColor = '';
        }, 1500);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id')
    }
    insertarCarrito(infoElemento);
}

function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
    
        <td>
        <img src="${elemento.imagen}" width=100  />
        </td>

        <td>
        ${elemento.titulo}
        </td>

        <td>
        ${elemento.precio}
        </td>

        <td>

        <a href="#" class="borrar" data-id="${elemento.id}" >X</a>

        </td>
    `;

    lista.appendChild(row);
    calcularTotal();
}

function eliminarElemento(e) {
    e.preventDefault();
    let elemento,
        elementoId;

    if (e.target.classList.contains('borrar')) {
        e.target.parentElement.parentElement.remove();
        elemento = e.target.parentElement.parentElement;
        elementoId = elemento.querySelector('a').getAttribute('data-id');
        calcularTotal();
    }
}

function vaciarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    calcularTotal();
    return false;
}

function calcularTotal() {
    let total = 0;
    const filas = lista.querySelectorAll('tr');

    filas.forEach(fila => {
        const precioTexto = fila.children[2].textContent;
        const precio = parseFloat(precioTexto.replace('$', ''));
        total += precio;
    });

    totalCarrito.textContent = `$${total.toFixed(2)}`;
}

function procesarPago(e) {
    e.preventDefault();

    const filas = lista.querySelectorAll('tr');

    if (filas.length === 0) {
        alert('⚠️ Tu carrito está vacío. Agrega productos antes de procesar el pago.');
        return;
    }

    const total = totalCarrito.textContent;

    // Simular proceso de pago
    const confirmar = confirm(`💳 ¿Confirmar pago de ${total}?\n\nSe procesará tu pedido y recibirás una confirmación por email.`);

    if (confirmar) {
        // Mostrar mensaje de éxito
        alert(`✅ ¡Pago procesado exitosamente!\n\nTotal: ${total}\n\nGracias por tu compra en Sabor Gourmet.\nTu pedido llegará en 30-45 minutos.`);

        // Vaciar carrito después del pago
        vaciarCarrito();
    }
}

// Sistema de Delivery en Tiempo Real

function actualizarEstadoDelivery() {
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    const dia = ahora.getDay(); // 0 = Domingo, 6 = Sábado

    const deliveryStatus = document.getElementById('delivery-status');
    const currentHours = document.getElementById('current-hours');

    // Horario: 7:00 AM - 11:00 PM (23:00) todos los días
    const horaApertura = 7;
    const horaCierre = 23;

    const horaActual = hora + (minutos / 60);

    if (horaActual >= horaApertura && horaActual < horaCierre) {
        // Restaurante ABIERTO
        deliveryStatus.textContent = 'Abierto ahora - Delivery disponible';
        deliveryStatus.className = 'status-open';

        // Calcular tiempo hasta el cierre
        const horasRestantes = Math.floor(horaCierre - horaActual);
        const minutosRestantes = Math.floor((horaCierre - horaActual - horasRestantes) * 60);

        if (horasRestantes < 2) {
            deliveryStatus.textContent = `Cierra en ${horasRestantes}h ${minutosRestantes}min`;
        }
    } else {
        // Restaurante CERRADO
        deliveryStatus.textContent = 'Cerrado - Abre a las 7:00 AM';
        deliveryStatus.className = 'status-closed';

        // Calcular tiempo hasta la apertura
        let horasHastaApertura;
        if (horaActual < horaApertura) {
            horasHastaApertura = horaApertura - horaActual;
        } else {
            horasHastaApertura = (24 - horaActual) + horaApertura;
        }

        const horas = Math.floor(horasHastaApertura);
        const mins = Math.floor((horasHastaApertura - horas) * 60);

        if (horas < 12) {
            deliveryStatus.textContent = `Abre en ${horas}h ${mins}min`;
        }
    }

    // Actualizar horario mostrado
    currentHours.textContent = 'Lun-Dom: 7:00 AM - 11:00 PM';
}

// Actualizar al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    actualizarEstadoDelivery();

    // Actualizar cada minuto
    setInterval(actualizarEstadoDelivery, 60000);
});

// ========================================
// RESERVATION SYSTEM
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    const reservaForm = document.getElementById('reserva-form');
    const fechaInput = document.getElementById('fecha');

    // Set minimum date to today
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.min = today;
    }

    if (reservaForm) {
        reservaForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                personas: document.getElementById('personas').value,
                email: document.getElementById('email').value,
                comentarios: document.getElementById('comentarios').value
            };

            // Generate reservation number
            const numeroReserva = 'SG' + Date.now().toString().slice(-6);

            // Show confirmation
            document.querySelector('.reserva-form').style.display = 'none';
            document.getElementById('reserva-confirmacion').style.display = 'block';
            document.getElementById('numero-reserva').textContent = numeroReserva;

            // Log reservation (in production, send to server)
            console.log('Nueva Reserva:', formData, 'Número:', numeroReserva);

            // Scroll to confirmation
            document.getElementById('reserva-confirmacion').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

function resetReserva() {
    document.querySelector('.reserva-form').style.display = 'block';
    document.getElementById('reserva-confirmacion').style.display = 'none';
    document.getElementById('reserva-form').reset();
    document.querySelector('.reservas').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// DARK MODE TOGGLE
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check for saved dark mode preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function () {
            body.classList.toggle('dark-mode');

            // Save preference
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
});
