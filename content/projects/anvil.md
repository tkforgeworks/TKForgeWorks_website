---
title: "Anvil"
status: "Active"
excerpt: "Desktop RPG data manager — classes, items, recipes, NPCs, loot tables — because game data deserved better than my seventh spreadsheet tab."
tech: ["Electron", "React", "TypeScript", "SQLite"]
featured: false
github: "https://github.com/tkforgeworks/anvil"
---

Anvil is a desktop tool for managing RPG game data: character classes, abilities, items, crafting recipes, NPCs, and loot tables, all stored in portable project files with configurable schemas. It started as "I just need somewhere to put the Aether Gears data" and escalated into a full editor suite with undo/redo, cross-domain validation, bulk operations, and a theming system. Scope creep isn't always a tragedy — sometimes it ships.

## What it does

- Dedicated editors for every data domain, with validation that catches the "this recipe requires an item that doesn't exist" class of mistake before the game engine does
- Flexible export: Godot Resource JSON, flat JSON, CSV, or custom templates
- Persistent SQLite-backed project files, change tracking, soft delete and archiving — the boring reliability features you only appreciate after losing work once

## Where it stands

The v1 feature set is essentially complete — twenty-some epics closed, one stubborn holdout around the application menu system that knows what it did. Active work is polish and whatever Aether Gears demands next.
