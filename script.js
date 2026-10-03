// CONFIGURAÇÃO DA PLANILHA (Substitua pela sua URL do SheetDB quando criar a sua própria)
const API_URL = "https://sheetdb.io/api/v1/u1wlzy3y54ge6"; 

const listaContainer = document.getElementById('lista-presentes');
const loadingElement = document.getElementById('loading');

async function carregarPresentes() {
    try {
        const resposta = await fetch(API_URL);
        const presentes = await resposta.json();
        
        listaContainer.innerHTML = '';
        
        presentes.forEach(item => {
            const card = document.createElement('div');
            card.className = "presente-card";
            
            const jaReservado = item.status && item.status.toLowerCase() === 'reservado';
            
            let botaoHTML = '';
            if (jaReservado) {
                botaoHTML = `
                    <button disabled class="btn-indisponivel">
                        Já Escolhido &hearts;
                    </button>
                `;
            } else {
                botaoHTML = `
                    <button onclick="reservarPresente('${item.id}', '${item.presente}')" class="btn-presentear">
                        Presentear
                    </button>
                `;
            }

            const imagemUrl = item.imagem && item.imagem.trim() !== "" ? item.imagem : "https://unsplash.com";

            card.innerHTML = `
                <div>
                    <div class="container-imagem">
                        <img src="${imagemUrl}" alt="${item.presente}" class="${jaReservado ? 'reservado-img' : ''}">
                        ${jaReservado ? '<span class="tag-reservado">Reservado</span>' : ''}
                    </div>
                    <div class="titulo-presente">
                        <h3>${item.presente}</h3>
                    </div>
                </div>
                <div class="container-botao">
                    ${botaoHTML}
                </div>
            `;
            
            listaContainer.appendChild(card);
        });

        loadingElement.classList.add('hidden');
        listaContainer.classList.remove('hidden');

    } catch (er) {
        console.error("Erro ao buscar presentes:", er);
        loadingElement.innerHTML = `<p style="color: red; font-weight: 300;">Não foi possível carregar a lista. Por favor, tente novamente mais tarde.</p>`;
    }
}

async function reservarPresente(id, nomePresente) {
    const confirmar = confirm(`Você deseja escolher o presente: "${nomePresente}"?\n\nAo confirmar, ele será reservado para você.`);
    if (!confirmar) return;

    loadingElement.classList.remove('hidden');
    listaContainer.classList.add('hidden');

    try {
        const resposta = await fetch(`${API_URL}/id/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'reservado'
            })
        });

        if (resposta.ok) {
            alert(`Muito obrigado! O presente "${nomePresente}" foi reservado com sucesso.`);
        } else {
            alert("Ocorreu um erro ao reservar o presente. Tente novamente.");
        }
        
        carregarPresentes();

    } catch (er) {
        console.error("Erro ao reservar presente:", er);
        alert("Erro de conexão. Tente novamente.");
        carregarPresentes();
    }
}

document.addEventListener('DOMContentLoaded', carregarPresentes);
