# 📋 CHECKLIST PARA APRESENTAÇÃO

## ✅ ANTES DE SAIR DE CASA

### 📁 Arquivos no Pen Drive
- [ ] Pasta completa `Trabalho_Bosco` com todos os arquivos
- [ ] `requirements.txt` (este arquivo)
- [ ] `CHECKLIST_APRESENTACAO.md` (este arquivo)
- [ ] `README.md`
- [ ] `RELATORIOS.md`
- [ ] `MELHORIAS_IMPLEMENTADAS.md`
- [ ] `RESPONSIVIDADE_TABLET.md`
- [ ] `arduino_simulacao.ino`
- [ ] `start.bat`
- [ ] `clean_and_run.bat`

### 💻 Preparação do Computador
- [ ] Java 11+ instalado
- [ ] Maven 3.6+ instalado
- [ ] Navegador web (Chrome/Firefox/Edge)
- [ ] Conexão com internet (para CDNs)

## ✅ CHEGANDO NO LOCAL

### 🔍 Verificações Iniciais
- [ ] Testar se Java está funcionando: `java -version`
- [ ] Testar se Maven está funcionando: `mvn -version`
- [ ] Verificar se porta 8080 está livre
- [ ] Testar conexão com internet

### 📂 Preparação dos Arquivos
- [ ] Copiar pasta `Trabalho_Bosco` para desktop
- [ ] Abrir terminal/PowerShell
- [ ] Navegar para a pasta: `cd Trabalho_Bosco`

## ✅ TESTES ANTES DA APRESENTAÇÃO

### 🚀 Teste de Compilação
```bash
# No terminal, executar:
mvn clean compile
```
- [ ] Compilação sem erros
- [ ] Dependências baixadas

### 🌐 Teste de Execução
```bash
# Executar o projeto:
mvn spring-boot:run
```
- [ ] Servidor inicia sem erros
- [ ] Mensagem "Started MonitoramentoEconomiaApplication"
- [ ] Acesso a http://localhost:8080

### 🎯 Teste da Interface
- [ ] Página carrega completamente
- [ ] Gráficos aparecem
- [ ] Formulários funcionam
- [ ] Simulação automática funciona
- [ ] Relatórios funcionam

## ✅ DURANTE A APRESENTAÇÃO

### 🎤 Demonstração Sugerida
1. **Introdução** (2 min)
   - [ ] Explicar os 3 módulos: Lean, Circular, Sustentável
   - [ ] Mostrar a interface principal

2. **Funcionalidades** (5 min)
   - [ ] Simulação automática
   - [ ] Entrada manual de dados
   - [ ] Visualização dos gráficos
   - [ ] Geração de relatórios

3. **Tecnologias** (3 min)
   - [ ] Mostrar código Java
   - [ ] Explicar Spring Boot
   - [ ] Mostrar banco H2
   - [ ] Explicar frontend

4. **Perguntas** (2 min)
   - [ ] Estar preparado para perguntas técnicas
   - [ ] Ter exemplos prontos

## ✅ COMANDOS RÁPIDOS

### 🚀 Iniciar Projeto
```bash
cd Trabalho_Bosco
mvn spring-boot:run
```

### 🛑 Parar Projeto
```bash
# No terminal: Ctrl + C
```

### 🔄 Reiniciar Projeto
```bash
# Parar (Ctrl + C)
# Iniciar novamente:
mvn spring-boot:run
```

### 🧹 Limpar e Recompilar
```bash
mvn clean compile
mvn spring-boot:run
```

## ✅ URLS IMPORTANTES

### 🌐 Aplicação
- **Principal**: http://localhost:8080
- **Console H2**: http://localhost:8080/h2-console
- **API**: http://localhost:8080/api

### 📊 Endpoints para Demonstrar
- `GET /api/dados` - Listar dados
- `POST /api/dados/simular/LEAN` - Simular Lean
- `POST /api/dados/simular/CIRCULAR` - Simular Circular
- `POST /api/dados/simular/SUSTENTAVEL` - Simular Sustentável

## ✅ SOLUÇÃO DE PROBLEMAS RÁPIDOS

### ❌ Problema: Java não encontrado
```bash
# Verificar instalação
java -version

# Se não funcionar, instalar Java 11+
```

### ❌ Problema: Maven não encontrado
```bash
# Verificar instalação
mvn -version

# Se não funcionar, instalar Maven 3.6+
```

### ❌ Problema: Porta 8080 ocupada
```bash
# Verificar processo
netstat -ano | findstr 8080

# Matar processo ou alterar porta no application.properties
```

### ❌ Problema: Dependências não baixam
```bash
# Limpar cache e tentar novamente
mvn clean
mvn spring-boot:run
```

## ✅ BACKUP DE SEGURANÇA

### 📱 Preparação
- [ ] Screenshots da interface funcionando
- [ ] Vídeo de demonstração (opcional)
- [ ] Slides de backup (opcional)
- [ ] Documentação impressa (opcional)

### 🔄 Alternativas
- [ ] Se não funcionar, mostrar código
- [ ] Explicar arquitetura
- [ ] Demonstrar funcionalidades via slides

## ✅ CHECKLIST FINAL

### 🎯 Antes de Começar
- [ ] ✅ Projeto compilando
- [ ] ✅ Servidor rodando
- [ ] ✅ Interface carregada
- [ ] ✅ Gráficos funcionando
- [ ] ✅ Simulação testada
- [ ] ✅ Relatórios testados

### 🎤 Durante a Apresentação
- [ ] ✅ Fala clara e objetiva
- [ ] ✅ Demonstração fluida
- [ ] ✅ Respostas para perguntas
- [ ] ✅ Tempo controlado

### 🏁 Após a Apresentação
- [ ] ✅ Fechar servidor (Ctrl + C)
- [ ] ✅ Limpar arquivos temporários
- [ ] ✅ Coletar feedback

---

## 🎯 DICAS IMPORTANTES

1. **Chegue cedo** para testar tudo
2. **Tenha um plano B** caso algo não funcione
3. **Pratique a demonstração** antes
4. **Prepare respostas** para perguntas comuns
5. **Mantenha a calma** se algo der errado

## 📞 EMERGÊNCIA

Se algo der muito errado:
1. Mostre o código e explique a arquitetura
2. Use screenshots/vídeos como backup
3. Foque nos conceitos e não na execução
4. Demonstre conhecimento técnico

---

**Boa sorte na apresentação! 🚀**

Desenvolvido por: Mateus Vinicius da Silva Padilha
Data: 2024 