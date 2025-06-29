package com.sistema.controller;

import com.sistema.model.DadosMaquina;
import com.sistema.service.DadosMaquinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dados")
@CrossOrigin(origins = "*")
public class DadosMaquinaController {
    
    @Autowired
    private DadosMaquinaService service;
    
    @PostMapping
    public ResponseEntity<DadosMaquina> salvarDados(@RequestBody DadosMaquina dados) {
        DadosMaquina dadosSalvos = service.salvarDados(dados);
        return ResponseEntity.ok(dadosSalvos);
    }
    
    @GetMapping
    @Cacheable("dadosPrincipais")
    public ResponseEntity<List<DadosMaquina>> buscarTodos() {
        List<DadosMaquina> dados = service.buscarTodos();
        return ResponseEntity.ok(dados);
    }
    
    @GetMapping("/modulo/{tipoModulo}")
    @Cacheable(value = "dadosPrincipais", key = "#tipoModulo")
    public ResponseEntity<List<DadosMaquina>> buscarPorModulo(@PathVariable String tipoModulo) {
        try {
            DadosMaquina.TipoModulo tipo = DadosMaquina.TipoModulo.valueOf(tipoModulo.toUpperCase());
            List<DadosMaquina> dados = service.buscarPorModulo(tipo);
            return ResponseEntity.ok(dados);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/maquina/{nomeMaquina}")
    @Cacheable(value = "dadosPrincipais", key = "#nomeMaquina")
    public ResponseEntity<List<DadosMaquina>> buscarPorMaquina(@PathVariable String nomeMaquina) {
        List<DadosMaquina> dados = service.buscarPorMaquina(nomeMaquina);
        return ResponseEntity.ok(dados);
    }
    
    @GetMapping("/estatisticas/{tipoModulo}")
    @Cacheable(value = "estatisticas", key = "#tipoModulo")
    public ResponseEntity<Map<String, Double>> getEstatisticas(@PathVariable String tipoModulo) {
        try {
            DadosMaquina.TipoModulo tipo = DadosMaquina.TipoModulo.valueOf(tipoModulo.toUpperCase());
            LocalDateTime inicio = LocalDateTime.now().minusHours(24); // Últimas 24 horas
            
            Double consumoMedio = service.getConsumoMedioEnergia(tipo, inicio);
            Double eficienciaMedia = service.getEficienciaMedia(tipo, inicio);
            
            Map<String, Double> estatisticas = Map.of(
                "consumoMedioEnergia", consumoMedio != null ? consumoMedio : 0.0,
                "eficienciaMedia", eficienciaMedia != null ? eficienciaMedia : 0.0
            );
            
            return ResponseEntity.ok(estatisticas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/simular/{tipoModulo}")
    public ResponseEntity<DadosMaquina> simularDadosArduino(
            @PathVariable String tipoModulo,
            @RequestParam String nomeMaquina) {
        try {
            DadosMaquina.TipoModulo tipo = DadosMaquina.TipoModulo.valueOf(tipoModulo.toUpperCase());
            DadosMaquina dadosSimulados = service.gerarDadosSimulados(tipo, nomeMaquina);
            return ResponseEntity.ok(dadosSimulados);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/limpar")
    public ResponseEntity<Void> limparDadosAntigos(@RequestParam(defaultValue = "7") int dias) {
        LocalDateTime antesDe = LocalDateTime.now().minusDays(dias);
        service.limparDadosAntigos(antesDe);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/kpis")
    @Cacheable("kpis")
    public ResponseEntity<Map<String, Object>> getKPIs() {
        try {
            LocalDateTime vinteQuatroHorasAtras = LocalDateTime.now().minusHours(24);
            LocalDateTime duasHorasAtras = LocalDateTime.now().minusHours(2);
            
            // Buscar dados das últimas 24 horas
            List<DadosMaquina> dados24h = service.buscarPorPeriodo(vinteQuatroHorasAtras, LocalDateTime.now());
            List<DadosMaquina> dados2h = service.buscarPorPeriodo(duasHorasAtras, LocalDateTime.now());
            
            // Calcular KPIs
            double consumoTotal = dados24h.stream().mapToDouble(DadosMaquina::getConsumoEnergia).sum();
            double eficienciaMedia = dados24h.stream().mapToDouble(DadosMaquina::getEficiencia).average().orElse(0.0);
            double temperaturaMedia = dados24h.stream().mapToDouble(DadosMaquina::getTemperatura).average().orElse(0.0);
            long maquinasAtivas = dados2h.stream().map(DadosMaquina::getNomeMaquina).distinct().count();
            
            // Calcular variações (simulado para demonstração)
            double variacaoConsumo = (Math.random() - 0.5) * 10;
            double variacaoEficiencia = (Math.random() - 0.5) * 5;
            double variacaoTemperatura = (Math.random() - 0.5) * 3;
            
            Map<String, Object> kpis = Map.of(
                "consumoTotal", Math.round(consumoTotal * 10.0) / 10.0,
                "eficienciaMedia", Math.round(eficienciaMedia * 10.0) / 10.0,
                "temperaturaMedia", Math.round(temperaturaMedia * 10.0) / 10.0,
                "maquinasAtivas", maquinasAtivas,
                "variacaoConsumo", Math.round(variacaoConsumo * 10.0) / 10.0,
                "variacaoEficiencia", Math.round(variacaoEficiencia * 10.0) / 10.0,
                "variacaoTemperatura", Math.round(variacaoTemperatura * 10.0) / 10.0
            );
            
            return ResponseEntity.ok(kpis);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/tendencias")
    @Cacheable(value = "tendencias", key = "#periodo")
    public ResponseEntity<Map<String, Object>> getTendencias(@RequestParam String periodo) {
        try {
            LocalDateTime dataInicial;
            LocalDateTime dataFinal = LocalDateTime.now();
            
            switch (periodo) {
                case "24h":
                    dataInicial = LocalDateTime.now().minusHours(24);
                    break;
                case "7d":
                    dataInicial = LocalDateTime.now().minusDays(7);
                    break;
                case "30d":
                    dataInicial = LocalDateTime.now().minusDays(30);
                    break;
                default:
                    dataInicial = LocalDateTime.now().minusHours(24);
            }
            
            List<DadosMaquina> dados = service.buscarPorPeriodo(dataInicial, dataFinal);
            
            // Agrupar dados por período
            Map<String, Object> tendencias = service.agruparDadosPorTempo(dados, periodo);
            
            return ResponseEntity.ok(tendencias);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 