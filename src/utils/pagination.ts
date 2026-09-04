export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
};

type NormalizePaginationOptions = {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
};

export const normalizePagination = (
  page: number,
  limit: number,
  options: NormalizePaginationOptions = {},
) => {
  const defaultPage = options.defaultPage ?? 1;
  const defaultLimit = options.defaultLimit ?? 10;

  const safePage = Number.isInteger(page) && page > 0 ? page : defaultPage;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : defaultLimit;
  const cappedLimit =
    options.maxLimit && safeLimit > options.maxLimit
      ? options.maxLimit
      : safeLimit;

  return {
    page: safePage,
    limit: cappedLimit,
  };
};

export const parsePaginationParams = (
  searchParams: URLSearchParams,
  options?: NormalizePaginationOptions,
) => {
  const pageParam = Number(
    searchParams.get("page") ?? options?.defaultPage ?? 1,
  );
  const limitParam = Number(
    searchParams.get("limit") ?? options?.defaultLimit ?? 10,
  );

  return normalizePagination(pageParam, limitParam, options);
};

export const buildPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / limit);

  if (totalPages === 0) {
    return {
      page,
      limit,
      totalItems,
      totalPages,
      nextPage: null,
      prevPage: null,
    };
  }

  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? Math.min(page - 1, totalPages) : null;

  return {
    page,
    limit,
    totalItems,
    totalPages,
    nextPage,
    prevPage,
  };
};

export const paginateArray = <T>(items: T[], page: number, limit: number) => {
  const normalized = normalizePagination(page, limit);
  const startIndex = (normalized.page - 1) * normalized.limit;
  const data = items.slice(startIndex, startIndex + normalized.limit);
  const pagination = buildPaginationMeta(
    items.length,
    normalized.page,
    normalized.limit,
  );

  return {
    data,
    pagination,
  };
};
