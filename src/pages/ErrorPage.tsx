const ErrorPage =  ({ title, message }: { title: string, message: string }) => {
    return (
        <div>
            <h1>{title}</h1>
            <p>{message}</p>
        </div>
    );
};

export default ErrorPage;