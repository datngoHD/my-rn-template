# React Native White-Label Multi-Tenant App

A production-grade React Native application built with Expo, designed to support white-label (multi-brand) and multi-tenant use cases.

## Features

- ✅ **White-Label Support**: Multiple brands with different app names, icons, colors, and bundle IDs
- ✅ **Multi-Tenant Support**: Runtime tenant configuration with feature flags and permissions
- ✅ **Clean Architecture**: Modular, scalable, and maintainable codebase
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Redux Toolkit**: Centralized state management
- ✅ **React Navigation**: Type-safe navigation
- ✅ **i18n**: Internationalization support
- ✅ **Error Handling**: Centralized error handling with Sentry integration
- ✅ **Logging**: Structured logging system
- ✅ **Theme System**: Dynamic theming with brand and tenant support

## Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn start
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Environment
EXPO_PUBLIC_ENV=dev

# Brand Configuration (build-time)
EXPO_PUBLIC_BRAND_ID=default

# Tenant Configuration (runtime)
EXPO_PUBLIC_TENANT_ID=default

# API URLs
EXPO_PUBLIC_API_URL_DEV=https://api-dev.example.com
EXPO_PUBLIC_API_URL_STAGING=https://api-staging.example.com
EXPO_PUBLIC_API_URL_PROD=https://api.example.com

# Sentry (optional)
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Project Structure

```
src/
├── core/                    # Core application infrastructure
│   ├── api/                 # API client
│   ├── branding/            # Brand configuration
│   ├── config/              # Environment configuration
│   ├── error-handling/      # Error handling
│   ├── i18n/                # Internationalization
│   ├── logging/              # Logging system
│   ├── navigation/          # Navigation setup
│   ├── store/               # Redux store
│   ├── tenant/              # Tenant configuration
│   └── theme/               # Theming system
├── features/                # Feature modules
│   ├── auth/                # Authentication feature
│   └── home/                # Home feature
└── shared/                  # Shared utilities
    ├── components/          # Reusable components
    ├── hooks/               # Custom hooks
    ├── types/               # Shared types
    └── utils/               # Utility functions
```

## Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

- **Presentation Layer**: UI components and Redux slices
- **Domain Layer**: Business logic and domain types
- **Data Layer**: Repositories and API calls

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## White-Label Configuration

### Setting Up a New Brand

1. Add brand configuration in `src/core/branding/brand.config.ts`:

```typescript
'brand-new': {
  id: 'brand-new',
  name: 'brand-new',
  displayName: 'New Brand',
  bundleId: 'com.newbrand.app',
  packageName: 'com.newbrand.app',
  colors: { /* ... */ },
  typography: { /* ... */ },
  assets: { /* ... */ },
}
```

2. Set `EXPO_PUBLIC_BRAND_ID=brand-new` in your environment

3. Update `app.json` with brand-specific settings

## Multi-Tenant Configuration

### Setting Up a New Tenant

1. Add tenant configuration in `src/core/tenant/tenant.config.ts`:

```typescript
'tenant-new': {
  id: 'tenant-new',
  name: 'tenant-new',
  displayName: 'New Tenant',
  api: { baseUrl: 'https://api-tenant-new.com' },
  featureFlags: { /* ... */ },
  permissions: { /* ... */ },
}
```

2. Load tenant at runtime:

```typescript
import { TenantLoader } from '@/core/tenant/tenant.config';

await TenantLoader.loadTenant('tenant-new');
```

## Available Scripts

```bash
# Development
yarn start              # Start Expo development server
yarn android            # Run on Android
yarn ios                # Run on iOS
yarn web                # Run on web

# Building
yarn build:ios          # Build iOS app
yarn build:android      # Build Android app

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier
```

## Development Guidelines

### Adding a New Feature

1. Create feature folder in `src/features/`:

```
features/
└── new-feature/
    ├── data/
    │   └── new-feature.repository.ts
    ├── domain/
    │   └── new-feature.types.ts
    └── presentation/
        ├── new-feature.slice.ts
        └── NewFeatureScreen.tsx
```

2. Add reducer to store in `src/core/store/store.ts`
3. Add navigation route in `src/core/navigation/navigation.tsx`
4. Follow the same pattern as the `auth` feature

### Using the API Client

```typescript
import { apiClient } from '@/core/api/api-client';

// GET request
const response = await apiClient.get<User>('/users/me');

// POST request
const response = await apiClient.post<User>('/users', userData);
```

### Using Redux

```typescript
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { login } from '@/features/auth/presentation/auth.slice';

const dispatch = useAppDispatch();
const user = useAppSelector(state => state.auth.user);

dispatch(login({ email, password }));
```

### Using Theme

```typescript
import { useTheme } from '@/core/theme/theme-context';

const { theme } = useTheme();

<View style={{ backgroundColor: theme.colors.primary }}>
  <Text style={{ color: theme.colors.text }}>Hello</Text>
</View>
```

## Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## Building for Production

### iOS

```bash
# Build for specific brand
EXPO_PUBLIC_BRAND_ID=brand-a eas build --platform ios --profile production
```

### Android

```bash
# Build for specific brand
EXPO_PUBLIC_BRAND_ID=brand-a eas build --platform android --profile production
```

## CI/CD

See [ARCHITECTURE.md](./ARCHITECTURE.md) for CI/CD strategy and examples.

## Troubleshooting

### Common Issues

1. **Module not found**: Run `yarn install` again
2. **Metro bundler issues**: Clear cache with `yarn start --clear`
3. **Type errors**: Run `yarn tsc --noEmit` to check types

## Contributing

1. Follow the existing code structure
2. Write TypeScript with strict types
3. Add JSDoc comments for public APIs
4. Follow the Clean Architecture pattern
5. Write tests for business logic

## License

[Your License Here]

## Support

For questions or issues, please open an issue on GitHub.
