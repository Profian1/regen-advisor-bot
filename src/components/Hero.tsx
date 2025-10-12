import heroImage from "@/assets/hero-farmland.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background/95" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 mb-6">
          <span className="text-2xl">🌾</span>
          <span className="text-sm font-medium text-primary-foreground">Powered by Regenerative Science</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
          AgroSense
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 max-w-3xl mx-auto leading-relaxed">
          Your AI-powered advisor for sustainable land management and regenerative agriculture
        </p>
        
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
          Get science-backed, actionable guidance tailored to your crops, soil, and climate conditions
        </p>
      </div>
    </section>
  );
};
