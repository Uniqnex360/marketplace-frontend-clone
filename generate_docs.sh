#!/bin/bash

echo "🚀 Generating MarketLink Documentation..."

# Create docs directory
mkdir -p docs

# 1. Project Structure
echo "📁 Generating project structure..."
if command -v tree &> /dev/null; then
    tree -L 3 -I 'node_modules|dist|build|.git' > docs/PROJECT_STRUCTURE.txt
else
    find . -maxdepth 3 -not -path '*/node_modules/*' -not -path '*/.git/*' | sort > docs/PROJECT_STRUCTURE.txt
fi

# 2. Package Analysis
echo "📦 Analyzing package.json..."
cat > docs/DEPENDENCIES.md << 'DEPS'
# Dependencies

## Production Dependencies
DEPS

if command -v jq &> /dev/null; then
    jq -r '.dependencies | to_entries[] | "- **\(.key)**: \(.value)"' package.json >> docs/DEPENDENCIES.md
    echo "" >> docs/DEPENDENCIES.md
    echo "## Development Dependencies" >> docs/DEPENDENCIES.md
    jq -r '.devDependencies | to_entries[] | "- **\(.key)**: \(.value)"' package.json >> docs/DEPENDENCIES.md
else
    grep -A 50 '"dependencies"' package.json >> docs/DEPENDENCIES.md
fi

# 3. Create Main Documentation
cat > DOCUMENTATION.md << 'MAIN'
# 🚀 MarketLink Frontend

## Overview
MarketLink is a modern frontend application.

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Build
```bash
npm run build
```

## Project Structure

See [docs/PROJECT_STRUCTURE.txt](docs/PROJECT_STRUCTURE.txt)

## Dependencies

See [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md)

## Deployment

This project uses Vercel for deployment (see vercel.json).

MAIN

echo "✅ Documentation created!"
echo "   - DOCUMENTATION.md"
echo "   - docs/PROJECT_STRUCTURE.txt"
echo "   - docs/DEPENDENCIES.md"
