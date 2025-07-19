# Pomodoro Timer

A clean, minimal Pomodoro Timer web application built with vanilla JavaScript.

![Pomodoro Timer Screenshot](https://github.com/user-attachments/assets/f70712ed-bc38-4128-ae6d-0715ae5a5baf)

## Features

- **Customizable timing**: Focus (1-360 min), breaks (1-120 min), multiple loops
- **Modern interface**: Dark theme with color-coded states (focus/break/pause)
- **Dual input methods**: Range sliders + manual number input
- **Audio notifications**: Custom sounds for period transitions + countdown beeps
- **Responsive design**: Works on desktop and mobile
- **Keyboard shortcuts**: Space to pause, 'i'/'s' to toggle stats
- **Touch gestures**: Swipe up/down to show/hide stats on mobile
- **Session tracking**: Real-time statistics during active sessions

## Usage

1. Set focus time, break time, and number of loops
2. Click "Start Session" to begin
3. Click timer or press Space to pause/resume
4. Audio plays when periods end
5. View stats popup when session completes

**Controls:**
- Click timer or press `Space`: Pause/resume
- Press `i` or `s`: Toggle stats view
- Mobile: Swipe up/down to show/hide stats

**Visual states:**
- Focus: Black background, white text
- Break: Lavender background, black text  
- Paused: Pink background, blinking timer, contextual status text

## Implementation

### Tech Stack
- HTML5, CSS3, Vanilla JavaScript
- Web Audio API for beeps
- CSS Grid/Flexbox for responsive layout
- Google Fonts (Inter, Gloock, Manrope)

### Key Components

**Timer Logic**
```javascript
currentTime = duration;
interval = setInterval(() => {
    if (!isPaused) {
        currentTime--;
        // Handle period transitions, audio, stats
    }
}, 1000);
```

**Audio System**
- HTML5 audio elements for notification sounds
- Web Audio API for programmatic countdown beeps
- Preloading with fallback handling

**State Management**
- Focus/Relax/Paused states with visual feedback
- Real-time stats calculation during active periods
- Session data persists until page refresh

**Responsive Design**
- Mobile breakpoints at 480px and 360px
- Touch-optimized controls and gesture recognition
- Adaptive typography and spacing

### File Structure
```
├── index.html          # Main application file
├── audio/
│   ├── timer.wav       # Focus period end sound
│   ├── relax.wav       # Break period end sound
│   └── loop.wav        # Session complete sound
└── README.md
```

### Browser Support
- Modern browsers with ES6+ support
- Web Audio API (Chrome 34+, Firefox 25+, Safari 14.1+)
- CSS Grid/Flexbox support
- Touch events for mobile

## Development

The app is built as a single HTML file with embedded CSS and JavaScript for easy deployment. No build process or dependencies required.

**Audio files**: Place three audio files in an `audio/` directory:
- `timer.wav` - Plays when focus period ends
- `relax.wav` - Plays when break period ends  
- `loop.wav` - Plays when all loops complete

## License

MIT License. Inspired by the Pomodoro Technique by Francesco Cirillo.
