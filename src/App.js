import { Button, Table, Dropdown } from "antd";
import "./App.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRation } from "./queries";
import { DashOutlined } from "@ant-design/icons";
import { EditableCell, EditableRow } from "./table/ModifyTable";
import RationTable from "./table/RationTable";

const App = () => {
  // const counter = useSelector((state) => state.counter);
  const ration = useRation("get");
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setDataSource(ration.data);
  }, [ration.data]);

  const defaultColumns = [
    {
      key: "_id",
      title: "Packet Id",
      dataIndex: "_id",
      width: "5%",
    },
    {
      key: "packetType",
      title: "Packet Type",
      dataIndex: "packetType",
      editable: true,
      width: "10%",
    },
    {
      key: "packetContent",
      title: "Packet Content",
      dataIndex: "packetContent",
      width: "35%",
      editable: true,
    },
    {
      key: "qty",
      title: "Calories",
      dataIndex: "qty",
      width: "10%",
      editable: true,
    },
    {
      key: "expiry_date",
      title: "Expiry Date",
      dataIndex: "expiry_date",
      editable: true,
      width: "30%",
    },
    {
      key: "quantity",
      title: "Quantity in Litres ",
      dataIndex: "quantity",
      editable: true,
      width: "5%",
    },
    {
      key: "operation",
      title: "operation",
      dataIndex: "operation",
      width: "5%",
      render: (_, record) =>
        ration.data.length >= 1 ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: <a onClick={(e) => e.preventDefault()}>Update</a>,
                },
                {
                  key: "2",
                  label: (
                    <a
                      style={{ color: "red" }}
                      onClick={(e) => e.preventDefault()}
                    >
                      Delete
                    </a>
                  ),
                },
              ],
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <DashOutlined style={{ marginLeft: 15, fontSize: 20 }} />
            </a>
          </Dropdown>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData = {
      key: count,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    console.log("newData", newData);
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => {
        return {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        };
      },
    };
  });

  return (
    <div className="flex items-center border justify-center w-full h-screen">
      <div>
        <div className="flex justify-between">
          <Button
            onClick={handleAdd}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Add a row
          </Button>
          <Button
            disabled
            onClick={handleSave}
            type="primary"
            style={{
              minWidth: 85,
              marginBottom: 16,
            }}
          >
            Update
          </Button>
        </div>
        <RationTable
          dataSource={structured_row(dataSource)}
          columns={columns}
          components={components}
        />
      </div>
    </div>
  );
};

export default App;

function structured_row(data) {
  return data.map((row, i) => ({ ...row, key: i }));
}

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};
