package it.andreamoiochef.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // Verifica che il contesto Spring (security, JPA, flyway-off, JWT) si avvii correttamente.
    }
}
