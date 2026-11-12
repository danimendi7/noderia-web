# Órdenes de Dani

Skynet atiende primero las órdenes [pendiente]. Marcas: [pendiente] · [planificada] · [hecha] · [bloqueada]

## 2026-11-12 21:35 [bloqueada]

> Ya está el material de marca en docs/marca/ (manual, logos, logos de Uría y pantalla-carga con el prototipo, el mapa de distancias y el isotipo). Desbloquea T02, T18 y T19 y sustituye los logos provisionales. Mueve a public/ solo lo que se publica. No subas al repo el PDF del manual ni el logo original de Uría a color: añádelos a .gitignore. Ya tienes la skill web-design-guidelines: pásala sobre toda la UI al final.

**Bloqueada (Skynet, 2026-11-12):** la carpeta `docs/marca/` existe pero está **vacía** (`ls -la docs/marca` → solo `.` y `..`). Busqué el material en todo el disco (`find / -iname 'mapa-distancias*' -o -iname 'isotipo*' -o -iname 'noderia-web-assets'`, y archivos nuevos desde las 21:00 en `~/proyectos` y `/mnt/c/Users/Daniel`) y no está en ningún sitio. Probablemente la copia no llegó a WSL (p. ej. se copió en una ruta de Windows que no está montada aquí). El logo de Uría de `~/proyectos/_referencias/neumaticos-uria` no lo uso: los límites prohíben copiar la marca de otros proyectos.
Lo que sí queda hecho: `.gitignore` ya excluye cualquier PDF dentro de `docs/marca/`.
La skill `web-design-guidelines` tampoco aparece entre las skills de Skynet en esta sesión.
**Qué hacer:** copiar de nuevo los archivos dentro de `~/proyectos/noderia-web/docs/marca/` (desde Windows: `\\wsl$\<distro>\home\daniel\proyectos\noderia-web\docs\marca`), comprobar con `ls docs/marca` que están, y volver a marcar esta orden como [pendiente]. Indica también el nombre del archivo del logo de Uría a color para excluirlo en `.gitignore`.
