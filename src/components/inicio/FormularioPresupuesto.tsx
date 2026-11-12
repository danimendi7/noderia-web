"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useActionState, useEffect, useRef, useState } from "react";
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

const idCampo = (campo: string) => `presupuesto-${campo}`;
const idError = (campo: string) => `presupuesto-${campo}-error`;

const claseControl =
  "mt-2 block w-full rounded-xl border border-midnight/20 bg-white px-4 py-3 text-base text-midnight placeholder:text-midnight/45 focus:border-electric focus:outline-2 focus:outline-offset-0 focus:outline-electric aria-[invalid=true]:border-[#C4002B]";

/** Formulario de presupuesto (SPEC F4): valida en el navegador y en el servidor. */
export function FormularioPresupuesto({ accion, origen = "home#presupuesto" }: Props) {
  const [estado, enviar, enviando] = useActionState(accion, ESTADO_INICIAL);
  const [erroresCliente, setErroresCliente] = useState<ErroresFormulario | null>(null);
  const refGracias = useRef<HTMLDivElement>(null);
  const refFallo = useRef<HTMLDivElement>(null);

  const errores: ErroresFormulario =
    erroresCliente ?? (estado.estado === "errores" ? estado.errores : {});
  const valores = estado.estado === "errores" || estado.estado === "fallo" ? estado.valores : {};

  function enfocarPrimerError(lista: ErroresFormulario) {
    const primero = ORDEN_CAMPOS.find((campo) => lista[campo]);
    if (primero) document.getElementById(idCampo(primero))?.focus();
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
        className="rounded-3xl bg-white p-8 text-center text-midnight sm:p-12"
      >
        <span
          aria-hidden="true"
          className="mx-auto flex size-14 items-center justify-center rounded-full bg-electric text-white"
        >
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className="mt-5 font-display text-2xl font-bold">{MENSAJE_GRACIAS}</p>
      </div>
    );
  }

  const nErrores = Object.keys(errores).length;

  return (
    <form
      action={enviar}
      onSubmit={alEnviar}
      noValidate
      aria-describedby="presupuesto-obligatorios"
      className="relative rounded-3xl bg-white p-6 text-midnight sm:p-10"
    >
      <p id="presupuesto-obligatorios" className="text-sm text-midnight/75">
        Los campos con <span aria-hidden="true">*</span>
        <span className="sr-only">asterisco</span> son obligatorios.
      </p>

      {estado.estado === "fallo" ? (
        <div
          ref={refFallo}
          role="alert"
          tabIndex={-1}
          className="mt-5 rounded-xl border border-[#C4002B]/30 bg-[#C4002B]/5 px-4 py-3 text-[#9B0022]"
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
            id={idCampo("nombre")}
            name="nombre"
            type="text"
            autoComplete="name"
            maxLength={120}
            defaultValue={valores.nombre}
            {...accesibilidad("nombre", errores.nombre, true)}
            className={claseControl}
          />
        </Campo>

        <Campo campo="taller" etiqueta="Nombre del taller" obligatorio error={errores.taller}>
          <input
            id={idCampo("taller")}
            name="taller"
            type="text"
            autoComplete="organization"
            maxLength={160}
            defaultValue={valores.taller}
            {...accesibilidad("taller", errores.taller, true)}
            className={claseControl}
          />
        </Campo>

        <Campo campo="telefono" etiqueta="Teléfono" obligatorio error={errores.telefono}>
          <input
            id={idCampo("telefono")}
            name="telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={30}
            defaultValue={valores.telefono}
            {...accesibilidad("telefono", errores.telefono, true)}
            className={claseControl}
          />
        </Campo>

        <Campo campo="email" etiqueta="Email" obligatorio error={errores.email}>
          <input
            id={idCampo("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            defaultValue={valores.email}
            {...accesibilidad("email", errores.email, true)}
            className={claseControl}
          />
        </Campo>

        <Campo campo="ubicacion" etiqueta="Provincia o ciudad" error={errores.ubicacion}>
          <input
            id={idCampo("ubicacion")}
            name="ubicacion"
            type="text"
            autoComplete="address-level2"
            maxLength={120}
            defaultValue={valores.ubicacion}
            {...accesibilidad("ubicacion", errores.ubicacion)}
            className={claseControl}
          />
        </Campo>

        <Campo campo="tipo_taller" etiqueta="Tipo de taller" error={errores.tipo_taller}>
          <select
            id={idCampo("tipo_taller")}
            name="tipo_taller"
            defaultValue={valores.tipo_taller ?? ""}
            {...accesibilidad("tipo_taller", errores.tipo_taller)}
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
            id={idCampo("tamano_equipo")}
            name="tamano_equipo"
            defaultValue={valores.tamano_equipo ?? ""}
            {...accesibilidad("tamano_equipo", errores.tamano_equipo)}
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
              id={idCampo("mensaje")}
              name="mensaje"
              rows={4}
              maxLength={MAX_MENSAJE}
              placeholder="Por ejemplo: que las citas entren por la web, avisar a los clientes de la ITV…"
              defaultValue={valores.mensaje}
              {...accesibilidad("mensaje", errores.mensaje)}
              className={claseControl}
            />
          </Campo>
        </div>
      </div>

      {/* Campo trampa contra spam: invisible para personas y lectores de pantalla. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={idCampo(CAMPO_TRAMPA)}>No rellenes este campo</label>
        <input id={idCampo(CAMPO_TRAMPA)} name={CAMPO_TRAMPA} type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="origen" value={origen} />

      <div className="mt-6">
        <div className="flex gap-3">
          <input
            id={idCampo("consentimiento")}
            name="consentimiento"
            type="checkbox"
            required
            defaultChecked={valores.consentimiento === "on"}
            {...accesibilidad("consentimiento", errores.consentimiento, true)}
            className="mt-1 size-5 shrink-0 accent-electric"
          />
          <label htmlFor={idCampo("consentimiento")} className="text-midnight/85">
            Acepto que NoderIA use estos datos para preparar mi presupuesto y contactarme, según la{" "}
            <Link href="/privacidad" className="font-medium text-electric underline underline-offset-2">
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
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-electric px-6 py-3 font-semibold text-white shadow-[0_8px_24px_-8px_rgb(0_104_224/0.6)] transition-colors hover:bg-royal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {enviando ? "Enviando…" : "Pide tu presupuesto"}
      </button>
    </form>
  );
}

function accesibilidad(campo: string, error: string | undefined, obligatorio = false) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? idError(campo) : undefined,
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
  return (
    <div>
      <label htmlFor={idCampo(campo)} className="font-medium">
        {etiqueta}
        {obligatorio ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      <MensajeError campo={campo} error={error} />
    </div>
  );
}

function MensajeError({ campo, error }: { campo: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={idError(campo)} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-[#C4002B]">
      {error}
    </p>
  );
}
