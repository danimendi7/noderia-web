import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GrupoVideos, VideoBucle } from "./VideoBucle";

describe("VideoBucle", () => {
  it("es decorativo, sin sonido, en bucle, con poster, carga diferida y mp4 + webm", () => {
    const { container } = render(<VideoBucle nombre="web-taller" />);
    const video = container.querySelector("video")!;
    expect(video).toHaveAttribute("aria-hidden", "true");
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("poster", "/video/web-taller.webp");
    expect([...video.querySelectorAll("source")].map((s) => s.getAttribute("type"))).toEqual(["video/webm", "video/mp4"]);
    // El autoplay solo se activa en el cliente, cerca de la pantalla y sin movimiento reducido.
    expect(video).not.toHaveAttribute("autoplay");
  });

  it("el grupo tiene un botón de pausa con aria-pressed", () => {
    render(
      <GrupoVideos etiqueta="Pausar vídeo de prueba">
        <VideoBucle nombre="web-taller" />
      </GrupoVideos>,
    );
    const boton = screen.getByRole("button", { name: "Pausar vídeo de prueba" });
    expect(boton).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(boton);
    expect(boton).toHaveAttribute("aria-pressed", "true");
  });
});
