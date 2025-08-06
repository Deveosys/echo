export default function DotsLoader() {
    return (
        <div className="flex space-x-1 items-center">
            <span className="sr-only">Loading...</span>
            <div className="size-1 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="size-1 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="size-1 bg-foreground rounded-full animate-bounce"></div>
        </div>
    );
}