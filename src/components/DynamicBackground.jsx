"use client";
import { useEffect, useRef } from "react";

const DynamicBackground = ({ logoPath = "logo.webp" }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const programRef = useRef(null);
  const glRef = useRef(null);
  const geometryRef = useRef(null);
  const particleGridRef = useRef([]);
  const posArrayRef = useRef(null);
  const colorArrayRef = useRef(null);
  const isCleanedUpRef = useRef(false);
  const isMobileRef = useRef(false);

  const CONFIG = {
    logoSize: 500,
    logoColor: "#999999",
    canvasBg: "transparent",
    distortionRadius: 3000,
    forceStrength: 0.003,
    maxDisplacement: 100,
    returnForce: 0.025,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const checkMobile = () => window.innerWidth < 1000;
    isMobileRef.current = checkMobile();
    if (isMobileRef.current) return;

    isCleanedUpRef.current = false;

    // Setup high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    glRef.current = gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
          }
        : { r: 1, g: 1, b: 1 };
    };

    // Shaders
    const vertexShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      attribute vec2 a_position;
      attribute vec4 a_color;
      varying vec4 v_color;
      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 clipSpace = zeroToOne * 2.0 - 1.0;
        v_color = a_color;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = 3.5;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      varying vec4 v_color;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
      }
    `;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (vs, fs) => {
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    // Load Logo
    const loadLogo = () => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        if (isCleanedUpRef.current) return;
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = CONFIG.logoSize;
        tempCanvas.height = CONFIG.logoSize;
        const ctx = tempCanvas.getContext("2d");
        ctx.clearRect(0, 0, CONFIG.logoSize, CONFIG.logoSize);
        ctx.drawImage(image, 0, 0, CONFIG.logoSize, CONFIG.logoSize);
        const imageData = ctx.getImageData(0, 0, CONFIG.logoSize, CONFIG.logoSize);
        initParticleSystem(imageData.data, CONFIG.logoSize);
      };
      image.onerror = () => console.error("Failed to load logo image:", logoPath);
      image.src = new URL(`/${logoPath}`, window.location.origin).toString();
    };

    // Init Particles
    const initParticleSystem = (pixels, dim) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const positions = [];
      const colors = [];
      const particles = [];
      const tint = hexToRgb(CONFIG.logoColor);

      for (let i = 0; i < dim; i += 2) {
        for (let j = 0; j < dim; j += 2) {
          const idx = (i * dim + j) * 4;
          const alpha = pixels[idx + 3];
          if (alpha > 10) {
            const x = centerX + (j - dim / 2);
            const y = centerY + (i - dim / 2);
            positions.push(x, y);
            colors.push(
              (pixels[idx] / 255) * tint.r,
              (pixels[idx + 1] / 255) * tint.g,
              (pixels[idx + 2] / 255) * tint.b,
              alpha / 255
            );
            particles.push({ ox: x, oy: y, vx: 0, vy: 0 });
          }
        }
      }

      posArrayRef.current = new Float32Array(positions);
      colorArrayRef.current = new Float32Array(colors);
      particleGridRef.current = particles;

      geometryRef.current = {
        positionBuffer: gl.createBuffer(),
        colorBuffer: gl.createBuffer(),
        vertexCount: particles.length,
      };

      gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, posArrayRef.current, gl.DYNAMIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colorArrayRef.current, gl.STATIC_DRAW);

      console.log(`✅ Created ${particles.length} particles`);
      startAnimation();
    };

    // Animation Loop
    const startAnimation = () => {
      const render = () => {
        if (
          isCleanedUpRef.current ||
          !gl ||
          gl.isContextLost() ||
          !programRef.current
        ) {
          return;
        }

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(programRef.current);
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.colorBuffer);
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, geometryRef.current.vertexCount);

        animationFrameRef.current = requestAnimationFrame(render);
      };

      render();
    };

    // Handle context lost
    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn("WebGL context lost event triggered.");
      isCleanedUpRef.current = true;
      cancelAnimationFrame(animationFrameRef.current);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);

    loadLogo();

    return () => {
      isCleanedUpRef.current = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener("webglcontextlost", handleContextLost);
    };
  }, [logoPath]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        backgroundColor: CONFIG.canvasBg,
      }}
    />
  );
};

export default DynamicBackground;