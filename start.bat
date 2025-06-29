@echo off
echo ========================================
echo Sistema de Monitoramento de Economia
echo ========================================
echo.
echo Iniciando o sistema...
echo.

REM Verificar se o Java está instalado
java -version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Java nao encontrado!
    echo Por favor, instale o Java 11 ou superior.
    pause
    exit /b 1
)

REM Verificar se o Maven está instalado
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Maven nao encontrado!
    echo Por favor, instale o Maven 3.6 ou superior.
    pause
    exit /b 1
)

echo Java e Maven encontrados. Iniciando aplicacao...
echo.

REM Compilar e executar o projeto
mvn spring-boot:run

echo.
echo Sistema iniciado com sucesso!
echo Acesse: http://localhost:8080
echo Console H2: http://localhost:8080/h2-console
echo.
pause 