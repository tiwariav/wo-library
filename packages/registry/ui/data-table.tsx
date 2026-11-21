/* eslint-disable sonarjs/prefer-read-only-props -- props interfaces are already immutable shapes */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  empty?: ReactNode;
  className?: string;
}

/** Minimal typed data table. */
export function DataTable<T>({
  className,
  columns,
  empty,
  getRowId,
  rows,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <>{empty ?? null}</>;
  }
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left text-sm text-primary">
        <thead>
          <tr className="border-b border-primary/20">
            {columns.map((column) => (
              <th
                className={cn("px-3 py-2 font-medium", column.className)}
                key={column.id}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-b border-primary/10" key={getRowId(row)}>
              {columns.map((column) => (
                <td
                  className={cn("px-3 py-2", column.className)}
                  key={column.id}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
