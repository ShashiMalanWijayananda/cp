import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface OscilloscopeDisplayProps {
  imageUrl?: string;
}

const OscilloscopeDisplay: React.FC<OscilloscopeDisplayProps> = ({
  imageUrl
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const requestRef = useRef<number | undefined>(undefined);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial update
    updateDimensions();

    return () => {
      resizeObserver.disconnect();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (imageUrl && !imageRef.current) {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        setIsImageLoaded(true);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const drawFrame = () => {
      // Clear canvas
      ctx.fillStyle = '#001208';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw grid
      ctx.strokeStyle = '#003015';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;

      // Vertical lines
      for (let x = 0; x < dimensions.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < dimensions.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }

      // Glow effect
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.4;

      for (let i = 0; i < 3; i++) {
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, maxRadius
        );
        gradient.addColorStop(0, `rgba(0, 255, 100, ${0.1 - i * 0.03})`);
        gradient.addColorStop(0.2, `rgba(0, 255, 100, ${0.05 - i * 0.01})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      }

      // Draw image if loaded
      if (imageRef.current && isImageLoaded) {
        const image = imageRef.current;
        const scale = Math.min(
          (dimensions.width * 0.6) / image.width,
          (dimensions.height * 0.6) / image.height
        );

        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
        const x = (dimensions.width - scaledWidth) / 2;
        const y = (dimensions.height - scaledHeight) / 2;

        ctx.save();
        ctx.filter = 'blur(4px)';
        ctx.globalAlpha = 0.4;
        ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
        
        ctx.filter = 'none';
        ctx.globalAlpha = 0.8;
        ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
        ctx.restore();
      }

      // Add noise
      const noiseData = ctx.createImageData(dimensions.width, dimensions.height);
      for (let i = 0; i < noiseData.data.length; i += 4) {
        const noise = Math.random() * 255;
        noiseData.data[i] = 0;
        noiseData.data[i + 1] = noise * 0.1;
        noiseData.data[i + 2] = 0;
        noiseData.data[i + 3] = 10;
      }
      ctx.putImageData(noiseData, 0, 0);

      // Central spot
      const spotGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 20
      );
      spotGradient.addColorStop(0, 'rgba(0, 255, 100, 0.2)');
      spotGradient.addColorStop(0.5, 'rgba(0, 255, 100, 0.1)');
      spotGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = spotGradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      requestRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [dimensions, isImageLoaded]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#000000',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(0,255,100,0.15)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(0,255,100,0.1) 0%, rgba(0,0,0,0) 60%)',
            pointerEvents: 'none',
          }
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </Box>
    </Box>
  );
};

export default OscilloscopeDisplay;
