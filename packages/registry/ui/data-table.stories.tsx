import type { Meta, StoryObj } from "@storybook/react";

import { DataTable, type DataTableColumn } from "./data-table.js";

interface Row {
  id: string;
  name: string;
  qty: number;
}

const columns: DataTableColumn<Row>[] = [
  { cell: (row) => row.name, header: "Name", id: "name" },
  {
    cell: (row) => row.qty,
    className: "text-right",
    header: "Quantity",
    id: "qty",
  },
];

const rows: Row[] = [
  { id: "a", name: "Widget", qty: 12 },
  { id: "b", name: "Gadget", qty: 3 },
];

const meta: Meta<typeof DataTable<Row>> = {
  component: DataTable<Row>,
  title: "registry/ui/DataTable",
};
export default meta;

type Story = StoryObj<typeof DataTable<Row>>;

export const Default: Story = {
  args: { columns, getRowId: (row) => row.id, rows },
};

export const Empty: Story = {
  args: {
    columns,
    empty: <p className="text-sm">No rows yet.</p>,
    getRowId: (row) => row.id,
    rows: [],
  },
};
