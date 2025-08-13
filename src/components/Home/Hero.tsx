import { useRef, useEffect, useState, Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Plane, 
  useTexture, 
  Environment, 
  Float,
  Sparkles,
  MeshTransmissionMaterial,
  Text3D,
  Center,
  useGLTF,
  OrbitControls,
  Stars,
  Trail
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  DepthOfField, 
  Noise, 
  ChromaticAberration,
  SMAA,
  ToneMapping
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles as SparklesIcon, Star, Diamond } from 'lucide-react';

// Advanced Silk Cloth with Physics Simulation
const SilkCloth = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const { mouse, viewport } = useThree();
  
  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Complex wave patterns
      meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.05 + mouse.x * 0.1;
      meshRef.current.rotation.x = Math.cos(time * 0.15) * 0.03 + mouse.y * 0.1;
      meshRef.current.position.y = Math.sin(time * 0.3) * 0.2;
      meshRef.current.position.x = Math.cos(time * 0.25) * 0.1;
      
      // Advanced vertex displacement with multiple wave layers
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const position = geometry.attributes.position;
      
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        
        // Multi-layered wave displacement
        const wave1 = Math.sin(x * 3 + time * 1.5) * 0.08;
        const wave2 = Math.cos(y * 4 + time * 2) * 0.06;
        const wave3 = Math.sin((x + y) * 2 + time) * 0.04;
        const ripple = Math.sin(Math.sqrt(x*x + y*y) * 5 - time * 3) * 0.03;
        
        // Mouse interaction
        const mouseInfluence = Math.exp(-((x - mouse.x * 2)**2 + (y - mouse.y * 2)**2) * 2) * 0.2;
        
        position.setZ(i, wave1 + wave2 + wave3 + ripple + mouseInfluence);
      }
      position.needsUpdate = true;
      
      // Dynamic material properties
      materialRef.current.roughness = 0.2 + Math.sin(time * 0.5) * 0.1;
      materialRef.current.metalness = 0.1 + Math.cos(time * 0.3) * 0.05;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Plane 
        ref={meshRef} 
        args={[6, 4, 64, 48]} 
        position={[0, 0, -2]}
        rotation={[0, 0, 0.1]}
      >
        <meshStandardMaterial
          ref={materialRef}
          color="#7A1F2B"
          metalness={0.15}
          roughness={0.25}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          envMapIntensity={1.5}
        />
      </Plane>
    </Float>
  );
};

// Floating Gold Particles
const GoldParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      particlesRef.current.rotation.y = time * 0.1;
      particlesRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  const count = 100;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#C9A227"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Interactive Jewelry Gems
const FloatingGems = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Float 
          key={i}
          speed={1 + i * 0.2} 
          rotationIntensity={0.5} 
          floatIntensity={0.8}
          position={[
            Math.sin(i) * 4, 
            Math.cos(i) * 3, 
            Math.random() * 2 - 1
          ]}
        >
          <mesh>
            <octahedronGeometry args={[0.1 + i * 0.02]} />
            <MeshTransmissionMaterial
              color={i % 2 === 0 ? "#C9A227" : "#7A1F2B"}
              transmission={0.9}
              roughness={0.05}
              thickness={0.2}
              chromaticAberration={0.02}
              anisotropy={1}
            />
          </mesh>
          <Trail
            width={0.05}
            length={8}
            color={new THREE.Color(i % 2 === 0 ? "#C9A227" : "#7A1F2B")}
            attenuation={(t) => t * t}
          >
            <mesh>
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial color={i % 2 === 0 ? "#C9A227" : "#7A1F2B"} />
            </mesh>
          </Trail>
        </Float>
      ))}
    </>
  );
};

// Cinematic 3D Scene with Post-Processing
const CinematicScene = ({ visible, perfLevel }: { visible: boolean; perfLevel: number }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, perfLevel > 1 ? 2 : 1.5]}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          preserveDrawingBuffer: false
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Suspense fallback={null}>
          {/* Advanced Lighting Setup */}
          <ambientLight intensity={0.3} color="#F7F3ED" />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            color="#FFFFFF"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <spotLight 
            position={[-5, 5, 5]} 
            intensity={0.8} 
            color="#C9A227"
            angle={0.3}
            penumbra={0.5}
            castShadow
          />
          <pointLight position={[5, -5, 3]} intensity={0.4} color="#7A1F2B" />
          
          {/* 3D Content */}
          <SilkCloth />
          <GoldParticles />
          <FloatingGems />
          
          {/* Sparkles for magical effect */}
          <Sparkles
            count={50}
            scale={[10, 10, 10]}
            size={2}
            speed={0.3}
            color="#C9A227"
          />
          
          {/* Environment */}
          <Environment preset="studio" />
          <Stars 
            radius={100} 
            depth={50} 
            count={200} 
            factor={2} 
            saturation={0.5}
            fade
          />
          
          {/* Post-Processing Effects */}
          {perfLevel > 0 && (
            <EffectComposer multisampling={perfLevel > 1 ? 4 : 0}>
              <SMAA />
              <Bloom 
                intensity={0.4}
                kernelSize={perfLevel > 1 ? 5 : 3}
                luminanceThreshold={0.9}
                luminanceSmoothing={0.025}
                mipmapBlur
              />
              <DepthOfField 
                focusDistance={0.02}
                focalLength={0.05}
                bokehScale={perfLevel > 1 ? 6 : 3}
              />
              <ChromaticAberration 
                offset={new THREE.Vector2(0.002, 0.002)} 
                radialModulation
                modulationOffset={0.2}
              />
              <ToneMapping 
                mode={ToneMappingMode.ACES_FILMIC} 
                resolution={256}
                whitePoint={16.0}
                middleGrey={0.6}
                minLuminance={0.01}
                averageLuminance={1.0}
                adaptationRate={2.0}
              />
              <Noise opacity={0.015} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

// Performance Detection Hook
const usePerformanceLevel = () => {
  const [perfLevel, setPerfLevel] = useState(2); // 0: low, 1: medium, 2: high
  
  useEffect(() => {
    const detectPerformance = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) {
        setPerfLevel(0);
        return;
      }
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
      
      // Device-specific performance detection
      const isHighEnd = /RTX|GTX 10\d0|GTX 20\d0|GTX 30\d0|GTX 40\d0|RX 6\d00|RX 7\d00/i.test(renderer);
      const isMidRange = /GTX|RX|Radeon|GeForce/i.test(renderer);
      const isLowEnd = navigator.hardwareConcurrency < 4;
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (isReducedMotion || isLowEnd) {
        setPerfLevel(0);
      } else if (isHighEnd) {
        setPerfLevel(2);
      } else if (isMidRange) {
        setPerfLevel(1);
      } else {
        setPerfLevel(0);
      }
    };
    
    detectPerformance();
  }, []);
  
  return perfLevel;
};

export const Hero = () => {
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const perfLevel = usePerformanceLevel();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const y = useTransform(smoothProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(smoothProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [1, 1.1]);
  const blur = useTransform(smoothProgress, [0, 1], ["blur(0px)", "blur(8px)"]);

  // Performance-based 3D toggle
  useEffect(() => {
    const shouldEnable3D = perfLevel > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIs3DEnabled(shouldEnable3D);
  }, [perfLevel]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient"
    >
      {/* Animated Background Mesh */}
      <motion.div 
        className="absolute inset-0 mesh-gradient opacity-40 animate-mesh-flow"
        style={{ filter: blur }}
      />
      
      {/* Cinematic 3D Scene */}
      {is3DEnabled && (
        <motion.div style={{ scale, opacity }}>
          <CinematicScene visible={true} perfLevel={perfLevel} />
        </motion.div>
      )}
      
      {/* Fallback Silk Texture */}
      {!is3DEnabled && (
        <motion.div 
          className="absolute inset-0 silk-texture opacity-70 animate-silk-wave"
          style={{ y, opacity, filter: blur }}
        />
      )}

      {/* Interactive Particles Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              i % 3 === 0 ? 'bg-mnf-gold/30' : 
              i % 3 === 1 ? 'bg-mnf-maroon/20' : 'bg-mnf-leaf/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              '--stagger': i,
            } as any}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        style={{ y: useTransform(smoothProgress, [0, 1], ["0%", "30%"]) }}
      >
        {/* Brand Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 card-glass px-6 py-3 rounded-full border border-border/30 text-sm font-medium backdrop-blur-xl">
            <Diamond className="h-4 w-4 text-accent animate-pulse-glow" />
            <span className="text-luxury">Handcrafted Excellence • Eco Innovation</span>
            <Star className="h-4 w-4 text-accent animate-spiral-float" />
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          className="text-display text-5xl sm:text-6xl lg:text-8xl font-bold mb-8 leading-[0.9]"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.span 
            className="block text-luxury"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Ethnic Elegance
          </motion.span>
          <motion.span 
            className="block mt-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-primary">Re</span>
            <span className="text-accent">ima</span>
            <span className="text-secondary">gined</span>
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          Immerse yourself in our luxurious collection of{' '}
          <span className="text-primary font-medium">premium sarees</span>,{' '}
          <span className="text-secondary font-medium">sustainable fashion</span>, and{' '}
          <span className="text-accent font-medium">exquisite jewelry</span>.
          <br />
          Where centuries-old craftsmanship meets modern sustainability.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <Button className="btn-primary group w-full sm:w-auto text-lg px-10 py-5 hover-lift">
            Shop Premium Collection
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
          
          <Button className="btn-glass w-full sm:w-auto text-lg px-10 py-5 group hover-glow">
            <SparklesIcon className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Explore Eco Collection
          </Button>
        </motion.div>

        {/* Video CTA */}
        <motion.div 
          className="flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          <button 
            onClick={() => setIsVideoPlaying(true)}
            className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-all duration-500 hover-lift"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 group-hover:border-primary/50 transition-all duration-500 group-hover:scale-110">
                <Play className="h-6 w-6 text-primary ml-1 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse-glow" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg group-hover:text-luxury transition-colors duration-300">
                Watch Our Journey
              </div>
              <div className="text-sm opacity-70">
                2 minutes of inspiration
              </div>
            </div>
          </button>
        </motion.div>
      </motion.div>

      {/* Floating Decorative Elements */}
      <motion.div 
        className="absolute top-1/4 left-8 hidden xl:block"
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-20 h-20 rounded-3xl card-glass flex items-center justify-center group hover-lift cursor-pointer">
          <span className="text-3xl group-hover:scale-125 transition-transform duration-300">🌿</span>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-1/4 right-8 hidden xl:block"
        animate={{ 
          y: [0, 25, 0],
          rotate: [0, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="w-24 h-24 rounded-3xl card-glass flex items-center justify-center group hover-lift cursor-pointer">
          <span className="text-4xl group-hover:scale-125 transition-transform duration-300">✨</span>
        </div>
      </motion.div>

      <motion.div 
        className="absolute top-1/3 right-1/4 hidden lg:block"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div className="w-16 h-16 rounded-full card-floating flex items-center justify-center">
          <Diamond className="h-8 w-8 text-accent animate-pulse-glow" />
        </div>
      </motion.div>

      {/* Cinematic Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
      >
        <motion.div 
          className="w-8 h-12 border-2 border-muted-foreground/50 rounded-full flex justify-center cursor-pointer hover:border-muted-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div 
            className="w-1.5 h-3 bg-gradient-to-b from-primary to-accent rounded-full mt-2"
            animate={{ 
              y: [0, 16, 0],
              opacity: [1, 0.3, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Performance Debug (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 text-xs bg-black/50 text-white px-3 py-2 rounded-lg font-mono">
          <div>3D: {is3DEnabled ? 'ON' : 'OFF'}</div>
          <div>Perf: {perfLevel === 2 ? 'HIGH' : perfLevel === 1 ? 'MED' : 'LOW'}</div>
          <button
            onClick={() => setIs3DEnabled(!is3DEnabled)}
            className="mt-1 px-2 py-1 bg-white/20 rounded text-xs hover:bg-white/30"
          >
            Toggle 3D
          </button>
        </div>
      )}
    </section>
  );
};