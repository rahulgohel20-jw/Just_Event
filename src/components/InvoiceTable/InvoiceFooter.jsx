import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Select, Radio, Input } from "antd";

const { TextArea } = Input;

const InvoiceFooter = () => {
  const [taxType, setTaxType] = useState("TDS");

  return (
    <div className="space-y-4 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1 text-[#464E5F]">
            Customers Notes<span className="text-red-500">*</span>
          </label>
          <TextArea
            placeholder="Thanks for your Business..."
            autoSize={{ minRows: 7 }}
            className="border rounded-lg border-[#BB8A5C]"
          />
        </div>

        <div className=" shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] border rounded-lg p-4">
          <label className="block font-semibold mb-2">Total Amount</label>
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-10 mb-2">
              <Radio.Group
                value={taxType}
                onChange={(e) => setTaxType(e.target.value)}
              >
                <Radio value="TDS">TDS</Radio>
                <Radio value="TCS">TCS</Radio>
              </Radio.Group>
              <Select
                placeholder="Select Tax"
                className="w-32"
                options={[
                  { value: "gst5", label: "GST 5%" },
                  { value: "gst12", label: "GST 12%" },
                ]}
              />
            </div>
            <span className="font-semibold">0.0</span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span>Adjustment Amount</span>
              <Input className="w-28 text-right" defaultValue="0.0" />
            </div>
            <span className="font-semibold">0.0</span>
          </div>

          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Total Amount</span>
            <span>0.0</span>
          </div>
        </div>
      </div>

      <div className="p-4 mt-5 flex items-center justify-between gap-8 w-fit shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] rounded-lg bg-white">
        <div className="w-full">
          <label className="block font-semibold mb-1">
            Terms & Conditions<span className="text-red-500">*</span>
          </label>
          <div className="border rounded-lg p-3 whitespace-pre-line w-[400px] text-sm border-[#AB7955]">
            HDFC BANK
            {"\n"}AC NO. :- 50200013422306
            {"\n"}BRANCH :- DARPAN SIX ROAD
            {"\n"}IFSC CODE :- HDFC0001678
            {"\n"}AC NAME :- SHREE INFOTECH
          </div>
        </div>

        <div className="flex flex-col gap-12 w-full">
          <div>
            <label className="block font-semibold mb-1">
              Attach File(s) to Invoice
            </label>
            <Button
              icon={<UploadOutlined />}
              className="mb-1 border-[#AB7955] text-[#AB7955]"
            >
              Upload File
            </Button>
            <p className="text-xs   text-[#AB7955]">
              you can upload maximum 10mb file
            </p>
          </div>

          <div className="flex  gap-8">
            <Button className="bg-[#689F4E] text-white rounded-lg hover:bg-green-600">
              Save as Draft
            </Button>
            <Button className="bg-[#96644D] text-white rounded-lg hover:bg-[#6b460e]">
              Save & Send
            </Button>
            <Button className="border border-[#AB7955] rounded-lg text-[#AB7955]">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;
