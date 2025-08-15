import { Input, Button, Form } from "antd";
import { LockOutlined } from "@ant-design/icons";

import "antd/dist/reset.css";

const { TextArea } = Input;

export default function Password() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form Values:", values);
  };

  return (
    <div className=" bg-white rounded-lg shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)]">
      <div className="relative">
        <div className=" p-6 h-18 flex rounded-t-lg items-center gap-3">
          <LockOutlined style={{ fontSize: "24px", color: "#555" }} />
          <span className="text-[#505050]">Change Password</span>
        </div>
        <div className="border-b"></div>
      </div>

      <div className="pt-6 p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Form.Item
            label={
              <span>
                Current Password <span className="text-red-500">*</span>
              </span>
            }
            name="Current_Password"
            rules={[
              {
                required: true,
                message: "Please enter your Current password ",
              },
              {
                type: "password",
                message: "Please enter a valid Current password",
              },
            ]}
          >
            <Input className="p-2" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                New Password <span className="text-red-500">*</span>
              </span>
            }
            name="New_Password"
            rules={[
              {
                required: true,
                message: "Please enter your New Password password ",
              },
              {
                type: "password",
                message: "Please enter a valid password",
              },
            ]}
          >
            <Input className="p-2" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Confirm Password <span className="text-red-500">*</span>
              </span>
            }
            name="Confirm_Password"
            rules={[
              {
                required: true,
                message: "Please enter your Confirm Password * ",
              },
              {
                type: "password",
                message: "Please enter a valid password",
              },
            ]}
          >
            <Input className="p-2" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="p-2 bg-green-600 hover:bg-green-700 border-none rounded-md px-8"
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
