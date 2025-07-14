# ViewArtifactButton Components

Two complementary React components that provide users with quick access to view generated artifacts in the sidebar. These components automatically appear when code is available and hide when no code is present.

## Components

### ViewArtifactButton
A floating action button (FAB) that appears in a fixed position, typically at the bottom-right of the screen.

### InlineViewArtifactButton  
A flexible inline button component with multiple variants (button, chip, icon) that can be positioned anywhere in the UI.

## Features

- ✅ **Conditional Rendering**: Only appears when `generatedCode` is non-empty
- ✅ **Sidebar Toggle**: Toggles the sidebar open/close state on click
- ✅ **Artifact Display**: Shows "View Generated Artifact" / "Hide Generated Artifact" labels
- ✅ **Code Metrics**: Shows line count and character count
- ✅ **Multiple Variants**: Button, chip, and icon variants available
- ✅ **Material UI Styling**: Beautiful animations and hover effects
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Accessibility**: Full tooltip and ARIA support

## Installation

No additional dependencies required - uses existing Material UI and ChatContext.

## Basic Usage

### Floating Button (ViewArtifactButton)

```jsx
import ViewArtifactButton from './components/ViewArtifactButton'

function App() {
  return (
    <div>
      {/* Your main content */}
      
      {/* Floating button appears when code is available */}
      <ViewArtifactButton />
    </div>
  )
}
```

### Inline Button (InlineViewArtifactButton)

```jsx
import InlineViewArtifactButton from './components/InlineViewArtifactButton'

function ChatInterface() {
  return (
    <div>
      {/* Chat messages */}
      
      {/* Inline button near input */}
      <InlineViewArtifactButton variant="chip" size="small" />
    </div>
  )
}
```

## Props

### ViewArtifactButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `string` | `'fixed'` | CSS position type |
| `bottom` | `number` | `24` | Bottom position in pixels |
| `right` | `number` | `24` | Right position in pixels |
| `zIndex` | `number` | `1000` | CSS z-index value |

### InlineViewArtifactButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'button' \| 'chip' \| 'icon'` | `'button'` | Button style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'small'` | Button size |
| `sx` | `object` | `{}` | Additional Material UI styles |

## Variants

### Button Variant
```jsx
<InlineViewArtifactButton variant="button" size="medium" />
```
- Standard Material UI Button
- Shows icon and text
- Outline style when closed, filled when open

### Chip Variant
```jsx
<InlineViewArtifactButton variant="chip" size="small" />
```
- Material UI Chip component
- Compact design with icon and text
- Good for inline placement

### Icon Variant
```jsx
<InlineViewArtifactButton variant="icon" size="small" />
```
- Icon-only button
- Minimal space usage
- Perfect for toolbars

## ChatContext Integration

Both components automatically connect to ChatContext:

```jsx
const {
  generatedCode,      // Code content (string)
  isSidebarOpen,      // Sidebar state (boolean)
  toggleSidebar       // Toggle function
} = useChatContext()
```

### Conditional Rendering Logic

```javascript
// Component only renders if code exists
if (!generatedCode || !generatedCode.trim()) {
  return null
}
```

### Language Detection

```javascript
const getLanguageHint = (code) => {
  if (code.includes('<html') || code.includes('<!DOCTYPE')) return 'HTML'
  if (code.includes('function') || code.includes('const ')) return 'JS'
  if (code.includes('def ') || code.includes('import ')) return 'Python'
  if (code.includes('#include') || code.includes('int main')) return 'C++'
  if (code.includes('public class')) return 'Java'
  if (code.includes('{') && code.includes(':')) return 'JSON'
  return 'Code'
}
```

## Styling and Animations

### ViewArtifactButton Features
- **Gradient background** that changes based on sidebar state
- **Scale animation** on hover
- **Badge** showing line count
- **Zoom entrance** animation

### InlineViewArtifactButton Features
- **Fade entrance** animation
- **Hover transformations** (scale, translate)
- **State-based styling** (different colors when open/closed)
- **Smooth transitions** between states

## Positioning Examples

### Fixed Bottom-Right (Default)
```jsx
<ViewArtifactButton />
```

### Custom Position
```jsx
<ViewArtifactButton 
  position="absolute"
  bottom={20}
  right={20}
  zIndex={999}
/>
```

### Near Message Input
```jsx
<Box sx={{ position: 'relative' }}>
  <MessageInput />
  <Box sx={{ position: 'absolute', bottom: 16, right: 80 }}>
    <InlineViewArtifactButton variant="chip" />
  </Box>
</Box>
```

### In Chat Header
```jsx
<AppBar>
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      Chat
    </Typography>
    <InlineViewArtifactButton variant="icon" />
  </Toolbar>
</AppBar>
```

## Code Metrics Display

Both components show helpful information about the generated code:

- **Line count**: Number of lines in the code
- **Character count**: Total characters
- **Language hint**: Auto-detected programming language
- **File size estimation**: For download/preview context

## Accessibility Features

### Tooltips
- Descriptive tooltips for all interactive elements
- Shows code metrics and current state
- Proper ARIA labeling

### Keyboard Support
- Full keyboard navigation support
- Tab order respects UI hierarchy
- Enter/Space key activation

### Screen Reader Support
- Semantic HTML structure
- Proper button roles and labels
- State announcements

## Integration Patterns

### With Chat Messages
```jsx
const Message = ({ message }) => {
  const hasCode = message.content.includes('```')
  
  return (
    <Box>
      <MessageContent>{message.content}</MessageContent>
      {hasCode && (
        <InlineViewArtifactButton 
          variant="chip" 
          size="small"
          sx={{ mt: 1 }}
        />
      )}
    </Box>
  )
}
```

### With Loading States
```jsx
const ChatInterface = () => {
  const { isGenerating } = useChatContext()
  
  return (
    <Box>
      {/* Chat content */}
      
      {!isGenerating && <ViewArtifactButton />}
    </Box>
  )
}
```

### Multiple Instances
```jsx
// Different variants can coexist
<Stack direction="row" spacing={1}>
  <InlineViewArtifactButton variant="button" />
  <InlineViewArtifactButton variant="chip" />
  <InlineViewArtifactButton variant="icon" />
</Stack>
```

## Customization

### Custom Styles
```jsx
<InlineViewArtifactButton 
  variant="button"
  sx={{
    borderRadius: 3,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }}
/>
```

### Theme Integration
```jsx
const theme = createTheme({
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        }
      }
    }
  }
})
```

## Performance Considerations

- **Conditional rendering** prevents unnecessary DOM nodes
- **Memoized calculations** for code metrics
- **Efficient re-renders** only when state changes
- **Lightweight animations** using CSS transforms

## Browser Support

- **Chrome 90+**: Full support
- **Firefox 88+**: Full support
- **Safari 14+**: Full support
- **Edge 90+**: Full support

## Troubleshooting

### Button Not Appearing
1. Check if `generatedCode` has content
2. Verify ChatProvider is wrapping the component
3. Ensure ChatContext is properly configured

### Styling Issues
1. Check for CSS conflicts
2. Verify Material UI theme is loaded
3. Use browser dev tools to inspect styles

### Click Not Working
1. Verify `toggleSidebar` function is available
2. Check for event propagation issues
3. Ensure button is not disabled

## License

These components are part of the AI Coding Agent project and are available under the MIT License. 