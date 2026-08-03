SELECT 
    u.email,
    COUNT(p.id) AS presupuestos_generados,
    MAX(p.created_at) AS ultima_actividad
FROM USUARIO u
LEFT JOIN PRESUPUESTO p ON u.id = p.usuario_id
GROUP BY u.email
ORDER BY presupuestos_generados DESC;