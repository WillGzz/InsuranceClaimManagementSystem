# ---- Build backend (Spring Boot) ----
FROM eclipse-temurin:17-jdk AS backend-builder
WORKDIR /app

COPY server/mvnw .
COPY server/.mvn .mvn
COPY server/pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY server/src src
RUN ./mvnw clean package -DskipTests

# ---- Runtime image ----
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy only the final jar
COPY --from=backend-builder /app/target/claims-0.0.1-SNAPSHOT.jar app.jar

# Set JVM options for lower memory usage
ENV JAVA_OPTS="-Xmx256m -Xms128m -XX:+UseSerialGC -XX:+ExitOnOutOfMemoryError"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT}"]
