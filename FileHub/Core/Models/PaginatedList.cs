namespace Application.Models
{
    public class PaginatedList<T> : List<T>
    {
        public int PageIndex { get; private set; }
        public int TotalPages { get; private set; }
        public int TotalCount { get; private set; }
        public int PageSize { get; private set; }

        public PaginatedList(List<T> items, int count, int pageIndex, int pageSize)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            TotalCount = count;
            AddRange(items);
        }

        public bool HasPreviousPage => PageIndex > 1;
        public bool HasNextPage => PageIndex < TotalPages;
    }

    public class PaginationParams
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class InfiniteScrollList<T>
    {
        public List<T> Items { get; set; }
        public bool HasMore { get; set; }
        public DateTime? NextTimestamp { get; set; }

        public InfiniteScrollList(List<T> items, bool hasMore, DateTime? nextTimestamp)
        {
            Items = items;
            HasMore = hasMore;
            NextTimestamp = nextTimestamp;
        }
    }
}
