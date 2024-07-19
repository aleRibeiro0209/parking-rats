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
        inputNome.value = inputNome.value.toLowerCase();
        inputNome.value = inputNome.value.replace(/\b\w/g, char => char.toUpperCase());

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
        obj = null;
        return;
    });

    noButton.addEventListener('click', () => {
        obj.checked = false;
        obj = null;
        return;
    });
}

window.addEventListener('DOMContentLoaded', () => {
    atualizarPlanilha();
});

function filterTable(inputObj) {
    var filter, table, tr, td, i, j, txtValue;
    filter = inputObj.value.toLowerCase();
    table = document.getElementById('tableBody');
    tr = table.getElementsByTagName('tr');
    for (i = 0; i < tr.length; i++) {
        tr[i].style.display = 'none'; // Esconde todas as linhas
        td = tr[i].getElementsByTagName('td');
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    tr[i].style.display = ''; // Mostra a linha se a busca corresponder
                    break; // Para de verificar outras células na linha
                }
            }
        }
    }

    inputObj.addEventListener('blur', () => {
        if (filter === "todos") {
            for (i = 0; i < tr.length; i++) {
                tr[i].style.display = '';
            }
        }
        inputObj.value = null;
    });
}