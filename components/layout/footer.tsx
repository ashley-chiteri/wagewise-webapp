import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="flex justify-center gap-4 mb-2">
        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
          <Twitter className="w-5 h-5 hover:text-primary" />
        </a>
        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
          <Github className="w-5 h-5 hover:text-primary" />
        </a>
      </div>
      <p>© {new Date().getFullYear()} WageWise. All rights reserved.</p>
    </footer>
  );
}
