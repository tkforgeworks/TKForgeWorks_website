---
title: "CookConnect"
status: "Active"
excerpt: "Recipe-sharing platform on Spring Boot microservices. Started as an academic project, now being rebuilt into something production-grade."
tech: ["Java 21", "Spring Boot", "Kafka", "Keycloak", "Kubernetes"]
featured: false
---

CookConnect is a recipe-sharing social platform: publish recipes, browse and search, follow other cooks, save things into collections and cookbooks, get notified when someone you follow posts. It began life as an academic project and is now being methodically rebuilt into a production-grade system — which is a polite way of saying I'm removing everything I did the first time and doing it properly.

## The architecture

Spring Boot microservices behind a Spring Cloud Gateway, Keycloak for authentication, Kafka for event messaging between services, MySQL per service, and an ELK stack for centralized logging. It runs on Docker Compose locally and deploys to Kubernetes on the [homelab](/projects/homelab). Yes, this is a lot of infrastructure for recipes. The recipes are not the point; the recipes were never the point.

## Where it stands

The core services work — recipes, users, auth, gateway, messaging. Current focus is standing up self-hosted CI/CD (Gitea + Act Runner), then cleanup, testing, the remaining features, and eventually a React frontend. There is a roadmap. There are epics. It's the most project-managed side project I own, and I'm at peace with that.
