import { FiGithub } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const APP_VERSION = "v0.2.0 Первая бета версия!";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-background/95 text-muted-foreground backdrop-blur-sm supports-backdrop-filter:bg-background/50">
      <div className="mx-auto flex h-14 w-full max-w-5xl flex-col items-center justify-center gap-1 px-4 text-xs sm:h-16 sm:flex-row sm:justify-between sm:gap-4 sm:text-sm">
        <p>
          © {new Date().getFullYear()} Habit Tracker · {APP_VERSION}
        </p>
        <nav>
          <Button
            intent="plain"
            className="text-muted-foreground"
            size="sm"
          >
            <FiGithub size={20} />{" "}
            <a href="https://github.com/Web-Zhaba/HabTrack#">GitHub</a>
          </Button>
        </nav>
      </div>
    </footer>
  );
};
