# GitHub Actions Workflows

This directory contains automated workflows for OpenCode Flow CI/CD and publishing.

## Workflows

### 1. npm-publish.yml
**Triggers:**
- Push to `main` or `cf-fox` branch
- Tag push matching `v*.*.*`
- Manual workflow dispatch

**What it does:**
- Validates and tests the package
- Builds the distribution
- Publishes to npm with appropriate tag
- Creates GitHub releases
- Publishes both main package and plugin package

**Usage:**

```bash
# Manual publish with specific tag
git push origin main  # Triggers with tag from version

# Or trigger manually from GitHub Actions UI
# Choose tag: alpha, beta, next, or latest
```

### 2. version-bump.yml
**Triggers:** Manual workflow dispatch only

**What it does:**
- Bumps package version (patch, minor, major, or prerelease)
- Updates both main and plugin packages
- Updates CHANGELOG.md
- Commits changes and creates git tag
- Triggers npm-publish workflow

**Usage:**

1. Go to GitHub Actions → "Version Bump"
2. Click "Run workflow"
3. Choose:
   - **Version type:** patch, minor, major, prepatch, preminor, premajor, prerelease
   - **Prerelease ID:** alpha, beta, or rc (for prereleases)

**Examples:**

```bash
# Bump patch version: 1.0.0-alpha.1 → 1.0.0-alpha.2
# Choose: patch

# Bump minor version: 1.0.0 → 1.1.0
# Choose: minor

# Bump to next prerelease: 1.0.0-alpha.1 → 1.0.0-alpha.2
# Choose: prerelease, prerelease_id: alpha

# Bump to beta: 1.0.0-alpha.5 → 1.0.0-beta.0
# Choose: premajor, prerelease_id: beta
```

### 3. release.yml
**Triggers:**
- Tag push matching `v*.*.*`
- Manual workflow dispatch

**What it does:**
- Generates changelog from git commits
- Creates GitHub release with notes
- Marks as prerelease if alpha/beta/rc
- Includes installation instructions

**Usage:**

```bash
# Create release tag
git tag v1.0.0-alpha.2
git push origin v1.0.0-alpha.2

# Or trigger manually from GitHub Actions UI
# Specify version number
```

## Setup

### 1. Create npm Token

1. Go to https://www.npmjs.com/settings/tannht/tokens
2. Click "New Access Token"
3. Choose "Granular Access Token" or "Automation"
4. Select permissions:
   - ✅ Publish
   - ✅ Read
5. Copy the token

### 2. Add to GitHub Secrets

1. Go to your repo: https://github.com/tannht/claude-flow/settings/secrets/actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Paste your npm token
5. Click "Add secret"

### 3. Enable Workflows

Workflows are automatically enabled when you push to GitHub. To verify:

1. Go to: https://github.com/tannht/claude-flow/actions
2. You should see all 3 workflows listed

## Typical Release Workflow

### Alpha/Beta Releases (Prereleases)

```bash
# 1. Make your changes
git add .
git commit -m "feat: add new feature"

# 2. Push to branch
git push origin cf-fox

# 3. Go to GitHub Actions → "Version Bump"
# 4. Run workflow with:
#    - Version type: prerelease
#    - Prerelease ID: alpha (or beta)

# 5. Workflow will:
#    - Bump version (e.g., 1.0.0-alpha.1 → 1.0.0-alpha.2)
#    - Create tag v1.0.0-alpha.2
#    - Trigger npm-publish
#    - Publish to @alpha tag on npm
```

### Stable Releases

```bash
# 1. Ensure all alpha features tested
git checkout main

# 2. Go to GitHub Actions → "Version Bump"
# 3. Run workflow with:
#    - Version type: major/minor/patch
#    - (no prerelease ID needed)

# 4. Workflow will:
#    - Bump version (e.g., 1.0.0 → 1.1.0)
#    - Create tag v1.1.0
#    - Trigger npm-publish
#    - Publish to @latest tag on npm
```

### Manual Publish with Custom Tag

```bash
# 1. Go to GitHub Actions → "npm-publish"
# 2. Click "Run workflow"
# 3. Choose tag: alpha, beta, next, or latest
# 4. Run workflow

# Useful for:
# - Republishing failed releases
# - Publishing to different tag
# - Testing npm publishing
```

## NPM Tags Explained

| Tag | Purpose | Example Version |
|-----|---------|-----------------|
| `latest` | Stable releases | `1.0.0`, `1.2.3` |
| `alpha` | Early testing | `1.0.0-alpha.1` |
| `beta` | Feature complete | `1.0.0-beta.1` |
| `next` | Pre-release | `1.0.0-rc.1`, `2.0.0-nightly` |

## Installation Examples

```bash
# Install latest stable
npx opencode-flow

# Install specific alpha
npx opencode-flow@alpha

# Install specific version
npx opencode-flow@1.0.0-alpha.1

# Install globally
npm install -g opencode-flow@alpha

# Install in project
npm install opencode-flow@latest
```

## Troubleshooting

### Publish fails with 403 error

**Problem:** `npm ERR! 403 403 Forbidden - PUT`

**Solution:**
1. Check NPM_TOKEN secret is set correctly
2. Token must have "Publish" permission
3. Regenerate token if expired

### Version conflict

**Problem:** `npm ERR! 403 403 Forbidden - version already published`

**Solution:**
1. Bump version first using "Version Bump" workflow
2. Don't manually edit package.json version

### Tests fail

**Problem:** Workflow fails at validation step

**Solution:**
1. Check test logs in Actions output
2. Fix failing tests locally
3. Push fixes before publishing

### Changelog not generated

**Problem:** Release has empty changelog

**Solution:**
1. Ensure commits have proper messages
2. Check if tag exists for previous version
3. Manually edit release notes on GitHub

## Best Practices

1. **Always test before publishing**
   - Run `npm test` locally
   - Check CI passes on branch

2. **Use semantic versioning**
   - `major`: Breaking changes
   - `minor`: New features (backwards compatible)
   - `patch`: Bug fixes

3. **Prerelease progression**
   - `alpha` → `beta` → `rc` → `stable`
   - Don't jump from alpha to stable

4. **Write good commit messages**
   - `feat:` for new features
   - `fix:` for bug fixes
   - `chore:` for maintenance
   - These appear in changelogs

5. **Monitor npm publishes**
   - Check https://www.npmjs.com/package/opencode-flow
   - Verify all files published correctly

## Related Documentation

- [npm publishing docs](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [GitHub Actions docs](https://docs.github.com/en/actions)
- [Semantic versioning](https://semver.org/)
- [CHANGELOG.md](../CHANGELOG.md) for version history

## Support

If workflows fail:
1. Check Actions tab for error logs
2. Review this README's troubleshooting section
3. Open an issue on GitHub
