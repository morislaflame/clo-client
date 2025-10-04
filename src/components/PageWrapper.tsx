import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { UpAnimation } from "@/animations/UpAnimation";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

const PageWrapper = ({ children, className = "" }: PageWrapperProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    if (wrapperRef.current) {
        UpAnimation(wrapperRef.current);
    }
}, [wrapperRef]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};

export default PageWrapper;