import React from 'react';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import { ExecutedQuery } from '../hooks/useExecutedQueries';

import SimpleKustoCodeBlock from './SimpleKustoCodeBlock';

interface CodeBlockTableRow {
  id: number;
  code: string;
  lastExecution: string;
}
const columns: GridColDef<CodeBlockTableRow>[] = [
  {
    field: 'code',
    headerName: 'CODE',
    flex: 1,
    renderCell: (params) => (
      <SimpleKustoCodeBlock code={params.row.code} showLineNumbers={true} />
    ),
  },
  { field: 'lastExecution', headerName: 'Last Used', width: 200 },
  { field: 'id' },
];

const paginationModel = { page: 0, pageSize: 10 };

interface CodeBlockTableProps {
  executedQueries?: ExecutedQuery[];
}

const CodeBlockTable: React.FC<CodeBlockTableProps> = ({
  executedQueries = [],
}) => {
  const rows = executedQueries.map((executedQuery: ExecutedQuery, index) => {
    return {
      id: index,
      code: executedQuery.query,
      lastExecution: executedQuery.lastExecution || 'N/A',
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
        // checkboxSelection
        sx={{ border: 0 }}
        columnVisibilityModel={{
          id: false,
        }}
      />
    </Paper>
  );
};

export default CodeBlockTable;
