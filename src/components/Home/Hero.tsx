import blackfabricVideo from '@/assets/blackfabric.mp4';

// Minimal hero: video only
export const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={blackfabricVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};
