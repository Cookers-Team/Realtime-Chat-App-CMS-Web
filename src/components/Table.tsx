import {
  CircleCheckBigIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
} from "lucide-react";
import Pagination from "./Pagination";
import NoData from "./NoData";

const Table = ({
  data,
  columns,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onReview,
  disableEditCondition,
  disableDeleteCondition,
  disableReviewCondition,
  disableViewCondition,
}: any) => {
  return (
    <div className="overflow-x-auto">
      {data.length === 0 ? (
        <NoData />
      ) : (
        <>
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
            <tbody className="text-gray-600">
              {data.map((item: any, index: any) => (
                <tr
                  key={item._id || index}
                  className="border-b hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="p-4 text-center">
                    {index + 1 + currentPage * itemsPerPage}
                  </td>
                  {columns.map((col: any) => (
                    <td key={col.accessor} className={`p-4 text-${col.align}`}>
                      {col.render ? col.render(item) : item[col.accessor]}
                    </td>
                  ))}
                  <td className="p-4 text-center">
                    <div className="flex justify-center space-x-2">
                      {onView && (
                        <button
                          className={`p-1 ${
                            disableViewCondition && disableViewCondition(item)
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-green-500"
                          }`}
                          onClick={() => onView(item._id)}
                          disabled={
                            disableViewCondition && disableViewCondition(item)
                          }
                        >
                          <EyeIcon size={16} />
                        </button>
                      )}
                      {onReview && (
                        <button
                          className={`p-1 ${
                            disableReviewCondition &&
                            disableReviewCondition(item)
                              ? "text-gray-500 cursor-not-allowed"
                              : item.status == 1
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                          onClick={() => onReview(item._id)}
                          disabled={
                            disableReviewCondition &&
                            disableReviewCondition(item)
                          }
                        >
                          {item.status == 1 ? (
                            <CircleCheckBigIcon size={16} />
                          ) : (
                            <XCircleIcon size={16} />
                          )}
                        </button>
                      )}
                      {onEdit && (
                        <button
                          className={`p-1 ${
                            disableEditCondition && disableEditCondition(item)
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-blue-500"
                          }`}
                          onClick={() =>
                            onEdit(
                              item.phone
                                ? { id: item._id, phone: item.phone }
                                : item._id
                            )
                          }
                          disabled={
                            disableEditCondition && disableEditCondition(item)
                          }
                        >
                          <PencilIcon size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className={`p-1 ${
                            disableDeleteCondition &&
                            disableDeleteCondition(item)
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-red-500"
                          }`}
                          onClick={() => onDelete(item._id)}
                          disabled={
                            disableDeleteCondition &&
                            disableDeleteCondition(item)
                          }
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
        </>
      )}
    </div>
  );
};

export default Table;
