SELECT 
    estado,
    COUNT(id) AS cantidad_presupuestos,
    SUM(total) AS dinero_acumulado
FROM PRESUPUESTO
GROUP BY estado
ORDER BY dinero_acumulado DESC;