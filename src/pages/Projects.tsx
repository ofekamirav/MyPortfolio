import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const Projects = () => {
  const projects = [
    {
      title: "RooMatch App",
      description:
        "RooMatch is a smart app that simplifies the search for apartments and roommates. It tailors recommendations based on user preferences and interactions, ensuring accurate and personalized matches.",
      image: "/assets/RooMatch-portfoilo.png",
      technologies: [
        "Kotlin",
        "Ktor",
        "MongoDB",
        "Jetpack Compose",
        "JWT",
        "Flow",
        "ROOM",
        "Raam-Costa",
      ],
      liveUrl: "#",
      githubUrl: "#",
      featured: true,
    },
    {
      title: "Chargehood App",
      description:
        "Chargehood is an innovative app that makes finding and managing private charging stations simple and fast.",
      image: "/assets/chargehood.png",
      technologies: [
        "Kotlin",
        "Firebase",
        "XML-layouts",
        "MVVM",
        "ROOM",
        "LiveData",
      ],
      liveUrl: "#",
      githubUrl: "https://github.com/ofekamirav/ChargehoodApp",
      featured: false,
    },

    {
      title: "Portfolio Website",
      description:
        "A modern, responsive portfolio website with dark mode and smooth animations.",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
    },
    {
      title: "QuiverSync App",
      description:
        "QuiverSync helps surfers optimize their gear by uploading their surfboards and receiving compatibility scores for each board based on wave forecasts and location data, using the Google Gemini API and surf prediction APIs. The app also features a peer-to-peer surfboard rental system for users who don't have the right board for upcoming conditions.",
      image:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=300&fit=crop",
      technologies: [
        "KMP",
        "Jetpack Compose",
        "Coroutines ",
        "Ktor-Client",
        "Flow",
        "ROOM",
      ],
      liveUrl: "#",
      githubUrl: "#",
      featured: true,
    },
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text">My Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Here are some of my recent projects that showcase my skills and
            passion for development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className={`glass hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                project.featured ? "lg:col-span-2" : ""
              }`}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                />
                {project.featured && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-700 to-blue-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="outline"
                      className="text-xs bg-gradient-to-r from-green-500/10 to-blue-500/10 border-blue-500/20"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-green-700 to-blue-500 text-white hover:from-blue-500 hover:to-green-700"
                  >
                    Live Demo
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
