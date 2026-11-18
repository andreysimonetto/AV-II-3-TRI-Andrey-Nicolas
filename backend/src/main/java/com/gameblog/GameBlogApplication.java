package com.gameblog;

import org.apache.catalina.connector.Connector;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GameBlogApplication {

    // Atende a pagina e a API na porta do frontend.
    @Bean
    @ConditionalOnProperty(name = "gameblog.frontend.port")
    WebServerFactoryCustomizer<TomcatServletWebServerFactory> portaFrontend(
            @Value("${gameblog.frontend.port}") int porta) {
        return servidor -> {
            Connector conector = new Connector();
            conector.setPort(porta);
            servidor.addAdditionalTomcatConnectors(conector);
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(GameBlogApplication.class, args);
    }
}
