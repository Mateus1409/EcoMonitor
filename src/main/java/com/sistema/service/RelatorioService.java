package com.sistema.service;

import com.sistema.dto.EstatisticasDTO;
import com.sistema.dto.RelatorioDTO;
import com.sistema.model.DadosMaquina;
import com.sistema.repository.DadosMaquinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RelatorioService {
    
    @Autowired
    private DadosMaquinaRepository dadosMaquinaRepository;
    
    @Autowired
    private GeradorRelatorioService geradorRelatorioService;
    
    public byte[] gerarRelatorio(RelatorioDTO relatorioDTO) throws Exception {
        // Converter datas para LocalDateTime
        LocalDateTime dataInicial = relatorioDTO.getDataInicial().atStartOfDay();
        LocalDateTime dataFinal = relatorioDTO.getDataFinal().atTime(LocalTime.MAX);
        
        // Buscar dados do período
        List<DadosMaquina> dados = buscarDadosPorPeriodo(
            dataInicial, 
            dataFinal, 
            relatorioDTO.getTipoModulo(), 
            relatorioDTO.getNomeMaquina()
        );
        
        // Calcular estatísticas
        EstatisticasDTO estatisticas = calcularEstatisticas(dados, dataInicial, dataFinal);
        
        // Gerar relatório no formato solicitado
        switch (relatorioDTO.getFormato().toUpperCase()) {
            case "PDF":
                return geradorRelatorioService.gerarRelatorioPDF(dados, estatisticas, relatorioDTO);
            case "EXCEL":
                return geradorRelatorioService.gerarRelatorioExcel(dados, estatisticas, relatorioDTO);
            case "CSV":
                return geradorRelatorioService.gerarRelatorioCSV(dados, estatisticas, relatorioDTO);
            default:
                throw new IllegalArgumentException("Formato de relatório não suportado: " + relatorioDTO.getFormato());
        }
    }
    
    public EstatisticasDTO gerarEstatisticas(LocalDate dataInicial, LocalDate dataFinal, 
                                           DadosMaquina.TipoModulo tipoModulo, String nomeMaquina) {
        LocalDateTime inicio = dataInicial.atStartOfDay();
        LocalDateTime fim = dataFinal.atTime(LocalTime.MAX);
        
        List<DadosMaquina> dados = buscarDadosPorPeriodo(inicio, fim, tipoModulo, nomeMaquina);
        return calcularEstatisticas(dados, inicio, fim);
    }
    
    private List<DadosMaquina> buscarDadosPorPeriodo(LocalDateTime dataInicial, LocalDateTime dataFinal,
                                                    DadosMaquina.TipoModulo tipoModulo, String nomeMaquina) {
        if (tipoModulo != null && nomeMaquina != null && !nomeMaquina.trim().isEmpty()) {
            return dadosMaquinaRepository.findByTipoModuloAndNomeMaquinaAndTimestampBetweenOrderByTimestampDesc(
                tipoModulo, nomeMaquina, dataInicial, dataFinal);
        } else if (tipoModulo != null) {
            return dadosMaquinaRepository.findByTipoModuloAndTimestampBetweenOrderByTimestampDesc(
                tipoModulo, dataInicial, dataFinal);
        } else if (nomeMaquina != null && !nomeMaquina.trim().isEmpty()) {
            return dadosMaquinaRepository.findByNomeMaquinaAndTimestampBetweenOrderByTimestampDesc(
                nomeMaquina, dataInicial, dataFinal);
        } else {
            return dadosMaquinaRepository.findByTimestampBetweenOrderByTimestampDesc(dataInicial, dataFinal);
        }
    }
    
    private EstatisticasDTO calcularEstatisticas(List<DadosMaquina> dados, LocalDateTime periodoInicial, LocalDateTime periodoFinal) {
        EstatisticasDTO estatisticas = new EstatisticasDTO();
        estatisticas.setPeriodoInicial(periodoInicial);
        estatisticas.setPeriodoFinal(periodoFinal);
        estatisticas.setTotalRegistros((long) dados.size());
        
        if (dados.isEmpty()) {
            return estatisticas;
        }
        
        // Agrupar por módulo se houver dados de diferentes módulos
        Map<DadosMaquina.TipoModulo, List<DadosMaquina>> dadosPorModulo = 
            dados.stream().collect(Collectors.groupingBy(DadosMaquina::getTipoModulo));
        
        // Se todos os dados são do mesmo módulo, definir o módulo
        if (dadosPorModulo.size() == 1) {
            estatisticas.setTipoModulo(dadosPorModulo.keySet().iterator().next());
        }
        
        // Se todos os dados são da mesma máquina, definir a máquina
        String nomeMaquina = dados.get(0).getNomeMaquina();
        boolean mesmaMaquina = dados.stream().allMatch(d -> d.getNomeMaquina().equals(nomeMaquina));
        if (mesmaMaquina) {
            estatisticas.setNomeMaquina(nomeMaquina);
        }
        
        // Calcular estatísticas de consumo de energia
        DoubleSummaryStatistics consumoStats = dados.stream()
            .mapToDouble(DadosMaquina::getConsumoEnergia)
            .summaryStatistics();
        
        estatisticas.setConsumoEnergiaMedia(consumoStats.getAverage());
        estatisticas.setConsumoEnergiaMin(consumoStats.getMin());
        estatisticas.setConsumoEnergiaMax(consumoStats.getMax());
        estatisticas.setConsumoEnergiaTotal(consumoStats.getSum());
        
        // Calcular estatísticas de temperatura
        DoubleSummaryStatistics tempStats = dados.stream()
            .mapToDouble(DadosMaquina::getTemperatura)
            .summaryStatistics();
        
        estatisticas.setTemperaturaMedia(tempStats.getAverage());
        estatisticas.setTemperaturaMin(tempStats.getMin());
        estatisticas.setTemperaturaMax(tempStats.getMax());
        
        // Calcular estatísticas de pressão
        DoubleSummaryStatistics pressaoStats = dados.stream()
            .mapToDouble(DadosMaquina::getPressao)
            .summaryStatistics();
        
        estatisticas.setPressaoMedia(pressaoStats.getAverage());
        estatisticas.setPressaoMin(pressaoStats.getMin());
        estatisticas.setPressaoMax(pressaoStats.getMax());
        
        // Calcular estatísticas de velocidade
        DoubleSummaryStatistics velocidadeStats = dados.stream()
            .mapToDouble(DadosMaquina::getVelocidade)
            .summaryStatistics();
        
        estatisticas.setVelocidadeMedia(velocidadeStats.getAverage());
        estatisticas.setVelocidadeMin(velocidadeStats.getMin());
        estatisticas.setVelocidadeMax(velocidadeStats.getMax());
        
        // Calcular estatísticas de eficiência
        DoubleSummaryStatistics eficienciaStats = dados.stream()
            .mapToDouble(DadosMaquina::getEficiencia)
            .summaryStatistics();
        
        estatisticas.setEficienciaMedia(eficienciaStats.getAverage());
        estatisticas.setEficienciaMin(eficienciaStats.getMin());
        estatisticas.setEficienciaMax(eficienciaStats.getMax());
        
        return estatisticas;
    }
    
    public Map<String, Object> gerarResumoExecutivo(LocalDate dataInicial, LocalDate dataFinal) {
        LocalDateTime inicio = dataInicial.atStartOfDay();
        LocalDateTime fim = dataFinal.atTime(LocalTime.MAX);
        
        List<DadosMaquina> todosDados = dadosMaquinaRepository.findByTimestampBetweenOrderByTimestampDesc(inicio, fim);
        
        Map<String, Object> resumo = new java.util.HashMap<>();
        
        // Total de registros
        resumo.put("totalRegistros", todosDados.size());
        
        // Registros por módulo
        Map<DadosMaquina.TipoModulo, Long> registrosPorModulo = todosDados.stream()
            .collect(Collectors.groupingBy(DadosMaquina::getTipoModulo, Collectors.counting()));
        resumo.put("registrosPorModulo", registrosPorModulo);
        
        // Média de eficiência por módulo
        Map<DadosMaquina.TipoModulo, Double> eficienciaPorModulo = todosDados.stream()
            .collect(Collectors.groupingBy(
                DadosMaquina::getTipoModulo,
                Collectors.averagingDouble(DadosMaquina::getEficiencia)
            ));
        resumo.put("eficienciaPorModulo", eficienciaPorModulo);
        
        // Consumo total de energia
        double consumoTotal = todosDados.stream()
            .mapToDouble(DadosMaquina::getConsumoEnergia)
            .sum();
        resumo.put("consumoTotalEnergia", consumoTotal);
        
        // Módulo mais eficiente
        DadosMaquina.TipoModulo moduloMaisEficiente = eficienciaPorModulo.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(null);
        resumo.put("moduloMaisEficiente", moduloMaisEficiente);
        
        return resumo;
    }
} 