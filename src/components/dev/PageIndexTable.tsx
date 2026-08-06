"use client";

import { DataGrid } from "@mui/x-data-grid";
import GuideNav from "@/components/guide/GuideNav";
import { pageIndexRows } from "@/data/pageIndex";
import { pageIndexColumns } from "./pageIndexTable.columns";

export default function PageIndexTable() {
  return (
    <section className="page-index">
      <GuideNav current="index" />
      <header className="page-index__header">
        <h1>페이지 인덱스</h1>
        <p>프로젝트 페이지·가이드 목록과 작업 상태입니다.</p>
      </header>
      <div className="page-index__grid">
        <DataGrid
          rows={pageIndexRows}
          columns={pageIndexColumns}
          disableRowSelectionOnClick
          pageSizeOptions={[pageIndexRows.length]}
          initialState={{
            pagination: { paginationModel: { pageSize: pageIndexRows.length } },
          }}
          getRowHeight={() => "auto"}
          sx={{
            "& .MuiDataGrid-cell": {
              alignItems: "flex-start",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: 13,
            },
          }}
          autoHeight
        />
      </div>
    </section>
  );
}
