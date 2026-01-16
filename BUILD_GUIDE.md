# Build Guide for White-Label Multi-Tenant App

This guide explains how to build the app for different brands and tenants.

## Prerequisites

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure EAS Build:
```bash
eas build:configure
```

## Building for Different Brands

### Option 1: Environment Variable Approach

Set the brand ID via environment variable before building:

```bash
# Build for Brand A (iOS)
EXPO_PUBLIC_BRAND_ID=brand-a eas build --platform ios --profile production

# Build for Brand B (Android)
EXPO_PUBLIC_BRAND_ID=brand-b eas build --platform android --profile production
```

### Option 2: Separate app.json Files

1. Create brand-specific app.json files:
   - `app.brand-a.json`
   - `app.brand-b.json`
   - `app.brand-c.json`

2. Create a build script:

```bash
#!/bin/bash
# build-brand.sh

BRAND=$1
PLATFORM=$2

if [ -z "$BRAND" ] || [ -z "$PLATFORM" ]; then
  echo "Usage: ./build-brand.sh <brand-id> <ios|android>"
  exit 1
fi

# Copy brand-specific app.json
cp "app.$BRAND.json" app.json

# Set brand ID
export EXPO_PUBLIC_BRAND_ID=$BRAND

# Build
eas build --platform $PLATFORM --profile production

# Restore original app.json
git checkout app.json
```

3. Run the script:
```bash
chmod +x build-brand.sh
./build-brand.sh brand-a ios
```

## Building for Different Environments

### Development
```bash
EXPO_PUBLIC_ENV=dev eas build --platform ios --profile development
```

### Staging
```bash
EXPO_PUBLIC_ENV=staging eas build --platform ios --profile staging
```

### Production
```bash
EXPO_PUBLIC_ENV=production eas build --platform ios --profile production
```

## EAS Build Profiles

Create or update `eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_ENV": "dev"
      }
    },
    "staging": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_ENV": "staging"
      }
    },
    "production": {
      "distribution": "store",
      "env": {
        "EXPO_PUBLIC_ENV": "production"
      }
    }
  }
}
```

## Multi-Brand Build Strategy

### Strategy 1: Separate Apps (Recommended)

Build completely separate apps for each brand:
- Different bundle IDs
- Different app store listings
- Clean separation
- Larger maintenance overhead

### Strategy 2: Single App with Runtime Selection

Build one app that supports all brands:
- Smaller maintenance overhead
- Larger app size
- More complex configuration
- All brands in one codebase

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build All Brands

on:
  push:
    branches: [main]

jobs:
  build-brand-a-ios:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: yarn install
      - run: |
          export EXPO_PUBLIC_BRAND_ID=brand-a
          eas build --platform ios --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## Testing Builds

1. **Internal Distribution**:
```bash
eas build --platform ios --profile staging --distribution internal
```

2. **TestFlight**:
```bash
eas build --platform ios --profile production --distribution store
```

3. **Google Play Internal Testing**:
```bash
eas build --platform android --profile production --distribution store
```

## Troubleshooting

### Build Fails with "Brand not found"
- Ensure `EXPO_PUBLIC_BRAND_ID` matches a brand in `brand.config.ts`
- Check that the brand configuration is properly exported

### Wrong Bundle ID
- Verify `app.json` has the correct bundle ID for the brand
- Check that brand configuration includes the correct bundle ID

### Assets Not Loading
- Ensure brand assets exist in the correct paths
- Check that asset paths in `brand.config.ts` are correct

## Best Practices

1. **Version Control**: Keep brand-specific configs in version control
2. **Testing**: Test each brand build before production release
3. **Documentation**: Document brand-specific differences
4. **Automation**: Automate builds via CI/CD
5. **Monitoring**: Track build success rates per brand





