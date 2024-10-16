# Next.js + Chroma and LangChain: A Primer

This is a simple **client-side** app to demonstrate the use of Chroma with LangChain in a Next.js app.

## Getting Started

Create a `.env` file in the root of the project and add the following:

```
NEXT_PUBLIC_OPENAI_API_KEY=sk-XXXXX
NEXT_PUBLIC_CHROMA_SERVER=http://127.0.0.1:8000
NEXT_PUBLIC_CHROMA_COLLECTION_NAME=my-collection
```

Make sure to point `NEXT_PUBLIC_CHROMA_SERVER` to the correct Chroma server. You will also need to
set `chroma_server_cors_allow_origins='["*"]'`. You will also need to adjust `NEXT_PUBLIC_CHROMA_COLLECTION_NAME` to the
collection you want to query.

The above will expose the env vars to the client side. If you want to keep the API key secret, you can remove
the `NEXT_PUBLIC_` prefix, but then you'll need to update the code to handle the retrieval on the server side (future
work).

Run the dev server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Chroma Server

Run Chroma as follows:

```bash
docker run -e CHROMA_SERVER_CORS_ALLOW_ORIGINS='["http://localhost:3000"]' --rm -v ./chroma-data:/chroma/chroma -p 8000:8000 chromadb/chroma:0.5.13 
```

> Note: The env var `CHROMA_SERVER_CORS_ALLOW_ORIGINS` is set to allow the Next.js app to access the Chroma server.

## Importing Data

You can import data into Chroma using the [Chroma Data Pipes](https://datapipes.chromadb.dev/). For example:

```bash
export OPENAI_API_KEY=sk-XXXXX
cdp imp url https://docs.trychroma.com/ -d 3 | \
  cdp chunk -s 512 | \
  cdp tx emoji-clean -m | \
  cdp embed --ef openai | \
  cdp import "http://localhost:8000/my_collection" --create --upsert
```

## Ask a question

![img.png](img.png)

