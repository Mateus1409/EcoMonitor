# Sistema de Monitoramento de Economia

Sistema demonstrativo completo para monitoramento de dados de máquinas industriais com foco nos 3 módulos de economia: **Lean**, **Circular** e **Sustentável**.

## 🎯 Características do Sistema

### Módulos de Economia
- **Lean**: Otimização de processos e redução de desperdícios
- **Circular**: Reutilização de recursos e economia circular  
- **Sustentável**: Energia renovável e práticas sustentáveis

### Funcionalidades
- ✅ Monitoramento em tempo real de dados de máquinas
- ✅ Simulação de sensores Arduino com potenciômetros
- ✅ Interface web moderna com gráficos Chart.js
- ✅ Entrada manual de dados
- ✅ Gráficos interativos e responsivos
- ✅ API REST completa
- ✅ Banco de dados H2 integrado
- ✅ Atualização automática de dados

## 🏗️ Arquitetura do Sistema

```
Sistema de Monitoramento de Economia
├── Backend (Spring Boot)
│   ├── API REST
│   ├── Banco de dados H2
│   ├── Simulação de dados
│   └── Estatísticas
├── Frontend (HTML/CSS/JavaScript)
│   ├── Interface web responsiva
│   ├── Gráficos Chart.js
│   ├── Formulários de entrada
│   └── Tabela de dados
└── Arduino (Simulação)
    ├── Sensores simulados
    ├── Comunicação Serial
    └── Geração de dados
```

## 🚀 Como Executar

### Pré-requisitos
- Java 11 ou superior
- Maven 3.6+
- Navegador web moderno
- Arduino (opcional, para simulação física)

### 1. Backend Spring Boot

```bash
# Navegar para o diretório do projeto
cd Trabalho_Bosco

# Compilar e executar
mvn spring-boot:run
```

O servidor estará disponível em: `http://localhost:8080`

### 2. Frontend

Após iniciar o backend, acesse:
- **Interface Principal**: `http://localhost:8080`
- **Console H2**: `http://localhost:8080/h2-console`

### 3. Simulação Arduino (Opcional)

```bash
# Upload do código para Arduino
arduino_simulacao.ino

# Conectar potenciômetros:
# - A0: Consumo de energia
# - A1: Temperatura  
# - A2: Pressão
# - A3: Velocidade
```

## 📊 Interface do Sistema

### Dashboard Principal
- **Cards dos Módulos**: Visualização rápida dos 3 módulos
- **Painel de Controle**: Simulação e entrada manual
- **Gráficos**: 4 gráficos diferentes com dados em tempo real
- **Tabela de Dados**: Histórico dos últimos registros

### Gráficos Disponíveis
1. **Consumo de Energia**: Linha temporal por módulo
2. **Temperatura**: Monitoramento térmico
3. **Eficiência**: Comparativo em rosca
4. **Comparativo**: Barras com todos os parâmetros

## 🔧 API REST

### Endpoints Disponíveis

```bash
# Dados
GET    /api/dados                    # Listar todos os dados
POST   /api/dados                    # Salvar dados manuais
GET    /api/dados/modulo/{tipo}      # Dados por módulo
GET    /api/dados/maquina/{nome}     # Dados por máquina
GET    /api/dados/estatisticas/{tipo} # Estatísticas do módulo

# Simulação
POST   /api/dados/simular/{tipo}     # Simular dados Arduino

# Manutenção
DELETE /api/dados/limpar             # Limpar dados antigos

# Relatórios (NOVO!)
POST   /api/relatorios/gerar         # Gerar relatório completo
GET    /api/relatorios/estatisticas  # Obter estatísticas detalhadas
GET    /api/relatorios/resumo-executivo # Resumo executivo
GET    /api/relatorios/download/csv  # Download CSV rápido
```

### Exemplo de Uso da API

```bash
# Simular dados do módulo Lean
curl -X POST "http://localhost:8080/api/dados/simular/LEAN?nomeMaquina=MAQ001"

# Salvar dados manuais
curl -X POST "http://localhost:8080/api/dados" \
  -H "Content-Type: application/json" \
  -d '{
    "tipoModulo": "LEAN",
    "nomeMaquina": "Máquina 001",
    "consumoEnergia": 95.5,
    "temperatura": 55.2,
    "pressao": 3.2,
    "velocidade": 950.0,
    "eficiencia": 88.5
  }'

# Gerar relatório PDF (NOVO!)
curl -X POST "http://localhost:8080/api/relatorios/gerar" \
  -H "Content-Type: application/json" \
  -d '{
    "dataInicial": "2024-01-01",
    "dataFinal": "2024-01-31",
    "tipoModulo": "LEAN",
    "formato": "PDF"
  }' \
  --output relatorio.pdf
```

## 📊 Sistema de Relatórios 

### Funcionalidades
- **Geração de Relatórios**: PDF, Excel e CSV
- **Estatísticas Detalhadas**: Média, mínimo, máximo e total
- **Resumo Executivo**: Visão geral do período
- **Filtros Flexíveis**: Por período, módulo e máquina
- **Download Automático**: Arquivos prontos para uso

### Como Usar
1. **Interface Web**: Acesse a seção "Relatórios e Estatísticas"
2. **Selecione Período**: Data inicial e final obrigatórias
3. **Configure Filtros**: Módulo e máquina opcionais
4. **Escolha Formato**: PDF, Excel ou CSV
5. **Gere Relatório**: Download automático do arquivo

### Tipos de Relatório
- **Relatório Completo**: Dados detalhados com estatísticas
- **Estatísticas Rápidas**: Análise em tempo real
- **Resumo Executivo**: Visão geral para gestão
- **CSV Rápido**: Dados brutos para análise externa

### Documentação Completa
Consulte o arquivo `RELATORIOS.md` para documentação detalhada do sistema de relatórios.

## 📈 Características dos Módulos

### Módulo Lean
- **Consumo de Energia**: 70-120 kWh (menor)
- **Temperatura**: 40-70°C
- **Pressão**: 2.0-5.0 bar
- **Velocidade**: 700-1300 RPM
- **Eficiência**: 85-95% (alta)

### Módulo Circular
- **Consumo de Energia**: 80-140 kWh (médio)
- **Temperatura**: 45-80°C
- **Pressão**: 2.5-6.0 bar
- **Velocidade**: 650-1350 RPM
- **Eficiência**: 80-90% (média)

### Módulo Sustentável
- **Consumo de Energia**: 60-110 kWh (menor)
- **Temperatura**: 35-65°C (menor)
- **Pressão**: 1.8-4.3 bar
- **Velocidade**: 600-1150 RPM
- **Eficiência**: 90-98% (máxima)

## 🎮 Como Usar

### 1. Simulação Automática
1. Clique em "Simulação Automática"
2. O sistema gerará dados automaticamente a cada 3 segundos
3. Os gráficos se atualizarão em tempo real

### 2. Simulação Manual
1. Selecione o módulo desejado
2. Digite o nome da máquina
3. Clique em "Simular Dados"

### 3. Entrada Manual
1. Preencha todos os campos do formulário
2. Clique em "Salvar Dados"
3. Os dados aparecerão na tabela e gráficos

### 4. Visualização de Módulos
1. Clique em "Visualizar" nos cards dos módulos
2. Os campos serão preenchidos automaticamente
3. Os gráficos mostrarão dados específicos do módulo

## 🔍 Monitoramento e Análise

### Indicadores de Performance
- **Consumo de Energia**: kWh por máquina
- **Temperatura**: °C de operação
- **Pressão**: bar do sistema
- **Velocidade**: RPM da máquina
- **Eficiência**: % de performance

### Estatísticas Disponíveis
- Média de consumo por módulo
- Eficiência média por período
- Comparativo entre módulos
- Tendências temporais

## 🛠️ Tecnologias Utilizadas

### Backend
- **Spring Boot 2.7.0**: Framework Java
- **Spring Data JPA**: Persistência de dados
- **H2 Database**: Banco de dados em memória
- **Maven**: Gerenciamento de dependências
- **iText 7**: Geração de relatórios PDF
- **Apache POI**: Geração de arquivos Excel
- **Bean Validation**: Validação de dados

### Frontend
- **HTML5/CSS3**: Interface responsiva
- **JavaScript ES6+**: Lógica do cliente
- **Chart.js**: Gráficos interativos
- **Bootstrap 5**: Framework CSS
- **Font Awesome**: Ícones

### Hardware (Simulação)
- **Arduino**: Microcontrolador
- **Potenciômetros**: Sensores simulados
- **Comunicação Serial**: Transmissão de dados

## 📁 Estrutura do Projeto

```
Sistema_monitoramento/
├── src/
│   └── main/
│       ├── java/com/sistema/
│       │   ├── MonitoramentoEconomiaApplication.java
│       │   ├── controller/
│       │   │   ├── DadosMaquinaController.java
│       │   │   └── RelatorioController.java (NOVO!)
│       │   ├── model/
│       │   │   └── DadosMaquina.java
│       │   ├── repository/
│       │   │   └── DadosMaquinaRepository.java
│       │   ├── service/
│       │   │   ├── DadosMaquinaService.java
│       │   │   ├── RelatorioService.java (NOVO!)
│       │   │   └── GeradorRelatorioService.java (NOVO!)
│       │   └── dto/
│       │       ├── RelatorioDTO.java (NOVO!)
│       │       └── EstatisticasDTO.java (NOVO!)
│       └── resources/
│           ├── static/
│           │   ├── index.html
│           │   ├── styles.css
│           │   └── script.js
│           └── application.properties
├── arduino_simulacao.ino
├── pom.xml
├── README.md
└── RELATORIOS.md (NOVO!)
```

## 🐛 Solução de Problemas

### Problema: Servidor não inicia
```bash
# Verificar se a porta 8080 está livre
netstat -an | grep 8080

# Alterar porta no application.properties
server.port=8081
```

### Problema: Gráficos não carregam
- Verificar se o backend está rodando
- Limpar cache do navegador
- Verificar console do navegador (F12)

### Problema: Dados não aparecem
- Verificar conexão com banco H2
- Acessar console H2: `http://localhost:8080/h2-console`
- Verificar logs do Spring Boot

## 📝 Licença

Este projeto é demonstrativo e pode ser usado para fins educacionais.

## 👨‍💻 Desenvolvido por

Mateus Vinicius da Silva Padilha

Sistema de Monitoramento de Economia - Demonstração dos módulos Lean, Circular e Sustentável.

---

**🎯 Objetivo**: Demonstrar um sistema completo de monitoramento industrial com foco em economia sustentável, utilizando tecnologias modernas e simulação de hardware real. 
