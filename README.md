# Lacrosse Stats

A cross-platform desktop app (Mac & Windows) for live lacrosse stat tracking with an interactive shot heat map.

## Features

- **Player roster** pre-loaded with your team
- **Live stat entry** — tap +/- buttons or use keyboard shortcuts
- **Stats tracked:** # / Name / Grade / Pos / G / A / SOG / GB / TO / FOU / FOL
- **Interactive shot map** — click anywhere on the lacrosse field canvas to log shot locations
- **Heat map overlay** — visualize shot density on the field
- **Auto-save** — data persists between sessions
- **CSV export** — export all stats to a spreadsheet
- **Add/edit/delete players** at any time

## Keyboard Shortcuts (when a player is selected)

| Key | Action |
|-----|--------|
| `G` | +1 Goal |
| `A` | +1 Assist |
| `S` | +1 Shot on Goal |
| `B` | +1 Ground Ball |
| `T` | +1 Turnover |
| `W` | +1 Face-Off Win |
| `L` | +1 Face-Off Loss |
| `←` / `→` | Previous / Next player |

## Setup & Run

```bash
npm install
npm start
```

## Build

```bash
# Mac (creates .dmg)
npm run build:mac

# Windows (creates .exe installer)
npm run build:win

# Both
npm run build:all
```

## Shot Map Usage

1. Select a player
2. Click the **Shot Map** tab
3. Choose the shot type (Goal / Shot on Goal / Miss / Ground Ball)
4. Click anywhere on the field canvas to place a marker
5. Toggle **Heat Map Overlay** to see shot density
6. Placing a **Goal** automatically increments G and SOG stats
7. Placing a **Shot on Goal** automatically increments SOG

## Data Storage

Stats are saved automatically to your OS user data folder:
- **Mac:** `~/Library/Application Support/lacrosse-stats/lacrosse-data.json`
- **Windows:** `%APPDATA%\lacrosse-stats\lacrosse-data.json`
