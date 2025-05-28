import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const AboutSection = () => {
  const careers = [
    {
      period: "2019 - Present",
      title: "Acting Shift Leader",
      company: "Crime Prevention Unit, Israel Airports Authority",
      images: "/assets/mabat_logo.png",
      description:
        "Led operational teams, assigned tasks, resolved real-time issues, and ensured efficient, compliant performance. Collaborated with cross-functional teams and executives, built shift plans, trained staff, and drove continuous improvement.",
      skills: [
        "Time Management",
        "Shift Planning",
        "Decision Making",
        "Team Leadership",
        "Emergency Handling",
      ],
      roles: ["Field Inspector", "Team Leader", "Acting Shift Leader"],
    },
    {
      period: "03/2024 - 09/2024",
      title: "Automation Engineer Internship",
      company: "ThetaRay",
      images: "/assets/thetaray_logo.png",
      description:
        "Developing automation infrastructure with Bash and Python, implementing CI/CD pipelines with Jenkins, optimizing containerized environments (Kubernetes & Docker), and executing API-based automated web tests.",
      skills: ["Pytest", "Jupyter", "Kubernetes", "Postman", "Bitbucket"],
    },
  ];

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text ">About Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate developer to find my first job in the tech industry.
            <br />I have a strong foundation in Android development and
            full-stack technologies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {careers.map((career, index) => (
            <Card
              key={index}
              className="glass hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {career.images && (
                      <img
                        src={career.images}
                        alt={`${career.company} logo`}
                        className="w-10 h-10 object-contain rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {career.title}
                      </h3>
                      <p className="text-primary font-medium">
                        {career.company}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs whitespace-nowrap"
                  >
                    {career.period}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-4">
                  {career.description}
                </p>
                {career.roles && (
                  <div className="flex items-center justify-start gap-4 mb-4 overflow-x-auto">
                    {career.roles.map((role, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {/* נקודה */}
                        <div className="w-3 h-3 bg-primary rounded-full border-2 border-background" />

                        {/* שם התפקיד */}
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {role}
                        </span>

                        {/* קו מחבר */}
                        {index < career.roles.length - 1 && (
                          <div className="w-6 h-0.5 bg-black/50 dark:bg-white" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="outline"
                      className="text-xs bg-gradient-to-r from-green-500/10 to-blue-500/10 border-blue-500/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
