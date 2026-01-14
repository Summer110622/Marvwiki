---
title: Plugins
categories: [plugins]
---
# Plugins & Command Guide

This guide explains the main plugins and commands available on the MARV server.

## 1. Player Utilities
Commands to make your life on the server easier.

### Scoreboard (marvtime)
- `/sbon`: Show the scoreboard
- `/sboff`: Hide the scoreboard

### Experience Management (Experience Bottle)
- `/bottle stats`: View current XP and level
- `/bottle store {amount} {quantity}`: Store specified XP into bottles
- `/bottle mend`: Create a bottle with the exact XP needed to repair held tools
- `/bottle until {level}`: Show XP needed to reach a specific level

### Emotes & Motions
- `/sit`: Sit down
- `/lay`: Lie down
- `/spin`: Spin around
- `/crawl`: Crawl on the ground

### Useful Features
- `/ec`: Open Ender Chest
- `/nick {name}`: Set your nickname
- `/sethome {name}` / `/home {name}`: Home point setting and teleportation

---

## 2. Economy & Shop
Commands for trading and financial management.

### Currency & Balance
- `/balance` / `/money`: View your current balance
- `/pay {player} {amount}`: Send money to another player
- `/withdraw {amount}`: Issue currency as items
- `/deposit`: Exchange item currency for balance (use `stack` or `all` for bulk)

### Shops
- `/shop` / `/market`: Open the main official shop (GUI)
- **QuickShop (Chest Shops)**: 
  - `/qs create`: Create a chest shop with the item in hand
  - `/qs buy`: Switch shop to "Buy" mode
  - `/qs sell`: Switch shop to "Sell" mode
  - `/qs price {amount}`: Set the price

---

## 3. Protection & Locks
Manage protection for chests, doors, etc.

- `/lock`: Lock blocks or entities (automatic protection)
- `/unlock`: Remove a lock
- `/bolt trust add {player}`: Grant access to all your protections
- `/bolt edit add {player}`: Grant access to a specific protected block

---

## 4. Organizations
Create groups like companies, political parties, or militaries.

- `/org create {name}`: Create an organization
- `/org invite {player}`: Invite a member
- `/org info {org_name}`: View organization details
- `/org setrole {player} {role}`: Assign a custom role to a member

---

## 5. Towny (Towns & Nations)
The main system for large-scale land protection and nation management.

### Town Commands
- `/town create {town_name}`: Create a new town
- `/town deposit {amount}`: Deposit money into the town bank (needed for upkeep)
- `/town claim`: Claim the current chunk as town territory
- `/town invite {player}`: Invite a resident
- `/town leave`: Leave your town

### Nation Commands
- `/nation create {nation_name}`: Establish a nation with your town as the capital
- `/nation deposit {amount}`: Deposit money into the nation bank
- `/nation invite {town_name}`: Invite another town to your nation
- `/nation ally {nation_name}`: Form an alliance with another nation

### Plot Commands
- `/plot forsale {amount}`: Put a plot of town land up for sale to residents
- `/plot claim`: Purchase a plot that is for sale for personal use

### Nation & Town Promotion
If you want to promote your town or nation, use the [Wiki Promotion Board](#/en/Promotion) or the [Nation & Town Promotion](https://discord.com/channels/1245921816959127673/1443877434561663058) channel on Discord.
