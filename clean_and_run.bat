@echo off
echo ========================================
echo Limpando e Executando o Sistema
echo ========================================
echo.

REM Limpar cache do Maven
echo Limpando cache do Maven...
mvn clean

REM Limpar dependências
echo Removendo dependências antigas...
mvn dependency:purge-local-repository

REM Baixar dependências novamente
echo Baixando dependências...
mvn dependency:resolve

REM Compilar projeto
echo Compilando projeto...
mvn compile

REM Executar aplicação
echo.
echo Iniciando aplicação...
echo.
mvn spring-boot:run

pause 