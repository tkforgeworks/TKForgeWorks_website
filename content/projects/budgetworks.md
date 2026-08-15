---
title: "BudgetWorks"
status: "Active"
excerpt: "Personal finance tracker with cross-account transfer matching and net worth over time. The third spreadsheet was a cry for help."
tech: ["Java", "Spring Boot", "Flyway", "PostgreSQL"]
featured: false
---

BudgetWorks is a personal finance tracker built around the things commercial budgeting apps consistently fumble: matching transfers across accounts so money moving between your own accounts doesn't count as "spending," and tracking net worth over time without a subscription fee attached to your own data.

## What it does

- Transaction import (with QFX/OFX and CSV paths on the roadmap)
- Cross-account transfer matching — the cornerstone feature, and the reason this exists at all
- Net worth over time, computed from actual account history rather than vibes

## Where it stands

The transfer-matching and net-worth phases are done. Up next: categorization at scale, spending and cash-flow views, budgets, and a migration from H2 to Postgres so it can run properly as a multi-device service — with encryption at rest, because it's my money and I'd like to keep the details between me and the database.
