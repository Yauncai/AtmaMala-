import { Soul } from '../types/soul';
import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface NetworkGraphVisualizationProps {
  currentSoul: Soul;
  allSouls: Soul[];
  onSelectSoul: (soul: Soul) => void;
}

interface Node {
  id: string;
  soul: Soul;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isCurrent: boolean;
}

interface Link {
  source: string;
  target: string;
  isMutual: boolean;
}

export default function NetworkGraphVisualization({ currentSoul, allSouls, onSelectSoul }: NetworkGraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const animationRef = useRef<number>();

  const nodesRef = useRef<Node[]>([]);
  const linksRef = useRef<Link[]>([]);

  useEffect(() => {
    const connectedSoulIds = new Set([
      currentSoul.id,
      ...currentSoul.trustedBy,
      ...allSouls.filter(s => s.trustedBy.includes(currentSoul.id)).map(s => s.id)
    ]);

    const connectedSouls = allSouls.filter(soul => connectedSoulIds.has(soul.id));

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    nodesRef.current = connectedSouls.map((soul, index) => {
      const isCurrent = soul.id === currentSoul.id;
      const angle = (index / connectedSouls.length) * Math.PI * 2;
      const radius = isCurrent ? 0 : 200;

      return {
        id: soul.id,
        soul,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        isCurrent
      };
    });

    linksRef.current = [];
    connectedSouls.forEach(soul => {
      if (soul.trustedBy.includes(currentSoul.id)) {
        const isMutual = currentSoul.trustedBy.includes(soul.id);
        linksRef.current.push({
          source: currentSoul.id,
          target: soul.id,
          isMutual
        });
      }
      if (currentSoul.trustedBy.includes(soul.id)) {
        const alreadyExists = linksRef.current.some(
          link => link.source === soul.id && link.target === currentSoul.id
        );
        if (!alreadyExists) {
          linksRef.current.push({
            source: soul.id,
            target: currentSoul.id,
            isMutual: false
          });
        }
      }
    });

    const simulate = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;

      nodes.forEach(node => {
        if (node.isCurrent) {
          node.x = centerX;
          node.y = centerY;
          return;
        }

        nodes.forEach(other => {
          if (node.id === other.id) return;

          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          const repulsion = 50000 / (distance * distance);
          node.vx -= (dx / distance) * repulsion;
          node.vy -= (dy / distance) * repulsion;
        });

        links.forEach(link => {
          if (link.source === node.id || link.target === node.id) {
            const other = nodes.find(n => n.id === (link.source === node.id ? link.target : link.source));
            if (!other) return;

            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;

            const attraction = (distance - 150) * 0.01;
            node.vx += (dx / distance) * attraction;
            node.vy += (dy / distance) * attraction;
          }
        });

        const centerDx = centerX - node.x;
        const centerDy = centerY - node.y;
        const centerDist = Math.sqrt(centerDx * centerDx + centerDy * centerDy);
        if (centerDist > 250) {
          node.vx += (centerDx / centerDist) * 0.5;
          node.vy += (centerDy / centerDist) * 0.5;
        }

        node.vx *= 0.9;
        node.vy *= 0.9;

        node.x += node.vx;
        node.y += node.vy;
      });
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      linksRef.current.forEach(link => {
        const sourceNode = nodesRef.current.find(n => n.id === link.source);
        const targetNode = nodesRef.current.find(n => n.id === link.target);

        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = link.isMutual ? 'rgba(236, 72, 153, 0.4)' : 'rgba(45, 212, 191, 0.3)';
          ctx.lineWidth = link.isMutual ? 3 : 2;
          ctx.stroke();
        }
      });

      nodesRef.current.forEach(node => {
        const radius = node.isCurrent ? 25 : 20;

        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
        if (node.isCurrent) {
          gradient.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
          gradient.addColorStop(1, 'rgba(167, 139, 250, 0.8)');
        } else {
          gradient.addColorStop(0, 'rgba(45, 212, 191, 0.6)');
          gradient.addColorStop(1, 'rgba(167, 139, 250, 0.6)');
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = node.isCurrent ? 'rgba(236, 72, 153, 1)' : 'rgba(45, 212, 191, 0.8)';
        ctx.lineWidth = node.isCurrent ? 3 : 2;
        ctx.stroke();

        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.soul.avatar, node.x, node.y);
      });

      ctx.restore();

      if (hoveredNode) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.8)';
        ctx.lineWidth = 2;
        const padding = 10;
        const textWidth = ctx.measureText(hoveredNode.soul.name).width;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = 30;
        const x = hoveredNode.x * scale + offset.x - boxWidth / 2;
        const y = hoveredNode.y * scale + offset.y - 40;

        ctx.beginPath();
        ctx.roundRect(x, y, boxWidth, boxHeight, 5);
        ctx.fill();
        ctx.stroke();

        ctx.font = '14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(hoveredNode.soul.name, x + boxWidth / 2, y + boxHeight / 2);
      }
    };

    const animate = () => {
      simulate();
      render();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentSoul, allSouls, scale, offset, hoveredNode]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - offset.x) / scale;
    const mouseY = (e.clientY - rect.top - offset.y) / scale;

    const hoveredNode = nodesRef.current.find(node => {
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (node.isCurrent ? 25 : 20);
    });

    setHoveredNode(hoveredNode || null);

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - offset.x) / scale;
    const mouseY = (e.clientY - rect.top - offset.y) / scale;

    const clickedNode = nodesRef.current.find(node => {
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (node.isCurrent ? 25 : 20);
    });

    if (clickedNode && !clickedNode.isCurrent) {
      onSelectSoul(clickedNode.soul);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      />

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-full bg-soul-dark/80 border border-soul-purple/30 flex items-center justify-center text-soul-teal hover:border-soul-teal/50 transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-full bg-soul-dark/80 border border-soul-purple/30 flex items-center justify-center text-soul-teal hover:border-soul-teal/50 transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded-full bg-soul-dark/80 border border-soul-purple/30 flex items-center justify-center text-soul-teal hover:border-soul-teal/50 transition-colors"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-4 left-4 bg-soul-dark/80 border border-soul-purple/30 rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-soul-pink to-soul-purple" />
          <span className="text-white">Current Soul</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-soul-teal to-soul-purple" />
          <span className="text-white">Connected Souls</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-0.5 bg-soul-pink/40" />
          <span className="text-white">Mutual Trust</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-soul-teal/30" />
          <span className="text-white">One-way Trust</span>
        </div>
      </div>
    </div>
  );
}
