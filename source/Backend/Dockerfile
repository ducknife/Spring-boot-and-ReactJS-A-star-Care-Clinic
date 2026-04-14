# syntax=docker/dockerfile:1

FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies first
COPY pom.xml ./
RUN mvn -B -DskipTests dependency:go-offline

# Build application jar
COPY src ./src
RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app

# Use production profile by default on Render
ENV SPRING_PROFILES_ACTIVE=prod

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Render provides PORT at runtime
CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
