interface ProjectCardProps {
  title: string;
  description: string;
}

export default function ProjectCard({ title, description }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
      <h3 className="mt-4 text-xl font-semibold text-white/90">
        {title}
      </h3>

      <p className="mt-2 text-sm text-white/60">
        {description}
      </p>
    </div>
  );
}
