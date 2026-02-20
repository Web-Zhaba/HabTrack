import { Outlet, useLocation, useNavigate } from 'react-router';
import { useRef } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart: React.TouchEventHandler = (event) => {
    const touch = event.touches[0];
    console.log("[swipe] touchstart", {
      x: touch.clientX,
      y: touch.clientY,
      path: location.pathname,
    });
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd: React.TouchEventHandler = (event) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      console.log("[swipe] touchend without start, skipping");
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    console.log("[swipe] touchend", {
      x: touch.clientX,
      y: touch.clientY,
      deltaX,
      deltaY,
    });

    touchStartX.current = null;
    touchStartY.current = null;

    const minSwipeDistance = 50;
    const maxVerticalOffset = 40;

    if (Math.abs(deltaX) < minSwipeDistance || Math.abs(deltaY) > maxVerticalOffset) {
      console.log("[swipe] below thresholds", {
        deltaX,
        deltaY,
        minSwipeDistance,
        maxVerticalOffset,
      });
      return;
    }

    const orderedPaths = ['/', '/habits', '/stats'];
    const currentIndex = orderedPaths.indexOf(location.pathname);

    if (currentIndex === -1) {
      console.log("[swipe] path not in orderedPaths", {
        path: location.pathname,
        orderedPaths,
      });
      return;
    }

    if (deltaX < 0 && currentIndex < orderedPaths.length - 1) {
      console.log("[swipe] navigate next", {
        from: location.pathname,
        to: orderedPaths[currentIndex + 1],
      });
      navigate(orderedPaths[currentIndex + 1]);
    } else if (deltaX > 0 && currentIndex > 0) {
      console.log("[swipe] navigate prev", {
        from: location.pathname,
        to: orderedPaths[currentIndex - 1],
      });
      navigate(orderedPaths[currentIndex - 1]);
    }
  };

  return (
    <>
      <Header />
      <main
        className='h-full'
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};
