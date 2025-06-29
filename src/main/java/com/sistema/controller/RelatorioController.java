package com.sistema.controller;

import com.sistema.dto.EstatisticasDTO;
import com.sistema.dto.RelatorioDTO;
import com.sistema.model.DadosMaquina;
import com.sistema.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {
    
    @Autowired
    private RelatorioService relatorioService;
    
    @PostMapping("/gerar")
    public ResponseEntity<byte[]> gerarRelatorio(@Valid @RequestBody RelatorioDTO relatorioDTO) {
        try {
            byte[] relatorio = relatorioService.gerarRelatorio(relatorioDTO);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(getMediaType(relatorioDTO.getFormato()));
            headers.setContentDispositionFormData("attachment", getNomeArquivo(relatorioDTO));
            
            return new ResponseEntity<>(relatorio, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/estatisticas")
    public ResponseEntity<EstatisticasDTO> obterEstatisticas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicial,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFinal,
            @RequestParam(required = false) DadosMaquina.TipoModulo tipoModulo,
            @RequestParam(required = false) String nomeMaquina) {
        
        try {
            EstatisticasDTO estatisticas = relatorioService.gerarEstatisticas(
                dataInicial, dataFinal, tipoModulo, nomeMaquina);
            return ResponseEntity.ok(estatisticas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/resumo-executivo")
    public ResponseEntity<Map<String, Object>> obterResumoExecutivo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicial,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFinal) {
        
        try {
            Map<String, Object> resumo = relatorioService.gerarResumoExecutivo(dataInicial, dataFinal);
            return ResponseEntity.ok(resumo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/download/csv")
    public ResponseEntity<byte[]> downloadCSV(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicial,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFinal,
            @RequestParam(required = false) DadosMaquina.TipoModulo tipoModulo,
            @RequestParam(required = false) String nomeMaquina) {
        
        try {
            RelatorioDTO relatorioDTO = new RelatorioDTO(dataInicial, dataFinal, tipoModulo, nomeMaquina, "CSV");
            byte[] relatorio = relatorioService.gerarRelatorio(relatorioDTO);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "relatorio_" + dataInicial + "_" + dataFinal + ".csv");
            
            return new ResponseEntity<>(relatorio, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private MediaType getMediaType(String formato) {
        switch (formato.toUpperCase()) {
            case "PDF":
                return MediaType.APPLICATION_PDF;
            case "EXCEL":
                return MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            case "CSV":
                return MediaType.parseMediaType("text/csv");
            default:
                return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
    
    private String getNomeArquivo(RelatorioDTO relatorioDTO) {
        String prefixo = "relatorio_monitoramento";
        String periodo = relatorioDTO.getDataInicial() + "_" + relatorioDTO.getDataFinal();
        
        if (relatorioDTO.getTipoModulo() != null) {
            prefixo += "_" + relatorioDTO.getTipoModulo().name().toLowerCase();
        }
        
        if (relatorioDTO.getNomeMaquina() != null && !relatorioDTO.getNomeMaquina().trim().isEmpty()) {
            prefixo += "_" + relatorioDTO.getNomeMaquina().replaceAll("\\s+", "_");
        }
        
        switch (relatorioDTO.getFormato().toUpperCase()) {
            case "PDF":
                return prefixo + "_" + periodo + ".pdf";
            case "EXCEL":
                return prefixo + "_" + periodo + ".xlsx";
            case "CSV":
                return prefixo + "_" + periodo + ".csv";
            default:
                return prefixo + "_" + periodo + ".txt";
        }
    }
} 