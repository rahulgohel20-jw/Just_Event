import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

const TaskTemplatePage = () => {
  const itemList = [
    {
      id: "1",
      template: "Task Template 1",
      template_description: "Description for task template 1",
    },
    {
      id: "2",
      template: "Task Template 2",
      template_description: "Description for task template 2",
    },
    {
      id: "3",
      template: "Task Template 3",
      template_description: "Description for task template 3",
    },
    {
      id: "4",
      template: "Task Template 4",
      template_description: "Description for task template 4",
    },
    {
      id: "5",
      template: "Task Template 5",
      template_description: "Description for task template 4",
    },
    {
      id: "6",
      template: "Task Template 6",
      template_description: "Description for task template 4",
    },
  ];

  const renderItem = (item) => {
    return (
      <div
        className="p-5 card"
        key={item.id}
      >
        <h4>Template Title</h4>
        <h4>{item.title}</h4>
        <small>{item.template_description}</small>
      </div>
    );
  };
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Tasks Template" }]} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {itemList && itemList.map((item, index) => renderItem(item))}
           <a href="#" className="p-5 card flex items-center justify-center border-2 border-dashed border-primary/10 bg-center bg-[length:600px] bg-no-repeat add-new-bg">
            <h4>Add New Template</h4>
          </a>
        </div>
      </Container>
    </Fragment>
  );
};
export { TaskTemplatePage };
