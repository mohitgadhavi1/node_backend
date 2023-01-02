import { Table } from "antd";
import React from "react";

function RationTable({ columns, dataSource, components }) {
  return (
    <div>
      <Table
        pagination={false}
        style={{ width: "1000px" }}
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
}

export default RationTable;
