# ETAPA 1: Compilación (Build)
# Usamos Maven con JDK 17 para construir el proyecto
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copiamos el pom.xml y descargamos dependencias para aprovechar el cache de Docker
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente y generamos el archivo ejecutable (.jar)
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Runtime)
# Usamos una imagen de JRE más liviana para producción
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copiamos el archivo .jar generado en la etapa anterior
# Nota: target/*.jar asume que el build genera un solo archivo ejecutable
COPY --from=build /app/target/*.jar app.jar

# Render inyecta dinámicamente el puerto en la variable $PORT.
# Debemos configurar Spring Boot para que escuche en ese puerto.
ENV PORT=8080
EXPOSE 8080

# Ejecutamos la aplicación pasando el puerto dinámico de Render
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]