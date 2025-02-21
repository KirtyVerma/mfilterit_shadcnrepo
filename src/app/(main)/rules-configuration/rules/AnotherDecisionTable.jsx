import React, { useState } from "react";
import { Row, Col, Select, Input, Button, Divider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const DecisionTable = () => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      conditions: [{ id: 1, property: "", operator: "", value: "" }],
    },
  ]);

  const addGroup = () => {
    setGroups([
      ...groups,
      {
        id: groups.length + 1,
        conditions: [{ id: 1, property: "", operator: "", value: "" }],
      },
    ]);
  };

  const addCondition = (groupId) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: [
                ...group.conditions,
                { id: group.conditions.length + 1, property: "", operator: "", value: "" },
              ],
            }
          : group
      )
    );
  };

  const removeCondition = (groupId, conditionId) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.filter(
                (condition) => condition.id !== conditionId
              ),
            }
          : group
      )
    );
  };

  const updateCondition = (groupId, conditionId, field, value) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((condition) =>
                condition.id === conditionId
                  ? { ...condition, [field]: value }
                  : condition
              ),
            }
          : group
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Decision Table</h2>
      <Row gutter={16}>
        {groups.map((group) => (
          <Col key={group.id} style={{ marginBottom: "20px", border: "1px solid #d9d9d9", padding: "10px" }}>
            <h3>Group {group.id}</h3>
            {group.conditions.map((condition) => (
              <Row key={condition.id} gutter={8} align="middle" style={{ marginBottom: "10px" }}>
                <Col>
                  <Select
                    placeholder="Property"
                    style={{ width: 120 }}
                    onChange={(value) =>
                      updateCondition(group.id, condition.id, "property", value)
                    }
                  >
                    <Option value="Property1">Property1</Option>
                    <Option value="Property2">Property2</Option>
                  </Select>
                </Col>
                <Col>
                  <Select
                    placeholder="Operator"
                    style={{ width: 100 }}
                    onChange={(value) =>
                      updateCondition(group.id, condition.id, "operator", value)
                    }
                  >
                    <Option value="Equals">Equals</Option>
                    <Option value="NotEquals">Not Equals</Option>
                  </Select>
                </Col>
                <Col>
                  <Input
                    placeholder="Value"
                    style={{ width: 150 }}
                    onChange={(e) =>
                      updateCondition(group.id, condition.id, "value", e.target.value)
                    }
                  />
                </Col>
                <Col>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeCondition(group.id, condition.id)}
                  />
                </Col>
              </Row>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => addCondition(group.id)}
              style={{ width: "100%" }}
            >
              Add Condition
            </Button>
          </Col>
        ))}
      </Row>
      <Divider />
      <Button type="primary" onClick={addGroup}>
        Add Group
      </Button>
    </div>
  );
};

export default DecisionTable;
