"use client";

import Link from "next/link";
import { createContext, type FormEvent, type ReactNode, useActionState, useContext, useEffect, useId, useRef, useState } from "react";
import { ESTADO_INICIAL, type EstadoFormulario, MENSAJE_GRACIAS } from "@/lib/presupuesto/estado";
import {
  CAMPO_TRAMPA,
  type CampoFormulario,
  type ErroresFormulario,
  MAX_MENSAJE,
  TAMANOS_EQUIPO,
  TIPOS_TALLER,
  validarSolicitud,
} from "@/lib/presupuesto/validacion";

type Accion = (anterior: EstadoFormulario, formulario: FormData) => Promise<EstadoFormulario>;

type Props = {
  accion: Accion;
  /** Página o ancla desde la que se envía (se guarda en `origen`). */
  origen?: string;
};

const ORDEN_CAMPOS: CampoFormulario[] = [
  "nombre",
  "taller",
  "telefono",
  "email",
  "ubicacion",
  "tipo_taller",
  "tamano_equipo",
  "mensaje",
  "consentimiento",
];

// Los ids llevan un prefijo único por formulario: con `cacheComponents`, Next conserva en el DOM (oculta) la página
// anterior al navegar, y dos formularios con los mismos ids harían que una etiqueta o el foco apuntasen al campo oculto.
const PrefijoIds = createContext("");
const idCampo = (prefijo: string, campo: string) => `${prefijo}presupuesto-${campo}`;
const idError = (prefijo: string, campo: string) => `${prefijo}presupuesto-${campo}-error`;

/** Campos sobre cristal oscuro (SPEC v2, S9): borde fino y foco luminoso Aqua. */
const claseControl =
  "campo-cristal mt-2 block w-full rounded-xl border border-white/25 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-white/55 hover:border-white/40 focus:border-aqua focus:outline-2 focus:outline-offset-0 focus:outline-aqua aria-[invalid=true]:border-[#FF8FA0]";

/** Rojo de error legible sobre Midnight (contraste > 7:1). */
const COLOR_ERROR = "text-[#FF9AAA]";

/** Formulario de presupuesto (SPEC F4) en tarjeta de cristal oscuro (SPEC v2, S9): valida en el navegador y en el servidor. */
export function FormularioPresupuesto({ accion, origen = "home#presupuesto" }: Props) {
  const [estado, enviar, enviando] = useActionState(accion, ESTADO_INICIAL);
  const [erroresCliente, setErroresCliente] = useState<ErroresFormulario | null>(null);
  const refGracias = useRef<HTMLDivElement>(null);
  const refFallo = useRef<HTMLDivElement>(null);
  const p = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const errores: ErroresFormulario =
    erroresCliente ?? (estado.estado === "errores" ? estado.errores : {});
  const valores = estado.estado === "errores" || estado.estado === "fallo" ? estado.valores : {};

  function enfocarPrimerError(lista: ErroresFormulario) {
    const primero = ORDEN_CAMPOS.find((campo) => lista[campo]);
    if (primero) document.getElementById(idCampo(p, primero))?.focus();
  }

  function alEnviar(evento: FormEvent<HTMLFormElement>) {
    const datos = Object.fromEntries(new FormData(evento.currentTarget).entries());
    const resultado = validarSolicitud(datos);
    if (resultado.estado === "invalida") {
      evento.preventDefault();
      setErroresCliente(resultado.errores);
      enfocarPrimerError(resultado.errores);
      return;
    }
    setErroresCliente(null);
  }

  useEffect(() => {
    if (estado.estado === "enviada") refGracias.current?.focus();
    if (estado.estado === "errores") enfocarPrimerError(estado.errores);
    if (estado.estado === "fallo") refFallo.current?.focus();
  }, [estado]);

  if (estado.estado === "enviada") {
    return (
      <div
        ref={refGracias}
        role="status"
        tabIndex={-1}
        className="tarjeta-cristal p-8 text-center text-white focus:outline-2 focus:outline-offset-4 focus:outline-aqua sm:p-12"
      >
        {/* Check que se dibuja en Aqua (SPEC v2, S9); con movimiento reducido aparece ya dibujado. */}
        <svg
          aria-hidden="true"
          data-check-exito
          viewBox="0 0 64 64"
          className="check-exito mx-auto size-16 text-aqua"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="32" cy="32" r="29" pathLength={1} className="check-exito-circulo" />
          <path d="M20 33l8.5 8.5L45 24" pathLength={1} className="check-exito-trazo" />
        </svg>
        <p className="mt-6 font-display text-2xl font-bold">{MENSAJE_GRACIAS}</p>
      </div>
    );
  }

  const nErrores = Object.keys(errores).length;

  return (
    <PrefijoIds value={p}>
      <form
        action={enviar}
        onSubmit={alEnviar}
        noValidate
        aria-describedby={`${p}presupuesto-obligatorios`}
        className="tarjeta-cristal relative p-6 text-white sm:p-10"
      >
        <p id={`${p}presupuesto-obligatorios`} className="text-sm text-white/75">
          Los campos con <span aria-hidden="true">*</span>
          <span className="sr-only">asterisco</span> son obligatorios.
        </p>

        {estado.estado === "fallo" ? (
          <div
            ref={refFallo}
            role="alert"
            tabIndex={-1}
            className="mt-5 rounded-xl border border-[#FF8FA0]/40 bg-[#FF8FA0]/10 px-4 py-3 text-[#FFC2CC] focus:outline-2 focus:outline-offset-2 focus:outline-aqua"
          >
            {estado.mensaje}
          </div>
        ) : null}

        <p aria-live="polite" className="sr-only">
          {nErrores > 0 ? `Revisa ${nErrores === 1 ? "1 campo" : `${nErrores} campos`} del formulario.` : ""}
        </p>

        <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Campo campo="nombre" etiqueta="Tu nombre" obligatorio error={errores.nombre}>
            <input
              id={idCampo(p, "nombre")}
              name="nombre"
              type="text"
              autoComplete="name"
              maxLength={120}
              defaultValue={valores.nombre}
              {...accesibilidad(p, "nombre", errores.nombre, true)}
              className={claseControl}
            />
          </Campo>

          <Campo campo="taller" etiqueta="Nombre del taller" obligatorio error={errores.taller}>
            <input
              id={idCampo(p, "taller")}
              name="taller"
              type="text"
              autoComplete="organization"
              maxLength={160}
              defaultValue={valores.taller}
              {...accesibilidad(p, "taller", errores.taller, true)}
              className={claseControl}
            />
          </Campo>

          <Campo campo="telefono" etiqueta="Teléfono" obligatorio error={errores.telefono}>
            <input
              id={idCampo(p, "telefono")}
              name="telefono"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={30}
              defaultValue={valores.telefono}
              {...accesibilidad(p, "telefono", errores.telefono, true)}
              className={claseControl}
            />
          </Campo>

          <Campo campo="email" etiqueta="Email" obligatorio error={errores.email}>
            <input
              id={idCampo(p, "email")}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              maxLength={254}
              defaultValue={valores.email}
              {...accesibilidad(p, "email", errores.email, true)}
              className={claseControl}
            />
          </Campo>

          <Campo campo="ubicacion" etiqueta="Provincia o ciudad" error={errores.ubicacion}>
            <input
              id={idCampo(p, "ubicacion")}
              name="ubicacion"
              type="text"
              autoComplete="address-level2"
              maxLength={120}
              defaultValue={valores.ubicacion}
              {...accesibilidad(p, "ubicacion", errores.ubicacion)}
              className={claseControl}
            />
          </Campo>

          <Campo campo="tipo_taller" etiqueta="Tipo de taller" error={errores.tipo_taller}>
            <select
              id={idCampo(p, "tipo_taller")}
              name="tipo_taller"
              defaultValue={valores.tipo_taller ?? ""}
              {...accesibilidad(p, "tipo_taller", errores.tipo_taller)}
              className={claseControl}
            >
              <option value="">Elige una opción</option>
              {TIPOS_TALLER.map((tipo) => (
                <option key={tipo.valor} value={tipo.valor}>
                  {tipo.texto}
                </option>
              ))}
            </select>
          </Campo>

          <Campo campo="tamano_equipo" etiqueta="Personas en el taller" error={errores.tamano_equipo}>
            <select
              id={idCampo(p, "tamano_equipo")}
              name="tamano_equipo"
              defaultValue={valores.tamano_equipo ?? ""}
              {...accesibilidad(p, "tamano_equipo", errores.tamano_equipo)}
              className={claseControl}
            >
              <option value="">Elige una opción</option>
              {TAMANOS_EQUIPO.map((tamano) => (
                <option key={tamano.valor} value={tamano.valor}>
                  {tamano.texto}
                </option>
              ))}
            </select>
          </Campo>

          <div className="sm:col-span-2">
            <Campo campo="mensaje" etiqueta="¿Qué te gustaría mejorar?" error={errores.mensaje}>
              <textarea
                id={idCampo(p, "mensaje")}
                name="mensaje"
                rows={4}
                maxLength={MAX_MENSAJE}
                placeholder="Por ejemplo: que las citas entren por la web, avisar a los clientes de la ITV…"
                defaultValue={valores.mensaje}
                {...accesibilidad(p, "mensaje", errores.mensaje)}
                className={claseControl}
              />
            </Campo>
          </div>
        </div>

        {/* Campo trampa contra spam: invisible para personas y lectores de pantalla. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={idCampo(p, CAMPO_TRAMPA)}>No rellenes este campo</label>
          <input id={idCampo(p, CAMPO_TRAMPA)} name={CAMPO_TRAMPA} type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="origen" value={origen} />

        <div className="mt-6">
          {/* Sin hueco entre la casilla y su texto: el relleno de la etiqueta hace de una sola zona de toque. */}
          <div className="flex">
            <input
              id={idCampo(p, "consentimiento")}
              name="consentimiento"
              type="checkbox"
              required
              defaultChecked={valores.consentimiento === "on"}
              {...accesibilidad(p, "consentimiento", errores.consentimiento, true)}
              className="mt-0.5 size-6 shrink-0 accent-aqua focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
            />
            <label htmlFor={idCampo(p, "consentimiento")} className="pl-3 text-white/85">
              Acepto que <span translate="no">NoderIA</span> use estos datos para preparar mi presupuesto y contactarme, según la{" "}
              <Link href="/privacidad" className="font-medium text-aqua underline underline-offset-2 hover:text-white">
                política de privacidad
              </Link>
              . <span aria-hidden="true">*</span>
            </label>
          </div>
          <MensajeError campo="consentimiento" error={errores.consentimiento} />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-electric px-6 py-3 font-semibold text-white shadow-[0_8px_28px_-6px_rgb(0_104_224/0.75)] transition-[background-color,box-shadow] hover:bg-royal hover:shadow-[0_10px_32px_-6px_rgb(0_176_240/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {enviando ? "Enviando…" : "Pide tu presupuesto"}
        </button>
      </form>
    </PrefijoIds>
  );
}

function accesibilidad(p: string, campo: string, error: string | undefined, obligatorio = false) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? idError(p, campo) : undefined,
    "aria-required": obligatorio || undefined,
  } as const;
}

function Campo({
  campo,
  etiqueta,
  obligatorio = false,
  error,
  children,
}: {
  campo: string;
  etiqueta: string;
  obligatorio?: boolean;
  error?: string;
  children: ReactNode;
}) {
  const p = useContext(PrefijoIds);
  return (
    <div>
      <label htmlFor={idCampo(p, campo)} className="font-medium text-white/90">
        {etiqueta}
        {obligatorio ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      <MensajeError campo={campo} error={error} />
    </div>
  );
}

function MensajeError({ campo, error }: { campo: string; error?: string }) {
  const p = useContext(PrefijoIds);
  if (!error) return null;
  return (
    <p id={idError(p, campo)} className={`mt-2 flex items-start gap-1.5 text-sm font-medium ${COLOR_ERROR}`}>
      {error}
    </p>
  );
}
