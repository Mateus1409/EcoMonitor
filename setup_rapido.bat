@echo off
echo ========================================
echo SISTEMA DE MONITORAMENTO DE ECONOMIA
echo Configuracao Rapida - Windows
echo ========================================
echo.

echo [1/5] Verificando Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java nao encontrado!
    echo Por favor, instale Java 11 ou superior
    echo Download: https://adoptium.net/
    pause
    exit /b 1
) else (
    echo ✅ Java encontrado
    java -version
)

echo.
echo [2/5] Verificando Maven...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Maven nao encontrado!
    echo Por favor, instale Maven 3.6 ou superior
    echo Download: https://maven.apache.org/download.cgi
    pause
    exit /b 1
) else (
    echo ✅ Maven encontrado
    mvn -version
)

echo.
echo [3/5] Verificando porta 8080...
netstat -an | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Porta 8080 esta em uso
    echo Tentando liberar porta...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    echo ✅ Porta liberada
) else (
    echo ✅ Porta 8080 livre
)

echo.
echo [4/5] Baixando dependencias...
mvn clean compile -q
if %errorlevel% neq 0 (
    echo ❌ Erro ao baixar dependencias
    echo Verifique sua conexao com a internet
    pause
    exit /b 1
) else (
    echo ✅ Dependencias baixadas com sucesso
)

echo.
echo [5/5] Iniciando aplicacao...
echo.
echo 🌐 Aplicacao sera iniciada em: http://localhost:8080
echo 📊 Console H2: http://localhost:8080/h2-console
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
echo ========================================
echo INICIANDO SERVIDOR...
echo ========================================

mvn spring-boot:run

echo.
echo Servidor parado.
pause 