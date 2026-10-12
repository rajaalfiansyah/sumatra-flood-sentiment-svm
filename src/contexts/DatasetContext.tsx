import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { generateDataset, getDatasetStats, type RawTweet } from '@/lib/dataset';
import { lexiconLabel, preprocess, type SentimentLabel } from '@/lib/nlp';

interface DatasetState {
  dataset: RawTweet[];
  stats: { total: number; positif: number; negatif: number; netral: number };
  runAutoLabeling: () => void;
  updateLabel: (id: string, label: SentimentLabel) => void;
  deleteRow: (id: string) => void;
  addRows: (rows: RawTweet[]) => void;
  replaceDataset: (rows: RawTweet[]) => void;
}

const DatasetContext = createContext<DatasetState | undefined>(undefined);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<RawTweet[]>(() => {
    const raw = generateDataset();
    // Compute cleaned tweet for each record
    return raw.map((row) => ({
      ...row,
      cleanedTweet: preprocess(row.isiTweet).finalText,
    }));
  });

  const stats = getDatasetStats(dataset);

  const runAutoLabeling = useCallback(() => {
    setDataset((prev) =>
      prev.map((row) => ({
        ...row,
        label: lexiconLabel(row.isiTweet),
        cleanedTweet: preprocess(row.isiTweet).finalText,
      }))
    );
  }, []);

  const updateLabel = useCallback((id: string, label: SentimentLabel) => {
    setDataset((prev) => prev.map((row) => (row.id === id ? { ...row, label } : row)));
  }, []);

  const deleteRow = useCallback((id: string) => {
    setDataset((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const addRows = useCallback((rows: RawTweet[]) => {
    setDataset((prev) => {
      const processed = rows.map((row) => ({
        ...row,
        cleanedTweet: preprocess(row.isiTweet).finalText,
        label: lexiconLabel(row.isiTweet),
      }));
      return [...prev, ...processed];
    });
  }, []);

  const replaceDataset = useCallback((rows: RawTweet[]) => {
    const processed = rows.map((row) => ({
      ...row,
      cleanedTweet: preprocess(row.isiTweet).finalText,
      label: lexiconLabel(row.isiTweet),
    }));
    setDataset(processed);
  }, []);

  return (
    <DatasetContext.Provider
      value={{ dataset, stats, runAutoLabeling, updateLabel, deleteRow, addRows, replaceDataset }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDataset() {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error('useDataset must be used within DatasetProvider');
  return ctx;
}
