interface ProjectCardProps {
  title: string;
  description: string;
}

export default function ProjectCard({ title, description }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/30 p-6 backdrop-blur-md transition-all duration-300 hover:scale-105">
      <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-500/30">
        Next.js 15
      </span>

      <h3 className="mt-4 text-xl font-semibold text-white/90">
        {title}
      </h3>

      <p className="mt-2 text-sm text-white/60">
        {description}
      </p>
    </div>
  );
}
