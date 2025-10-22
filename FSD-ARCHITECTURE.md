# Feature-Sliced Design Architecture

This project follows the **Feature-Sliced Design (FSD)** methodology for scalable and maintainable React Native applications.

## 📐 Project Structure

```
src/
├── shared/           # Reusable code without business logic
│   ├── api/         # API clients, storage, query client
│   ├── lib/         # Types, hooks, utilities
│   └── ui/          # UI components (ErrorBoundary)
├── entities/         # Business entities
│   ├── user/        # User entity (types, API, hooks)
│   └── theme/       # Theme entity (types, context, provider)
├── features/         # Business features
│   ├── auth/        # Authentication (context, API, hooks)
│   └── theme-switcher/ # Theme switching (UI component)
├── widgets/          # Composite blocks
│   ├── navigation/  # App navigation
│   └── app-providers/ # Application providers
├── pages/            # Application pages
│   ├── home/        # Home page
│   └── details/     # Details page
└── app/              # Application initialization
```

## 🎯 FSD Principles

### 1. Layer Isolation
Each layer can only import from lower layers:
- `pages` → `widgets` → `features` → `entities` → `shared`
- No circular dependencies

### 2. Segmentation
Each slice contains standard segments:
- `api/` - API integration
- `model/` - Business logic and state
- `lib/` - Hooks and utilities
- `ui/` - UI components

### 3. Public API
Each slice exports only public API through `index.ts`:
```typescript
// ✅ Good
import { useAuth } from '~/features/auth'

// ❌ Bad
import { useAuth } from '~/features/auth/model/context'
```

## 🔧 Path Mapping

The project uses TypeScript path mapping with `~` alias:

```typescript
// Instead of relative paths:
import { useAuth } from '../../../features/auth'

// Use absolute paths:
import { useAuth } from '~/features/auth'
```

## 📦 Key Dependencies

- **@tanstack/react-query** - Server state management
- **@react-native-async-storage/async-storage** - Data persistence
- **@react-navigation/native** - Navigation
- **babel-plugin-module-resolver** - Path mapping support

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Metro bundler:**
   ```bash
   npm run start
   ```

3. **Run on iOS/Android:**
   ```bash
   npm run ios
   npm run android
   ```

## 🧪 Development Scripts

- `npm run lint` - Code linting
- `npm run test` - Run tests
- `npm run clode` - Start Claude Code
- `npm run dev` - Start with Context7 and Claude Code

## 🏗 Adding New Features

When adding a new feature, follow this structure:

```
src/features/my-feature/
├── api/           # API calls for this feature
├── model/         # State management
├── lib/           # Feature-specific hooks
├── ui/            # UI components
└── index.ts       # Public API exports
```

## 📚 Resources

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)
- [React Native Documentation](https://reactnative.dev/)