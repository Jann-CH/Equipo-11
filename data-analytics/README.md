# 📊 Área de Data Analytics | Proyecto Innova (MVP Cotizador)

¡Hola! 👋 Te damos la bienvenida a la carpeta oficial del área de **Data Analytics** del **Equipo 11** para el proyecto **Innova**.

El objetivo de este módulo es instrumentar la arquitectura de datos, transformar los registros relacionales en valor analítico y medir el comportamiento de nuestros usuarios dentro del cotizador MVP.

---

## 🔗 Enlaces Rápidos y Recursos Core

* 📈 **[Dashboard Interactivo en Looker Studio](https://datastudio.google.com/reporting/49c8694d-6492-4bd3-92ae-c11de82b1ef4)** *(Visualización ejecutiva de métricas en tiempo real)*
* 🐍 **[Pipeline ETL & Simulación de Eventos](https://colab.research.google.com/drive/1FIvXxoNNQ9YC7kzhEcEF9Hz95yltVMNk?usp=sharing)** *Código en Python/Pandas para la ingesta, limpieza y cálculo del embudo.*
* 🗄️ **Consultas SQL en DBeaver (`sql/`):** Scripts exploratorios probados sobre la base de datos relacional de producción en Render.

---

## 📂 Estructura del Módulo `data-analytics`

```text
data-analytics/
├── README.md                     <-- Documento principal de documentación
├── notebooks/
│   └── innova_pipeline_etl.ipynb <-- Pipeline de Python, Pandas y eventos
├── sql/
│   └── queries_dbeaver.sql       <-- Consultas exploratorias en PostgreSQL
└── datasets/
    └── dashboard_innova_mvp.csv  <-- Dataset consolidado para Looker Studio



## 💡 Métricas Clave y Hallazgos del MVP

A partir de la ingesta y análisis de los datos generados, destacamos los siguientes indicadores del negocio:

| Métrica | Valor Registrado | Impacto / Insights |
| :--- | :---: | :--- |
| **Monto Total Cotizado** | **$1.136.200,00** | Volumen acumulado en 20 presupuestos procesados. |
| **Ticket Promedio** | **$113.620,00** | Valor medio generado por cada cotización. |
| **Efectividad a PDF (Tasa Conversión)** | **85%** | **17 de 20 presupuestos** se convirtieron exitosamente en PDF exportable. |
| **Presupuestos en Borrador** | **25%** | Representa **$79.900,00 inmovilizados** pendientes de envío. |
| **Interacción con Historial** | **26 eventos** | Es la pantalla de mayor recurrencia por los emprendedores. |




## 📌 A. Resolución Final del Área de Data

Desde la perspectiva de **Data Architecture & Analytics**, la conclusión es contundente:

> **El modelo relacional actual (PostgreSQL) y la estructura de eventos están 100% validados.** 
> 
> Las tablas `USUARIO`, `CLIENTE`, `ITEM`, `PRESUPUESTO` y `DETALLE_PRESUPUESTO` responden de manera sólida, permitiendo calcular métricas complejas de ingresos y comportamiento sin generar inconsistencias matemáticas ni sobrecargas en la base de datos.

---

## 🗺️ B. Propuesta de Acciones Recomendadas (Roadmap Multidisciplinario)

Para potenciar los resultados reflejados en el Dashboard de cara a las próximas etapas de desarrollo, proponemos las siguientes acciones concretas para cada área:

### 🎨 Para el equipo de Producto y UX/UI
1. **Flujo de Recuperación de Borradores:** Diseñar una alerta o "recordatorio" dentro de la pantalla principal cuando el usuario tenga presupuestos en borrador por más de 48 horas. Recuperar ese 25% inmovilizado ($79.900) aumentaría directamente el valor transaccionado en la app.
2. **Acceso Directo al Historial:** Dado que la visualización del historial es la acción más recurrente (26 eventos), se recomienda mantener la sección de *"Mis Presupuestos"* visible desde el menú de navegación principal.

### ⚙️ Para el equipo de Back-End
1. **Institucionalizar el Estado 'Aceptado':** Garantizar que cuando el cliente del emprendedor apruebe la cotización, la base de datos registre explícitamente el estado `'Aceptado'` (además de `'Guardado'`), permitiendo medir la tasa de cierre real de ventas.
2. **Tabla Nativa de Auditoría (`LOG_EVENTOS`):** Integrar de forma definitiva en el servidor el registro de eventos para continuar capturando las descargas de PDF y búsquedas en historial directamente desde la base de datos.

### 💻 Para el equipo de Front-End
1. **Optimización del Botón PDF:** Mantener la prominencia del botón *"Generar PDF"*, ya que representa el punto más alto del embudo de conversión (85% de éxito).

---

## 🤝 C. Cierre y Agradecimientos

Agradecemos profundamente el esfuerzo de todo el equipo en la construcción de esta base de datos, la interfaz y a la coordinación del proyecto de la mano de **Jann**. 

Estamos parados sobre un MVP sólido, funcional y con una excelente capacidad de escalabilidad.

> **¡Seguimos construyendo soluciones impulsadas por datos!** 🚀

Un gran saludo,  
**Área de Data Analytics – Proyecto Innova (Equipo 11)**    
