import { Form, Input, Popconfirm, Select, DatePicker } from "antd";
import React, { useContext, useRef, useState, useEffect } from "react";
const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell = ({
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
        {dataIndex === "packetType" ? (
          <Select
            onBlur={save}
            ref={inputRef}
            // defaultValue="Food"
            // onChange={handleChange}
          >
            <Select.Option value="Food">Food</Select.Option>
            <Select.Option value="Water">Water</Select.Option>
          </Select>
        ) : dataIndex === "expiry_date" ? (
          // <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          <DatePicker ref={inputRef} onPressEnter={save} onBlur={save} />
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
