package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.auth.AuthResponse;
import bg.fmi.polyhub.dto.auth.RegisterRequest;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.exceptions.NoImplementationException;
import bg.fmi.polyhub.mappers.UserMapper;
import bg.fmi.polyhub.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserMapper userMapper;

    @PostMapping
    public ResponseEntity<AuthResponse> createRacer(@RequestBody RegisterRequest registerDto) {
        throw new NoImplementationException("");
    }
}
