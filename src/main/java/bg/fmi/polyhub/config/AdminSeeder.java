package bg.fmi.polyhub.config;

import bg.fmi.polyhub.entities.RoleType;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.entities.UserRole;
import bg.fmi.polyhub.repositories.UserRepository;
import bg.fmi.polyhub.repositories.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

// all args ctor does not work due to admin email/passwd
@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Every time you run the code without defining them as env variables 13 penguins die
    // Define as env before running!!!
    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    // Define as env before running!!!
    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    @Override
    public void run(String... args) {

        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        UserRole adminRole = roleRepository.findByName(RoleType.ADMIN)
                .orElseThrow(() -> new RuntimeException("Role POLY_ADMIN not found"));

        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setFirstname("System");
        admin.setLastname("Admin");
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole(adminRole);

        userRepository.save(admin);
    }
}