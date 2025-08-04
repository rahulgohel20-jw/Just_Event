import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

const TaskDirectoryPage = () => {
  const TaskDirectoryList = [
    {
      title: "E-Commerce",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 20,
    },
    {
      title: "CRM",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 15,
    },
    {
      title: "Project Management",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 10,
    },
    {
      title: "HR Management",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 8,
    },
    {
      title: "Finance & Accounting",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 5,
    },
    {
      title: "Marketing Automation",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 12,
    },
    {
      title: "Customer Support",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 7,
    },
    {
      title: "Content Management",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 9,
    },
  ];
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Tasks Directory" }]} />
        </div>
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Directory"
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TaskDirectoryList.map((directory, index) => (
            <div key={index}>
              <img
                src={directory.image}
                alt={directory.title}
                className="w-full h-32 object-cover mx-auto mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-2 text-center">
                {directory.title}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {directory.template_count} Template
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Fragment>
  );
};
export { TaskDirectoryPage };
