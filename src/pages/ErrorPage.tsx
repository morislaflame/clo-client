import PageWrapper from "@/components/PageWrapper";

const ErrorPage =  ({ title, message }: { title: string, message: string }) => {
    return (
        <PageWrapper className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <p className="text-default-500">{message}</p>
            </div>
        </PageWrapper>
    );
};

export default ErrorPage;