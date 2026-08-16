# Stage 1: Build the application jar
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and fetch dependencies to cache them
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source files and package the jar
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Runtime JRE environment
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Run the fat jar
ENTRYPOINT ["java", "-jar", "app.jar"]
