import { Input, Select, Button, Form } from "antd";
import "antd/dist/reset.css";
import { toAbsoluteUrl } from "@/utils";
import { SelectDropdown } from "@/components/form-components/SelectDropdown";
import { useState } from "react";
const { Option } = Select;
const { TextArea } = Input;

export default function ProfileForm({ value, onChange, ...rest }) {
  const [selectedCompanies, setSelectedCompanies] = useState(value || []);
  const [form] = Form.useForm();
  const handleChange = (event) => {
    setSelectedCompanies(event.target.value);
    onChange(event);
  };

  const onFinish = (values) => {
    console.log("Form Values:", values);
  };

  return (
    <div className=" bg-white rounded-lg shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)]">
      <div className="relative">
        <div className="h-28 bg-[#A57353] rounded-t-lg"></div>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-10">
          <img
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
            src={toAbsoluteUrl("/images/user_img.jpg")}
            alt=""
          />
        </div>
      </div>

      <div className="pt-16 p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={
                <span>
                  First Name <span className="text-red-500">*</span>
                </span>
              }
              name="firstName"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
            >
              <Input className="p-2" />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Last Name <span className="text-red-500">*</span>
                </span>
              }
              name="lastName"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
            >
              <Input className="p-2" />
            </Form.Item>
          </div>

          <Form.Item
            label={
              <span>
                Email ID <span className="text-red-500">*</span>
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input className="p-2" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={
                <span>
                  Phone Number <span className="text-red-500">*</span>
                </span>
              }
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input className="p-2" />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Country <span className="text-red-500">*</span>
                </span>
              }
              name="country"
              rules={[{ required: true, message: "Please select a country" }]}
            >
              <SelectDropdown
                value={selectedCompanies}
                onChange={handleChange}
                staticOptions={[
                  { label: "Wedding", value: "Wedding" },
                  { label: "Pool Party", value: "PoolParty" },
                  { label: "Sangeet", value: "Sangeet" },
                ]}
                mode="multiple"
                placeholder={"Please select"}
                {...rest}
              />
            </Form.Item>
          </div>

          <Form.Item
            label={
              <span>
                Permitted ID <span className="text-red-500">*</span>
              </span>
            }
            name="permittedId"
            rules={[{ required: true, message: "Please enter permitted ID" }]}
          >
            <Input className="p-2" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Bio <span className="text-red-500">*</span>
              </span>
            }
            name="bio"
            rules={[{ required: true, message: "Please enter your bio" }]}
          >
            <TextArea
              rows={4}
              placeholder="Passionate event manager with over 10 years of experience in creating memorable experiences."
            />
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
