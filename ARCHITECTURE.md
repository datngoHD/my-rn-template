# React Native White-Label Multi-Tenant Architecture

## Overview

This is a production-grade React Native application built with Expo, designed to support white-label (multi-brand) and multi-tenant use cases. The architecture follows Clean Architecture principles with clear separation of concerns.

## Technology Stack

- **Framework**: Expo (latest)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **i18n**: react-i18next
- **Error Tracking**: Sentry (ready)
- **Package Manager**: Yarn

## Architecture Decision: Expo vs React Native CLI

**We chose Expo** for the following reasons:

1. **Faster Development**: Over-the-air updates, easier builds, and better developer experience
2. **White-Label Support**: Expo's app.json configuration system makes it easier to manage multiple brand configurations
3. **Ecosystem**: Rich set of pre-built modules and better community support
4. **Build Process**: EAS Build simplifies multi-brand builds with different app.json configurations
5. **Maintenance**: Easier to maintain and update dependencies

**Trade-offs**:
- Less control over native code (though Expo supports custom native code via config plugins)
- Slightly larger bundle size
- Dependency on Expo's release cycle

For enterprise applications requiring extensive native customization, React Native CLI might be preferred, but for most white-label scenarios, Expo provides better developer experience and faster iteration.

## Folder Structure

```
src/
├── core/                    # Core application infrastructure
│   ├── api/                 # API client and HTTP layer
│   ├── branding/            # Brand configuration (build-time)
│   ├── config/              # Environment configuration
│   ├── error-handling/      # Error handling and recovery
│   ├── i18n/                # Internationalization
│   ├── logging/             # Logging system
│   ├── navigation/          # Navigation setup
│   ├── store/               # Redux store configuration
│   ├── tenant/              # Tenant configuration (runtime)
│   └── theme/               # Theming system
├── features/                # Feature modules (Clean Architecture)
│   ├── auth/
│   │   ├── data/           # Data layer (repositories, API calls)
│   │   ├── domain/         # Domain layer (business logic, types)
│   │   └── presentation/   # Presentation layer (UI, Redux slices)
│   └── home/
│       ├── data/
│       ├── domain/
│       └── presentation/
└── shared/                  # Shared utilities and components
    ├── components/         # Reusable UI components
    ├── hooks/              # Custom React hooks
    ├── types/             # Shared TypeScript types
    └── utils/              # Utility functions
```

## Core Concepts

### 1. White-Label (Multi-Brand) Support

**Build-Time Configuration** (`src/core/branding/brand.config.ts`):
- App name, bundle ID, package name
- App icon and splash screen
- Default color palette
- Typography preferences

**How it works**:
- Each brand has its own configuration object
- Selected via `EXPO_PUBLIC_BRAND_ID` environment variable
- Build separate apps per brand using EAS Build with different app.json files

**Example**:
```typescript
// Build for Brand A
EXPO_PUBLIC_BRAND_ID=brand-a yarn build:ios

// Build for Brand B
EXPO_PUBLIC_BRAND_ID=brand-b yarn build:android
```

### 2. Multi-Tenant Support

**Runtime Configuration** (`src/core/tenant/tenant.config.ts`):
- API endpoints (can vary per tenant)
- Feature flags (tenant-specific features)
- Permissions and access control
- Custom business rules

**How it works**:
- Tenant configuration loaded at runtime
- Can be selected via:
  1. Deep link: `app://tenant-1`
  2. User login (tenant from user profile)
  3. Stored preference
  4. Server-side configuration fetch

**Example**:
```typescript
// Load tenant at app start
await TenantLoader.loadTenant('tenant-1');

// Check feature availability
if (TenantLoader.isFeatureEnabled('enableBiometricAuth')) {
  // Show biometric auth option
}
```

### 3. Build-Time vs Runtime Decisions

**Build-Time** (Cannot change after app is built):
- App name, bundle ID, package name
- App icon, splash screen
- Core app structure
- Brand-specific assets

**Runtime** (Can change dynamically):
- API endpoints
- Feature flags
- Tenant-specific configurations
- User preferences
- Theme colors (optional override)

### 4. Clean Architecture

Each feature follows Clean Architecture with three layers:

1. **Presentation Layer** (`presentation/`):
   - React components
   - Redux slices
   - UI logic

2. **Domain Layer** (`domain/`):
   - Business logic
   - Domain types
   - Use cases

3. **Data Layer** (`data/`):
   - Repositories
   - API calls
   - Data transformation

**Benefits**:
- Testability: Each layer can be tested independently
- Maintainability: Clear separation of concerns
- Scalability: Easy to add new features
- Flexibility: Can swap implementations (e.g., API → GraphQL)

## Configuration Files

### Environment Configuration

```typescript
// src/core/config/environment.ts
export const environmentConfig = {
  environment: 'dev' | 'staging' | 'production',
  apiBaseUrl: string,
  enableLogging: boolean,
  enableSentry: boolean,
  // ...
};
```

### Brand Configuration

```typescript
// src/core/branding/brand.config.ts
export const brandConfig = {
  id: 'brand-a',
  name: 'Brand A',
  bundleId: 'com.branda.app',
  colors: { /* ... */ },
  typography: { /* ... */ },
  assets: { /* ... */ },
};
```

### Tenant Configuration

```typescript
// src/core/tenant/tenant.config.ts
export const tenantConfig = {
  id: 'tenant-1',
  api: { baseUrl: 'https://api-tenant1.com' },
  featureFlags: { /* ... */ },
  permissions: { /* ... */ },
};
```

## API Layer

The API client (`src/core/api/api-client.ts`) provides:
- Automatic token management
- Request/response interceptors
- Error handling
- Retry logic
- Tenant ID header injection

**Usage**:
```typescript
import { apiClient } from '@/core/api/api-client';

const response = await apiClient.get<User>('/users/me');
```

## State Management

Redux Toolkit is used for state management with:
- Typed hooks (`useAppDispatch`, `useAppSelector`)
- Feature-based slices
- Async thunks for API calls

**Example**:
```typescript
// In a component
const dispatch = useAppDispatch();
const user = useAppSelector(state => state.auth.user);

dispatch(login({ email, password }));
```

## Theming System

The theme system (`src/core/theme/`) combines:
- Brand colors (from brand config)
- Tenant-specific overrides (optional)
- Light/dark mode support

**Usage**:
```typescript
const { theme } = useTheme();

<View style={{ backgroundColor: theme.colors.primary }}>
  <Text style={{ color: theme.colors.text }}>Hello</Text>
</View>
```

## Navigation

React Navigation is configured with:
- Type-safe navigation
- Stack and Tab navigators
- Authentication flow handling
- Deep linking support

## Internationalization

i18next is configured for:
- Multiple languages
- Lazy loading of translations
- Tenant-specific translations (if needed)

## Error Handling

Centralized error handling with:
- Error normalization
- User-friendly messages
- Sentry integration
- Error recovery strategies

## Logging

Structured logging system with:
- Environment-aware log levels
- Sentry integration
- Performance monitoring

## CI/CD Strategy for White-Label Builds

### Option 1: Separate Apps per Brand

1. Create separate app.json files for each brand:
   - `app.brand-a.json`
   - `app.brand-b.json`
   - `app.brand-c.json`

2. Build script:
```bash
#!/bin/bash
BRAND=$1
cp app.$BRAND.json app.json
EXPO_PUBLIC_BRAND_ID=$BRAND eas build --platform ios --profile production
```

3. CI/CD pipeline:
```yaml
# .github/workflows/build.yml
jobs:
  build-brand-a:
    steps:
      - run: yarn build:brand brand-a
  build-brand-b:
    steps:
      - run: yarn build:brand brand-b
```

### Option 2: Single App with Runtime Brand Selection

1. Bundle all brand assets
2. Select brand at runtime (first launch or deep link)
3. Store selection in AsyncStorage
4. Load brand config dynamically

**Trade-offs**:
- Option 1: Larger app size, but cleaner separation
- Option 2: Smaller per-brand size, but all brands in one app

## Common Pitfalls and Best Practices

### Pitfalls

1. **Mixing build-time and runtime configs**: Keep them separate
2. **Hardcoding values**: Always use configuration
3. **Not testing multi-tenant scenarios**: Test with different tenants
4. **Bundle size**: Monitor and optimize per brand
5. **Asset management**: Organize brand assets clearly

### Best Practices

1. **Type Safety**: Use TypeScript strictly, avoid `any`
2. **Error Handling**: Always handle errors gracefully
3. **Logging**: Log important events, but not sensitive data
4. **Testing**: Write tests for business logic
5. **Documentation**: Document brand/tenant-specific behavior
6. **Code Review**: Review brand/tenant config changes carefully
7. **Version Control**: Use feature flags for gradual rollouts

## Development Workflow

1. **Local Development**:
```bash
# Set environment
EXPO_PUBLIC_ENV=dev EXPO_PUBLIC_BRAND_ID=default yarn start

# Set tenant
EXPO_PUBLIC_TENANT_ID=tenant-1 yarn start
```

2. **Building for Production**:
```bash
# Build for specific brand
yarn build:ios:brand-a
yarn build:android:brand-b
```

3. **Testing Multi-Tenant**:
```typescript
// In your test setup
await TenantLoader.loadTenant('tenant-1');
// Test feature availability
```

## Next Steps

1. Add more features following the same architecture
2. Set up EAS Build for automated builds
3. Configure Sentry for error tracking
4. Add unit and integration tests
5. Set up CI/CD pipeline
6. Add feature flags system (Firebase Remote Config, etc.)
7. Implement offline support
8. Add analytics (tenant-aware)

## Questions?

For questions about:
- **Architecture**: See this document
- **Brand Configuration**: See `src/core/branding/brand.config.ts`
- **Tenant Configuration**: See `src/core/tenant/tenant.config.ts`
- **Adding Features**: Follow the `auth` feature as an example
