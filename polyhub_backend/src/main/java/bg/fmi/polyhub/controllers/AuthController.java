package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.auth.LoginRequest;
import bg.fmi.polyhub.dto.auth.RegisterRequest;
import bg.fmi.polyhub.dto.partyadmin.LoggedPartyAdmin;
import bg.fmi.polyhub.services.AuthService;
import bg.fmi.polyhub.services.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoggedPartyAdmin login(@Valid @RequestBody LoginRequest request,
                                  HttpServletResponse response) {
        LoggedPartyAdmin loggedUser = authService.login(request);

        String token = jwtService.generateToken(
                loggedUser.email(),
                loggedUser.role().name()
        );

        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // set to false for local HTTP dev if needed
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day, put in a constant
        response.addCookie(cookie);

        return loggedUser;
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // delete immediately
        response.addCookie(cookie);
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public LoggedPartyAdmin me(@AuthenticationPrincipal String email) {
        return authService.me(email);
    }
}