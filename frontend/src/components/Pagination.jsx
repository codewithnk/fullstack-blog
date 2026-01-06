const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-4 py-2">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
