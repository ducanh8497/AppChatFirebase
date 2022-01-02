import moment from "moment";
import { Drawer } from "antd";
import { Button, Form, Input, DatePicker, Select } from "antd";

const { Option } = Select;

export const Profile = (props) => {
  const { data, onClose, visible } = props;

  const onFinish = (values) => {
    // update user
    console.log(values);
  };

  return (
    <Drawer
      title="User profile"
      placement="left"
      onClose={onClose}
      visible={visible}
    >
      {data && (
        <Form
          name="normal_login"
          className="login-form mt-4"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="name"
            hasFeedback
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="Full name" defaultValue={data?.name} />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="dateOfBirth"
            rules={[{ required: true, message: "Please input your birthday!" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              defaultValue={moment(data?.dateOfBirth, "DD/MM/YYYY")}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="gender"
            rules={[{ required: true, message: "Please select gender!" }]}
          >
            <Select
              placeholder="Select your gender"
              defaultValue={data?.gender}
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item hasFeedback name="email">
            <Input placeholder="Email" defaultValue={data?.email} disabled />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button w-100 text-uppercase"
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};
