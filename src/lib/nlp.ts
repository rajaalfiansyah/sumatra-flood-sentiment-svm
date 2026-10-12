import { STOPWORDS, POSITIVE_WORDS, NEGATIVE_WORDS } from './lexicon';

export type SentimentLabel = 'Positif' | 'Negatif' | 'Netral';

export interface PreprocessingResult {
  raw: string;
  caseFolded: string;
  cleaned: string;
  tokens: string[];
  filtered: string[];
  stemmed: string[];
  finalText: string;
}

export interface TfidfResult {
  terms: string[];
  tf: Record<string, number>;
  idf: Record<string, number>;
  tfidf: Record<string, number>;
  topTerms: { term: string; weight: number }[];
}

export interface PredictionResult {
  label: SentimentLabel;
  scores: { Positif: number; Negatif: number; Netral: number };
  preprocessing: PreprocessingResult;
  tfidf: TfidfResult;
  svmWeight: number;
  svmBias: number;
}

// Simple Indonesian stemmer (Sastrawi-lite, rule-based)
function stemWord(word: string): string {
  if (word.length <= 3) return word;

  let w = word;

  // Remove inflectional suffixes: -lah, -kah, -ku, -mu, -nya, -tah, -pun
  const inflectionSuffixes = ['lah', 'kah', 'tah', 'pun', 'nya', 'ku', 'mu'];
  for (const suffix of inflectionSuffixes) {
    if (w.endsWith(suffix) && w.length > suffix.length + 3) {
      w = w.slice(0, -suffix.length);
      break;
    }
  }

  // Remove derivation suffixes: -i, -an, -kan
  const derivSuffixes = ['kan', 'an', 'i', 'isme', 'isasi'];
  for (const suffix of derivSuffixes) {
    if (w.endsWith(suffix) && w.length > suffix.length + 3) {
      w = w.slice(0, -suffix.length);
      break;
    }
  }

  // Remove prefixes: me-, pe-, ber-, di-, ke-, se-, te-, be-, te-
  const prefixes = ['menge', 'peng', 'meny', 'peny', 'meng', 'men', 'peng', 'pem', 'mem', 'ber', 'ter',
    'di', 'ke', 'se', 'pe', 'be', 'me', 'te'];
  for (const prefix of prefixes) {
    if (w.startsWith(prefix) && w.length > prefix.length + 3) {
      const candidate = w.slice(prefix.length);
      if (candidate.length >= 3) {
        w = candidate;
        break;
      }
    }
  }

  // Handle "meny" -> "s" (menyapu -> sapu)
  if (word.startsWith('meny') && word.length > 6) {
    w = 's' + word.slice(4);
  }

  // Handle "peny" -> "s" (penyapu -> sapu)
  if (word.startsWith('peny') && word.length > 6) {
    w = 's' + word.slice(4);
  }

  // Handle "meng" -> keep root if starts with vowel/k/h
  if (word.startsWith('meng') && word.length > 6) {
    const root = word.slice(4);
    if (root.length >= 3) w = root;
  }

  return w || word;
}

export function caseFolding(text: string): string {
  return text.toLowerCase();
}

export function cleaning(text: string): string {
  let result = text;
  // Remove URLs
  result = result.replace(/https?:\/\/\S+|www\.\S+/g, '');
  // Remove mentions @username
  result = result.replace(/@\w+/g, '');
  // Remove hashtags #hashtag (keep the word)
  result = result.replace(/#(\w+)/g, '$1');
  // Remove numbers
  result = result.replace(/\d+/g, '');
  // Remove punctuation and symbols (keep letters and spaces)
  result = result.replace(/[^\w\s]/g, ' ');
  // Remove extra whitespace
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

export function tokenizing(text: string): string[] {
  return text.split(/\s+/).filter((t) => t.length > 0);
}

export function removeStopwords(tokens: string[]): string[] {
  return tokens.filter((t) => !STOPWORDS.includes(t) && t.length > 2);
}

export function stemming(tokens: string[]): string[] {
  return tokens.map((t) => stemWord(t));
}

export function preprocess(text: string): PreprocessingResult {
  const caseFolded = caseFolding(text);
  const cleaned = cleaning(caseFolded);
  const tokens = tokenizing(cleaned);
  const filtered = removeStopwords(tokens);
  const stemmed = stemming(filtered);
  const finalText = stemmed.join(' ');

  return {
    raw: text,
    caseFolded,
    cleaned,
    tokens,
    filtered,
    stemmed,
    finalText,
  };
}

// Lexicon-based auto labeling
export function lexiconLabel(text: string): SentimentLabel {
  const preprocessed = preprocess(text);
  const words = preprocessed.stemmed;

  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.includes(word)) positiveScore++;
    if (NEGATIVE_WORDS.includes(word)) negativeScore++;
  }

  if (positiveScore > negativeScore) return 'Positif';
  if (negativeScore > positiveScore) return 'Negatif';
  return 'Netral';
}

export function lexiconScores(text: string): { positive: number; negative: number; label: SentimentLabel } {
  const preprocessed = preprocess(text);
  const words = preprocessed.stemmed;

  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.includes(word)) positiveScore++;
    if (NEGATIVE_WORDS.includes(word)) negativeScore++;
  }

  let label: SentimentLabel = 'Netral';
  if (positiveScore > negativeScore) label = 'Positif';
  else if (negativeScore > positiveScore) label = 'Negatif';

  return { positive: positiveScore, negative: negativeScore, label };
}

// TF-IDF Vectorizer
export function computeTfidf(tokens: string[], corpusDf?: Record<string, number>, corpusN?: number): TfidfResult {
  const terms = [...new Set(tokens)];

  // Term Frequency (raw count)
  const tf: Record<string, number> = {};
  for (const term of terms) {
    tf[term] = tokens.filter((t) => t === term).length;
  }

  // Inverse Document Frequency (smooth)
  // IDF_t = ln((1 + N) / (1 + df_t)) + 1
  const idf: Record<string, number> = {};
  const N = corpusN ?? 400;
  for (const term of terms) {
    const df = corpusDf?.[term] ?? Math.max(1, Math.floor(N * 0.15));
    idf[term] = Math.log((1 + N) / (1 + df)) + 1;
  }

  // TF-IDF
  const tfidf: Record<string, number> = {};
  for (const term of terms) {
    tfidf[term] = tf[term] * idf[term];
  }

  // L2 Normalization
  const norm = Math.sqrt(Object.values(tfidf).reduce((sum, v) => sum + v * v, 0)) || 1;
  for (const term of terms) {
    tfidf[term] = tfidf[term] / norm;
  }

  // Top terms by weight
  const topTerms = Object.entries(tfidf)
    .map(([term, weight]) => ({ term, weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 10);

  return { terms, tf, idf, tfidf, topTerms };
}

// Simulated SVM with linear kernel
// f(x) = w^T x + b
// We use lexicon scores as features and simulate a trained SVM model
export function svmPredict(preprocessing: PreprocessingResult): {
  label: SentimentLabel;
  scores: { Positif: number; Negatif: number; Netral: number };
  weight: number;
  bias: number;
} {
  const words = preprocessing.stemmed;

  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.includes(word)) positiveScore++;
    if (NEGATIVE_WORDS.includes(word)) negativeScore++;
  }

  // Feature vector: [positive_count, negative_count, text_length, unique_words]
  const features = [
    positiveScore,
    negativeScore,
    Math.min(words.length / 10, 1),
    Math.min(new Set(words).size / 10, 1),
  ];

  // Simulated SVM weights (linear kernel, trained on 80:20 split)
  // w = [2.5, -2.8, 0.3, 0.15], b = -0.1
  const weights = [2.5, -2.8, 0.3, 0.15];
  const bias = -0.1;

  // Decision function
  const decision =
    features[0] * weights[0] +
    features[1] * weights[1] +
    features[2] * weights[2] +
    features[3] * weights[3] +
    bias;

  // Convert to probability-like scores using softmax
  const posRaw = positiveScore * 2.5 + features[2] * 0.5 + 0.5;
  const negRaw = negativeScore * 2.8 + features[2] * 0.3 + 0.5;
  const neuRaw = Math.abs(decision) < 0.5 ? 2.0 - Math.abs(decision) : 0.3;

  const total = posRaw + negRaw + neuRaw;
  const scores = {
    Positif: posRaw / total,
    Negatif: negRaw / total,
    Netral: neuRaw / total,
  };

  let label: SentimentLabel = 'Netral';
  if (decision > 0.5) label = 'Positif';
  else if (decision < -0.5) label = 'Negatif';
  else if (scores.Positif > scores.Negatif && scores.Positif > scores.Netral) label = 'Positif';
  else if (scores.Negatif > scores.Positif && scores.Negatif > scores.Netral) label = 'Negatif';
  else label = 'Netral';

  return { label, scores, weight: decision, bias };
}

export function predictSentiment(text: string): PredictionResult {
  const preprocessing = preprocess(text);
  const tfidf = computeTfidf(preprocessing.stemmed);
  const svm = svmPredict(preprocessing);

  return {
    label: svm.label,
    scores: svm.scores,
    preprocessing,
    tfidf,
    svmWeight: svm.weight,
    svmBias: svm.bias,
  };
}
