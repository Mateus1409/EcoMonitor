/*
 * Simulação Arduino para Sistema de Monitoramento de Economia
 * 
 * Este código simula sensores de máquinas industriais e envia dados
 * via Serial para serem lidos pelo sistema Java.
 * 
 * Sensores simulados:
 * - Potenciômetro para consumo de energia
 * - Sensor de temperatura
 * - Sensor de pressão
 * - Sensor de velocidade
 * - Cálculo de eficiência
 */

// Pinos dos sensores simulados
const int PIN_POT_ENERGIA = A0;    // Potenciômetro para consumo de energia
const int PIN_POT_TEMP = A1;       // Potenciômetro para temperatura
const int PIN_POT_PRESSAO = A2;    // Potenciômetro para pressão
const int PIN_POT_VELOCIDADE = A3; // Potenciômetro para velocidade

// Configurações
const unsigned long INTERVALO_ENVIO = 5000; // Enviar dados a cada 5 segundos
const int NUM_MODULOS = 3; // Lean, Circular, Sustentável

// Variáveis globais
unsigned long ultimoEnvio = 0;
int moduloAtual = 0; // 0=Lean, 1=Circular, 2=Sustentável
String nomesModulos[] = {"LEAN", "CIRCULAR", "SUSTENTAVEL"};
String nomesMaquinas[] = {"MAQ001", "MAQ002", "MAQ003"};

void setup() {
  // Inicializar comunicação serial
  Serial.begin(9600);
  Serial.println("Sistema de Monitoramento de Economia - Simulacao Arduino");
  Serial.println("========================================================");
  
  // Configurar pinos
  pinMode(PIN_POT_ENERGIA, INPUT);
  pinMode(PIN_POT_TEMP, INPUT);
  pinMode(PIN_POT_PRESSAO, INPUT);
  pinMode(PIN_POT_VELOCIDADE, INPUT);
  
  // Aguardar estabilização
  delay(1000);
  
  Serial.println("Sistema iniciado. Enviando dados...");
  Serial.println();
}

void loop() {
  unsigned long tempoAtual = millis();
  
  // Verificar se é hora de enviar dados
  if (tempoAtual - ultimoEnvio >= INTERVALO_ENVIO) {
    // Gerar dados simulados para o módulo atual
    gerarEEnviarDados();
    
    // Próximo módulo
    moduloAtual = (moduloAtual + 1) % NUM_MODULOS;
    
    ultimoEnvio = tempoAtual;
  }
  
  // Pequena pausa para não sobrecarregar
  delay(100);
}

void gerarEEnviarDados() {
  // Ler valores dos potenciômetros
  int valorEnergia = analogRead(PIN_POT_ENERGIA);
  int valorTemp = analogRead(PIN_POT_TEMP);
  int valorPressao = analogRead(PIN_POT_PRESSAO);
  int valorVelocidade = analogRead(PIN_POT_VELOCIDADE);
  
  // Converter valores baseados no módulo
  float consumoEnergia = converterConsumoEnergia(valorEnergia, moduloAtual);
  float temperatura = converterTemperatura(valorTemp, moduloAtual);
  float pressao = converterPressao(valorPressao, moduloAtual);
  float velocidade = converterVelocidade(valorVelocidade, moduloAtual);
  float eficiencia = calcularEficiencia(consumoEnergia, temperatura, pressao, velocidade, moduloAtual);
  
  // Selecionar máquina aleatória
  String maquina = nomesMaquinas[random(0, 3)];
  
  // Enviar dados via Serial no formato JSON
  enviarDadosJSON(nomesModulos[moduloAtual], maquina, consumoEnergia, temperatura, pressao, velocidade, eficiencia);
  
  // Mostrar dados no monitor serial
  mostrarDadosMonitor(nomesModulos[moduloAtual], maquina, consumoEnergia, temperatura, pressao, velocidade, eficiencia);
}

float converterConsumoEnergia(int valor, int modulo) {
  // Converter valor do potenciômetro (0-1023) para consumo de energia (kWh)
  // Cada módulo tem faixas diferentes de consumo
  float base = map(valor, 0, 1023, 0, 100);
  
  switch (modulo) {
    case 0: // Lean - Menor consumo
      return 70.0 + (base * 0.5); // 70-120 kWh
    case 1: // Circular - Consumo médio
      return 80.0 + (base * 0.6); // 80-140 kWh
    case 2: // Sustentável - Menor consumo
      return 60.0 + (base * 0.5); // 60-110 kWh
    default:
      return 100.0;
  }
}

float converterTemperatura(int valor, int modulo) {
  // Converter para temperatura em °C
  float base = map(valor, 0, 1023, 0, 100);
  
  switch (modulo) {
    case 0: // Lean
      return 40.0 + (base * 0.3); // 40-70°C
    case 1: // Circular
      return 45.0 + (base * 0.35); // 45-80°C
    case 2: // Sustentável - Menor temperatura
      return 35.0 + (base * 0.3); // 35-65°C
    default:
      return 50.0;
  }
}

float converterPressao(int valor, int modulo) {
  // Converter para pressão em bar
  float base = map(valor, 0, 1023, 0, 100);
  
  switch (modulo) {
    case 0: // Lean
      return 2.0 + (base * 0.03); // 2.0-5.0 bar
    case 1: // Circular
      return 2.5 + (base * 0.035); // 2.5-6.0 bar
    case 2: // Sustentável
      return 1.8 + (base * 0.025); // 1.8-4.3 bar
    default:
      return 3.0;
  }
}

float converterVelocidade(int valor, int modulo) {
  // Converter para velocidade em RPM
  float base = map(valor, 0, 1023, 0, 100);
  
  switch (modulo) {
    case 0: // Lean
      return 700.0 + (base * 6.0); // 700-1300 RPM
    case 1: // Circular
      return 650.0 + (base * 7.0); // 650-1350 RPM
    case 2: // Sustentável
      return 600.0 + (base * 5.5); // 600-1150 RPM
    default:
      return 1000.0;
  }
}

float calcularEficiencia(float consumo, float temp, float pressao, float velocidade, int modulo) {
  // Calcular eficiência baseada nos parâmetros e módulo
  float eficienciaBase = 85.0;
  
  // Ajustes baseados no módulo
  switch (modulo) {
    case 0: // Lean - Alta eficiência
      eficienciaBase = 88.0;
      break;
    case 1: // Circular - Eficiência média
      eficienciaBase = 82.0;
      break;
    case 2: // Sustentável - Máxima eficiência
      eficienciaBase = 92.0;
      break;
  }
  
  // Ajustes baseados nos valores
  if (consumo < 90) eficienciaBase += 2.0;
  if (temp < 60) eficienciaBase += 1.5;
  if (pressao > 2.5 && pressao < 4.5) eficienciaBase += 1.0;
  if (velocidade > 800 && velocidade < 1200) eficienciaBase += 1.5;
  
  // Adicionar variação aleatória
  eficienciaBase += random(-3, 4);
  
  // Limitar entre 70% e 98%
  return constrain(eficienciaBase, 70.0, 98.0);
}

void enviarDadosJSON(String modulo, String maquina, float consumo, float temp, float pressao, float velocidade, float eficiencia) {
  // Formato JSON para comunicação com o sistema Java
  Serial.print("{\"modulo\":\"");
  Serial.print(modulo);
  Serial.print("\",\"maquina\":\"");
  Serial.print(maquina);
  Serial.print("\",\"consumoEnergia\":");
  Serial.print(consumo, 2);
  Serial.print(",\"temperatura\":");
  Serial.print(temp, 1);
  Serial.print(",\"pressao\":");
  Serial.print(pressao, 1);
  Serial.print(",\"velocidade\":");
  Serial.print(velocidade, 0);
  Serial.print(",\"eficiencia\":");
  Serial.print(eficiencia, 1);
  Serial.print(",\"timestamp\":\"");
  Serial.print(getTimestamp());
  Serial.println("\"}");
}

void mostrarDadosMonitor(String modulo, String maquina, float consumo, float temp, float pressao, float velocidade, float eficiencia) {
  Serial.println("========================================================");
  Serial.print("Módulo: ");
  Serial.println(modulo);
  Serial.print("Máquina: ");
  Serial.println(maquina);
  Serial.print("Consumo de Energia: ");
  Serial.print(consumo, 2);
  Serial.println(" kWh");
  Serial.print("Temperatura: ");
  Serial.print(temp, 1);
  Serial.println(" °C");
  Serial.print("Pressão: ");
  Serial.print(pressao, 1);
  Serial.println(" bar");
  Serial.print("Velocidade: ");
  Serial.print(velocidade, 0);
  Serial.println(" RPM");
  Serial.print("Eficiência: ");
  Serial.print(eficiencia, 1);
  Serial.println(" %");
  Serial.println("========================================================");
  Serial.println();
}

String getTimestamp() {
  // Retorna timestamp atual (simulado)
  unsigned long segundos = millis() / 1000;
  unsigned long horas = segundos / 3600;
  unsigned long minutos = (segundos % 3600) / 60;
  segundos = segundos % 60;
  
  char timestamp[20];
  sprintf(timestamp, "%02lu:%02lu:%02lu", horas, minutos, segundos);
  return String(timestamp);
}

/*
 * INSTRUÇÕES DE USO:
 * 
 * 1. Conecte potenciômetros aos pinos A0, A1, A2, A3
 * 2. Faça upload do código para o Arduino
 * 3. Abra o Monitor Serial (9600 baud)
 * 4. Ajuste os potenciômetros para simular diferentes valores
 * 5. Os dados serão enviados automaticamente a cada 5 segundos
 * 6. O sistema alterna entre os 3 módulos automaticamente
 * 
 * FORMATO DOS DADOS:
 * - JSON via Serial para integração com sistema Java
 * - Dados formatados no Monitor Serial para visualização
 * 
 * CARACTERÍSTICAS DOS MÓDULOS:
 * - LEAN: Menor consumo, alta eficiência
 * - CIRCULAR: Consumo médio, eficiência média
 * - SUSTENTÁVEL: Menor consumo, máxima eficiência
 */ 