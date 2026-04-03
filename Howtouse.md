# 🎮 Vendetta Games - Guía de Uso e Instalación

Bienvenido a la guía de usuario de **Vendetta Games**. Este documento explica cómo instalar el proyecto localmente, cómo manejar el panel interactivo durante el evento, y cómo personalizar los recursos visuales (como las fotos de los jugadores y cursores).

---

## 📂 1. ¿Dónde poner las fotos de los jugadores?

Debes colocar las imágenes de los participantes exactamente en esta carpeta dentro de tu proyecto:
`public/players/` 

**Reglas para las fotos:**
1.  Deben llamarse **exactamente con el número del ID del jugador a 3 dígitos**.
2.  El formato aceptado es **.jpg** o **.png**.
3.  *Ejemplos válidos:* `000.jpg`, `001.png`, `015.jpg`, `059.png`.

> [!NOTE]
> **Sistema Inteligente:** Si olvidas subir la foto de un jugador o el nombre está mal escrito, el sistema **no se romperá**. Automáticamente cargará un modelo/placeholder predeterminado para que el jugador siga apareciendo en el panel.

---

## 🛠️ 2. Instalación y Puesta en Marcha

Si necesitas mover el proyecto a otro ordenador o configurarlo por primera vez, sigue estos pasos:

### Requisitos Previos
1. Descargar e instalar **Node.js** (versión recomendada LTS).

### Pasos
1. Abre una terminal (o consola de comandos) en la carpeta raíz del proyecto (`d:\webs\vendettagames\`).
2. Instala las dependencias del proyecto ejecutando:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo en vivo ejecutando:
   ```bash
   npm run dev
   ```
4. Abre tu navegador web y entra en la ruta que te indica la consola (generalmente `http://localhost:5173`).

---

## 🖱️ 3. Cómo Usar y Manipular la Aplicación

### Funcionamiento del Panel
*   **Inicio:** Al cargar la web, verás un muro interactivo con 60 monitores (del 000 al 059) todos en estado "Vivos".
*   **Eliminaciones:** Para eliminar a un jugador, simplemente **haz click en su foto/rombo**. La foto bajará su opacidad, obtendrá un filtro oscuro y un rayón rojo gigante de eliminación, y el temporizador global restará "1" vivo.
*   **Revivir (Deshacer eliminación):** Si te equivocaste tocando a un jugador, vuelve a hacer click sobre su panel eliminado, y regresará inmediatamente al estado vivo.

### Pantalla de Ganador (Secuencia Automática)
*   **El Único Superviviente:** En el instante en que elimines a 59 personas y quede **sólo 1 jugador vivo** en el panel, NO hagas nada más.
*   **Transición:** El muro de monitores iniciará una transición dramática (apagándose paulatinamente). Tras 2.5 segundos, emergerá el modo GANADOR enseñando al superviviente en pantalla gigante brillante con un cartel palpitante.
*   *Nota:* Si te equivocaste y quieres abortar el modo ganador, puedes recargar la web o cambiar el código manualmente, aunque por la naturaleza del evento esto está pensado como el fin de bloque televisivo definitivo.

---

## 🎨 4. Personalización Adicional

*   **Cursores Customizados:** En la carpeta `public/` encontrarás dos archivos llamados `cursor-normal.png` y `cursor-hover.png`. Si alguna vez necesitas cambiarlos, reemplaza estas fotos manteniendo el mismo nombre (tamaño recomendado: 32x32 píxeles máximo).
*   **Resolución Ideal:** La aplicación está programada con ecuaciones que se adaptan a móviles, tablets, pantallas 2K y 4K. No obstante, ha sido perfeccionada asiduamente enfocándose en su lectura ideal bajo un formato de emisión típica: Monitor principal Full HD **1920x1080**.

¡Disfruta organizando Vendetta Games! 🚀
