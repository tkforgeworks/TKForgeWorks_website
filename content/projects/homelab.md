---
title: "Homelab"
status: "Active"
excerpt: "Two Lenovo M720q nodes running Proxmox and Kubernetes, UniFi VLANs, centralized logging — enterprise infrastructure for an audience of one."
tech: ["Proxmox", "Kubernetes", "UniFi", "Docker"]
featured: true
---

The homelab is the load-bearing project: two Lenovo M720q tiny PCs running Proxmox, hosting a Kubernetes cluster, sitting behind UniFi networking that has been segmented into more VLANs than a two-person household strictly requires. Management, services, and lab traffic each get their own network, because if you're going to overengineer, overengineer with conviction.

## What runs on it

This is where the other projects live in production. [CookConnect](/projects/cookconnect) deploys here on Kubernetes, self-hosted Gitea handles source control and CI/CD, an ELK stack does centralized logging, and monitoring keeps me honest about all of it.

## Why

Partly to run my own services on my own hardware. Partly because "I'll just spin up one VM" is a lie everyone tells themselves once. Mostly because the fastest way to actually learn infrastructure is to be personally responsible for it when it breaks at 11 PM.
