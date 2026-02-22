import { RouterProvider } from 'react-router';
import { router } from './router';
import { ThemeProvider } from "@/components/ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
  
export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={1000} skipDelayDuration={500}>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  );
}