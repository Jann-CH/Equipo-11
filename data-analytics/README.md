# 📊 Área de Data Analytics | Proyecto Innova (MVP Cotizador)

¡Hola! 👋 Te damos la bienvenida a la carpeta oficial del área de **Data Analytics** del **Equipo 11** para el proyecto **Innova**.

El objetivo de este módulo es instrumentar la arquitectura de datos, transformar los registros relacionales en valor analítico y medir el comportamiento de nuestros usuarios dentro del cotizador MVP.

---

## 🔗 Enlaces Rápidos y Recursos Core

* 📈 **[Dashboard Interactivo en Looker Studio](https://datastudio.google.com/reporting/49c8694d-6492-4bd3-92ae-c11de82b1ef4)** *(Visualización ejecutiva de métricas en tiempo real)*
* 🐍 **Pipeline ETL & Simulación de Eventos (`notebooks/`):** Código en Python/Pandas para la ingesta, limpieza y cálculo del embudo.
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