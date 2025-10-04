# ---- Build backend (Spring Boot) ----
FROM eclipse-temurin:17-jdk AS backend-builder
WORKDIR /app

# Copy Maven wrapper and config
COPY server/mvnw .
COPY server/.mvn .mvn
COPY server/pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Copy backend source
COPY server/src src

# Build Spring Boot jar (skip tests for speed)
RUN ./mvnw clean package -DskipTests


# ---- Runtime image ----
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy backend JAR
COPY --from=backend-builder /app/target/claims-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Start app
ENTRYPOINT ["java", "-jar", "app.jar"]
