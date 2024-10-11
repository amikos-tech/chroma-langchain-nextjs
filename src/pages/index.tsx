import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createRetrievalChain } from "langchain/chains/retrieval";
// @ts-ignore
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import {useEffect, useState} from "react";

const inter = Inter({ subsets: ["latin"] });
async function run_retrieval(question: string,context?: string){

// Create an LLM instance
  const llm = new OpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
// Create embedding function
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    // modelName:'text-embedding-3-large',
  });
// Create a prompt template
  const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question based only of the provided context:
    <context>{context}</context>
    Question: {input}
`);

// Create a vector store to interact with the vector store
  const vectorStore = new Chroma(embeddings, {
    url: process.env.CHROMA_SERVER || 'http://127.0.0.1:8000', //update this as per your requirements
    collectionName: process.env.CHROMA_COLLECTION_NAME || 'my_collection',
  });
// Create a retriever
  const retriever = await vectorStore.asRetriever();

// Define the document chain
  const combineDocsChain = await createStuffDocumentsChain({
        llm,
        prompt,
      }
  );

// Define the retrieval chain
  const retrievalChain = await createRetrievalChain({
    combineDocsChain,
    retriever,
  });
  const response = await retrievalChain.invoke({ input: question, context: context});
  return response;
}
export default function Home() {
    const [input, setInput] = useState('');
    const [data, setData] = useState('');
    const [context, setContext] = useState(''); // Add context state
    const [isLoading, setIsLoading] = useState(false);
    // Function to handle the input change and trigger data retrieval
    const handleSearch = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (input.trim()) {
            setIsLoading(true);
            try {
                const data = await run_retrieval(input);
                setData(data.answer);
                setContext(data.context); // Update context state (if needed)
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Inline styles
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        },
        input: {
            margin: '0 0 20px',
            padding: '10px',
            fontSize: '16px',
        },
        button: {
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
        },
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSearch} style={{ textAlign: 'center' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your input"
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Search</button>
            </form>
            {!isLoading && data ? <div>{data}</div> : isLoading ? 'Loading...' : null}
        </div>
    );
}
