# Next.js + Chroma and LangChain: A Primer

This is a simple client-side app to demonstrate the use of Chroma with LangChain in a Next.js app.

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

You can run a local Chroma server by following the instructions [here](https://medium.com/@amikostech/running-chromadb-part-1-local-server-2c61cb1c9f2c).

## Importing Data

You can import data into Chroma using the [Chroma Data Pipes](https://datapipes.chromadb.dev/). For example:

```bash
cdp ds-get "hf://KShivendu/dbpedia-entities-openai-1M" \
  --doc-feature text \
  --id-feature _id \
  --embed-feature openai \
  --meta-features title | \
  cdp import "http://localhost:8000/my_collection" --create --upsert
```

