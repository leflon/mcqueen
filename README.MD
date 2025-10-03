# McQueen

## Great Flash Cards with no ads, for free.

### How to use

#### 1. Clone the repository

**Using Git CLI**

```bash
git clone https://github.com/leflon/mcqueen.git
```

**Using GitHub CLI**

```bash
gh repo clone leflon/mcqueen
```

#### 2. Install dependencies

```bash
cd mcqueen
cd backend && bun install && cd ../frontend && bun install && cd ..
```

#### 3. Run locally

You can either run backend and frontend separately:

```bash
bun client:dev
```

```bash
bun server:dev
```

Or you can run them both using `concurrently`:

```bash
bun dev
```
