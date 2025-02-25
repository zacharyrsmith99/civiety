import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectAllTiles,
  selectViewport,
  setViewport,
} from "@/store/slices/landSlice";
import { GridPosition } from "@/store/slices/types/land";
import { positionKey } from "@/store/slices/util/initialLandState";

const TILE_SIZE = 32; // pixels
const TILE_COLORS = {
  grassland: "#7CB342",
  steppe: "#CDDC39",
  forest: "#1B5E20",
  jungle: "#004D40",
  taiga: "#33691E",
  desert: "#FFD54F",
  tundra: "#ECEFF1",
};

const TERRAIN_MODIFIERS = {
  flat: { filter: "brightness(1)" },
  hill: { filter: "brightness(0.9)" },
  coastal: { filter: "brightness(1.1)" },
  mountain: { filter: "brightness(0.8)" },
};

const IMPROVEMENT_ICONS: Record<string, string> = {
  none: "",
  farm: "🌾",
  mine: "⛏️",
  lumber_camp: "🪓",
  settlement: "🏠",
};

interface MapProps {
  onTileSelect: (position: GridPosition) => void;
  selectedPosition: GridPosition | null;
  onBackgroundClick?: () => void;
  className?: string;
}

export const GameMap: React.FC<MapProps> = ({
  onTileSelect,
  selectedPosition,
  onBackgroundClick,
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const tiles = useAppSelector(selectAllTiles);
  const { center, zoom } = useAppSelector(selectViewport);
  const mapRef = useRef<HTMLDivElement>(null);

  // State for panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [viewOffset, setViewOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const scaledTileSize = TILE_SIZE * zoom;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.5, Math.min(3, zoom + zoomDelta));

      dispatch(setViewport({ zoom: newZoom }));
    };

    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (mapElement) {
        mapElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [zoom, dispatch]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const dx = (e.clientX - dragStart.x) / scaledTileSize;
    const dy = (e.clientY - dragStart.y) / scaledTileSize;

    setViewOffset({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    const newCenter = {
      x: center.x - viewOffset.x,
      y: center.y - viewOffset.y,
    };

    dispatch(setViewport({ center: newCenter }));

    setViewOffset({ x: 0, y: 0 });
  };

  const calculateVisibleTiles = () => {
    if (!mapRef.current) return [];

    const mapWidth = mapRef.current.clientWidth;
    const mapHeight = mapRef.current.clientHeight;

    const tilesWide = Math.ceil(mapWidth / scaledTileSize) + 2;
    const tilesHigh = Math.ceil(mapHeight / scaledTileSize) + 2;

    const startX =
      Math.floor(center.x - tilesWide / 2) - Math.floor(viewOffset.x);
    const startY =
      Math.floor(center.y - tilesHigh / 2) - Math.floor(viewOffset.y);
    const endX = startX + tilesWide;
    const endY = startY + tilesHigh;

    const visibleTilePositions: GridPosition[] = [];

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        visibleTilePositions.push({ x, y });
      }
    }

    return visibleTilePositions;
  };

  const visibleTilePositions = calculateVisibleTiles();

  const handleTileClick = (position: GridPosition) => {
    onTileSelect(position);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onBackgroundClick?.();
    }
  };

  return (
    <div
      ref={mapRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="relative w-full h-full"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.2s ease-out",
        }}
        onClick={handleBackgroundClick}
      >
        {/* Map background - terra incognita */}
        <div
          className="absolute inset-0 bg-gray-800 bg-opacity-90"
          onClick={onBackgroundClick}
        />

        {/* Render visible tiles */}
        {visibleTilePositions.map((position) => {
          const tileKey = positionKey(position);
          const tile = tiles[tileKey];

          // For positions without tiles in our state, render empty terra incognita
          if (!tile) {
            return (
              <div
                key={tileKey}
                className="absolute border border-gray-700 bg-gray-800"
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  left: `calc(50% + ${(position.x - center.x + viewOffset.x) * TILE_SIZE}px)`,
                  top: `calc(50% + ${(position.y - center.y + viewOffset.y) * TILE_SIZE}px)`,
                }}
              />
            );
          }

          // Skip rendering undiscovered tiles
          if (!tile.discovered) {
            return (
              <div
                key={tileKey}
                className="absolute border border-gray-700 bg-gray-800"
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  left: `calc(50% + ${(position.x - center.x + viewOffset.x) * TILE_SIZE}px)`,
                  top: `calc(50% + ${(position.y - center.y + viewOffset.y) * TILE_SIZE}px)`,
                }}
              />
            );
          }

          // Render discovered tiles
          return (
            <div
              key={tileKey}
              className={`
                absolute 
                ${tile.controlled ? "border-2 border-amber-400" : "border border-gray-600"}
                ${
                  selectedPosition &&
                  position.x === selectedPosition.x &&
                  position.y === selectedPosition.y
                    ? "ring-4 ring-white ring-opacity-60 shadow-lg z-10 transform scale-105 transition-all duration-200"
                    : ""
                }
              `}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                left: `calc(50% + ${(position.x - center.x + viewOffset.x) * TILE_SIZE}px)`,
                top: `calc(50% + ${(position.y - center.y + viewOffset.y) * TILE_SIZE}px)`,
                backgroundColor: TILE_COLORS[tile.biome],
                ...TERRAIN_MODIFIERS[tile.terrain],
              }}
              onClick={() => handleTileClick(position)}
            >
              {/* Coordinate indicator (debug purposes) */}
              <span className="absolute bottom-0 right-1 text-xs text-white bg-black bg-opacity-50 px-1">
                {position.x},{position.y}
              </span>

              {/* Improvements */}
              {tile.improvements.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  {IMPROVEMENT_ICONS[tile.improvements[0].type]}
                </div>
              )}

              {/* Selection indicator */}
              {selectedPosition &&
                position.x === selectedPosition.x &&
                position.y === selectedPosition.y && (
                  <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse pointer-events-none"></div>
                )}
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 bg-slate-800 bg-opacity-80 p-2 rounded-lg flex gap-2 z-20">
        <button
          className="w-8 h-8 flex items-center justify-center bg-amber-800 text-white rounded hover:bg-amber-700"
          onClick={() =>
            dispatch(setViewport({ zoom: Math.min(zoom + 0.2, 3) }))
          }
        >
          +
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-amber-800 text-white rounded hover:bg-amber-700"
          onClick={() =>
            dispatch(setViewport({ zoom: Math.max(zoom - 0.2, 0.5) }))
          }
        >
          -
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-amber-800 text-white rounded hover:bg-amber-700"
          onClick={() => dispatch(setViewport({ center: { x: 0, y: 0 } }))}
        >
          🏠
        </button>
      </div>
    </div>
  );
};

export default GameMap;
