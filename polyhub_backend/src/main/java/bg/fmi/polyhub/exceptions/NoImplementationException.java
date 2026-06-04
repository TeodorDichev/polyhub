package bg.fmi.polyhub.exceptions;

public class NoImplementationException extends RuntimeException {
    public NoImplementationException(String message) {
        super(message);
    }

    public NoImplementationException(String message, Throwable cause) {
        super(message, cause);
    }
}
