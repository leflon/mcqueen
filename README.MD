# McQueen

## Great Flash Cards with no ads, for free.

## Base Figma design: [Flashcards on Figma](https://www.figma.com/site/oIu2DDbzXZddwfTMnEmvzA/Flashcards?node-id=0-4&t=vTfeueMjgVzz2fI5-1)
 

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
