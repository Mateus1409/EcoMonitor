# Sistema de Relatórios - Documentação

## 📊 Visão Geral

O sistema de relatórios permite gerar análises detalhadas dos dados de monitoramento em diferentes formatos (PDF, Excel, CSV) com estatísticas completas e resumos executivos.

## 🚀 Funcionalidades

### 1. Geração de Relatórios
- **Formatos Suportados**: PDF, Excel, CSV
- **Filtros**: Por período, módulo e máquina
- **Estatísticas**: Média, mínimo, máximo e total de todos os parâmetros
- **Download Automático**: Arquivos são baixados automaticamente

### 2. Estatísticas em Tempo Real
- **Análise Detalhada**: Por período específico
- **Filtros Flexíveis**: Módulo e máquina opcionais
- **Visualização**: Interface amigável com cards informativos

### 3. Resumo Executivo
- **Visão Geral**: Total de registros e consumo energético
- **Comparativo**: Eficiência por módulo
- **Distribuição**: Registros por tipo de módulo

## 🔧 API Endpoints

### Gerar Relatório
```http
POST /api/relatorios/gerar
Content-Type: application/json

{
  "dataInicial": "2024-01-01",
  "dataFinal": "2024-01-31",
  "tipoModulo": "LEAN",
  "nomeMaquina": "Máquina 001",
  "formato": "PDF"
}
```

### Obter Estatísticas
```http
GET /api/relatorios/estatisticas?dataInicial=2024-01-01&dataFinal=2024-01-31&tipoModulo=LEAN&nomeMaquina=Máquina%20001
```

### Resumo Executivo
```http
GET /api/relatorios/resumo-executivo?dataInicial=2024-01-01&dataFinal=2024-01-31
```

### Download CSV Rápido
```http
GET /api/relatorios/download/csv?dataInicial=2024-01-01&dataFinal=2024-01-31&tipoModulo=LEAN
```

## 📋 Como Usar

### 1. Interface Web

#### Gerar Relatório Completo
1. Acesse a seção "Relatórios e Estatísticas"
2. Selecione as datas inicial e final
3. (Opcional) Escolha um módulo específico
4. (Opcional) Digite o nome da máquina
5. Selecione o formato desejado (PDF, Excel, CSV)
6. Clique em "Gerar Relatório"

#### Ver Estatísticas
1. Configure o período desejado
2. Clique em "Ver Estatísticas"
3. Visualize os dados na área de estatísticas

#### Resumo Executivo
1. Configure o período desejado
2. Clique em "Resumo Executivo"
3. Veja o resumo geral do período

#### Download CSV Rápido
1. Configure o período desejado
2. Clique em "Download CSV Rápido"
3. O arquivo será baixado automaticamente

### 2. Via API

#### Exemplo com cURL
```bash
# Gerar relatório PDF
curl -X POST "http://localhost:8080/api/relatorios/gerar" \
  -H "Content-Type: application/json" \
  -d '{
    "dataInicial": "2024-01-01",
    "dataFinal": "2024-01-31",
    "tipoModulo": "LEAN",
    "formato": "PDF"
  }' \
  --output relatorio.pdf

# Obter estatísticas
curl "http://localhost:8080/api/relatorios/estatisticas?dataInicial=2024-01-01&dataFinal=2024-01-31"

# Download CSV
curl "http://localhost:8080/api/relatorios/download/csv?dataInicial=2024-01-01&dataFinal=2024-01-31" \
  --output relatorio.csv
```

## 📊 Estrutura dos Relatórios

### Estatísticas Incluídas
- **Consumo de Energia**: Média, mínimo, máximo e total
- **Temperatura**: Média, mínimo e máximo
- **Pressão**: Média, mínimo e máximo
- **Velocidade**: Média, mínimo e máximo
- **Eficiência**: Média, mínimo e máximo
- **Contadores**: Total de registros e registros por módulo

### Resumo Executivo
- Total de registros no período
- Consumo total de energia
- Módulo mais eficiente
- Distribuição de registros por módulo
- Eficiência média por módulo

## 🎨 Personalização

### Formatos de Arquivo
- **PDF**: Relatório estruturado com gráficos e tabelas
- **Excel**: Planilha com dados organizados e fórmulas
- **CSV**: Dados brutos para análise externa

### Filtros Disponíveis
- **Período**: Data inicial e final obrigatórias
- **Módulo**: LEAN, CIRCULAR, SUSTENTAVEL (opcional)
- **Máquina**: Nome específico da máquina (opcional)

## 🔍 Exemplos de Uso

### Relatório Mensal Completo
```json
{
  "dataInicial": "2024-01-01",
  "dataFinal": "2024-01-31",
  "formato": "PDF"
}
```

### Análise de Módulo Específico
```json
{
  "dataInicial": "2024-01-01",
  "dataFinal": "2024-01-31",
  "tipoModulo": "LEAN",
  "formato": "EXCEL"
}
```

### Dados de Máquina Específica
```json
{
  "dataInicial": "2024-01-01",
  "dataFinal": "2024-01-31",
  "nomeMaquina": "Máquina 001",
  "formato": "CSV"
}
```

## 🛠️ Configuração

### Dependências
O sistema utiliza as seguintes bibliotecas:
- **iText 7**: Geração de PDFs
- **Apache POI**: Geração de arquivos Excel
- **Spring Boot**: Framework backend

### Configuração de Datas
- Formato: YYYY-MM-DD (ISO 8601)
- Período máximo: 1 ano
- Validação automática de datas

## 📈 Próximas Melhorias

### Funcionalidades Planejadas
1. **Gráficos nos Relatórios**: Inclusão de gráficos nos PDFs
2. **Templates Personalizáveis**: Relatórios com layout customizável
3. **Agendamento**: Relatórios automáticos por email
4. **Comparativo**: Comparação entre períodos
5. **Alertas**: Notificações baseadas em thresholds

### Melhorias Técnicas
1. **Cache**: Cache de relatórios frequentes
2. **Compressão**: Compressão de arquivos grandes
3. **Assíncrono**: Geração de relatórios em background
4. **Progresso**: Barra de progresso para relatórios grandes

## 🐛 Solução de Problemas

### Erros Comuns
1. **Data inválida**: Verificar formato YYYY-MM-DD
2. **Período muito grande**: Reduzir o período de análise
3. **Sem dados**: Verificar se existem dados no período
4. **Erro de download**: Verificar permissões de escrita

### Logs
Os logs de erro são exibidos no console do navegador e no log do servidor Spring Boot.

## 📞 Suporte

Para dúvidas ou problemas com o sistema de relatórios:
1. Verificar a documentação da API
2. Consultar os logs do servidor
3. Testar com períodos menores
4. Verificar a conectividade com o banco de dados 