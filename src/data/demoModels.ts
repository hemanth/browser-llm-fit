export interface DemoModel {
  id: string;
  name: string;
  task: 'text-generation' | 'sentiment-analysis' | 'feature-extraction';
  defaultPrompt: string;
}

export const DEMO_MODELS: DemoModel[] = [
  { id: 'HuggingFaceTB/SmolLM2-135M-Instruct', name: 'SmolLM2 135M Instruct',
    task: 'text-generation', defaultPrompt: 'The future of local in-browser artificial intelligence is' },
  { id: 'onnx-community/Qwen2.5-0.5B-Instruct', name: 'Qwen 2.5 0.5B Instruct',
    task: 'text-generation', defaultPrompt: 'The future of local in-browser artificial intelligence is' },
  { id: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', name: 'DistilBERT SST-2 (Sentiment Analysis)',
    task: 'sentiment-analysis', defaultPrompt: 'I love running models locally in the browser.' },
  { id: 'Xenova/all-MiniLM-L6-v2', name: 'all-MiniLM-L6-v2 (Embeddings)',
    task: 'feature-extraction', defaultPrompt: 'Local vector search and semantic retrieval.' },
  { id: 'Xenova/bge-small-en-v1.5', name: 'BGE Small English (Embeddings)',
    task: 'feature-extraction', defaultPrompt: 'Local vector search and semantic retrieval.' },
];

export function getDemoModel(id: string | undefined): DemoModel | undefined {
  return DEMO_MODELS.find(model => model.id === id);
}
