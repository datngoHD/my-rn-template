# Project Structure

Complete folder structure of the React Native white-label multi-tenant application.

```
NEWs/
├── .github/
│   └── workflows/
│       └── ci.yml.example          # CI/CD pipeline example
├── assets/                          # Static assets
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src/
│   ├── core/                        # Core application infrastructure
│   │   ├── api/
│   │   │   └── api-client.ts       # Axios-based API client
│   │   ├── branding/
│   │   │   └── brand.config.ts     # Brand configuration (build-time)
│   │   ├── config/
│   │   │   └── environment.ts      # Environment configuration
│   │   ├── error-handling/
│   │   │   └── error-handler.ts    # Error handling system
│   │   ├── i18n/
│   │   │   └── i18n.ts             # Internationalization setup
│   │   ├── logging/
│   │   │   └── logger.ts           # Logging system
│   │   ├── navigation/
│   │   │   ├── navigation.tsx     # Navigation setup
│   │   │   └── types.ts            # Navigation types
│   │   ├── store/
│   │   │   ├── store.ts            # Redux store configuration
│   │   │   └── hooks.ts            # Typed Redux hooks
│   │   ├── tenant/
│   │   │   └── tenant.config.ts    # Tenant configuration (runtime)
│   │   └── theme/
│   │       ├── theme.ts            # Theme system
│   │       └── theme-context.tsx   # Theme React context
│   ├── features/                    # Feature modules (Clean Architecture)
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   └── auth.repository.ts    # Auth data layer
│   │   │   ├── domain/
│   │   │   │   └── auth.types.ts         # Auth domain types
│   │   │   └── presentation/
│   │   │       └── auth.slice.ts        # Auth Redux slice
│   │   └── home/
│   │       ├── data/                     # (Placeholder for home feature)
│   │       ├── domain/
│   │       └── presentation/
│   └── shared/                     # Shared utilities and components
│       ├── components/
│       │   └── button/
│       │       └── button.tsx      # Reusable Button component
│       ├── hooks/
│       │   └── use-debounce.ts     # Custom React hooks
│       ├── types/
│       │   └── common.ts           # Shared TypeScript types
│       └── utils/
│           ├── format.ts            # Formatting utilities
│           └── validation.ts       # Validation utilities
├── .env.example                    # Environment variables example
├── .eslintrc.js                    # ESLint configuration
├── .gitignore                      # Git ignore rules
├── .prettierrc.js                  # Prettier configuration
├── App.tsx                          # Main app component
├── ARCHITECTURE.md                  # Architecture documentation
├── BUILD_GUIDE.md                  # Build guide for white-label
├── babel.config.js                 # Babel configuration
├── index.ts                        # Entry point
├── package.json                    # Dependencies and scripts
├── PROJECT_STRUCTURE.md            # This file
├── README.md                       # Project README
├── SETUP_COMPLETE.md               # Setup completion guide
└── tsconfig.json                   # TypeScript configuration
```

## Key Directories Explained

### `src/core/`
Core application infrastructure that provides foundational services:
- **api/**: HTTP client with interceptors and token management
- **branding/**: Build-time brand configuration
- **config/**: Environment-specific configuration
- **error-handling/**: Centralized error handling
- **i18n/**: Internationalization setup
- **logging/**: Structured logging system
- **navigation/**: React Navigation setup
- **store/**: Redux store configuration
- **tenant/**: Runtime tenant configuration
- **theme/**: Theming system

### `src/features/`
Feature modules following Clean Architecture:
- Each feature has three layers:
  - **data/**: Repositories and API calls
  - **domain/**: Business logic and types
  - **presentation/**: UI components and Redux slices

### `src/shared/`
Reusable code shared across features:
- **components/**: Reusable UI components
- **hooks/**: Custom React hooks
- **types/**: Shared TypeScript types
- **utils/**: Utility functions

## File Naming Conventions

- **Files**: kebab-case (e.g., `auth.repository.ts`)
- **Components**: PascalCase (e.g., `Button.tsx`)
- **Types/Interfaces**: camelCase with `.types.ts` suffix
- **Configs**: camelCase with `.config.ts` suffix

## Import Paths

The project uses path aliases configured in `tsconfig.json`:
- `@/*` maps to `src/*`

Example:
```typescript
import { apiClient } from '@/core/api/api-client';
import { Button } from '@/shared/components/button/button';
```
