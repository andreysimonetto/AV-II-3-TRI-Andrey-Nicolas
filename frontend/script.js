// Endereco da API do Spring Boot.
// No GitHub Codespaces o navegador NAO enxerga "localhost", entao a URL e
// montada automaticamente trocando a porta do front (5500) pela do back (8080).
// Rodando na sua maquina, usa localhost normalmente.
const API_URL = (() => {
    const host = window.location.hostname;
    if (host.endsWith('.app.github.dev')) {
        const hostBackend = host.replace(/-\d+(\.app\.github\.dev)$/, '-8080$1');
        return `https://${hostBackend}/api/publicacoes`;
    }
    return 'http://localhost:8080/api/publicacoes';
})();

// ---------- PAGINA INICIAL ----------
const listaPublicacoes = document.getElementById('lista-publicacoes');
if (listaPublicacoes) {
    carregarPublicacoes();
}

let todasPublicacoes = [];
let categoriaAtual = 'Todas';

async function carregarPublicacoes() {
    const msgCarregando = document.getElementById('mensagem-carregando');
    const msgVazia = document.getElementById('mensagem-vazia');
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('Erro ao buscar');
        todasPublicacoes = await resposta.json();
        msgCarregando.style.display = 'none';
        if (todasPublicacoes.length === 0) {
            msgVazia.style.display = 'block';
        } else {
            msgVazia.style.display = 'none';
            criarFiltros(todasPublicacoes);
            mostrarPublicacoes(todasPublicacoes);
        }
    } catch (erro) {
        msgCarregando.textContent = 'Erro ao carregar os artigos. O backend esta rodando?';
        console.error(erro);
    }
}

function criarFiltros(publicacoes) {
    const containerFiltros = document.getElementById('filtros-categoria');
    const categorias = ['Todas', ...new Set(publicacoes.map(p => p.categoria))];
    containerFiltros.innerHTML = '';
    categorias.forEach(cat => {
        const botao = document.createElement('button');
        botao.textContent = cat;
        botao.classList.add('filtro-btn');
        if (cat === 'Todas') botao.classList.add('ativo');
        botao.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');
            categoriaAtual = cat;
            aplicarFiltros();
        });
        containerFiltros.appendChild(botao);
    });
}

function mostrarPublicacoes(publicacoes) {
    const container = document.getElementById('lista-publicacoes');
    const msgVazia = document.getElementById('mensagem-vazia');
    container.innerHTML = '';
    if (publicacoes.length === 0) {
        msgVazia.style.display = 'block';
        return;
    }
    msgVazia.style.display = 'none';
    publicacoes.forEach(pub => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <span class="categoria">${pub.categoria}</span>
            <h3>${pub.titulo}</h3>
            <p class="data">${formatarData(pub.dataPublicacao)}</p>
            <p>${pub.descricao || 'Sem descricao.'}</p>
            <a href="artigo.html?id=${pub.id}">Ler artigo completo</a>
        `;
        container.appendChild(card);
    });
}

function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
}

// Pesquisa e filtros
const campoPesquisa = document.getElementById('campo-pesquisa');
if (campoPesquisa) {
    campoPesquisa.addEventListener('input', aplicarFiltros);
}

function aplicarFiltros() {
    let resultado = todasPublicacoes;
    if (categoriaAtual !== 'Todas') {
        resultado = resultado.filter(p => p.categoria === categoriaAtual);
    }
    const termo = campoPesquisa ? campoPesquisa.value.toLowerCase() : '';
    if (termo) {
        resultado = resultado.filter(p =>
            p.titulo.toLowerCase().includes(termo) ||
            (p.descricao && p.descricao.toLowerCase().includes(termo))
        );
    }
    mostrarPublicacoes(resultado);
}

// ---------- PAGINA DE ARTIGO ----------
const artigoCompleto = document.getElementById('artigo-completo');
if (artigoCompleto) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        carregarArtigo(id);
    } else {
        document.getElementById('mensagem-erro').style.display = 'block';
    }
}

async function carregarArtigo(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        if (!resposta.ok) throw new Error('Nao encontrado');
        const pub = await resposta.json();
        artigoCompleto.innerHTML = `
            <h1>${pub.titulo}</h1>
            <p class="meta">Categoria: ${pub.categoria} | Publicado em: ${formatarData(pub.dataPublicacao)}</p>
            <div class="conteudo">${pub.conteudo}</div>
        `;
    } catch (erro) {
        document.getElementById('mensagem-erro').style.display = 'block';
        artigoCompleto.style.display = 'none';
        console.error(erro);
    }
}

// ---------- PAGINA DE CRIACAO ----------
const formCriar = document.getElementById('form-criar');
if (formCriar) {
    formCriar.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const titulo = document.getElementById('titulo').value.trim();
        const categoria = document.getElementById('categoria').value;
        const descricao = document.getElementById('descricao').value.trim();
        const conteudo = document.getElementById('conteudo').value.trim();

        const msgErro = document.getElementById('mensagem-erro');
        const msgSucesso = document.getElementById('mensagem-sucesso');

        // Validacao simples
        if (titulo === '' || categoria === '' || conteudo === '') {
            msgErro.style.display = 'block';
            msgErro.textContent = 'Preencha todos os campos obrigatorios (Titulo, Categoria e Conteudo).';
            msgSucesso.style.display = 'none';
            return;
        }

        const novaPublicacao = {
            titulo: titulo,
            categoria: categoria,
            descricao: descricao,
            conteudo: conteudo
        };

        try {
            const resposta = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaPublicacao)
            });

            if (!resposta.ok) throw new Error('Erro ao cadastrar');

            msgSucesso.style.display = 'block';
            msgErro.style.display = 'none';
            formCriar.reset();

            // Redireciona para a home apos 1.5 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (erro) {
            msgErro.style.display = 'block';
            msgErro.textContent = 'Erro ao cadastrar a publicacao. Tente novamente.';
            msgSucesso.style.display = 'none';
            console.error(erro);
        }
    });
}
