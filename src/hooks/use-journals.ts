import { JournalService } from "@/services/journal.service";
import { useQuery } from "@tanstack/react-query";

export const JOURNAL_QUERY_KEYS = {
  all: ["journals"] as const,
  byStandard: (standardId: string) => [...JOURNAL_QUERY_KEYS.all, "standard", standardId] as const,
};

export const useJournals = (standardId?: string) => {
  return useQuery({
    queryKey: standardId ? JOURNAL_QUERY_KEYS.byStandard(standardId) : JOURNAL_QUERY_KEYS.all,
    queryFn: () => JournalService.getJournals(standardId),
    select: (res: any) => res.data,
  });
};

export const useJournalByStandardId = (standardId: string) => {
  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.byStandard(standardId),
    queryFn: () => JournalService.getJournalByStandardId(standardId),
    enabled: Boolean(standardId),
    select: (res: any) => res.data,
  });
};
