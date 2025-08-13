import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Plane, useTexture, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

// 3D Silk Cloth Component
const SilkCloth = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Create silk-like texture with noise
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      
      // Animate vertices for cloth-like movement
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const position = geometry.attributes.position;
      
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const wave = Math.sin(x * 2 + time) * 0.1;
        const wave2 = Math.cos(y * 3 + time * 1.5) * 0.05;
        position.setZ(i, wave + wave2);
      }
      position.needsUpdate = true;
    }
  });

  return (
    <Plane 
      ref={meshRef} 
      args={[4, 3, 32, 24]} 
      position={[0, 0, -1]}
      rotation={[0, 0, 0.1]}
    >
      <meshStandardMaterial
        ref={materialRef}
        color="#7A1F2B"
        metalness={0.1}
        roughness={0.3}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </Plane>
  );
};

// Performance-aware 3D Scene
const Hero3DScene = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#C9A227" />
        
        <SilkCloth />
        
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
};

export const Hero = () => {
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Detect performance and user preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    if (mediaQuery.matches || isLowEnd) {
      setIs3DEnabled(false);
    }
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--mnf-gold) / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, hsl(var(--mnf-maroon) / 0.1) 0%, transparent 50%)`
        }} />
      </div>

      {/* 3D Scene or Fallback */}
      {is3DEnabled ? (
        <Hero3DScene visible={true} />
      ) : (
        <motion.div 
          className="absolute inset-0 silk-texture opacity-60"
          style={{ y, opacity }}
        />
      )}

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        style={{ y, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Handcrafted with Love • Sustainably Made</span>
          </div>
        </motion.div>

        <motion.h1 
          className="text-display text-4xl sm:text-5xl lg:text-7xl font-semibold text-foreground mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <span className="block">Ethnic Elegance</span>
          <span className="block text-primary">Redefined</span>
        </motion.h1>

        <motion.p 
          className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          Discover our curated collection of premium sarees, eco-friendly fashion, 
          and exquisite imitation jewellery. Where tradition meets sustainability.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <Button className="btn-primary group w-full sm:w-auto text-lg px-8 py-4">
            Shop Sarees
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-4 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-secondary hover:text-secondary-foreground">
            Explore Eco Collection
          </Button>
        </motion.div>

        {/* Video CTA */}
        <motion.div 
          className="mt-16 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          <button 
            onClick={() => setIsVideoPlaying(true)}
            className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Play className="h-5 w-5 text-primary ml-0.5" />
              </div>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
            </div>
            <span className="font-medium">Watch Our Story</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div 
        className="absolute top-1/4 left-8 hidden lg:block"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-16 h-16 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center">
          <span className="text-2xl">🌿</span>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-1/4 right-8 hidden lg:block"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
          <span className="text-3xl">✨</span>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div 
          className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 bg-muted-foreground rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Performance Toggle (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setIs3DEnabled(!is3DEnabled)}
          className="absolute top-4 right-4 px-3 py-1 text-xs bg-card/80 backdrop-blur-sm rounded-lg border border-border/50"
        >
          3D: {is3DEnabled ? 'ON' : 'OFF'}
        </button>
      )}
    </section>
  );
};