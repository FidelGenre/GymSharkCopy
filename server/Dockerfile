# ETAPA 1: Compilación (Build)
# Actualizamos a una imagen que soporte JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos archivos de configuración
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Runtime)
# También actualizamos el JRE a la versión 21
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copiamos el .jar generado
COPY --from=build /app/target/*.jar app.jar

# Configuración de puerto para Render
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]