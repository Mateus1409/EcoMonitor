package com.sistema.dto;

import com.sistema.model.DadosMaquina.TipoModulo;
import java.time.LocalDateTime;

public class EstatisticasDTO {
    
    private TipoModulo tipoModulo;
    private String nomeMaquina;
    private LocalDateTime periodoInicial;
    private LocalDateTime periodoFinal;
    
    // Estatísticas de Consumo de Energia
    private Double consumoEnergiaMedia;
    private Double consumoEnergiaMin;
    private Double consumoEnergiaMax;
    private Double consumoEnergiaTotal;
    
    // Estatísticas de Temperatura
    private Double temperaturaMedia;
    private Double temperaturaMin;
    private Double temperaturaMax;
    
    // Estatísticas de Pressão
    private Double pressaoMedia;
    private Double pressaoMin;
    private Double pressaoMax;
    
    // Estatísticas de Velocidade
    private Double velocidadeMedia;
    private Double velocidadeMin;
    private Double velocidadeMax;
    
    // Estatísticas de Eficiência
    private Double eficienciaMedia;
    private Double eficienciaMin;
    private Double eficienciaMax;
    
    // Contadores
    private Long totalRegistros;
    private Long registrosPorModulo;
    
    public EstatisticasDTO() {}
    
    // Getters e Setters
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
    
    public LocalDateTime getPeriodoInicial() {
        return periodoInicial;
    }
    
    public void setPeriodoInicial(LocalDateTime periodoInicial) {
        this.periodoInicial = periodoInicial;
    }
    
    public LocalDateTime getPeriodoFinal() {
        return periodoFinal;
    }
    
    public void setPeriodoFinal(LocalDateTime periodoFinal) {
        this.periodoFinal = periodoFinal;
    }
    
    public Double getConsumoEnergiaMedia() {
        return consumoEnergiaMedia;
    }
    
    public void setConsumoEnergiaMedia(Double consumoEnergiaMedia) {
        this.consumoEnergiaMedia = consumoEnergiaMedia;
    }
    
    public Double getConsumoEnergiaMin() {
        return consumoEnergiaMin;
    }
    
    public void setConsumoEnergiaMin(Double consumoEnergiaMin) {
        this.consumoEnergiaMin = consumoEnergiaMin;
    }
    
    public Double getConsumoEnergiaMax() {
        return consumoEnergiaMax;
    }
    
    public void setConsumoEnergiaMax(Double consumoEnergiaMax) {
        this.consumoEnergiaMax = consumoEnergiaMax;
    }
    
    public Double getConsumoEnergiaTotal() {
        return consumoEnergiaTotal;
    }
    
    public void setConsumoEnergiaTotal(Double consumoEnergiaTotal) {
        this.consumoEnergiaTotal = consumoEnergiaTotal;
    }
    
    public Double getTemperaturaMedia() {
        return temperaturaMedia;
    }
    
    public void setTemperaturaMedia(Double temperaturaMedia) {
        this.temperaturaMedia = temperaturaMedia;
    }
    
    public Double getTemperaturaMin() {
        return temperaturaMin;
    }
    
    public void setTemperaturaMin(Double temperaturaMin) {
        this.temperaturaMin = temperaturaMin;
    }
    
    public Double getTemperaturaMax() {
        return temperaturaMax;
    }
    
    public void setTemperaturaMax(Double temperaturaMax) {
        this.temperaturaMax = temperaturaMax;
    }
    
    public Double getPressaoMedia() {
        return pressaoMedia;
    }
    
    public void setPressaoMedia(Double pressaoMedia) {
        this.pressaoMedia = pressaoMedia;
    }
    
    public Double getPressaoMin() {
        return pressaoMin;
    }
    
    public void setPressaoMin(Double pressaoMin) {
        this.pressaoMin = pressaoMin;
    }
    
    public Double getPressaoMax() {
        return pressaoMax;
    }
    
    public void setPressaoMax(Double pressaoMax) {
        this.pressaoMax = pressaoMax;
    }
    
    public Double getVelocidadeMedia() {
        return velocidadeMedia;
    }
    
    public void setVelocidadeMedia(Double velocidadeMedia) {
        this.velocidadeMedia = velocidadeMedia;
    }
    
    public Double getVelocidadeMin() {
        return velocidadeMin;
    }
    
    public void setVelocidadeMin(Double velocidadeMin) {
        this.velocidadeMin = velocidadeMin;
    }
    
    public Double getVelocidadeMax() {
        return velocidadeMax;
    }
    
    public void setVelocidadeMax(Double velocidadeMax) {
        this.velocidadeMax = velocidadeMax;
    }
    
    public Double getEficienciaMedia() {
        return eficienciaMedia;
    }
    
    public void setEficienciaMedia(Double eficienciaMedia) {
        this.eficienciaMedia = eficienciaMedia;
    }
    
    public Double getEficienciaMin() {
        return eficienciaMin;
    }
    
    public void setEficienciaMin(Double eficienciaMin) {
        this.eficienciaMin = eficienciaMin;
    }
    
    public Double getEficienciaMax() {
        return eficienciaMax;
    }
    
    public void setEficienciaMax(Double eficienciaMax) {
        this.eficienciaMax = eficienciaMax;
    }
    
    public Long getTotalRegistros() {
        return totalRegistros;
    }
    
    public void setTotalRegistros(Long totalRegistros) {
        this.totalRegistros = totalRegistros;
    }
    
    public Long getRegistrosPorModulo() {
        return registrosPorModulo;
    }
    
    public void setRegistrosPorModulo(Long registrosPorModulo) {
        this.registrosPorModulo = registrosPorModulo;
    }
} 