import React from 'react';
import Spinner from "./Spinner";

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    width?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string | number;
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

function Table<T>({
                      columns,
                      data,
                      keyExtractor,
                      onRowClick,
                      isLoading = false,
                      emptyMessage = 'No data available',
                  }: TableProps<T>) {
    const renderCell = (item: T, column: Column<T>) => {
        if (typeof column.accessor === 'function') {
            return column.accessor(item);
        }
        return item[column.accessor] as React.ReactNode;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#E9EDC9]">
                <tr>
                    {columns.map((column, index) => (
                        <th
                            key={index}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-[#CCD5AE] uppercase tracking-wider"
                            style={column.width ? { width: column.width } : undefined}
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                    <tr>
                        <td colSpan={columns.length} className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                                <Spinner size="md" />
                            </div>
                        </td>
                    </tr>
                ) : data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} className="px-6 py-4 text-center text-[#CCD5AE]">
                            {emptyMessage}
                        </td>
                    </tr>
                ) : (
                    data.map((item) => (
                        <tr
                            key={keyExtractor(item)}
                            className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                            onClick={() => onRowClick && onRowClick(item)}
                        >
                            {columns.map((column, index) => (
                                <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {renderCell(item, column)}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;