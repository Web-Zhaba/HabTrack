import { FiGithub } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="w-full h-16 border-t flex items-center justify-center fixed bottom-0 bg-background text-muted-foreground">
      <div className="flex items-center justify-center w-full max-w-4xl px-4 gap-4">
        <p>© {new Date().getFullYear()} Habit Tracker</p>
        <nav>
          <Button
          variant="link"
          className="text-muted-foreground"
          size="sm"
          >
            <FiGithub size={20} /> <a href="https://github.com/Web-Zhaba/HabTrack#">GitHub</a>
          </Button>
        </nav>
      </div>
    </footer>
  );
};