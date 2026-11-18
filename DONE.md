# NoderIA Web: textos legales provisionales (orden del 2026-11-18 10:09)

**Producción:** https://noderia.es

`/aviso-legal`, `/privacidad` y `/cookies` ya no muestran ningún hueco. El titular es **Noderia Tech, S.L. (en
constitución)**, y una sola línea sustituye a los datos que aún no existen. El último despliegue es `main` en
`47c3680`, hecho con `npm run deploy`, con la prueba de humo en verde.

## Qué hay de nuevo y la prueba que lo demuestra

| Punto de la orden | Qué hay | Prueba | PR |
| --- | --- | --- | --- |
| 1 · Titular y responsable | «Titular: Noderia Tech, S.L. (en constitución)» en el aviso legal y «Responsable: …» en privacidad. Sin las líneas de NIF, domicilio ni registro. En su lugar va «Datos identificativos completos disponibles en cuanto finalice la constitución de la sociedad.» y debajo «Ubicación: Donostia / San Sebastián (Gipuzkoa)» | `DatosTitular.test.tsx`, `aviso-legal/page.test.tsx`, `privacidad/page.test.tsx` | #104 |
| 2 · Email | `contacto@noderia.es` (enlace `mailto:`) como contacto del aviso legal, contacto de privacidad y dirección para ejercer derechos. Sale de `src/lib/contenido/contacto.ts` | Los mismos tests | #104 |
| 3 · Plazo de conservación | «Si no llegas a ser cliente, 12 meses desde nuestro último contacto; después los borramos. Si llegas a ser cliente, durante toda nuestra relación y, después, durante los plazos legales que correspondan.» | `privacidad/page.test.tsx` | #104 |
| 4 · Proveedores | Están comprobados en su documentación oficial y en la lista oficial del Marco de Privacidad de Datos (dataprivacyframework.gov). Ver la tabla de abajo. Las fuentes están en `src/lib/contenido/proveedores.ts` y en DECISIONS.md | `proveedores.test.ts` | #105 |
| 5 · `Hueco` solo para desarrollo | En desarrollo se ve marcado, como antes. En producción lanza un error, así que el build falla y nunca se publica. `src/app/sin-huecos.test.tsx` renderiza las 10 rutas públicas y falla si alguna lleva un hueco. `e2e/sin-huecos.spec.ts` hace lo mismo en el navegador | Con un hueco de prueba en `/cookies`, el test falla y `next build` termina con «Hueco sin rellenar en una página pública: «prueba»» | #106 |
| 6 · Un solo archivo de empresa | `src/lib/contenido/empresa.ts` guarda la razón social, `enConstitucion`, el CIF, el domicilio, los datos registrales y la ubicación | `empresa.test.ts` y `DatosTitular.test.tsx` (los dos modos) | #104 |

### Proveedores que aparecen en `/privacidad` (comprobado el 2026-11-18)

| Proveedor | Qué hace | Dónde y con qué garantía |
| --- | --- | --- |
| Cloudflare | Aloja la web | Red mundial, sobre todo en EE. UU. Está adherido al Marco de Privacidad de Datos UE-EE. UU. (activo) y su DPA incluye además cláusulas contractuales tipo |
| Supabase | Base de datos | En la UE: región `eu-west-3`, París (sale del host del proyecto). El soporte de Singapur y EE. UU. solo accede si se le pide ayuda, con cláusulas contractuales tipo. **No** está adherido al Marco |
| Resend | Envía el aviso por email | EE. UU. Marco de Privacidad (activo) y cláusulas contractuales tipo |
| Zoho Mail | Correo `contacto@noderia.es` | Centro de datos de la UE (Ámsterdam y Dublín). El soporte desde la India va con cláusulas contractuales tipo. Zoho dejó el Marco |
| Google (Gmail) | Buzón donde llega hoy el aviso (`admin.noderia@gmail.com`) | Servidores en todo el mundo. Marco de Privacidad (activo) y cláusulas contractuales tipo |

### Pruebas

- `npm run verify`: 265 tests en verde. Hay e2e en local de las páginas legales, el formulario, `responsive` y
  `sin-huecos`. No hay preview de Vercel porque la cuenta está bloqueada.
- Se desplegó tras cada fusión (`2aeb926`, `97e4eb2` y `47c3680`), con la prueba de humo **6/6** contra
  https://noderia.es cada vez.
- `curl` de `/aviso-legal`, `/privacidad` y `/cookies` en producción: ningún «[» en el texto de `<main>` (solo los hay en el JSON-LD), ningún `data-hueco`, y sí la
  razón social, la línea provisional y `contacto@noderia.es`.

## Qué dice ahora cada página

- **`/aviso-legal`.** Titular: Noderia Tech, S.L. (en constitución), con la línea de datos pendientes, la ubicación
  y el contacto (`contacto@noderia.es` o el formulario). Después: para qué sirve la web, las condiciones de uso, la
  propiedad intelectual (la marca de Uría se usa con permiso), la responsabilidad, los enlaces, la remisión a
  privacidad y cookies, y la ley española. Actualizado el 18 de noviembre de 2026.
- **`/privacidad`.** Responsable: Noderia Tech, S.L. (en constitución), con la línea provisional, la ubicación y el
  email de privacidad. Explica los datos del formulario y el hash irreversible de la IP, la finalidad (solo
  contestarte y preparar la demo o el presupuesto) y la base legal (el consentimiento). El plazo es el del punto 3.
  Siguen los cinco proveedores con su garantía, los derechos (que se ejercen en `contacto@noderia.es`), la
  reclamación ante la AEPD y la seguridad. Actualizado el 18 de noviembre de 2026.
- **`/cookies`.** Sin cambios: nunca tuvo huecos. Dice que no hay cookies de publicidad ni de seguimiento, que solo se
  usa el almacenamiento de sesión para no repetir la animación de entrada, y que se pedirá permiso si eso cambia.

## Datos que faltan para la versión definitiva

Todos van en **`src/lib/contenido/empresa.ts`**:

1. **Razón social definitiva**: confirma que es exactamente «Noderia Tech, S.L.» (`razonSocial`).
2. **CIF** (`cif`).
3. **Domicilio social completo**: calle, número, código postal y municipio (`domicilio`).
4. **Datos registrales**: Registro Mercantil de Gipuzkoa, tomo, folio, hoja e inscripción (`datosRegistrales`).
5. Cambia `enConstitucion` a `false`.

Con el CIF, el domicilio y los datos registrales rellenos, las dos páginas enseñan cada dato en su línea y quitan la
línea provisional. Si quieres, pon también la fecha nueva en «Última actualización» (`actualizado` en
`src/app/aviso-legal/page.tsx` y en `src/app/privacidad/page.tsx`).

## Para que lo revises (no lo he dado por hecho)

- **Gmail no estaba en la orden, pero aparece en la política.** Hoy el aviso de cada solicitud llega a
  `admin.noderia@gmail.com`, que es el valor por defecto de `AVISO_EMAIL_PARA`. Para que los datos no pasen por
  Google, verifica el dominio en Resend (lo explicaba el DONE anterior) y pon `AVISO_EMAIL_PARA=contacto@noderia.es`
  y `AVISO_EMAIL_DE`. Después, pide a Skynet que quite Google de `proveedores.ts`. Ojo: hoy no se puede cambiar el
  destinatario, porque con el remitente de pruebas `onboarding@resend.dev` Resend solo entrega al email del dueño de
  la cuenta. Además, con una cuenta de Gmail de consumo no hay contrato de encargo con Google.
- **Resend** está en el Marco como «Active – Re-certification under Review». Vuelve a mirarlo en
  dataprivacyframework.gov (participante 8907) antes de dar el texto por definitivo. No he podido comprobar la región
  de envío de tu cuenta de Resend: por defecto es `us-east-1`, y aunque elijas `eu-west-1`, Resend procesa sobre todo
  en EE. UU.
- **Supabase** no está en el Marco: la única garantía son las cláusulas contractuales tipo de su DPA, firmado con
  Supabase Pte. Ltd. (Singapur). La región es la del proyecto que usa hoy la web (el mismo de staging). Si producción
  pasa a otro proyecto de Supabase, comprueba su región.
- **Zoho** dejó el Marco y usa cláusulas contractuales tipo. Su política general menciona almacenamiento en EE. UU.,
  el EEE «y otros países», y no dice dónde guarda las copias de seguridad de la UE.
- **Cloudflare** no publica en qué centro concreto se ejecuta un Worker: la política dice «red repartida por todo el
  mundo, sobre todo EE. UU.».
- La política dice que los proveedores tratan los datos «por cuenta nuestra». Comprueba que tienes aceptado el
  contrato de encargo (DPA) de cada uno.

## Órdenes atendidas

- 2026-11-18 10:09, textos legales provisionales: **[hecha]** (T81–T84; PR #103–#107).

## Tareas bloqueadas

Ninguna.

## Decisiones más importantes (DECISIONS.md)

- En producción, `Hueco` rompe el build en lugar de no pintar nada: así un dato pendiente nunca se publica a medias.
- Gmail se añade a la lista de proveedores porque hoy recibe los datos.
- Cuatro PR pequeñas: textos y archivo de empresa, proveedores, `Hueco` y cierre.
