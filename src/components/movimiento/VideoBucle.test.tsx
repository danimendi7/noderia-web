import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GrupoVideos, VideoBucle } from "./VideoBucle";

describe("VideoBucle", () => {
  it("es decorativo, sin sonido, en bucle, con poster, carga diferida y mp4 + webm", () => {
    const { container } = render(<VideoBucle nombre="movil-formulario" />);
    const video = container.querySelector("video")!;
    expect(video).toHaveAttribute("aria-hidden", "true");
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("poster", "/video/movil-formulario.webp");
    expect([...video.querySelectorAll("source")].map((s) => s.getAttribute("type"))).toEqual(["video/webm", "video/mp4"]);
    // El autoplay solo se activa en el cliente, cerca de la pantalla y sin movimiento reducido.
    expect(video).not.toHaveAttribute("autoplay");
  });

  it("el grupo se pausa con un clic sobre el vídeo y su botón solo se ve con el foco", async () => {
    const { container } = render(
      <GrupoVideos etiqueta="Pausar vídeo de prueba">
        <VideoBucle nombre="movil-formulario" />
      </GrupoVideos>,
    );
    // El botón aparece al saber en el cliente que no hay movimiento reducido.
    const boton = await screen.findByRole("button", { name: "Pausar vídeo de prueba" });
    expect(boton.className).toContain("not-focus-visible:sr-only");
    expect(boton).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(container.querySelector("video")!);
    expect(boton).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(boton);
    expect(boton).toHaveAttribute("aria-pressed", "false");
  });
});
