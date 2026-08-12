# Simulador de Estabilidad Transversal de Buques

Este proyecto es una aplicación web interactiva que visualiza la estabilidad transversal de un barco en sección.

## Cómo iniciar

1. Abre la terminal y sitúate en el directorio del proyecto:
   ```bash
   cd /Users/ephil/Documents/CHATGPT
   ```
2. Instala dependencias (solo la primera vez):
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Qué contiene

- Vista de sección transversal animada del buque
- Línea de flotación y representación de fuerzas
- Indicadores de G, B, M, GM, GZ
- Tanque de lastre y carga móvil
- Curva dinámica de estabilidad `GZ`
- Controles de parámetros del buque y del centro de gravedad
- Mensajes de estado de estabilidad

## Notas

- El proyecto usa Vite + React + TypeScript.
- Si no tienes Node instalado, puedes instalarlo con `nvm`:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm install --lts
  ```
