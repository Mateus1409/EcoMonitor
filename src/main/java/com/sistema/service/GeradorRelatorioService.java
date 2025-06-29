package com.sistema.service;

import com.sistema.dto.EstatisticasDTO;
import com.sistema.dto.RelatorioDTO;
import com.sistema.model.DadosMaquina;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class GeradorRelatorioService {
    
    public byte[] gerarRelatorioPDF(List<DadosMaquina> dados, EstatisticasDTO estatisticas, RelatorioDTO relatorioDTO) throws Exception {
        // Implementação básica - será expandida posteriormente
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        // Aqui seria implementada a geração do PDF usando iText
        // Por enquanto, retornamos um PDF simples
        String conteudo = gerarConteudoRelatorio(dados, estatisticas, relatorioDTO);
        baos.write(conteudo.getBytes());
        
        return baos.toByteArray();
    }
    
    public byte[] gerarRelatorioExcel(List<DadosMaquina> dados, EstatisticasDTO estatisticas, RelatorioDTO relatorioDTO) throws Exception {
        // Implementação básica - será expandida posteriormente
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        // Aqui seria implementada a geração do Excel usando Apache POI
        // Por enquanto, retornamos um CSV que pode ser aberto no Excel
        String conteudo = gerarConteudoRelatorio(dados, estatisticas, relatorioDTO);
        baos.write(conteudo.getBytes());
        
        return baos.toByteArray();
    }
    
    public byte[] gerarRelatorioCSV(List<DadosMaquina> dados, EstatisticasDTO estatisticas, RelatorioDTO relatorioDTO) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        StringBuilder csv = new StringBuilder();
        
        // Cabeçalho
        csv.append("Módulo,Máquina,Consumo Energia (kWh),Temperatura (°C),Pressão (bar),Velocidade (RPM),Eficiência (%),Data/Hora\n");
        
        // Dados
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        for (DadosMaquina dado : dados) {
            csv.append(String.format("%s,%s,%.2f,%.2f,%.2f,%.2f,%.2f,%s\n",
                dado.getTipoModulo().getDescricao(),
                dado.getNomeMaquina(),
                dado.getConsumoEnergia(),
                dado.getTemperatura(),
                dado.getPressao(),
                dado.getVelocidade(),
                dado.getEficiencia(),
                dado.getTimestamp().format(formatter)
            ));
        }
        
        baos.write(csv.toString().getBytes("UTF-8"));
        return baos.toByteArray();
    }
    
    private String gerarConteudoRelatorio(List<DadosMaquina> dados, EstatisticasDTO estatisticas, RelatorioDTO relatorioDTO) {
        StringBuilder conteudo = new StringBuilder();
        
        conteudo.append("=== RELATÓRIO DE MONITORAMENTO ===\n\n");
        conteudo.append("Período: ").append(relatorioDTO.getDataInicial()).append(" a ").append(relatorioDTO.getDataFinal()).append("\n");
        conteudo.append("Formato: ").append(relatorioDTO.getFormato()).append("\n\n");
        
        if (estatisticas.getTipoModulo() != null) {
            conteudo.append("Módulo: ").append(estatisticas.getTipoModulo().getDescricao()).append("\n");
        }
        
        if (estatisticas.getNomeMaquina() != null) {
            conteudo.append("Máquina: ").append(estatisticas.getNomeMaquina()).append("\n");
        }
        
        conteudo.append("Total de Registros: ").append(estatisticas.getTotalRegistros()).append("\n\n");
        
        // Estatísticas
        conteudo.append("=== ESTATÍSTICAS ===\n");
        conteudo.append("Consumo de Energia:\n");
        conteudo.append("  - Média: ").append(String.format("%.2f kWh", estatisticas.getConsumoEnergiaMedia())).append("\n");
        conteudo.append("  - Mínimo: ").append(String.format("%.2f kWh", estatisticas.getConsumoEnergiaMin())).append("\n");
        conteudo.append("  - Máximo: ").append(String.format("%.2f kWh", estatisticas.getConsumoEnergiaMax())).append("\n");
        conteudo.append("  - Total: ").append(String.format("%.2f kWh", estatisticas.getConsumoEnergiaTotal())).append("\n\n");
        
        conteudo.append("Temperatura:\n");
        conteudo.append("  - Média: ").append(String.format("%.2f °C", estatisticas.getTemperaturaMedia())).append("\n");
        conteudo.append("  - Mínimo: ").append(String.format("%.2f °C", estatisticas.getTemperaturaMin())).append("\n");
        conteudo.append("  - Máximo: ").append(String.format("%.2f °C", estatisticas.getTemperaturaMax())).append("\n\n");
        
        conteudo.append("Eficiência:\n");
        conteudo.append("  - Média: ").append(String.format("%.2f%%", estatisticas.getEficienciaMedia())).append("\n");
        conteudo.append("  - Mínimo: ").append(String.format("%.2f%%", estatisticas.getEficienciaMin())).append("\n");
        conteudo.append("  - Máximo: ").append(String.format("%.2f%%", estatisticas.getEficienciaMax())).append("\n\n");
        
        return conteudo.toString();
    }
} 