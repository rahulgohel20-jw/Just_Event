import React, { Fragment, useState } from "react";
import {
  Info as InfoIcon,
  Settings as FunctionsIcon,
  Utensils as MealIcon,
} from "lucide-react";
import dayjs from 'dayjs';
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import StepsComponent from "@/components/StepsComponents";
import EventBasicInfoStep from "@/container/EventStepsContainer/EventBasicInfoStep";
import FunctionsStep from "@/container/EventStepsContainer/FunctionsStep";
import MealAndNoteStep from "@/container/EventStepsContainer/MealAndNoteStep";
import OtherInfoStep from "@/container/EventStepsContainer/OtherInfoStep";
import { requiredFields } from "./constant";
import { useLocation } from "react-router";

const CreateEventPage = () => {
const location = useLocation();
  const { event_date } = location.state || {};
  
  const [formData, setFormData] = useState({...requiredFields.basic_info, event_date: event_date ? event_date : '',
    meeting_date: dayjs().format('YYYY-MM-DD')
  });
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    const nextStep = current + 1;
    switch (nextStep) {
      case 1:
        setFormData({ ...formData, ...requiredFields.functions });
        break;
      case 2:
        setFormData({ ...formData, ...requiredFields.meal });
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
  };

  const handleInputChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const steps = () => [
    {
      title: "Basic Information",
      content: (
        <EventBasicInfoStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
        />
      ),
      icon: <i className="ki-filled ki-security-user"></i>,
    },
    {
      title: "Functions",
      content: (
        <FunctionsStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
        />
      ),
      icon: <i className="ki-filled ki-setting-4"></i>,
    },
    {
      title: "Meal Type & Notes",
      content: (
        <MealAndNoteStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
        />
      ),
      icon: <i className="ki-filled ki-note-2"></i>,
    },
    {
      title: "Other Details",
      content: (
        <OtherInfoStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
        />
      ),
      icon: <i className="ki-filled ki-information-4"></i>,
    },
  ];
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Create Event" }]} />
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
