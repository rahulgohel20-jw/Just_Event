import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import TabComponent from "@/components/tab/TabComponent";
import { AllTasks } from "@/container/tasks";

const TaskListPage = () => {
  const tabs = [
    {
      value: "all",
      label: (
        <>
          <i className="ki-filled ki-abstract-16"></i>
          All Tasks
        </>
      ),
      children: <AllTasks />,
    },
    {
      value: "my",
      label: (
        <>
          <i className="ki-filled ki-check-squared"></i>
          My Tasks
        </>
      ),
      children: <AllTasks />,
    },
    {
      value: "assigned_by_me",
      label: (
        <>
          <i className="ki-filled ki-user-tick"></i>
          Assigned by Me
        </>
      ),
      children: <AllTasks />,
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Manage Tasks" }]} />
        </div>
        <TabComponent tabs={tabs} />
      </Container>
    </Fragment>
  );
};
export { TaskListPage };
