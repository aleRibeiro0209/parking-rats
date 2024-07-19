function overlay(idOverlay) {
    const overlay = document.getElementById(`${idOverlay}`);
    overlay.classList.toggle("ativo");
    return;
}

function cadastrarCostumer() {
    const inputNome = document.getElementById('nome');
    const inputPlaca = document.getElementById('placa');
    
    if (inputNome.value && inputPlaca.value) {
        const data = new Date();
        let dataAtual = data.toLocaleDateString();
        dataAtual = dataAtual.replaceAll("/", "-");
        dataAtual += " " + data.toLocaleTimeString();
        inputPlaca.value = inputPlaca.value.toUpperCase();
        console.log(inputPlaca.value)

        const xmlHttp = new XMLHttpRequest;
        const url = 'http://localapi.allparking.com.br/registros';
        const params = {
            nomeCliente: inputNome.value,
            placaCarro: inputPlaca.value,
            dataHoraEntrada: dataAtual
        };

        inputNome.value = null;
        inputPlaca.value = null;
        const paramsJson = JSON.stringify(params);

        xmlHttp.open('POST', url, true);
        xmlHttp.setRequestHeader('Content-type', 'application/json');

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 201) {
                overlay('overlay-register');
                atualizarPlanilha();
            }
        }

        xmlHttp.send(paramsJson);
    } else {
        alert('Preencha todos os dados');
    }
}

function atualizarPlanilha() {
    const xmlHttp = new XMLHttpRequest;
    const url = 'http://localapi.allparking.com.br/registros';

    xmlHttp.open('GET', url);
    xmlHttp.setRequestHeader('Content-type', 'application/json');

    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            const lista = xmlHttp.responseText;
            listaObj = JSON.parse(lista);
            for(let i = listaObj.length - 1; i >= 0; i--) {
                if (!document.getElementById(`${listaObj[i].id}`)) {
                    const tbody = document.getElementById('tableBody');
                    let tr = document.createElement('tr');
                    tr.id = `${listaObj[i].id}`;
                    tr.innerHTML = `<td>${listaObj[i].id}</td>
                    <td>${listaObj[i].nomeCliente}</td>
                    <td>${listaObj[i].placaCarro}</td>
                    <td>${listaObj[i].dataHoraEntrada}</td>
                    <td>${listaObj[i].dataHoraSaida}</td>
                    <td>${listaObj[i].precoId}</td>
                    <td>${listaObj[i].dataHoraSaida == null ? 'Estacionado' : 'Retirado'}</td>
                    <td>${listaObj[i].valorTotal}</td>
                    <td><input id=radio${listaObj[i].id} ${listaObj[i].dataHoraSaida == null ? '' : 'checked disabled'} type="checkbox" onchange="registrarSaida(this)"></td>`;
                    tbody.insertBefore(tr, tbody.firstChild);
                } else {
                    const tr = document.getElementById(`${listaObj[i].id}`);
                    tr.innerHTML = `<td>${listaObj[i].id}</td>
                    <td>${listaObj[i].nomeCliente}</td>
                    <td>${listaObj[i].placaCarro}</td>
                    <td>${listaObj[i].dataHoraEntrada}</td>
                    <td>${listaObj[i].dataHoraSaida}</td>
                    <td>${listaObj[i].precoId}</td>
                    <td>${listaObj[i].dataHoraSaida == null ? 'Estacionado' : 'Retirado'}</td>
                    <td>${listaObj[i].valorTotal}</td>
                    <td><input id=radio${listaObj[i].id} ${listaObj[i].dataHoraSaida == null ? '' : 'checked disabled'} type="checkbox" onchange="registrarSaida(this)"></td>`;
                }
            }
        }
    }
    xmlHttp.send();
}

function registrarSaida(obj) {
    overlay('overlay-exit');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');

    yesButton.addEventListener('click', () => {
        let radioId = obj.id;
        radioId = radioId.replace('radio', '');
        const xmlHttp = new XMLHttpRequest;
        const url = `http://localapi.allparking.com.br/registros/${radioId}`;

        xmlHttp.open('DELETE', url);
        xmlHttp.setRequestHeader('Content-type', 'application/json');

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                atualizarPlanilha();
            }
        }
        xmlHttp.send();
        return;
    });

    noButton.addEventListener('click', () => {
        obj.checked = false;
        return;
    });
}