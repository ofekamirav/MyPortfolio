import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card"; // ודא שהנתיבים נכונים
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
// הוספנו Linkedin והסרנו את User אם הוא לא בשימוש במקום אחר
import { Mail, Linkedin } from "lucide-react"; 
import { useToast } from "../hooks/use-toast"; // ודא שהנתיב נכון

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    "bot-field": "", 
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const encode = (data: { [key: string]: string | number | boolean }) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;

    try {
      await fetch("/", { 
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": form.getAttribute("name") || "contact", 
          ...formData,
        }),
      });

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      });
      setFormData({ name: "", email: "", message: "", "bot-field": "" }); 
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error sending message",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text">Get In Touch</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  Let's Connect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  I'm always open to discussing new opportunities, creative
                  projects, or just having a chat about technology and
                  development.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    {/* אפשר להפוך גם את המייל לקישור mailto אם תרצה */}
                    <span>ofek.amirav@gmail.com</span>
                  </div>
                  {/* --- שורת הלינקדאין המעודכנת --- */}
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-primary" /> {/* אייקון לינקדאין */}
                    <a
                      href="https://www.linkedin.com/in/ofek-amirav" // הנחתי שזה הקישור הנכון
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-primary transition-colors" // סגנון לקישור
                    >
                      linkedin.com/in/ofek-amirav
                    </a>
                  </div>
                  {/* --- סוף שורת הלינקדאין המעודכנת --- */}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  What I Can Help With
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Web Application Development</li>
                  <li>• Mobile App Development</li>
                  <li>• UI/UX Design & Implementation</li>
                  <li>• Code Review & Optimization</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input type="hidden" name="form-name" value="contact" />
                <div className="hidden">
                  <label>
                    Don’t fill this out if you’re human:{" "}
                    <input name="bot-field" value={formData["bot-field"]} onChange={handleChange} />
                  </label>
                </div>
                <div>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="bg-background/50"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-700 to-blue-500 text-white hover:from-blue-500 hover:to-green-700"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;