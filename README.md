# Alien Canon Timeline - Interactive SPA

A modern, interactive single-page application showcasing the complete Alien franchise timeline with properly connected visual elements.

## Features

- **Interactive Timeline**: Horizontal scrolling timeline with events properly connected to the main timeline bar via SVG curves
- **Smart Filtering**: Filter by media type (Films, Games, Comics, Books, Short Films)
- **Search Functionality**: Real-time search across titles, years, and descriptions
- **Modal Details**: Click any event for detailed information with navigation between events
- **Keyboard Navigation**: Arrow keys for timeline scrolling and modal navigation
- **Smooth Animations**: CRT-style effects, glowing elements, and smooth transitions
- **Statistics Panel**: Live stats showing total events, visible events, and year range
- **Responsive Design**: Adapts to different screen sizes

## Technology Stack

- Pure JavaScript (ES6+) - No frameworks required
- HTML5 semantic markup
- CSS3 with custom properties and animations
- SVG for dynamic timeline connections

## File Structure

```
alien_canon_timeline/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling with CRT effects
├── data.js         # Timeline event data
├── app.js          # Application logic
├── server.py       # Development server
└── README.md       # Documentation
```

## Running the Application

### Option 1: Python Server (Recommended)
```bash
python3 server.py
# or
./server.py
```
Then open http://localhost:8000 in your browser.

### Option 2: Any Static Server
```bash
# Using Node.js http-server
npx http-server

# Using Python built-in
python3 -m http.server 8000

# Using PHP
php -S localhost:8000
```

## Timeline Connections

The timeline uses SVG paths to create curved connections between:
- Event cards (positioned above/below the timeline)
- The central timeline bar

Connection colors match the event type:
- Red: Films
- Blue: Games  
- Yellow: Comics
- Magenta: Books
- Cyan: Short Films

## Controls

### Mouse/Trackpad
- Click and drag or use scroll wheel to navigate timeline
- Click events to view details
- Click filter buttons to filter by type

### Keyboard
- **Arrow Left/Right**: Navigate timeline
- **Escape**: Close modal
- **Arrow Left/Right** (in modal): Navigate between events

### Navigation Buttons
- **◄ / ►**: Scroll timeline left/right
- **Reset View**: Return to timeline start

## Data Structure

Events include:
- `year`: The in-universe year
- `title`: Name of the media
- `type`: film, game, comic, book, or short
- `description`: Detailed information about the event

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Performance Optimizations

- Efficient DOM manipulation with DocumentFragment
- RequestAnimationFrame for smooth animations
- Debounced search input
- SVG path optimization for connections
- CSS transform for hardware acceleration

## Customization

Edit CSS custom properties in `:root` to change:
- Colors and glow effects
- Timeline dimensions
- Event card sizing
- Animation speeds

## Future Enhancements

- Touch gestures for mobile
- Event clustering for dense years
- Advanced filtering options
- Timeline zoom functionality
- Data persistence with localStorage
- Export timeline as image