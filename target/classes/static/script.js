// Variáveis globais
let graficos = {};
let simulacaoAutomatica = null;
let dadosAtuais = [];
let dadosFiltrados = [];
let paginaAtual = 1;
let registrosPorPagina = 10;
let periodoKPIs = '24h';
let modoEscuro = false;
let isTablet = false;
let isLandscape = false;

// Cache para otimização
let cacheDados = new Map();
let cacheTimeout = 30000; // 30 segundos
let debounceTimers = {};

// Configuração da API
const API_BASE_URL = 'http://localhost:8080/api/dados';

// Função debounce para otimizar chamadas
function debounce(func, wait) {
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(debounceTimers[func.name]);
            func(...args);
        };
        clearTimeout(debounceTimers[func.name]);
        debounceTimers[func.name] = setTimeout(later, wait);
    };
}

// Cache de dados com TTL
function getCachedData(key) {
    const cached = cacheDados.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        return cached.data;
    }
    return null;
}

function setCachedData(key, data) {
    cacheDados.set(key, {
        data: data,
        timestamp: Date.now()
    });
}

// Limpar cache antigo periodicamente
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cacheDados.entries()) {
        if (now - value.timestamp > cacheTimeout) {
            cacheDados.delete(key);
        }
    }
}, 60000); // Limpar a cada minuto

// Detectar dispositivo e orientação
function detectarDispositivo() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Detectar tablet (Samsung Galaxy Tab S6 Lite: 2000x1200)
    isTablet = (width >= 768 && width <= 1200) || (height >= 768 && height <= 1200);
    isLandscape = width > height;
    
    // Ajustar registros por página baseado no dispositivo
    if (isTablet) {
        registrosPorPagina = isLandscape ? 15 : 8;
    } else {
        registrosPorPagina = 10;
    }
    
    // Aplicar classes CSS baseadas no dispositivo
    document.body.classList.toggle('tablet-device', isTablet);
    document.body.classList.toggle('landscape-mode', isLandscape);
    
    console.log(`Dispositivo detectado: ${isTablet ? 'Tablet' : 'Desktop'}, Orientação: ${isLandscape ? 'Landscape' : 'Portrait'}`);
}

// Otimizar gráficos para tablets
function otimizarGraficosParaTablet() {
    if (!isTablet) return;
    
    // Ajustar opções dos gráficos para melhor visualização em tablet
    Object.values(graficos).forEach(grafico => {
        if (grafico && grafico.options) {
            // Ajustar tamanho da fonte
            if (grafico.options.plugins && grafico.options.plugins.title) {
                grafico.options.plugins.title.font = {
                    size: isLandscape ? 14 : 12
                };
            }
            
            // Ajustar legendas
            if (grafico.options.plugins && grafico.options.plugins.legend) {
                grafico.options.plugins.legend.labels = {
                    font: {
                        size: isLandscape ? 12 : 10
                    },
                    padding: isLandscape ? 15 : 10
                };
            }
            
            // Ajustar eixos
            if (grafico.options.scales) {
                Object.values(grafico.options.scales).forEach(scale => {
                    if (scale && scale.ticks) {
                        scale.ticks.font = {
                            size: isLandscape ? 11 : 9
                        };
                    }
                });
            }
            
            grafico.update('none'); // Atualizar sem animação para melhor performance
        }
    });
}

// Melhorar experiência de toque para tablets
function configurarTouchParaTablet() {
    if (!isTablet) return;
    
    // Adicionar feedback tátil para botões
    const botoes = document.querySelectorAll('.btn');
    botoes.forEach(botao => {
        botao.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        botao.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Melhorar scroll da tabela
    const tabela = document.querySelector('.table-responsive');
    if (tabela) {
        tabela.style.webkitOverflowScrolling = 'touch';
    }
    
    // Adicionar gestos de swipe para navegação
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Swipe horizontal para navegar entre páginas
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0 && paginaAtual < Math.ceil(dadosFiltrados.length / registrosPorPagina)) {
                // Swipe para esquerda - próxima página
                irParaPagina(paginaAtual + 1);
            } else if (diffX < 0 && paginaAtual > 1) {
                // Swipe para direita - página anterior
                irParaPagina(paginaAtual - 1);
            }
        }
    });
}

// Otimizar layout para orientação
function otimizarLayoutParaOrientacao() {
    if (!isTablet) return;
    
    const container = document.querySelector('.container');
    if (isLandscape) {
        container.style.padding = '10px';
        // Ajustar altura dos gráficos para landscape
        document.querySelectorAll('canvas').forEach(canvas => {
            canvas.style.maxHeight = '200px';
        });
    } else {
        container.style.padding = '15px';
        // Ajustar altura dos gráficos para portrait
        document.querySelectorAll('canvas').forEach(canvas => {
            canvas.style.maxHeight = '250px';
        });
    }
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    detectarDispositivo();
    inicializarGraficos();
    carregarDados();
    configurarFormulario();
    configurarAtualizacaoAutomatica();
    inicializarKPIs();
    configurarFiltros();
    carregarPreferenciasUsuario();
    configurarTouchParaTablet();
    otimizarGraficosParaTablet();
    otimizarLayoutParaOrientacao();
});

// Listener para mudança de orientação
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        detectarDispositivo();
        otimizarLayoutParaOrientacao();
        otimizarGraficosParaTablet();
    }, 100);
});

// Listener para redimensionamento da janela
window.addEventListener('resize', debounce(function() {
    detectarDispositivo();
    otimizarLayoutParaOrientacao();
    otimizarGraficosParaTablet();
}, 250));

// Sistema de KPIs em Tempo Real
function inicializarKPIs() {
    atualizarKPIs();
    // Atualizar KPIs a cada 30 segundos
    setInterval(atualizarKPIs, 30000);
}

async function atualizarKPIs() {
    try {
        // Verificar cache primeiro
        const cacheKey = 'kpis';
        const cachedKPIs = getCachedData(cacheKey);
        
        if (cachedKPIs) {
            calcularKPIs(cachedKPIs);
            verificarAlertas(cachedKPIs);
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/kpis`);
        if (response.ok) {
            const dados = await response.json();
            setCachedData(cacheKey, dados);
            calcularKPIs(dados);
            verificarAlertas(dados);
        }
    } catch (error) {
        console.error('Erro ao atualizar KPIs:', error);
    }
}

function calcularKPIs(dados) {
    if (!dados.length) return;

    // Filtrar dados das últimas 24 horas
    const agora = new Date();
    const vinteQuatroHorasAtras = new Date(agora.getTime() - (24 * 60 * 60 * 1000));
    const dados24h = dados.filter(d => new Date(d.timestamp) > vinteQuatroHorasAtras);

    // Consumo Total
    const consumoTotal = dados24h.reduce((total, d) => total + d.consumoEnergia, 0);
    document.getElementById('kpiConsumoTotal').textContent = `${consumoTotal.toFixed(1)} kWh`;

    // Eficiência Média
    const eficienciaMedia = dados24h.reduce((total, d) => total + d.eficiencia, 0) / dados24h.length;
    document.getElementById('kpiEficienciaMedia').textContent = `${eficienciaMedia.toFixed(1)}%`;

    // Temperatura Média
    const temperaturaMedia = dados24h.reduce((total, d) => total + d.temperatura, 0) / dados24h.length;
    document.getElementById('kpiTemperaturaMedia').textContent = `${temperaturaMedia.toFixed(1)}°C`;

    // Máquinas Ativas (últimas 2 horas)
    const duasHorasAtras = new Date(agora.getTime() - (2 * 60 * 60 * 1000));
    const maquinasAtivas = new Set(dados.filter(d => new Date(d.timestamp) > duasHorasAtras).map(d => d.nomeMaquina));
    document.getElementById('kpiMaquinasAtivas').textContent = maquinasAtivas.size;

    // Calcular variações (simulado)
    const variacaoConsumo = (Math.random() - 0.5) * 10;
    const variacaoEficiencia = (Math.random() - 0.5) * 5;
    const variacaoTemperatura = (Math.random() - 0.5) * 3;

    document.getElementById('kpiConsumoVariacao').textContent = `${variacaoConsumo > 0 ? '+' : ''}${variacaoConsumo.toFixed(1)}%`;
    document.getElementById('kpiEficienciaVariacao').textContent = `${variacaoEficiencia > 0 ? '+' : ''}${variacaoEficiencia.toFixed(1)}%`;
    document.getElementById('kpiTemperaturaVariacao').textContent = `${variacaoTemperatura > 0 ? '+' : ''}${variacaoTemperatura.toFixed(1)}°C`;
}

function verificarAlertas(dados) {
    const areaAlertas = document.getElementById('areaAlertas');
    areaAlertas.innerHTML = '';

    if (!dados.length) return;

    const alertas = [];

    // Verificar temperatura alta
    const temperaturaAlta = dados.filter(d => d.temperatura > 75);
    if (temperaturaAlta.length > 0) {
        alertas.push({
            tipo: 'critico',
            mensagem: `${temperaturaAlta.length} máquina(s) com temperatura acima de 75°C`,
            icone: 'fas fa-thermometer-half'
        });
    }

    // Verificar eficiência baixa
    const eficienciaBaixa = dados.filter(d => d.eficiencia < 70);
    if (eficienciaBaixa.length > 0) {
        alertas.push({
            tipo: 'aviso',
            mensagem: `${eficienciaBaixa.length} máquina(s) com eficiência abaixo de 70%`,
            icone: 'fas fa-exclamation-triangle'
        });
    }

    // Verificar consumo alto
    const consumoAlto = dados.filter(d => d.consumoEnergia > 120);
    if (consumoAlto.length > 0) {
        alertas.push({
            tipo: 'info',
            mensagem: `${consumoAlto.length} máquina(s) com alto consumo de energia`,
            icone: 'fas fa-bolt'
        });
    }

    // Exibir alertas
    alertas.forEach(alerta => {
        const alertaElement = document.createElement('div');
        alertaElement.className = `alerta-item alerta-${alerta.tipo}`;
        alertaElement.innerHTML = `
            <div>
                <i class="${alerta.icone} me-2"></i>
                ${alerta.mensagem}
            </div>
            <button class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        areaAlertas.appendChild(alertaElement);
    });
}

// Sistema de Filtros Avançados
function configurarFiltros() {
    // Configurar data inicial como 7 dias atrás
    const dataInicial = new Date();
    dataInicial.setDate(dataInicial.getDate() - 7);
    document.getElementById('filtroDataInicial').value = dataInicial.toISOString().slice(0, 16);

    // Configurar data final como agora
    const dataFinal = new Date();
    document.getElementById('filtroDataFinal').value = dataFinal.toISOString().slice(0, 16);
    
    // Adicionar debounce aos filtros
    document.getElementById('filtroMaquina').addEventListener('input', debounce(aplicarFiltros, 300));
    document.getElementById('filtroModulo').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroDataInicial').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroDataFinal').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroOrdenacao').addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
    const filtroModulo = document.getElementById('filtroModulo').value;
    const filtroMaquina = document.getElementById('filtroMaquina').value;
    const filtroDataInicial = document.getElementById('filtroDataInicial').value;
    const filtroDataFinal = document.getElementById('filtroDataFinal').value;
    const filtroOrdenacao = document.getElementById('filtroOrdenacao').value;

    // Usar requestAnimationFrame para otimizar renderização
    requestAnimationFrame(() => {
        dadosFiltrados = dadosAtuais.filter(dado => {
            // Filtro por módulo
            if (filtroModulo && dado.tipoModulo !== filtroModulo) return false;

            // Filtro por máquina
            if (filtroMaquina && !dado.nomeMaquina.toLowerCase().includes(filtroMaquina.toLowerCase())) return false;

            // Filtro por data
            const dataDado = new Date(dado.timestamp);
            if (filtroDataInicial && dataDado < new Date(filtroDataInicial)) return false;
            if (filtroDataFinal && dataDado > new Date(filtroDataFinal)) return false;

            return true;
        });

        // Ordenação
        dadosFiltrados.sort((a, b) => {
            switch (filtroOrdenacao) {
                case 'consumoEnergia':
                    return b.consumoEnergia - a.consumoEnergia;
                case 'eficiencia':
                    return b.eficiencia - a.eficiencia;
                case 'temperatura':
                    return b.temperatura - a.temperatura;
                default:
                    return new Date(b.timestamp) - new Date(a.timestamp);
            }
        });

        paginaAtual = 1;
        atualizarTabelaFiltrada();
        atualizarPaginacao();
    });
}

function limparFiltros() {
    document.getElementById('filtroModulo').value = '';
    document.getElementById('filtroMaquina').value = '';
    document.getElementById('filtroDataInicial').value = '';
    document.getElementById('filtroDataFinal').value = '';
    document.getElementById('filtroOrdenacao').value = 'timestamp';
    
    dadosFiltrados = [...dadosAtuais];
    paginaAtual = 1;
    atualizarTabelaFiltrada();
    atualizarPaginacao();
}

function atualizarTabelaFiltrada() {
    const inicio = (paginaAtual - 1) * registrosPorPagina;
    const fim = inicio + registrosPorPagina;
    const dadosPagina = dadosFiltrados.slice(inicio, fim);

    const tbody = document.getElementById('tabelaDados');
    
    // Usar DocumentFragment para melhor performance
    const fragment = document.createDocumentFragment();

    dadosPagina.forEach(dado => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="badge bg-${getCorModulo(dado.tipoModulo)}">${dado.tipoModulo}</span></td>
            <td>${dado.nomeMaquina}</td>
            <td>${dado.consumoEnergia.toFixed(1)}</td>
            <td>${dado.temperatura.toFixed(1)}</td>
            <td>${dado.pressao.toFixed(1)}</td>
            <td>${dado.velocidade.toFixed(0)}</td>
            <td>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-${dado.eficiencia >= 90 ? 'success' : dado.eficiencia >= 70 ? 'warning' : 'danger'}" 
                         style="width: ${dado.eficiencia}%">
                        ${dado.eficiencia.toFixed(1)}%
                    </div>
                </div>
            </td>
            <td>${formatarData(dado.timestamp)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-acao" onclick="visualizarDetalhes(${dado.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success btn-acao" onclick="exportarDado(${dado.id})">
                    <i class="fas fa-download"></i>
                </button>
            </td>
        `;
        fragment.appendChild(tr);
    });

    tbody.innerHTML = '';
    tbody.appendChild(fragment);

    // Atualizar contadores
    document.getElementById('registrosMostrados').textContent = dadosPagina.length;
    document.getElementById('totalRegistros').textContent = dadosFiltrados.length;
}

function atualizarPaginacao() {
    const totalPaginas = Math.ceil(dadosFiltrados.length / registrosPorPagina);
    const paginacao = document.getElementById('paginacao');
    paginacao.innerHTML = '';

    if (totalPaginas <= 1) return;

    // Botão anterior
    if (paginaAtual > 1) {
        const liAnterior = document.createElement('li');
        liAnterior.className = 'page-item';
        liAnterior.innerHTML = `<a class="page-link" href="#" onclick="irParaPagina(${paginaAtual - 1})">Anterior</a>`;
        paginacao.appendChild(liAnterior);
    }

    // Páginas numeradas
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= paginaAtual - 2 && i <= paginaAtual + 2)) {
            const li = document.createElement('li');
            li.className = `page-item ${i === paginaAtual ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" onclick="irParaPagina(${i})">${i}</a>`;
            paginacao.appendChild(li);
        } else if (i === paginaAtual - 3 || i === paginaAtual + 3) {
            const li = document.createElement('li');
            li.className = 'page-item disabled';
            li.innerHTML = '<span class="page-link">...</span>';
            paginacao.appendChild(li);
        }
    }

    // Botão próximo
    if (paginaAtual < totalPaginas) {
        const liProximo = document.createElement('li');
        liProximo.className = 'page-item';
        liProximo.innerHTML = `<a class="page-link" href="#" onclick="irParaPagina(${paginaAtual + 1})">Próximo</a>`;
        paginacao.appendChild(liProximo);
    }
}

function irParaPagina(pagina) {
    paginaAtual = pagina;
    atualizarTabelaFiltrada();
    atualizarPaginacao();
}

// Sistema de Modo Escuro
function alternarTema() {
    modoEscuro = !modoEscuro;
    document.body.classList.toggle('dark-mode', modoEscuro);
    
    const btnTema = document.querySelector('button[onclick="alternarTema()"]');
    if (modoEscuro) {
        btnTema.innerHTML = '<i class="fas fa-sun me-1"></i>Modo Claro';
    } else {
        btnTema.innerHTML = '<i class="fas fa-moon me-1"></i>Modo Escuro';
    }
    
    salvarPreferenciasUsuario();
    atualizarGraficos(); // Atualizar cores dos gráficos
}

function carregarPreferenciasUsuario() {
    const preferencias = localStorage.getItem('preferenciasUsuario');
    if (preferencias) {
        const config = JSON.parse(preferencias);
        modoEscuro = config.modoEscuro || false;
        if (modoEscuro) {
            alternarTema();
        }
    }
}

function salvarPreferenciasUsuario() {
    const preferencias = {
        modoEscuro: modoEscuro
    };
    localStorage.setItem('preferenciasUsuario', JSON.stringify(preferencias));
}

// Funções de Exportação
function exportarDadosFiltrados() {
    if (!dadosFiltrados.length) {
        mostrarNotificacao('Nenhum dado para exportar', 'warning');
        return;
    }

    const csv = gerarCSV(dadosFiltrados);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dados_monitoramento_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function gerarCSV(dados) {
    const headers = ['Módulo', 'Máquina', 'Consumo (kWh)', 'Temperatura (°C)', 'Pressão (bar)', 'Velocidade (RPM)', 'Eficiência (%)', 'Data/Hora'];
    const csvContent = [
        headers.join(','),
        ...dados.map(d => [
            d.tipoModulo,
            d.nomeMaquina,
            d.consumoEnergia,
            d.temperatura,
            d.pressao,
            d.velocidade,
            d.eficiencia,
            d.timestamp
        ].join(','))
    ].join('\n');
    
    return csvContent;
}

// Funções auxiliares
function visualizarDetalhes(id) {
    const dado = dadosAtuais.find(d => d.id === id);
    if (dado) {
        mostrarNotificacao(`Detalhes da máquina ${dado.nomeMaquina} carregados`, 'info');
        // Aqui você pode implementar um modal com detalhes completos
    }
}

function exportarDado(id) {
    const dado = dadosAtuais.find(d => d.id === id);
    if (dado) {
        const csv = gerarCSV([dado]);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `dado_${dado.nomeMaquina}_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Configuração dos gráficos Chart.js
function inicializarGraficos() {
    // Gráfico de Consumo de Energia
    const ctxConsumo = document.getElementById('graficoConsumo').getContext('2d');
    graficos.consumo = new Chart(ctxConsumo, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Lean',
                data: [],
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.4
            }, {
                label: 'Circular',
                data: [],
                borderColor: '#17a2b8',
                backgroundColor: 'rgba(23, 162, 184, 0.1)',
                tension: 0.4
            }, {
                label: 'Sustentável',
                data: [],
                borderColor: '#20c997',
                backgroundColor: 'rgba(32, 201, 151, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Consumo de Energia (kWh)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Temperatura
    const ctxTemperatura = document.getElementById('graficoTemperatura').getContext('2d');
    graficos.temperatura = new Chart(ctxTemperatura, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Lean',
                data: [],
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.4
            }, {
                label: 'Circular',
                data: [],
                borderColor: '#17a2b8',
                backgroundColor: 'rgba(23, 162, 184, 0.1)',
                tension: 0.4
            }, {
                label: 'Sustentável',
                data: [],
                borderColor: '#20c997',
                backgroundColor: 'rgba(32, 201, 151, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperatura (°C)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Eficiência
    const ctxEficiencia = document.getElementById('graficoEficiencia').getContext('2d');
    graficos.eficiencia = new Chart(ctxEficiencia, {
        type: 'doughnut',
        data: {
            labels: ['Lean', 'Circular', 'Sustentável'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#28a745', '#17a2b8', '#20c997'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Eficiência Média (%)'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Gráfico Comparativo
    const ctxComparativo = document.getElementById('graficoComparativo').getContext('2d');
    graficos.comparativo = new Chart(ctxComparativo, {
        type: 'bar',
        data: {
            labels: ['Consumo Energia', 'Temperatura', 'Pressão', 'Velocidade'],
            datasets: [{
                label: 'Lean',
                data: [0, 0, 0, 0],
                backgroundColor: 'rgba(40, 167, 69, 0.8)'
            }, {
                label: 'Circular',
                data: [0, 0, 0, 0],
                backgroundColor: 'rgba(23, 162, 184, 0.8)'
            }, {
                label: 'Sustentável',
                data: [0, 0, 0, 0],
                backgroundColor: 'rgba(32, 201, 151, 0.8)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparativo entre Módulos'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Tendências Temporais
    const ctxTendencias = document.getElementById('graficoTendencias').getContext('2d');
    graficos.tendencias = new Chart(ctxTendencias, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Consumo de Energia',
                data: [],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: 'Eficiência',
                data: [],
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }, {
                label: 'Temperatura',
                data: [],
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Tendências Temporais - Últimas 24 Horas'
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Horário'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Consumo (kWh) / Temperatura (°C)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Eficiência (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

// Carregar dados da API
async function carregarDados() {
    try {
        // Verificar cache primeiro
        const cacheKey = 'dados_principais';
        const cachedData = getCachedData(cacheKey);
        
        if (cachedData) {
            dadosAtuais = cachedData;
            atualizarTabela();
            atualizarGraficos();
            return;
        }
        
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
            dadosAtuais = await response.json();
            setCachedData(cacheKey, dadosAtuais);
            atualizarTabela();
            atualizarGraficos();
        } else {
            mostrarNotificacao('Erro ao carregar dados', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao('Erro de conexão com o servidor', 'error');
    }
}

// Atualizar gráficos com dados atuais
function atualizarGraficos() {
    if (!dadosAtuais.length) return;

    // Usar requestAnimationFrame para otimizar renderização
    requestAnimationFrame(() => {
        // Preparar dados para os gráficos
        const dadosPorModulo = {
            LEAN: dadosAtuais.filter(d => d.tipoModulo === 'LEAN'),
            CIRCULAR: dadosAtuais.filter(d => d.tipoModulo === 'CIRCULAR'),
            SUSTENTAVEL: dadosAtuais.filter(d => d.tipoModulo === 'SUSTENTAVEL')
        };

        // Atualizar gráfico de consumo
        atualizarGraficoLinha(graficos.consumo, dadosPorModulo, 'consumoEnergia', 'Consumo de Energia (kWh)');

        // Atualizar gráfico de temperatura
        atualizarGraficoLinha(graficos.temperatura, dadosPorModulo, 'temperatura', 'Temperatura (°C)');

        // Atualizar gráfico de eficiência
        atualizarGraficoEficiencia(dadosPorModulo);

        // Atualizar gráfico comparativo
        atualizarGraficoComparativo(dadosPorModulo);

        // Atualizar gráfico de tendências
        atualizarGraficoTendencias();
    });
}

function atualizarGraficoLinha(grafico, dadosPorModulo, campo, titulo) {
    const labels = [];
    const datasets = [];

    // Pegar os últimos 20 registros de cada módulo
    Object.keys(dadosPorModulo).forEach((modulo, index) => {
        const dados = dadosPorModulo[modulo].slice(-20);
        const cores = ['#28a745', '#17a2b8', '#20c997'];
        
        datasets.push({
            label: modulo,
            data: dados.map(d => d[campo]),
            borderColor: cores[index],
            backgroundColor: cores[index] + '20',
            tension: 0.4
        });

        // Usar timestamps como labels
        dados.forEach(d => {
            const time = new Date(d.timestamp).toLocaleTimeString();
            if (!labels.includes(time)) {
                labels.push(time);
            }
        });
    });

    grafico.data.labels = labels;
    grafico.data.datasets = datasets;
    grafico.options.plugins.title.text = titulo;
    grafico.update('none'); // Atualizar sem animação para melhor performance
}

function atualizarGraficoEficiencia(dadosPorModulo) {
    const eficiencias = [];
    
    Object.keys(dadosPorModulo).forEach(modulo => {
        const dados = dadosPorModulo[modulo];
        if (dados.length > 0) {
            const media = dados.reduce((sum, d) => sum + d.eficiencia, 0) / dados.length;
            eficiencias.push(Math.round(media * 10) / 10);
        } else {
            eficiencias.push(0);
        }
    });

    graficos.eficiencia.data.datasets[0].data = eficiencias;
    graficos.eficiencia.update('none');
}

function atualizarGraficoComparativo(dadosPorModulo) {
    const modulos = ['LEAN', 'CIRCULAR', 'SUSTENTAVEL'];
    const metricas = ['consumoEnergia', 'temperatura', 'pressao', 'velocidade'];
    
    modulos.forEach((modulo, index) => {
        const dados = dadosPorModulo[modulo] || [];
        if (dados.length > 0) {
            const mediaConsumo = dados.reduce((sum, d) => sum + d.consumoEnergia, 0) / dados.length;
            const mediaTemperatura = dados.reduce((sum, d) => sum + d.temperatura, 0) / dados.length;
            const mediaPressao = dados.reduce((sum, d) => sum + d.pressao, 0) / dados.length;
            const mediaVelocidade = dados.reduce((sum, d) => sum + d.velocidade, 0) / dados.length;
            
            graficos.comparativo.data.datasets[index].data = [
                mediaConsumo,
                mediaTemperatura,
                mediaPressao,
                mediaVelocidade
            ];
        } else {
            graficos.comparativo.data.datasets[index].data = [0, 0, 0, 0];
        }
    });
    
    graficos.comparativo.update('none');
}

// Funções para o Gráfico de Tendências Temporais
function atualizarGraficoTendencias() {
    if (!dadosAtuais.length) return;

    // Filtrar dados por período
    const agora = new Date();
    let dadosFiltrados = [];
    
    switch (periodoKPIs) {
        case '24h':
            const vinteQuatroHorasAtras = new Date(agora.getTime() - (24 * 60 * 60 * 1000));
            dadosFiltrados = dadosAtuais.filter(d => new Date(d.timestamp) > vinteQuatroHorasAtras);
            break;
        case '7d':
            const seteDiasAtras = new Date(agora.getTime() - (7 * 24 * 60 * 60 * 1000));
            dadosFiltrados = dadosAtuais.filter(d => new Date(d.timestamp) > seteDiasAtras);
            break;
        case '30d':
            const trintaDiasAtras = new Date(agora.getTime() - (30 * 24 * 60 * 60 * 1000));
            dadosFiltrados = dadosAtuais.filter(d => new Date(d.timestamp) > trintaDiasAtras);
            break;
    }

    // Agrupar dados por hora/dia
    const dadosAgrupados = agruparDadosPorTempo(dadosFiltrados);
    
    // Preparar dados para o gráfico
    const labels = dadosAgrupados.map(d => d.label);
    const consumoData = dadosAgrupados.map(d => d.consumoMedio);
    const eficienciaData = dadosAgrupados.map(d => d.eficienciaMedia);
    const temperaturaData = dadosAgrupados.map(d => d.temperaturaMedia);

    // Atualizar gráfico
    graficos.tendencias.data.labels = labels;
    graficos.tendencias.data.datasets[0].data = consumoData;
    graficos.tendencias.data.datasets[1].data = eficienciaData;
    graficos.tendencias.data.datasets[2].data = temperaturaData;

    // Atualizar título
    const titulos = {
        '24h': 'Tendências Temporais - Últimas 24 Horas',
        '7d': 'Tendências Temporais - Últimos 7 Dias',
        '30d': 'Tendências Temporais - Últimos 30 Dias'
    };
    graficos.tendencias.options.plugins.title.text = titulos[periodoKPIs];

    graficos.tendencias.update();
}

function agruparDadosPorTempo(dados) {
    const grupos = {};
    
    dados.forEach(dado => {
        const data = new Date(dado.timestamp);
        let chave;
        
        if (periodoKPIs === '24h') {
            // Agrupar por hora
            chave = data.toLocaleString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else {
            // Agrupar por dia
            chave = data.toLocaleDateString('pt-BR');
        }
        
        if (!grupos[chave]) {
            grupos[chave] = {
                consumos: [],
                eficiencias: [],
                temperaturas: []
            };
        }
        
        grupos[chave].consumos.push(dado.consumoEnergia);
        grupos[chave].eficiencias.push(dado.eficiencia);
        grupos[chave].temperaturas.push(dado.temperatura);
    });

    // Calcular médias
    return Object.keys(grupos).map(chave => ({
        label: chave,
        consumoMedio: grupos[chave].consumos.reduce((a, b) => a + b, 0) / grupos[chave].consumos.length,
        eficienciaMedia: grupos[chave].eficiencias.reduce((a, b) => a + b, 0) / grupos[chave].eficiencias.length,
        temperaturaMedia: grupos[chave].temperaturas.reduce((a, b) => a + b, 0) / grupos[chave].temperaturas.length
    })).sort((a, b) => {
        // Ordenar por data/hora
        if (periodoKPIs === '24h') {
            return new Date(`2000-01-01 ${a.label}`) - new Date(`2000-01-01 ${b.label}`);
        } else {
            return new Date(a.label.split('/').reverse().join('-')) - new Date(b.label.split('/').reverse().join('-'));
        }
    });
}

function alterarPeriodoTendencias(periodo) {
    periodoKPIs = periodo;
    
    // Atualizar botões
    document.querySelectorAll('button[onclick^="alterarPeriodoTendencias"]').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Atualizar gráfico
    atualizarGraficoTendencias();
}

// Atualizar tabela de dados
function atualizarTabela() {
    const tbody = document.getElementById('tabelaDados');
    tbody.innerHTML = '';

    // Usar dados filtrados se disponíveis, senão usar dados atuais
    const dadosParaExibir = dadosFiltrados.length > 0 ? dadosFiltrados : dadosAtuais;
    
    // Aplicar paginação
    const inicio = (paginaAtual - 1) * registrosPorPagina;
    const fim = inicio + registrosPorPagina;
    const dadosPagina = dadosParaExibir.slice(inicio, fim);

    dadosPagina.forEach(dado => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="badge bg-${getCorModulo(dado.tipoModulo)}">${dado.tipoModulo}</span></td>
            <td>${dado.nomeMaquina}</td>
            <td>${dado.consumoEnergia.toFixed(1)}</td>
            <td>${dado.temperatura.toFixed(1)}</td>
            <td>${dado.pressao.toFixed(1)}</td>
            <td>${dado.velocidade.toFixed(0)}</td>
            <td>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-${dado.eficiencia >= 90 ? 'success' : dado.eficiencia >= 70 ? 'warning' : 'danger'}" 
                         style="width: ${dado.eficiencia}%">
                        ${dado.eficiencia.toFixed(1)}%
                    </div>
                </div>
            </td>
            <td>${formatarData(dado.timestamp)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-acao" onclick="visualizarDetalhes(${dado.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success btn-acao" onclick="exportarDado(${dado.id})">
                    <i class="fas fa-download"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Atualizar contadores
    document.getElementById('registrosMostrados').textContent = dadosPagina.length;
    document.getElementById('totalRegistros').textContent = dadosParaExibir.length;

    // Atualizar paginação se necessário
    if (dadosFiltrados.length > 0) {
        atualizarPaginacao();
    }
}

function getCorModulo(modulo) {
    switch (modulo) {
        case 'LEAN': return 'success';
        case 'CIRCULAR': return 'info';
        case 'SUSTENTAVEL': return 'success';
        default: return 'secondary';
    }
}

// Simular dados do Arduino
async function simularDadosArduino() {
    const modulo = document.getElementById('moduloSimulacao').value;
    const nomeMaquina = document.getElementById('nomeMaquina').value;

    if (!nomeMaquina) {
        mostrarNotificacao('Por favor, informe o nome da máquina', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/simular/${modulo}?nomeMaquina=${encodeURIComponent(nomeMaquina)}`, {
            method: 'POST'
        });

        if (response.ok) {
            const novoDado = await response.json();
            dadosAtuais.push(novoDado);
            atualizarTabela();
            atualizarGraficos();
            mostrarNotificacao('Dados simulados com sucesso!', 'success');
        } else {
            mostrarNotificacao('Erro ao simular dados', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao('Erro de conexão', 'error');
    }
}

// Simulação automática
function iniciarSimulacaoAutomatica() {
    if (simulacaoAutomatica) {
        clearInterval(simulacaoAutomatica);
        simulacaoAutomatica = null;
        mostrarNotificacao('Simulação automática parada', 'info');
        return;
    }

    simulacaoAutomatica = setInterval(() => {
        const modulos = ['LEAN', 'CIRCULAR', 'SUSTENTAVEL'];
        const maquinas = ['Máquina 001', 'Máquina 002', 'Máquina 003'];
        
        const moduloAleatorio = modulos[Math.floor(Math.random() * modulos.length)];
        const maquinaAleatoria = maquinas[Math.floor(Math.random() * maquinas.length)];
        
        // Atualizar campos do formulário
        document.getElementById('moduloSimulacao').value = moduloAleatorio;
        document.getElementById('nomeMaquina').value = maquinaAleatoria;
        
        simularDadosArduino();
    }, 3000); // A cada 3 segundos

    mostrarNotificacao('Simulação automática iniciada', 'success');
}

// Configurar formulário manual
function configurarFormulario() {
    document.getElementById('formManual').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const dados = {
            tipoModulo: document.getElementById('moduloManual').value,
            nomeMaquina: document.getElementById('nomeMaquinaManual').value,
            consumoEnergia: parseFloat(document.getElementById('consumoEnergia').value),
            temperatura: parseFloat(document.getElementById('temperatura').value),
            pressao: parseFloat(document.getElementById('pressao').value),
            velocidade: parseFloat(document.getElementById('velocidade').value),
            eficiencia: parseFloat(document.getElementById('eficiencia').value)
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                const novoDado = await response.json();
                dadosAtuais.push(novoDado);
                atualizarTabela();
                atualizarGraficos();
                mostrarNotificacao('Dados salvos com sucesso!', 'success');
                this.reset();
            } else {
                mostrarNotificacao('Erro ao salvar dados', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            mostrarNotificacao('Erro de conexão', 'error');
        }
    });
}

// Selecionar módulo
function selecionarModulo(modulo) {
    document.getElementById('moduloManual').value = modulo;
    document.getElementById('moduloSimulacao').value = modulo;
    
    // Scroll para o painel de controle
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
    
    mostrarNotificacao(`Módulo ${modulo} selecionado`, 'info');
}

// Limpar dados antigos
async function limparDados() {
    if (!confirm('Tem certeza que deseja limpar os dados antigos?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/limpar?dias=7`, {
            method: 'DELETE'
        });

        if (response.ok) {
            dadosAtuais = [];
            atualizarTabela();
            atualizarGraficos();
            mostrarNotificacao('Dados antigos removidos', 'success');
        } else {
            mostrarNotificacao('Erro ao limpar dados', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao('Erro de conexão', 'error');
    }
}

// Configurar atualização automática
function configurarAtualizacaoAutomatica() {
    setInterval(() => {
        if (!simulacaoAutomatica) {
            carregarDados();
        }
    }, 10000); // Atualizar a cada 10 segundos
}

// Mostrar notificações
function mostrarNotificacao(mensagem, tipo) {
    const toast = document.getElementById('toast');
    const toastBody = document.getElementById('toastBody');
    
    toastBody.textContent = mensagem;
    toast.classList.remove('bg-success', 'bg-danger', 'bg-warning');
    
    switch (tipo) {
        case 'success':
            toast.classList.add('bg-success', 'text-white');
            break;
        case 'error':
            toast.classList.add('bg-danger', 'text-white');
            break;
        case 'warning':
            toast.classList.add('bg-warning', 'text-dark');
            break;
        default:
            toast.classList.add('bg-primary', 'text-white');
    }
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// ===== FUNCIONALIDADES DE RELATÓRIOS =====

// Configurar formulário de relatório
document.addEventListener('DOMContentLoaded', function() {
    const formRelatorio = document.getElementById('formRelatorio');
    if (formRelatorio) {
        formRelatorio.addEventListener('submit', gerarRelatorio);
    }
    
    // Definir datas padrão (últimos 7 dias)
    const hoje = new Date();
    const dataInicial = new Date(hoje.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const dataInicialInput = document.getElementById('dataInicial');
    const dataFinalInput = document.getElementById('dataFinal');
    
    if (dataInicialInput && dataFinalInput) {
        dataInicialInput.value = dataInicial.toISOString().split('T')[0];
        dataFinalInput.value = hoje.toISOString().split('T')[0];
    }
});

// Gerar relatório
async function gerarRelatorio(event) {
    event.preventDefault();
    
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;
    const modulo = document.getElementById('moduloRelatorio').value;
    const maquina = document.getElementById('maquinaRelatorio').value;
    const formato = document.getElementById('formatoRelatorio').value;
    
    if (!dataInicial || !dataFinal) {
        mostrarNotificacao('Por favor, selecione as datas inicial e final', 'warning');
        return;
    }
    
    if (new Date(dataInicial) > new Date(dataFinal)) {
        mostrarNotificacao('A data inicial não pode ser maior que a data final', 'warning');
        return;
    }
    
    try {
        mostrarNotificacao('Gerando relatório...', 'info');
        
        const relatorioDTO = {
            dataInicial: dataInicial,
            dataFinal: dataFinal,
            tipoModulo: modulo || null,
            nomeMaquina: maquina || null,
            formato: formato
        };
        
        const response = await fetch('/api/relatorios/gerar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(relatorioDTO)
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio_${dataInicial}_${dataFinal}.${formato.toLowerCase()}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            mostrarNotificacao('Relatório gerado com sucesso!', 'success');
        } else {
            mostrarNotificacao('Erro ao gerar relatório', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao gerar relatório', 'error');
    }
}

// Obter estatísticas
async function obterEstatisticas() {
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;
    const modulo = document.getElementById('moduloRelatorio').value;
    const maquina = document.getElementById('maquinaRelatorio').value;
    
    if (!dataInicial || !dataFinal) {
        mostrarNotificacao('Por favor, selecione as datas inicial e final', 'warning');
        return;
    }
    
    try {
        let url = `/api/relatorios/estatisticas?dataInicial=${dataInicial}&dataFinal=${dataFinal}`;
        
        if (modulo) {
            url += `&tipoModulo=${modulo}`;
        }
        
        if (maquina) {
            url += `&nomeMaquina=${encodeURIComponent(maquina)}`;
        }
        
        const response = await fetch(url);
        
        if (response.ok) {
            const estatisticas = await response.json();
            exibirEstatisticas(estatisticas);
            mostrarNotificacao('Estatísticas carregadas com sucesso!', 'success');
        } else {
            mostrarNotificacao('Erro ao carregar estatísticas', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao carregar estatísticas', 'error');
    }
}

// Exibir estatísticas na interface
function exibirEstatisticas(estatisticas) {
    const areaEstatisticas = document.getElementById('areaEstatisticas');
    const conteudoEstatisticas = document.getElementById('conteudoEstatisticas');
    
    let html = `
        <div class="row">
            <div class="col-12">
                <p><strong>Período:</strong> ${formatarData(estatisticas.periodoInicial)} a ${formatarData(estatisticas.periodoFinal)}</p>
                <p><strong>Total de Registros:</strong> ${estatisticas.totalRegistros}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h6>Consumo de Energia</h6>
                <ul class="list-unstyled">
                    <li><small>Média: ${estatisticas.consumoEnergiaMedia?.toFixed(2) || 'N/A'} kWh</small></li>
                    <li><small>Mínimo: ${estatisticas.consumoEnergiaMin?.toFixed(2) || 'N/A'} kWh</small></li>
                    <li><small>Máximo: ${estatisticas.consumoEnergiaMax?.toFixed(2) || 'N/A'} kWh</small></li>
                    <li><small>Total: ${estatisticas.consumoEnergiaTotal?.toFixed(2) || 'N/A'} kWh</small></li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Temperatura</h6>
                <ul class="list-unstyled">
                    <li><small>Média: ${estatisticas.temperaturaMedia?.toFixed(2) || 'N/A'} °C</small></li>
                    <li><small>Mínimo: ${estatisticas.temperaturaMin?.toFixed(2) || 'N/A'} °C</small></li>
                    <li><small>Máximo: ${estatisticas.temperaturaMax?.toFixed(2) || 'N/A'} °C</small></li>
                </ul>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h6>Eficiência</h6>
                <ul class="list-unstyled">
                    <li><small>Média: ${estatisticas.eficienciaMedia?.toFixed(2) || 'N/A'}%</small></li>
                    <li><small>Mínimo: ${estatisticas.eficienciaMin?.toFixed(2) || 'N/A'}%</small></li>
                    <li><small>Máximo: ${estatisticas.eficienciaMax?.toFixed(2) || 'N/A'}%</small></li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Velocidade</h6>
                <ul class="list-unstyled">
                    <li><small>Média: ${estatisticas.velocidadeMedia?.toFixed(2) || 'N/A'} RPM</small></li>
                    <li><small>Mínimo: ${estatisticas.velocidadeMin?.toFixed(2) || 'N/A'} RPM</small></li>
                    <li><small>Máximo: ${estatisticas.velocidadeMax?.toFixed(2) || 'N/A'} RPM</small></li>
                </ul>
            </div>
        </div>
    `;
    
    conteudoEstatisticas.innerHTML = html;
    areaEstatisticas.style.display = 'block';
}

// Obter resumo executivo
async function obterResumoExecutivo() {
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;
    
    if (!dataInicial || !dataFinal) {
        mostrarNotificacao('Por favor, selecione as datas inicial e final', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`/api/relatorios/resumo-executivo?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
        
        if (response.ok) {
            const resumo = await response.json();
            exibirResumoExecutivo(resumo);
            mostrarNotificacao('Resumo executivo carregado com sucesso!', 'success');
        } else {
            mostrarNotificacao('Erro ao carregar resumo executivo', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao carregar resumo executivo', 'error');
    }
}

// Exibir resumo executivo
function exibirResumoExecutivo(resumo) {
    const areaEstatisticas = document.getElementById('areaEstatisticas');
    const conteudoEstatisticas = document.getElementById('conteudoEstatisticas');
    
    let html = `
        <div class="row">
            <div class="col-12">
                <h6>Resumo Executivo</h6>
                <p><strong>Total de Registros:</strong> ${resumo.totalRegistros}</p>
                <p><strong>Consumo Total de Energia:</strong> ${resumo.consumoTotalEnergia?.toFixed(2) || 'N/A'} kWh</p>
                <p><strong>Módulo Mais Eficiente:</strong> ${resumo.moduloMaisEficiente || 'N/A'}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h6>Registros por Módulo</h6>
                <ul class="list-unstyled">
                    ${Object.entries(resumo.registrosPorModulo || {}).map(([modulo, count]) => 
                        `<li><small>${modulo}: ${count} registros</small></li>`
                    ).join('')}
                </ul>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h6>Eficiência Média por Módulo</h6>
                <ul class="list-unstyled">
                    ${Object.entries(resumo.eficienciaPorModulo || {}).map(([modulo, eficiencia]) => 
                        `<li><small>${modulo}: ${eficiencia?.toFixed(2) || 'N/A'}%</small></li>`
                    ).join('')}
                </ul>
            </div>
        </div>
    `;
    
    conteudoEstatisticas.innerHTML = html;
    areaEstatisticas.style.display = 'block';
}

// Download CSV rápido
async function downloadCSVRapido() {
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;
    const modulo = document.getElementById('moduloRelatorio').value;
    const maquina = document.getElementById('maquinaRelatorio').value;
    
    if (!dataInicial || !dataFinal) {
        mostrarNotificacao('Por favor, selecione as datas inicial e final', 'warning');
        return;
    }
    
    try {
        let url = `/api/relatorios/download/csv?dataInicial=${dataInicial}&dataFinal=${dataFinal}`;
        
        if (modulo) {
            url += `&tipoModulo=${modulo}`;
        }
        
        if (maquina) {
            url += `&nomeMaquina=${encodeURIComponent(maquina)}`;
        }
        
        const response = await fetch(url);
        
        if (response.ok) {
            const blob = await response.blob();
            const url2 = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url2;
            a.download = `relatorio_${dataInicial}_${dataFinal}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url2);
            document.body.removeChild(a);
            
            mostrarNotificacao('CSV baixado com sucesso!', 'success');
        } else {
            mostrarNotificacao('Erro ao baixar CSV', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao baixar CSV', 'error');
    }
}

// Função auxiliar para formatar data
function formatarData(dataString) {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
} 