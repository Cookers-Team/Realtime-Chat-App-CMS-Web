import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import Pagination from "./Pagination";

const Table = ({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="p-4 text-center">#</th>
            {columns.map((col: any) => (
              <th key={col.accessor} className={`p-4 text-${col.align}`}>
                {col.label}
              </th>
            ))}
            <th className="p-4 text-center whitespace-nowrap">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 font-light">
          {data.map((item: any, index: any) => (
            <tr
              key={item.id || index}
              className="border-b hover:bg-blue-100 transition-colors duration-200"
            >
              <td className="p-4 text-center">{index + 1}</td>
              {columns.map((col: any) => (
                <td key={col.accessor} className={`p-4 text-${col.align}`}>
                  {col.render ? col.render(item) : item[col.accessor]}
                </td>
              ))}
              <td className="p-4 text-center">
                <div className="flex justify-center space-x-2">
                  {onView && (
                    <button
                      className="text-green-500 p-1"
                      onClick={() => onView(item.id)}
                    >
                      <EyeIcon size={16} />
                    </button>
                  )}
                  {onEdit && (
                    <button
                      className="text-blue-500 p-1"
                      onClick={() => onEdit(item.id)}
                    >
                      <PencilIcon size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="text-red-500 p-1"
                      onClick={() => onDelete(item.id)}
                    >
                      <TrashIcon size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Table;
