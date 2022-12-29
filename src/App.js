import { Button, Form, Input, Popconfirm, Table, Select } from "antd";
import "./App.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRation } from "./queries";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {dataIndex === "packet_type" ? (
          <Select
            onBlur={save}
            ref={inputRef}
            defaultValue="Food"
            style={{
              width: 120,
            }}
            // onChange={handleChange}
          >
            <Select.Option value="Food">Food</Select.Option>
            <Select.Option value="Water">Water</Select.Option>
          </Select>
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          height: 30,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const App = () => {
  const counter = useSelector((state) => state.counter);
  const ration = useRation("get");
  console.log("ration", ration);
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);

  const defaultColumns = [
    {
      title: "Packet Id",
      dataIndex: "_id",
      width: "5%",
      editable: true,
    },
    {
      title: "Packet Type",
      dataIndex: "packetType",
      editable: true,
      width: "10%",
    },
    {
      title: "Packet Content",
      dataIndex: "packetContent",
      // width: "30%",
      editable: true,
    },
    {
      title: "Calories",
      dataIndex: "qty",
      width: "10%",
      editable: true,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      editable: true,
      width: "15%",
    },
    {
      title: "Quantity in Litres ",
      dataIndex: "quantity",
      editable: true,
      width: "5%",
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: "5%",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button>Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleAdd = () => {
    const newData = {
      key: count,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className="flex items-center border justify-center w-full h-screen">
      <div>
        <Button
          onClick={handleAdd}
          // onClick={() => ration("get")}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={ration.data}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default App;
