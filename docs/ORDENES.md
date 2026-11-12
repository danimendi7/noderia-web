# Órdenes de Dani

Skynet atiende primero las órdenes [pendiente]. Marcas: [pendiente] · [planificada] · [hecha] · [bloqueada]

## 2026-11-12 21:35 [hecha]

> Ya está el material de marca en docs/marca/ (manual, logos, logos de Uría y pantalla-carga con el prototipo, el mapa de distancias y el isotipo). Desbloquea T02, T18 y T19 y sustituye los logos provisionales. Mueve a public/ solo lo que se publica. No subas al repo el PDF del manual ni el logo original de Uría a color: añádelos a .gitignore. Ya tienes la skill web-design-guidelines: pásala sobre toda la UI al final.

**Retomada (Skynet, 2026-11-12 22:10):** el material llegó con la orden de las 22:04, que la sustituye; se planifica junto con ella (T02, T18, T19, T24).

**Bloqueada antes (Skynet, 2026-11-12):** la carpeta `docs/marca/` existe pero está **vacía** (`ls -la docs/marca` → solo `.` y `..`). Busqué el material en todo el disco (`find / -iname 'mapa-distancias*' -o -iname 'isotipo*' -o -iname 'noderia-web-assets'`, y archivos nuevos desde las 21:00 en `~/proyectos` y `/mnt/c/Users/Daniel`) y no está en ningún sitio. Probablemente la copia no llegó a WSL (p. ej. se copió en una ruta de Windows que no está montada aquí). El logo de Uría de `~/proyectos/_referencias/neumaticos-uria` no lo uso: los límites prohíben copiar la marca de otros proyectos.
Lo que sí queda hecho: `.gitignore` ya excluye cualquier PDF dentro de `docs/marca/`.
La skill `web-design-guidelines` tampoco aparece entre las skills de Skynet en esta sesión.
**Qué hacer:** copiar de nuevo los archivos dentro de `~/proyectos/noderia-web/docs/marca/` (desde Windows: `\\wsl$\<distro>\home\daniel\proyectos\noderia-web\docs\marca`), comprobar con `ls docs/marca` que están, y volver a marcar esta orden como [pendiente]. Indica también el nombre del archivo del logo de Uría a color para excluirlo en `.gitignore`.

## 2026-11-12 22:04 [hecha]

> Ahora sí: el material de marca ya está copiado en docs/marca/ (compruébalo con ls -R). Retoma la orden bloqueada del material de marca y desbloquea T02, T18 y T19 con las mismas indicaciones: logos oficiales sustituyendo los provisionales, solo a public/ lo que se publica y el PDF del manual y el logo de Uría a color en .gitignore.

**Planificada (Skynet, 2026-11-12):** `ls -R docs/marca` muestra el material completo. Tareas en PROGRESS.md: **T02** (logos oficiales en `public/marca/`, favicon e icono con el isotipo, logo de Uría en Midnight, adiós al logo provisional), **T18** (pantalla de carga), **T19** (test visual del loader) y **T24** (revisión final de la UI con el material nuevo). Se excluyen del repo con `.gitignore` el PDF del manual y el logo de Uría a color (`docs/marca/clientes/logo-uria.png`); el resto de `docs/marca/` se versiona como material de origen y a `public/` solo va lo que se publica, optimizado.

**Hecha (Skynet, 2026-11-12):** T02 (#25), T18 (#26), T19 (#27) y T24 (#28) fusionadas. Logos oficiales en cabecera, pie, caso Uría (versión Midnight) e imagen para compartir; favicon e iconos con el isotipo; pantalla de carga portada del prototipo; el último fotograma coincide con el PNG oficial (0 píxeles distintos). El PDF del manual y `docs/marca/clientes/logo-uria.png` quedan fuera del repo. `web-design-guidelines` sigue sin estar disponible para Skynet: la revisión final se hizo con `design:accessibility-review`. Detalle en DONE.md.
