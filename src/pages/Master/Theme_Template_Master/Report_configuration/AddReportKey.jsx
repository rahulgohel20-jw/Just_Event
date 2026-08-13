// AddReportKey.jsx
import React, { useEffect, useState } from "react";
import { Form, Input, Switch } from "antd";
import { addupadtereportkey } from "@/services/apiServices"; // <-- rename to your real create/update API
import { CustomModal } from "../../../../components/custom-modal/CustomModal";
import { showApiResult, showApiError } from "../../../../utils/swalHelpers"; // adjust path

const initialValues = {
  name: "",
  defaultValue: true,
};

export function AddReportKey({ open, onClose, onSave, editingRow }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // reactive — re-renders whenever the "defaultValue" field changes
  const defaultValueWatch = Form.useWatch("defaultValue", form);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (editingRow) {
        form.setFieldsValue({
          name: editingRow.name,
          defaultValue: editingRow.defaultValue,
        });
      }
    }
  }, [open, editingRow, form]);

  const handleFinish = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        id: editingRow?.id ?? null,
        name: values.name,
        defaultValue: values.defaultValue,
      };
      const res = await addupadtereportkey(payload);

      const isSuccess = showApiResult(res, {
        fallbackSuccess: "Report Key saved successfully.",
        fallbackError: "Failed to save report key.",
        onSuccess: () => {
          // API returns the full updated list — hand it straight to the parent
          onSave?.(Array.isArray(res?.data?.data) ? res.data.data : []);
          form.resetFields();
        },
      });

      if (!isSuccess) return; // keep modal open so the user can fix and retry
    } catch (err) {
      showApiError(err, { fallback: "Failed to save report key." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={editingRow ? "Edit Report Key" : "Add Report Key"}
      centered
      width={380}
      footer={
        <div className="flex justify-end gap-2 px-4 pb-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-primary-clarity text-dark text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => form.submit()}
            disabled={submitting}
            className="px-3.5 py-1.5 rounded-lg bg-primary text-light text-sm font-medium disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
        className="px-4 pt-3"
      >
        <Form.Item
          label="Report Key Name"
          name="name"
          className="mb-3"
          rules={[{ required: true, message: "Please enter report key name" }]}
        >
          <Input placeholder="Enter report key name" size="middle" autoFocus />
        </Form.Item>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-dark">Default Value</span>
          <Switch
            checked={!!defaultValueWatch}
            onChange={(checked) => form.setFieldValue("defaultValue", checked)}
          />
        </div>
        {/* keep the field registered with the form even though the Switch above is unmounted from Form.Item */}
        <Form.Item name="defaultValue" hidden>
          <Input />
        </Form.Item>
      </Form>
    </CustomModal>
  );
}