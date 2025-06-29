package com.sistema.dto;

import com.sistema.model.DadosMaquina.TipoModulo;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

public class RelatorioDTO {
    
    @NotNull(message = "Data inicial é obrigatória")
    private LocalDate dataInicial;
    
    @NotNull(message = "Data final é obrigatória")
    private LocalDate dataFinal;
    
    private TipoModulo tipoModulo;
    private String nomeMaquina;
    private String formato; // PDF, EXCEL, CSV
    
    public RelatorioDTO() {}
    
    public RelatorioDTO(LocalDate dataInicial, LocalDate dataFinal, TipoModulo tipoModulo, String nomeMaquina, String formato) {
        this.dataInicial = dataInicial;
        this.dataFinal = dataFinal;
        this.tipoModulo = tipoModulo;
        this.nomeMaquina = nomeMaquina;
        this.formato = formato;
    }
    
    // Getters e Setters
    public LocalDate getDataInicial() {
        return dataInicial;
    }
    
    public void setDataInicial(LocalDate dataInicial) {
        this.dataInicial = dataInicial;
    }
    
    public LocalDate getDataFinal() {
        return dataFinal;
    }
    
    public void setDataFinal(LocalDate dataFinal) {
        this.dataFinal = dataFinal;
    }
    
    public TipoModulo getTipoModulo() {
        return tipoModulo;
    }
    
    public void setTipoModulo(TipoModulo tipoModulo) {
        this.tipoModulo = tipoModulo;
    }
    
    public String getNomeMaquina() {
        return nomeMaquina;
    }
    
    public void setNomeMaquina(String nomeMaquina) {
        this.nomeMaquina = nomeMaquina;
    }
    
    public String getFormato() {
        return formato;
    }
    
    public void setFormato(String formato) {
        this.formato = formato;
    }
} 