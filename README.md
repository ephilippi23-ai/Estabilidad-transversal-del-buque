# TrimLab - estabilidad transversal

Simulador educativo interactivo para explorar la estabilidad transversal de un buque. La interfaz muestra en tiempo real la escora, los centros G/B/M, las fuerzas, GM, GZ, momento adrizante, efecto de superficie libre y curva de brazos adrizantes.

## Iniciar en esta Mac

La forma mas simple es hacer doble clic en `start.command`. Se abrira automaticamente:

`http://localhost:5173`

Desde Terminal, el equivalente es:

```bash
cd /Users/ephil/Documents/CHATGPT
./start.command
```

Para detener el servidor, pulse `Control + C` en la ventana de Terminal.

## Desarrollo

```bash
npm install
npm run dev
npm run build
```

El proyecto usa React, TypeScript y Vite. En esta maquina tambien se incluye un runtime local ignorado por Git en `.tools/node`, por lo que `start.command` funciona aunque Node.js no este instalado globalmente.

## Alcance del modelo

El calculo combina momentos de pesos, volumen desplazado en agua de mar, inercia transversal de la flotacion y correccion por superficie libre. La curva GZ a grandes angulos es una aproximacion didactica. No sustituye las curvas KN, condiciones de carga ni el cuaderno de estabilidad aprobado del buque.
