const Table = ({ headers, data, renderRow, className = "" }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((item, index) => (
            <tr
              key={index}
              className="transition-colors duration-200 hover:bg-slate-50"
            >
              {renderRow(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
