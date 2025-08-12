import React, { Fragment, useState } from "react";
import dayjs from "dayjs";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import StepsComponent from "@/components/StepsComponents";
import EventDetailsStep from "@/container/EventStepsContainer/EventDetailsStep";
import FunctionsStep from "@/container/EventStepsContainer/FunctionsStep";
import ClientDetailsStep from "@/container/EventStepsContainer/ClientDetailsStep";
import OtherInfoStep from "@/container/EventStepsContainer/OtherInfoStep";
import { requiredFields } from "./constant";
import { useLocation } from "react-router";
import { toAbsoluteUrl } from "@/utils";
import { useNavigate } from "react-router-dom";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { event_date } = location.state || {};

  const [formData, setFormData] = useState({
    ...requiredFields.basic_info,
    event_date: event_date ? event_date : "",
    meeting_date: dayjs().format("YYYY-MM-DD"),
  });
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    const nextStep = current + 1;
    switch (nextStep) {
      case 1:
        setFormData({ ...formData, ...requiredFields.client_info });
        break;
      case 2:
        setFormData({ ...formData, ...requiredFields.functions });
        break;
      default:
        break;
    }
    setCurrent(nextStep);
  };
  const handlePrev = () => {
    setCurrent(current - 1);
  };
  const handleFinish = () => {
    // Handle form submission logic here
    console.log("Form submitted with data:", formData);
    // Reset form or redirect as needed
    setFormData(requiredFields.basic_info);
    setCurrent(0);
    navigate("/event-overview");
  };

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [fieldName || e.target.name]: value,
    }));
  };

  const stepData = [
    {
      title: "Event Details",
      content: (
        <EventDetailsStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
        />
      ),
      icon: (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FDE7C5]">
          <img
            src={toAbsoluteUrl("/media/steps-image/event.png")}
            alt="event"
            className="w-8 h-8 "
          />
        </div>
      ),
    },
    {
      title: "Client Details",
      content: (
        <ClientDetailsStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
        />
      ),
      icon: (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FDE7C5]">
          <img
            src={toAbsoluteUrl("/media/steps-image/client.png")}
            alt="event"
            className="w-8 h-8"
          />
        </div>
      ),
    },
    {
      title: "Function Details",
      content: (
        <FunctionsStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
        />
      ),
      icon: (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FDE7C5]">
          <img
            src={toAbsoluteUrl("/media/steps-image/function.png")}
            alt="event"
            className="w-8 h-8"
          />
        </div>
      ),
    },
    {
      title: "Other Informations",
      content: (
        <OtherInfoStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
        />
      ),
      icon: (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FDE7C5]">
          <img
            src={toAbsoluteUrl("/media/steps-image/other.png")}
            alt="event"
            className="w-8 h-8"
          />
        </div>
      ),
    },
  ];
  const steps = () => stepData;
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: stepData[current]?.title || "Event Details",
                subTitle:
                  "Keep your Event planning seamless from start to finish!",
              },
            ]}
          />
        </div>
        <StepsComponent
          direction="vertical"
          // direction="horizontal"
          current={current}
          steps={steps()}
          onNext={handleNext}
          onPrev={handlePrev}
          onFinish={handleFinish}
        />
      </Container>
    </Fragment>
  );
};
export default CreateEventPage;
