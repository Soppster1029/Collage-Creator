# Collage-Creator
A sleek, cross-platform desktop and browser application that transforms your local image folders into dynamic, randomized collage slideshows.

## Features
- **Smart Folder Scanning**: Add one or multiple folders. The app automatically organizes images into "chapters" based on subfolders.
- **Dynamic Collage Layouts**: Displays images in randomized groups (default 6) with unique positions, rotations, and layering for a "scattered" aesthetic.
- **Smooth Transitions**: Features background preloading and progress bars for a seamless viewing experience.
- **Multi-Platform Support**: Built for Windows, macOS, and Linux.
- **Hardware Optimized**: Includes logic to prevent UI white flashes and hides the cursor during active fullscreen playback.

## Desktop Application
The native desktop version provides the most robust experience and doesn't require any command-line setup.

### Installation
Download the latest version from the **Releases** section:
- **Windows**: `.exe` (Installer or Portable)
- **macOS**: `.dmg` (Universal)
- **Linux**: `.AppImage`, `.deb`, or `.rpm`

## Browser Version (Local Server)
There is no standalone "package install" for the browser version. Because browsers have security restrictions regarding local file access, the app is "served" via a local Node.js server.

### Prerequisites
- Node.js (v18.0.0 or higher)

### Getting Started
1. Clone the repository to your local machine.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the local server:
   ```bash
   npm run serve
   ```
4. Open your browser and navigate to: `http://localhost:3000`

*Note: The browser version requires a modern browser that supports the File System Access API (e.g., Chrome, Edge, or Opera).*

## Keyboard Shortcuts
While the slideshow is active, you can use the following keys:

| Key | Action |
| :--- | :--- |
| `Right Arrow` / `Down Arrow` | Skip to Next Slide |
| `Left Arrow` / `Up Arrow` | Go to Previous Slide |
| `Space` / `P` | Play / Pause |
| `S` | Cycle Speed (2s, 4s, 6s, 10s) |
| `F` | Toggle Fullscreen |
| `Esc` | Exit Slideshow |

## Development
To run the Electron desktop app from source for development:
```bash
npm start
```

## Tech Stack
- **Core**: HTML5, CSS3, Vanilla JavaScript
- **Desktop Wrapper**: Electron
- **Package Management**: npm
- **Build Tool**: electron-builder
- **CI/CD**: GitHub Actions
