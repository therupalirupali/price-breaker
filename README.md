# Price Breaker - Metal Making Charge Calculator

A React application to calculate metal making charges based on final price and configured metal pricing.

## Features

- **Making Charge Calculator**: Input final price and automatically calculate the making charge based on current metal price and GST
- **Configuration Management**: Update current metal price and GST percentage through an intuitive UI
- **Persistent Storage**: Settings are saved to localStorage and persist across sessions
- **Detailed Breakdown**: View detailed calculation breakdown including metal price, making charge, and GST amount
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Calculation Logic

The calculator uses the following formula:

```
Final Price = (Metal Price + Making Charge) × (1 + GST%)

Rearranged:
Metal Price + Making Charge = Final Price / (1 + GST%)
Making Charge = (Final Price / (1 + GST%)) - Metal Price
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Calculator.tsx      # Making charge calculator component
│   ├── Calculator.css      # Calculator styling
│   ├── Settings.tsx        # Configuration settings component
│   └── Settings.css        # Settings styling
├── context/
│   └── ConfigContext.tsx   # Global configuration context and hooks
├── App.tsx                 # Main application component
├── App.css                 # Application styling
├── main.tsx                # Application entry point
└── index.css               # Global styles
```

## Usage

### Calculator
1. Enter the final price (including GST) in the "Final Price" field
2. Click "Calculate Making Charge"
3. View the breakdown of:
   - Metal price
   - Making charge
   - GST amount
   - Percentage of making charge relative to metal price

### Settings
1. Update the current metal price
2. Adjust the GST percentage
3. Click "Save Configuration"
4. Settings are automatically saved and will persist across sessions

## Configuration Storage

Configuration is stored in browser's localStorage under the key `priceBreakerConfig`. The stored data includes:
- `currentMetalPrice`: Current market price of metal
- `gstPercentage`: GST rate to be applied

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Build tool and development server
- **CSS3**: Styling with gradients and responsive design

## License

MIT

## Support

For issues or feature requests, please open an issue in the repository.
