package bg.fmi.polyhub.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Email(message = "This email does not exist")
        @NotBlank(message = "Password cannot be blank")
        String email,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6, message = "Password must be at least 6 symbols")
        String password,

        @NotBlank(message = "Firstname cannot be blank")
        String firstname,

        @NotBlank(message = "Lastname cannot be blank")
        String lastname) {
}
