import { Spinner } from "@heroui/react";
import PageWrapper from "./PageWrapper";

interface LoadingPageProps {
  message?: string;
  className?: string;
}

const LoadingPage = ({ message = "Загрузка...", className }: LoadingPageProps) => {
  return (
    <PageWrapper className={`min-h-screen flex items-center justify-center ${className || ""}`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" color="default" />
        <p className="text-default-500 text-center max-w-sm">
          {message}
        </p>
      </div>
    </PageWrapper>
  );
};

export default LoadingPage;
