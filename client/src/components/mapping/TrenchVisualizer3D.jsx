import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Box, Layers, AlertTriangle } from "lucide-react";

export default function TrenchVisualizer3D({
  siteName = "Excavation Site",
  bounds = {
    min_x: 0,
    max_x: 10,
    min_y: 0,
    max_y: 10,
    min_depth: -8,
    max_depth: 0,
  },
  layers = [],
  artifacts = [],
  depthFilter = -10,
  selectedLayerCodes = [],
  is2DFallback = false,
  selectedArtifact = null,
  onSelectArtifact = () => {},
}) {
  const mountRef = useRef(null);
  const canvas2DRef = useRef(null);
  const [webGLError, setWebGLError] = useState(false);

  // Filter layers & artifacts based on depth and layer toggles
  const filteredLayers = layers.filter((layer) =>
    selectedLayerCodes.length > 0
      ? selectedLayerCodes.includes(layer.layer_code)
      : true,
  );

  const filteredArtifacts = artifacts.filter((art) => {
    const z = art.z_depth_meters ?? -1.0;
    return z >= depthFilter;
  });

  // Three.js WebGL Renderer setup
  useEffect(() => {
    if (is2DFallback || webGLError || !mountRef.current) return;

    let scene, camera, renderer, animationFrameId;
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };

    try {
      const width = mountRef.current.clientWidth || 800;
      const height = mountRef.current.clientHeight || 500;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a); // slate-900

      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(15, 12, 15);
      camera.lookAt(0, -3, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio || 1);

      mountRef.current.innerHTML = "";
      mountRef.current.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfff5ea, 0.8);
      dirLight.position.set(20, 30, 10);
      scene.add(dirLight);

      // Grid helper / Trench wireframe box
      const trenchWidth = bounds.max_x - bounds.min_x || 10;
      const trenchLength = bounds.max_y - bounds.min_y || 10;
      const trenchDepth = Math.abs(bounds.min_depth - bounds.max_depth) || 8;

      const gridHelper = new THREE.GridHelper(
        Math.max(trenchWidth, trenchLength) * 1.5,
        10,
        0xf59e0b,
        0x334155,
      );
      gridHelper.position.y = 0;
      scene.add(gridHelper);

      // Group for stratigraphy layers
      const layersGroup = new THREE.Group();
      filteredLayers.forEach((layer, idx) => {
        const topY = -(layer.depth_top_meters ?? idx * 1.5);
        const botY = -(layer.depth_bottom_meters ?? (idx + 1) * 1.5);
        const layerThickness = Math.max(0.2, Math.abs(topY - botY));
        const layerCenterY = (topY + botY) / 2;

        const geometry = new THREE.BoxGeometry(
          trenchWidth,
          layerThickness,
          trenchLength,
        );
        const colorHex = parseInt(
          (layer.color_hex || "#8B4513").replace("#", "0x"),
          16,
        );
        const material = new THREE.MeshStandardMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.65,
          roughness: 0.8,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, layerCenterY, 0);
        layersGroup.add(mesh);
      });
      scene.add(layersGroup);

      // Group for Spatial Artifact Nodes
      const artifactsGroup = new THREE.Group();
      filteredArtifacts.forEach((art) => {
        const x = (art.x_offset_meters ?? 0) - trenchWidth / 2;
        const y = -(art.z_depth_meters ?? 1.5);
        const z = (art.y_offset_meters ?? 0) - trenchLength / 2;

        const isSelected = selectedArtifact?.id === art.id;
        const geo = new THREE.SphereGeometry(isSelected ? 0.4 : 0.25, 16, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xef4444 : 0xf59e0b,
          emissive: isSelected ? 0x991b1b : 0x78350f,
          roughness: 0.3,
        });

        const sphere = new THREE.Mesh(geo, mat);
        sphere.position.set(x, y, z);
        sphere.userData = art;
        artifactsGroup.add(sphere);
      });
      scene.add(artifactsGroup);

      // Mouse Orbit Controls (basic implementation)
      const handleMouseDown = (e) => {
        isMouseDown = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const handleMouseMove = (e) => {
        if (!isMouseDown) return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        const radius = camera.position.distanceTo(new THREE.Vector3(0, -3, 0));
        let theta = Math.atan2(camera.position.x, camera.position.z);
        let phi = Math.acos(camera.position.y / radius);

        theta -= deltaX * 0.008;
        phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, phi - deltaY * 0.008));

        camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
        camera.position.y = radius * Math.cos(phi);
        camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
        camera.lookAt(0, -3, 0);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const handleMouseUp = () => {
        isMouseDown = false;
      };

      // Raycasting for clicking artifact nodes
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const handleClick = (e) => {
        if (!mountRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(artifactsGroup.children);
        if (intersects.length > 0) {
          onSelectArtifact(intersects[0].object.userData);
        }
      };

      const domElement = renderer.domElement;
      domElement.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      domElement.addEventListener("click", handleClick);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        domElement.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        domElement.removeEventListener("click", handleClick);
        if (mountRef.current) {
          mountRef.current.innerHTML = "";
        }
      };
    } catch (err) {
      console.warn(
        "WebGL initialization failed, falling back to 2D Canvas:",
        err,
      );
      setWebGLError(true);
    }
  }, [
    is2DFallback,
    webGLError,
    bounds,
    filteredLayers,
    filteredArtifacts,
    selectedArtifact,
  ]);

  // 2D Canvas Fallback Renderer
  useEffect(() => {
    if ((!is2DFallback && !webGLError) || !canvas2DRef.current) return;

    const canvas = canvas2DRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#1e293b"; // slate-800
    ctx.fillRect(0, 0, width, height);

    // Title / Mode label
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 12px monospace";
    ctx.fillText(
      `2D Trench Stratigraphy Fallback View &bull; ${siteName}`,
      15,
      25,
    );

    // Draw Strata Bands
    const startY = 50;
    const totalDepth = Math.abs(bounds.min_depth - bounds.max_depth) || 8;
    const availableHeight = height - 90;

    filteredLayers.forEach((layer, idx) => {
      const topM = layer.depth_top_meters ?? idx * 1.5;
      const botM = layer.depth_bottom_meters ?? (idx + 1) * 1.5;

      const bandY = startY + (topM / totalDepth) * availableHeight;
      const bandHeight = Math.max(
        15,
        ((botM - topM) / totalDepth) * availableHeight,
      );

      ctx.fillStyle = layer.color_hex || "#8B4513";
      ctx.globalAlpha = 0.75;
      ctx.fillRect(40, bandY, width - 80, bandHeight);
      ctx.globalAlpha = 1.0;

      ctx.strokeStyle = "#475569";
      ctx.strokeRect(40, bandY, width - 80, bandHeight);

      // Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "11px sans-serif";
      ctx.fillText(
        `${layer.layer_code} (${layer.historical_period}) [${topM}m to ${botM}m]`,
        50,
        bandY + Math.min(18, bandHeight / 1.5),
      );
    });

    // Draw Spatial Artifact Nodes as 2D Dots
    filteredArtifacts.forEach((art) => {
      const z = art.z_depth_meters ?? 1.5;
      const x = art.x_offset_meters ?? 5;

      const posX = 40 + (x / (bounds.max_x || 10)) * (width - 80);
      const posY = startY + (z / totalDepth) * availableHeight;

      const isSelected = selectedArtifact?.id === art.id;

      ctx.beginPath();
      ctx.arc(posX, posY, isSelected ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? "#ef4444" : "#f59e0b";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = "#f8fafc";
      ctx.font = "10px monospace";
      ctx.fillText(art.artifact_code, posX + 10, posY + 4);
    });
  }, [
    is2DFallback,
    webGLError,
    siteName,
    bounds,
    filteredLayers,
    filteredArtifacts,
    selectedArtifact,
  ]);

  const handle2DCanvasClick = (e) => {
    if (!canvas2DRef.current) return;
    const rect = canvas2DRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const totalDepth = Math.abs(bounds.min_depth - bounds.max_depth) || 8;
    const availableHeight = canvas2DRef.current.height - 90;
    const startY = 50;

    // Find clicked artifact
    for (const art of filteredArtifacts) {
      const z = art.z_depth_meters ?? 1.5;
      const x = art.x_offset_meters ?? 5;

      const posX =
        40 + (x / (bounds.max_x || 10)) * (canvas2DRef.current.width - 80);
      const posY = startY + (z / totalDepth) * availableHeight;

      const dist = Math.hypot(clickX - posX, clickY - posY);
      if (dist <= 15) {
        onSelectArtifact(art);
        break;
      }
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
      {/* Mode Status Banner */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded border border-slate-700 text-xs font-mono text-slate-300 flex items-center space-x-2">
        <Box className="w-4 h-4 text-amber-400" />
        <span className="font-bold text-amber-300">{siteName}</span>
        <span>&bull;</span>
        <span>
          {filteredLayers.length} Strata Layers | {filteredArtifacts.length}{" "}
          Artifact Nodes
        </span>
      </div>

      {/* Render WebGL 3D or 2D Canvas Fallback */}
      {!is2DFallback && !webGLError ? (
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
          {webGLError && (
            <div className="mb-2 px-3 py-1 bg-amber-900/80 text-amber-200 text-xs rounded flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                WebGL context not available. Displaying 2D Canvas fallback map.
              </span>
            </div>
          )}
          <canvas
            ref={canvas2DRef}
            width={800}
            height={460}
            onClick={handle2DCanvasClick}
            className="w-full h-full object-contain cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
