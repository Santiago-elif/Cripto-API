const cryptoSelector = document.querySelector('#criptomonedas');
const monedaSelector = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const busqueda = {

    moneda: '',
    criptomoneda : ''

}

// Creacion del promise.

const cryptoObtener  = criptomonedas => new Promise(resolve => {

    resolve(criptomonedas);

});

document.addEventListener('DOMContentLoaded', () => {

    cryptoConsultar();

    formulario.addEventListener('submit', submitFormulario);

    cryptoSelector.addEventListener('change', cryptoLeer);
    monedaSelector.addEventListener('change', cryptoLeer);
})

function cryptoConsultar(){

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';

    fetch(url)
        .then( respuesta => respuesta.json() ) 
        .then( resultado => cryptoObtener(resultado.Data))
        .then( criptomonedas => cryptoSeleccionar(criptomonedas) )

}

function cryptoSeleccionar(criptomonedas){

    criptomonedas.forEach(cripto => {

        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');

        option.value = Name;

        option.textContent = FullName;

        cryptoSelector.appendChild(option);

    })

}

function cryptoLeer(e){

    busqueda[e.target.name] = e.target.value;

}

function submitFormulario(e){

    e.preventDefault();
    
    // Validar formulario.

    const {moneda, criptomoneda} = busqueda;

    if(moneda === '' || criptomoneda === '' ){

        mostrarAlerta('AMBOS CAMPOS SON OBLIGATORIOS!');

        return;

    }

    // Consultar los resultados mediante la API.

    consultarAPI();

}

function mostrarAlerta(msg){

    const existeError = document.querySelector('.error');

    if(!existeError){

        const divMensaje = document.createElement('div');
    
        divMensaje.classList.add('error');

        // Mensaje de error.

        divMensaje.textContent = msg;

        formulario.appendChild(divMensaje);

        setTimeout(() => {

            divMensaje.remove();

        }, 3000);

    }

}

function consultarAPI(){

    const {moneda, criptomoneda} = busqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)

        .then( respuesta => respuesta.json())
        .then( cotizacion => {

            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);

        })

}

function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualización = document.createElement('p');
    ultimaActualización.innerHTML = `<p>Última Actualización <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualización);

}


function limpiarHTML(){

    while(resultado.firstChild){

        resultado.removeChild(resultado.firstChild);

    }

}

function mostrarSpinner(){

    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);

}