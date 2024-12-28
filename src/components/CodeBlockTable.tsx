import React from 'react';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import SimpleKustoCodeBlock from './SimpleKustoCodeBlock';

import './styles/CodeBlockList.css';

const columns: GridColDef[] = [
  {
    field: 'code',
    headerName: 'CODE',
    width: 700,
    renderCell: (params) => (
      <SimpleKustoCodeBlock
        code={params.row.code?.query || ''}
        showLineNumbers={true}
      />
    ),
  },
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { code: {}, id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { code: {}, id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { code: {}, id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { code: {}, id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { code: {}, id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { code: {}, id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { code: {}, id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { code: {}, id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { code: {}, id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function CodeBlockTable({ codes = [] }) {
  // const modifiedRows = rows.map((row, index) => {
  //   row.code = codes[index];
  //   console.log('codes', codes);
  //   return row;
  // });

  const rows = codes.map((code, index) => {
    return {
      code: code,
      id: index,
      lastName: 'Snow',
      firstName: 'Jon',
      age: 35,
    };
  });
  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
// function CodeBlockTable({ codes = [] }) {
//   return (
//     <div className="code-block-table-container">
//       {codes.map((code, index) => (
//         <div key={index} className="code-block-table-row">
//           <div className="code-block-table-row-title"></div>
//           <SimpleKustoCodeBlock code={code.query} showLineNumbers={true} />
//           <hr />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default CodeBlockTable;

// const hasSearchTerm = (query, term) => {
//   return [query.title || '', query.query || '']
//     .map((s) => s.toLowerCase())
//     .some((s) => s.includes(term.toLowerCase()));
// };
