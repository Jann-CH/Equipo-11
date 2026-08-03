SELECT 
    i.nombre AS producto_servicio,
    COUNT(dp.id) AS veces_cotizado,
    AVG(dp.subtotal) AS ticket_promedio
FROM ITEM i
INNER JOIN DETALLE_PRESUPUESTO dp ON i.id = dp.item_id
GROUP BY i.nombre
ORDER BY veces_cotizado DESC
LIMIT 5;