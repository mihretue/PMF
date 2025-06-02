"use client";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridValidRowModel,
  GridRowParams,
} from "@mui/x-data-grid";

// Define the props type with a generic parameter that extends GridValidRowModel
interface TableProps<T extends GridValidRowModel> {
  columns: GridColDef[];
  rows: T[];
  onRowClick?: (row: T) => void;
  getRowClassName?: (params: GridRowParams) => string;
}

// const customStyles = {
//   ".MuiDataGrid-root": {
//     width: '100% !important',
//     maxHeight: '80vh',
//     overflow: 'scroll !important',
//   },
//   ".MuiDataGrid-columnHeader .MuiDataGrid-sortIcon": {
//     color: "white",
//   },
//   ".MuiDataGrid-columnHeaders .MuiDataGrid-menuIcon": {
//     color: "white",
//   },
//   "& .MuiDataGrid-columnHeaders": {
//     fontSize: "12px",
//     "@media (min-width:600px)": {
//       fontSize: "13px",
//     },
//     "@media (min-width:960px)": {
//       fontSize: "14px",
//     },
//   },
//   " & .MuiDataGrid-cell": {
//     fontSize: "12px",
//     cursor: 'pointer',
//     "@media (min-width:600px)": {
//       fontSize: "13px",
//     },
//     "@media (min-width:960px)": {
//       fontSize: "14px",
//     },
//   },
//   ".MuiTablePagination-toolbar > *": {
//     fontSize: "12px",
//     "@media (min-width:600px)": {
//       fontSize: "13px",
//     },
//     "@media (min-width:960px)": {
//       fontSize: "14px",
//     },
//   },
//   ".MuiDataGrid-footerContainer > *": {
//     fontSize: "12px",
//     "@media (min-width:600px)": {
//       fontSize: "13px",
//     },
//     "@media (min-width:960px)": {
//       fontSize: "14px",
//     },
//   },
//   '& .MuiDataGrid-cell:focus': {
//             outline: 'none',
//           },
//           '& .MuiDataGrid-cell:focus-within': {
//             outline: 'none',
//           },
// };

const paginationModel = { page: 0, pageSize: 10 };

// Make the component generic by using <T extends GridValidRowModel> and passing T to TableProps
export default function Table<T extends GridValidRowModel>({
  columns,
  rows,
  onRowClick,
  getRowClassName,
}: TableProps<T>) {
  return (
      <DataGrid
        rows={Array.isArray(rows) ? rows : []} // Ensure it's always an array
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10]}
        pagination
        onRowClick={
          onRowClick ? (params) => onRowClick(params.row as T) : undefined
        }
        getRowClassName={getRowClassName}
        // sx={customStyles}
      />
  );
}
