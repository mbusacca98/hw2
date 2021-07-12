//Event Listener
document.addEventListener("DOMContentLoaded", function(event) { 
    riempiSaloni();
    loadSaloniPreferiti();
    loadAppuntamenti();

    document.querySelector('.all .search input').addEventListener("keyup", searchAllSaloni);
    let temp = document.querySelectorAll('.header_mobile .fas');
    temp.forEach(element => {
        element.addEventListener('click', openMenu);
    })
    temp = document.querySelectorAll('.close i');
    temp.forEach(element => {
        element.addEventListener('click', closeMenu);
    })

    temp = document.querySelectorAll('.overlay_div > i');
    temp.forEach(element => {
        element.addEventListener('click', closeOverlay);
    })

    document.querySelector('.geolocation-search > div').addEventListener("click", geo);
    document.querySelector('.geolocation-search .fa-times').addEventListener("click", clearGeo);

    document.querySelector('.addAppuntamento > div').addEventListener('click', openAddAppuntamento);
    document.querySelector('#addAppuntamento #salone').addEventListener('blur', loadServiziSalone);
    document.querySelector('#addAppuntamento form').addEventListener('submit', prenota);

    temp = document.querySelectorAll('header .menu > div');
    temp.forEach(element => {
        element.addEventListener('click', changePage);
    })

    controlEmpty();
});

function controlEmpty(){
    let div = document.querySelectorAll('.div_appuntamento');
    if(div.length == 0){
        document.querySelector('#body_prenotazioni').classList.add('emptyImg');
        document.querySelector('.emptyDiv').classList.remove('hidden');
    } else{
        document.querySelector('.emptyDiv').classList.add('hidden');
        document.querySelector('#body_prenotazioni').classList.remove('emptyImg');
    }
}

function changePage(e){
    const pagina = e.currentTarget.dataset.page;
    const div = document.querySelectorAll('.body');
    const menu = document.querySelectorAll('header .menu > div');
    const url = window.location.href;
    const urlParam = window.location.search;
    
    if(urlParam.length == 0){
        let urlTemp = url + "?page=" + pagina;
        window.history.replaceState('', '', urlTemp);
    } else{
        let urlTemp = url.split('?');
        urlTemp = urlTemp[0] + "?page=" + pagina;
        window.history.replaceState('', '', urlTemp);
    }

    console.log(url);

    div.forEach(element => {
        if(element.dataset.page == pagina){
            element.classList.remove('hidden');
        } else{
            element.classList.add('hidden');
        }
    });

    menu.forEach(element => {
        if(element.dataset.page == pagina){
            element.classList.add('sel');
        } else{
            element.classList.remove('sel');
        }
    });

    controlEmpty();
}

function disdiciAppuntamento(e){
    const parentDiv = e.target.parentElement.parentElement;;
    const parentContainer = parentDiv.parentElement.parentElement;

    async function deleteData(){
        const data = parentDiv.querySelector('#dataApp').innerHTML;
        const salone = parentDiv.parentElement.parentElement.querySelector('#nome_saloneApp').dataset.iva;

        const url = "disdettaAppCliente/"+data+"/"+salone;

        var response = await fetch(url);

        return response.json();
    }
    

    deleteData().then(response => {
        if(response == "Appuntamento disdetto"){
            parentContainer.parentElement.classList.add('hidden');
        }
    });
}

function confermaDisdetta(e){
    let divParent = e.target.parentElement;
    console.log(divParent);
    e.currentTarget.classList.add('hidden');
    divParent.querySelector('.confirm').classList.remove('hidden');
    divParent.querySelector('.confirm').addEventListener('click', disdiciAppuntamento);
}

function loadAppuntamenti(){
    async function getData(){
        const url = "loadAppuntamentiCliente";

        var response = await fetch(url);

        return response.json();
    }
    

    getData().then(response => {
        if(response != "Connessione al db non riuscita."){
            response.forEach(element => {
                const dataInizio = element.dataInizio;
                const salone = element.nomeSalone;
                const citta = element.citta;
                const indirizzo = element.indirizzo;
                const servizio = element.nomeServizio;
                const durata = element.durata;
                const prezzo = element.prezzo;
                const img = element.img;
                const iva = element.Iva;

                var template = document.querySelector("#template_appuntamento");
                var el;
                template = template.content.cloneNode(true);
        
                var p = template.querySelectorAll(".nome_salone");
                p.forEach(elements => {
                    elements.innerHTML += "<br>" + salone;
                    elements.dataset.iva = iva;
                });
                
                p = template.querySelector("#cittaApp");
                p.textContent = citta;
        
                p = template.querySelector("#indirizzoApp");
                p.textContent = indirizzo;
        
                p = template.querySelector("#mappaApp");
                p.dataset.address = indirizzo + ", " + citta;
                p.addEventListener("click", initMap);
        
                p = template.querySelector("#dataApp");
                p.textContent = dataInizio;

                p = template.querySelector("#servizioApp");
                p.textContent = servizio;

                p = template.querySelector("#durataApp");
                p.textContent = durata + 'min';

                p = template.querySelector("#prezzoApp");
                p.textContent = prezzo + '€';
        
                var arrayElement = template.querySelectorAll(".button-desc");
                arrayElement.forEach(element => {
                    element.addEventListener("click", dettagli);
                });

                template.querySelector(".disdettaApp > p").addEventListener("click", confermaDisdetta);

                template.querySelector(".div_appuntamento").style.backgroundImage = "url('img/copertine_saloni/" + img + "')" ;
                
                document.querySelector(".body_all_appuntamenti").appendChild(template);

                controlEmpty();
            });
        }
    }) 

    
}

function prenota(e){
    e.preventDefault();
    async function insertdata(){
        const url = "insertAppuntamento";
        const form = e.currentTarget;
            const formData = new FormData(form);
            var div = document.querySelectorAll('#addAppuntamento form input');
            div.forEach(element => {
                var name = element.name;
                var val = element.value;
                formData.append(name, val);
            });
            div = document.querySelectorAll('#addAppuntamento form select');
            div.forEach(element => {
                var name = element.name;
                var val = element.value;
                formData.append(name, val);
            });

            var response = await fetch(url, {
                headers: {
                    "X-CSRF-Token": document.querySelector('meta[name="_token"]').dataset.token
                },
                method: "POST",
                body: formData,
            });

            return response.json();
    }

    insertdata().then(response => {
        if(response != "Connessione al db non riuscita."){
            response.forEach(element => {
                if(response == "Appuntamento inserito correttamente."){
                    console.log(response[0]);
                    document.querySelector('#addAppuntamento .errorDiv > p').innerHTML = response[0];
                    document.querySelector('#addAppuntamento .errorDiv').classList.add('ok');
                    document.querySelector('#addAppuntamento .errorDiv').classList.remove('error');
                    document.querySelector('#addAppuntamento .errorDiv').classList.remove('hidden');
                } else{
                    document.querySelector('#addAppuntamento .errorDiv > p').innerHTML = response[0];
                    document.querySelector('#addAppuntamento .errorDiv').classList.remove('ok');
                    document.querySelector('#addAppuntamento .errorDiv').classList.add('error');
                    document.querySelector('#addAppuntamento .errorDiv').classList.remove('hidden');
                }
            });
        }
    });

    controlEmpty();
}

function openAddAppuntamento(e){
    document.querySelector('#addAppuntamento').classList.toggle('hidden');
    loadSelectSaloniAddApp();
}

function loadServiziSalone(){
    let form = document.querySelector('#addAppuntamento form');
    let salone = form.querySelector('#salone').value;
    let selectServizi = form.querySelector('#servizioAddApp');

    async function getServizi(){
        const url = "loadServiziSalone/"+salone;

        var response = await fetch(url);

        return response.json();
    }

    getServizi().then(response => {
        console.log(response);
        if(response != "Connessione al db non riuscita."){
            response.forEach(element => {

                const idServizio = element.id;
                const nomeServizio = element.nome; 
                
                let option = document.createElement("option");
                option.value = idServizio;
                option.text = nomeServizio;
                selectServizi.appendChild(option);
            });
        }
    });

    controlEmpty();
}

function loadSelectSaloniAddApp(){
    let form = document.querySelector('#addAppuntamento form');
    let selectSalone = form.querySelector('#salone');
    let selectServizi = form.querySelector('#servizioAddApp');
    let cf = document.querySelector('.addAppuntamento > div').dataset.cf;

    async function getPreferiti(){
        const url = "loadSaloniPreferiti/"+cf;

        var response = await fetch(url);

        return response.json();
    }

    getPreferiti().then(response => {
        if(response != "Connessione al db non riuscita."){
            response.forEach(element => {
                let optionSalone = selectSalone.querySelectorAll('option');
                let trovato = false;
                
                const iva = element.idSalone;
                const nome = element.nome;

                    optionSalone.forEach(element => {
                        if(element.value.localeCompare(iva) == 0){
                            trovato = true;
                        }
                    });
                
                if(trovato == false){
                    let option = document.createElement("option");
                    option.value = iva;
                    option.text = nome;
                    selectSalone.appendChild(option);
                }
            });
        }
    });
}

function loadSaloniPreferiti(){
    async function getData(){
        const cf = document.querySelector('.title p').dataset.cf;
        const url = "loadSaloniPreferiti/"+cf;

        var response = await fetch(url);

        return response.json();
    }

    getData().then(response => {
        if(response != "Connessione al db non riuscita."){
            response.forEach(element => {
                const pIva = element.Iva;
                const nome = element.nome;
                const citta = element.citta;
                const indirizzo = element.indirizzo;
                const sesso = element.sesso;
                const img = element.img;
    
                var template = document.querySelector("#template_allSaloni");
                var el;
                template = template.content.cloneNode(true);
        
                var p = template.querySelectorAll(".nome_salone");
                p.forEach(elements => {
                    elements.textContent = nome;
                });
                
                p = template.querySelector("#citta");
                p.textContent = citta;
        
                p = template.querySelector("#indirizzo");
                p.textContent = indirizzo;
        
                p = template.querySelector("#mappa");
                p.dataset.address = indirizzo + ", " + citta;
                p.addEventListener("click", initMap);
        
                p = template.querySelector("#sesso");
                p.textContent = sesso;
        
                var arrayElement = template.querySelectorAll(".button-desc");
                arrayElement.forEach(element => {
                    element.addEventListener("click", dettagliSalone);
                });
        
                arrayElement = template.querySelectorAll(".preferito");
                arrayElement.forEach(element => {
                    element.addEventListener("click", addPreferito);
                });
        
                template.querySelector('.div_salone').dataset.id = pIva;
                template.querySelector('.preferito').dataset.id = pIva;
                template.querySelector('.preferito').dataset.id_salone = pIva;
        
                template.querySelector('#qrCode').addEventListener('click', getQrCode);
                template.querySelector('#qrCode').dataset.dati = nome;
        
                template.querySelector(".div_salone").style.backgroundImage = "url('img/copertine_saloni/" + img + "')" ;
                template.querySelector('.preferito').dataset.preferito = true;
        
                document.querySelector('.body_preferiti').appendChild(template);
                
                var divPreferito = document.querySelector(".body_all_saloni .div_salone[data-id='"+pIva+"']");
                divPreferito.querySelector('.preferito').dataset.preferito = true;
            });
        }
    })
}

function dettagli(event){
    var parent = event.target.parentElement.parentElement.parentElement;
    parent.querySelector("#titleApp").classList.toggle("hidden");
    parent.querySelector("#descApp").classList.toggle("hidden");    
}

function dettagliSalone(event){
    var parent = event.target.parentElement.parentElement.parentElement;
    parent.querySelector("#title").classList.toggle("hidden");
    parent.querySelector("#desc").classList.toggle("hidden");    
}

function riempiSaloni(){

    if(1){
        async function getData(){
            const url = "loadSaloni";

            var response = await fetch(url);

            return response.json();
        }
        

        getData().then(response => {
            if(response != "Connessione al db non riuscita."){
                response.forEach(element => {
                    console.log(element);
                    const pIva = element.Iva;
                    const nome = element.nome;
                    const citta = element.citta;
                    const indirizzo = element.indirizzo
                    const sesso = element.sesso;
                    const img = element.img;
    
                    var template = document.querySelector("#template_allSaloni");
                    var el;
                    template = template.content.cloneNode(true);
            
                    var p = template.querySelectorAll(".nome_salone");
                    p.forEach(elements => {
                        elements.textContent = nome;
                    });
                    
                    p = template.querySelector("#citta");
                    p.textContent = citta;
            
                    p = template.querySelector("#indirizzo");
                    p.textContent = indirizzo;
            
                    p = template.querySelector("#mappa");
                    p.dataset.address = indirizzo + ", " + citta;
                    p.addEventListener("click", initMap);
            
                    p = template.querySelector("#sesso");
                    p.textContent = sesso;
            
                    var arrayElement = template.querySelectorAll(".button-desc");
                    arrayElement.forEach(element => {
                        element.addEventListener("click", dettagliSalone);
                    });
            
                    arrayElement = template.querySelectorAll(".preferito");
                    arrayElement.forEach(element => {
                        element.addEventListener("click", addPreferito);
                    });
            
                    template.querySelector('.div_salone').dataset.id = pIva;
                    template.querySelector('.preferito').dataset.id = pIva;
                    template.querySelector('.preferito').dataset.id_salone = pIva;
            
                    template.querySelector('#qrCode').addEventListener('click', getQrCode);
                    template.querySelector('#qrCode').dataset.dati = nome;
            
                    template.querySelector(".div_salone").style.backgroundImage = "url('img/copertine_saloni/" + img + "')" ;
            
                    document.querySelector(".body_all_saloni").appendChild(template);
            
                });
            }
        }) 
    }
}

function getQrCode(event){
    let salone = event.currentTarget.dataset.dati;
    let url = "https://api.qrserver.com/v1/create-qr-code/?data=" + salone;

    fetch(url)
        .then(onSuccess)
        .then(onPhoto);

    function onSuccess(response){
        if(response.status === 200 && response.ok === true){
            return response.url;
        }
    }

    function onPhoto(url){
        document.querySelector('#qrCode_overlay > img').src = url;
        document.querySelector('#qrCode_overlay').classList.remove('hidden');
    }
}

function searchAllSaloni(){
    var text = document.querySelector('.all .search input').value;
    
    if(text != ''){
        var arrayDiv = document.querySelectorAll(".body_all_saloni > .div_salone");

        arrayDiv.forEach(element => {
            var nome = element.querySelector("#nome_salone").textContent;

            if(nome.toLowerCase().search(text.toLowerCase()) == -1){
                element.classList.add('hidden');
            } else{
                element.classList.remove('hidden');
            }
        });
    } else{
        var arrayDiv = document.querySelectorAll(".body_all_saloni > .div_salone");

        arrayDiv.forEach(element => {
            element.classList.remove('hidden');
        }); 
    }
}

function addPreferito(event){
    var dataPref = event.target.dataset.preferito;
    var id = event.target.dataset.id;

    if(dataPref == 'false'){
        event.target.dataset.preferito = 'true';

        async function getData(){
            const cf = document.querySelector('.title p').dataset.cf;
            const idSalone = event.target.dataset.id_salone;
            const url = "addSaloniPreferiti/"+cf+"/"+idSalone;

            var response = await fetch(url);

            return response.json();
        }
        

        getData().then(response => {
            if(response == 'Insert ok'){
                var template = document.querySelector(".div_salone[data-id='"+id+"']").cloneNode(true);
                var clone = template.cloneNode(true);

                var arrayElement = clone.querySelectorAll(".button-desc");
                arrayElement.forEach(element => {
                    element.addEventListener("click", dettagliSalone);
                });

                var p = clone.querySelector("#mappa");
                p.addEventListener("click", initMap);

                clone.querySelector('#qrCode').addEventListener('click', getQrCode);

                document.querySelector('.body_preferiti').appendChild(clone);
            }
        }); 
        
    } else if(dataPref == 'true'){
        
        const pIva = event.target.dataset.id;

        async function getData(){
            const cf = document.querySelector('.title p').dataset.cf;
            console.log(cf, pIva);
            const url = "removeSalonePreferito/"+cf+"/"+pIva;

            var response = await fetch(url);

            return response.json();
        }
        

        getData().then(response => {
            if(response == 'Deleted'){
                document.querySelector(".body_all_saloni .preferito[data-id='"+pIva+"']").dataset.preferito = 'false';
                document.querySelector(".body_preferiti .div_salone[data-id='"+pIva+"']").remove();
            }
        }); 

        
    }
}

function openMenu(){
    document.querySelector('header').style.display = "flex";
}

function closeMenu(){
    document.querySelector('header').style.display = "none";
}

function closeOverlay(events){
    let div = events.currentTarget.parentElement;
    div.classList.add('hidden');
}

//Map
let map;
let key = "AIzaSyBFlOKR1gNmS5gsyI6ha3j_IdL7WG9wxK4";

async function initMap(event){
    let address = event.currentTarget.dataset.address;
    let responseJson = await getLatLong(address);
    
    let latitude = responseJson.geometry.location.lat;
    let longitude = responseJson.geometry.location.lng;

    map = new google.maps.Map(document.querySelector("#maps_overlay > div"), {
        center: { lat: latitude, lng: longitude },
        zoom: 19,
    });

    new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        cursor: "normal"
    });

    document.querySelector('#maps_overlay').classList.remove('hidden');
}

async function getLatLong(address){
    let temp = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + key)
        .then(onResponse)
        .then(onJson);

    return temp;
}

function onResponse(response){
    return response.json();
}

function onJson(json){
    return json.results[0];
}

async function geo(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                let temp = await getLatLong(pos.lat + ", " + pos.lng);
                var city = temp.address_components[1].long_name;

                if(city !== ''){
                    var arrayDiv = document.querySelectorAll(".body_all_saloni > .div_salone");
            
                    arrayDiv.forEach(element => {
                        var nome = element.querySelector("#citta").textContent;
            
                        if(nome.toLowerCase().search(city.toLowerCase()) == -1){
                            element.classList.add('hidden');
                        } else{
                            element.classList.remove('hidden');
                        }
                    });
                } else{
                    var arrayDiv = document.querySelectorAll(".body_all_saloni > .div_salone");
            
                    arrayDiv.forEach(element => {
                        element.classList.remove('hidden');
                    }); 
                }

                document.querySelector('.geolocation-search .fa-times').classList.remove('hidden');
                
            }
        )
    }
}

function clearGeo(){
    document.querySelector('.geolocation-search .fa-times').classList.add('hidden');
    var arrayDiv = document.querySelectorAll(".body_all_saloni > .div_salone");

    arrayDiv.forEach(element => {
        element.classList.remove('hidden');
    });

}