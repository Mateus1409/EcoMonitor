package com.sistema.service;

import com.sistema.model.DadosMaquina;
import com.sistema.repository.DadosMaquinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class DadosMaquinaService {
    
    @Autowired
    private DadosMaquinaRepository repository;
    
    private final Random random = new Random();
    
    @CacheEvict(value = {"dadosPrincipais", "kpis", "estatisticas", "tendencias"}, allEntries = true)
    public DadosMaquina salvarDados(DadosMaquina dados) {
        if (dados.getTimestamp() == null) {
            dados.setTimestamp(LocalDateTime.now());
        }
        return repository.save(dados);
    }
    
    @Cacheable("dadosPrincipais")
    public List<DadosMaquina> buscarTodos() {
        return repository.findAll();
    }
    
    @Cacheable(value = "dadosPrincipais", key = "#tipoModulo.name()")
    public List<DadosMaquina> buscarPorModulo(DadosMaquina.TipoModulo tipoModulo) {
        return repository.findByTipoModuloOrderByTimestampDesc(tipoModulo);
    }
    
    @Cacheable(value = "dadosPrincipais", key = "#nomeMaquina")
    public List<DadosMaquina> buscarPorMaquina(String nomeMaquina) {
        return repository.findByNomeMaquinaOrderByTimestampDesc(nomeMaquina);
    }
    
    @Cacheable(value = "dadosPrincipais", key = "#inicio.toString() + '_' + #fim.toString()")
    public List<DadosMaquina> buscarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return repository.findByTimestampBetweenOrderByTimestampDesc(inicio, fim);
    }
    
    @Cacheable(value = "estatisticas", key = "#tipoModulo.name() + '_' + #inicio.toString()")
    public Double getConsumoMedioEnergia(DadosMaquina.TipoModulo tipoModulo, LocalDateTime inicio) {
        return repository.getConsumoMedioEnergia(tipoModulo, inicio);
    }
    
    @Cacheable(value = "estatisticas", key = "#tipoModulo.name() + '_' + #inicio.toString() + '_eficiencia'")
    public Double getEficienciaMedia(DadosMaquina.TipoModulo tipoModulo, LocalDateTime inicio) {
        return repository.getEficienciaMedia(tipoModulo, inicio);
    }
    
    // Simulação de dados do Arduino
    @CacheEvict(value = {"dadosPrincipais", "kpis", "estatisticas", "tendencias"}, allEntries = true)
    public DadosMaquina gerarDadosSimulados(DadosMaquina.TipoModulo tipoModulo, String nomeMaquina) {
        DadosMaquina dados = new DadosMaquina();
        dados.setTipoModulo(tipoModulo);
        dados.setNomeMaquina(nomeMaquina);
        
        // Simular valores baseados no tipo de módulo
        switch (tipoModulo) {
            case LEAN:
                dados.setConsumoEnergia(gerarValorAleatorio(80.0, 120.0)); // Menor consumo
                dados.setTemperatura(gerarValorAleatorio(45.0, 65.0));
                dados.setPressao(gerarValorAleatorio(2.5, 4.0));
                dados.setVelocidade(gerarValorAleatorio(800.0, 1200.0));
                dados.setEficiencia(gerarValorAleatorio(85.0, 95.0)); // Alta eficiência
                break;
                
            case CIRCULAR:
                dados.setConsumoEnergia(gerarValorAleatorio(90.0, 130.0));
                dados.setTemperatura(gerarValorAleatorio(50.0, 70.0));
                dados.setPressao(gerarValorAleatorio(2.8, 4.2));
                dados.setVelocidade(gerarValorAleatorio(750.0, 1150.0));
                dados.setEficiencia(gerarValorAleatorio(80.0, 90.0));
                break;
                
            case SUSTENTAVEL:
                dados.setConsumoEnergia(gerarValorAleatorio(70.0, 110.0)); // Menor consumo
                dados.setTemperatura(gerarValorAleatorio(40.0, 60.0)); // Menor temperatura
                dados.setPressao(gerarValorAleatorio(2.2, 3.8));
                dados.setVelocidade(gerarValorAleatorio(700.0, 1100.0));
                dados.setEficiencia(gerarValorAleatorio(90.0, 98.0)); // Máxima eficiência
                break;
        }
        
        dados.setTimestamp(LocalDateTime.now());
        return repository.save(dados);
    }
    
    private Double gerarValorAleatorio(Double min, Double max) {
        return min + (max - min) * random.nextDouble();
    }
    
    @CacheEvict(value = {"dadosPrincipais", "kpis", "estatisticas", "tendencias"}, allEntries = true)
    public void limparDadosAntigos(LocalDateTime antesDe) {
        List<DadosMaquina> dadosAntigos = repository.findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime.MIN, antesDe);
        repository.deleteAll(dadosAntigos);
    }
    
    @Cacheable(value = "tendencias", key = "#periodo")
    public Map<String, Object> agruparDadosPorTempo(List<DadosMaquina> dados, String periodo) {
        Map<String, Object> resultado = new java.util.HashMap<>();
        Map<String, java.util.List<DadosMaquina>> grupos = new java.util.HashMap<>();
        
        for (DadosMaquina dado : dados) {
            String chave;
            if ("24h".equals(periodo)) {
                // Agrupar por hora
                chave = dado.getTimestamp().getHour() + ":" + 
                       String.format("%02d", dado.getTimestamp().getMinute());
            } else {
                // Agrupar por dia
                chave = dado.getTimestamp().toLocalDate().toString();
            }
            
            grupos.computeIfAbsent(chave, k -> new java.util.ArrayList<>()).add(dado);
        }
        
        // Calcular médias para cada grupo
        java.util.List<Map<String, Object>> dadosAgrupados = new java.util.ArrayList<>();
        for (Map.Entry<String, java.util.List<DadosMaquina>> entry : grupos.entrySet()) {
            java.util.List<DadosMaquina> grupo = entry.getValue();
            
            double consumoMedio = grupo.stream().mapToDouble(DadosMaquina::getConsumoEnergia).average().orElse(0.0);
            double eficienciaMedia = grupo.stream().mapToDouble(DadosMaquina::getEficiencia).average().orElse(0.0);
            double temperaturaMedia = grupo.stream().mapToDouble(DadosMaquina::getTemperatura).average().orElse(0.0);
            
            Map<String, Object> grupoData = new java.util.HashMap<>();
            grupoData.put("label", entry.getKey());
            grupoData.put("consumoMedio", Math.round(consumoMedio * 10.0) / 10.0);
            grupoData.put("eficienciaMedia", Math.round(eficienciaMedia * 10.0) / 10.0);
            grupoData.put("temperaturaMedia", Math.round(temperaturaMedia * 10.0) / 10.0);
            
            dadosAgrupados.add(grupoData);
        }
        
        resultado.put("dados", dadosAgrupados);
        resultado.put("periodo", periodo);
        
        return resultado;
    }
} 