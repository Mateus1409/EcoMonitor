package com.sistema.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dados_maquina")
public class DadosMaquina {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoModulo tipoModulo;
    
    @Column(nullable = false)
    private String nomeMaquina;
    
    @Column(nullable = false)
    private Double consumoEnergia; // kWh
    
    @Column(nullable = false)
    private Double temperatura; // °C
    
    @Column(nullable = false)
    private Double pressao; // bar
    
    @Column(nullable = false)
    private Double velocidade; // RPM
    
    @Column(nullable = false)
    private Double eficiencia; // %
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column
    private String observacoes;
    
    public enum TipoModulo {
        LEAN("Lean"),
        CIRCULAR("Circular"),
        SUSTENTAVEL("Sustentável");
        
        private final String descricao;
        
        TipoModulo(String descricao) {
            this.descricao = descricao;
        }
        
        public String getDescricao() {
            return descricao;
        }
    }
    
    // Construtores
    public DadosMaquina() {}
    
    public DadosMaquina(TipoModulo tipoModulo, String nomeMaquina, Double consumoEnergia, 
                       Double temperatura, Double pressao, Double velocidade, Double eficiencia) {
        this.tipoModulo = tipoModulo;
        this.nomeMaquina = nomeMaquina;
        this.consumoEnergia = consumoEnergia;
        this.temperatura = temperatura;
        this.pressao = pressao;
        this.velocidade = velocidade;
        this.eficiencia = eficiencia;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public Double getConsumoEnergia() {
        return consumoEnergia;
    }
    
    public void setConsumoEnergia(Double consumoEnergia) {
        this.consumoEnergia = consumoEnergia;
    }
    
    public Double getTemperatura() {
        return temperatura;
    }
    
    public void setTemperatura(Double temperatura) {
        this.temperatura = temperatura;
    }
    
    public Double getPressao() {
        return pressao;
    }
    
    public void setPressao(Double pressao) {
        this.pressao = pressao;
    }
    
    public Double getVelocidade() {
        return velocidade;
    }
    
    public void setVelocidade(Double velocidade) {
        this.velocidade = velocidade;
    }
    
    public Double getEficiencia() {
        return eficiencia;
    }
    
    public void setEficiencia(Double eficiencia) {
        this.eficiencia = eficiencia;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getObservacoes() {
        return observacoes;
    }
    
    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
} 