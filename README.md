# Laboratorio de estabilidad transversal · Buque Echo

Simulador educativo interactivo para estudiar la estabilidad transversal con los datos del Buque Echo utilizados en el curso.

## Contenidos

- Relación entre calado, desplazamiento, KB, KM y TPC mediante la tabla hidrostática.
- Vistas transversal y longitudinal del buque, con Xb, Xf y MCT 1 cm.
- Estabilidad inicial y cálculo de `GM = KM − KG corregido`.
- Corrección virtual de KG por superficies libres.
- Traslado transversal de pesos, momento escorante y corrimiento de G.
- Curva de brazos adrizantes a partir de pantocarenas: `GZ = KN − KG·sen θ`.
- Casos comparativos y cuaderno de cálculo visible paso a paso.
- Cuadro de carga basado en `Tabla CG - BUQUE ECHO.xls`, con cálculo automático de desplazamiento, KG, LCG, TCG y superficies libres.

Los valores intermedios se calculan mediante interpolación lineal. El rango del simulador se limita a la zona común de las tablas hidrostática y KN suministradas.

El modo **Cuadro de carga** permite ajustar pesos y porcentajes de llenado por categoría. La corrección de superficie libre para tanques parciales es una aproximación educativa: nula vacío/lleno y máxima al 50%.

## Ejecutar el proyecto

Requiere una versión reciente de Node.js:

```bash
npm install
npm run dev
```

Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```

## Material académico

La carpeta local `ayudas/` contiene la documentación original del curso y está excluida de Git mediante `.gitignore`. Los datos necesarios para el funcionamiento del simulador fueron transcritos al modelo de cálculo; los documentos originales no se publican en el repositorio.

Este simulador es una herramienta educativa. No sustituye las curvas, las condiciones de carga ni el cuaderno de estabilidad aprobado de un buque.
