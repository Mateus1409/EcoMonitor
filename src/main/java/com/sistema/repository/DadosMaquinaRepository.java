package com.sistema.repository;

import com.sistema.model.DadosMaquina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DadosMaquinaRepository extends JpaRepository<DadosMaquina, Long> {
    
    List<DadosMaquina> findByTipoModuloOrderByTimestampDesc(DadosMaquina.TipoModulo tipoModulo);
    
    List<DadosMaquina> findByNomeMaquinaOrderByTimestampDesc(String nomeMaquina);
    
    List<DadosMaquina> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime inicio, LocalDateTime fim);
    
    List<DadosMaquina> findByTipoModuloAndNomeMaquinaAndTimestampBetweenOrderByTimestampDesc(
        DadosMaquina.TipoModulo tipoModulo, String nomeMaquina, LocalDateTime inicio, LocalDateTime fim);
    
    List<DadosMaquina> findByTipoModuloAndTimestampBetweenOrderByTimestampDesc(
        DadosMaquina.TipoModulo tipoModulo, LocalDateTime inicio, LocalDateTime fim);
    
    List<DadosMaquina> findByNomeMaquinaAndTimestampBetweenOrderByTimestampDesc(
        String nomeMaquina, LocalDateTime inicio, LocalDateTime fim);
    
    @Query("SELECT d FROM DadosMaquina d WHERE d.tipoModulo = :tipoModulo AND d.timestamp >= :inicio ORDER BY d.timestamp DESC")
    List<DadosMaquina> findByTipoModuloAndTimestampAfter(@Param("tipoModulo") DadosMaquina.TipoModulo tipoModulo, 
                                                         @Param("inicio") LocalDateTime inicio);
    
    @Query("SELECT AVG(d.consumoEnergia) FROM DadosMaquina d WHERE d.tipoModulo = :tipoModulo AND d.timestamp >= :inicio")
    Double getConsumoMedioEnergia(@Param("tipoModulo") DadosMaquina.TipoModulo tipoModulo, 
                                  @Param("inicio") LocalDateTime inicio);
    
    @Query("SELECT AVG(d.eficiencia) FROM DadosMaquina d WHERE d.tipoModulo = :tipoModulo AND d.timestamp >= :inicio")
    Double getEficienciaMedia(@Param("tipoModulo") DadosMaquina.TipoModulo tipoModulo, 
                              @Param("inicio") LocalDateTime inicio);
} 