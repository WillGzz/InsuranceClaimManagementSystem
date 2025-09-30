# ---- Build stage ----
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# Copy Maven wrapper & project files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make wrapper executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build the jar (skip tests for faster builds)
RUN ./mvnw clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy built jar from builder stage
COPY --from=builder /app/target/claims-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
