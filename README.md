# PolyInk

A bilingual reader application that helps you read books in two languages.

## How to Use

### Prerequisites

- Node.js and npm installed.
- An EPUB file to convert.

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

1.  Start the development server:
    ```bash
    npm start
    ```
2.  Open your browser to [http://localhost:3000](http://localhost:3000) to see the application.

### Converting an EPUB File

1.  Place your EPUB file in the project's root directory.
2.  Run the conversion script:
    ```bash
    npm run convert-epub <your-book-name>.epub
    ```
3.  The converted content will be saved to `src/bilingual-content.json`.

### Building for Production

To create a production build, run:

```bash
npm run build
```

This will create a `build` directory with the optimized files.
