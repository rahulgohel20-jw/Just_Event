import { Fragment } from "react";

import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import BrideGroomCard from "@/components/EventOverView/BrideGroomCard";
import EventInformationCard from "@/components/EventOverView/EventInformationCard";
import GuestsCard from "@/components/EventOverView/GuestsCard";
import ChecklistProgress from "@/components/EventOverView/ChecklistProgress";
import Estimatechart from "../../../components/EventOverView/Estimatechart";
import EventItinerary from "../../../components/EventOverView/EventItinerary";
const EventOverviewPage = () => {
  return (
    <Fragment>
      <Container>
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: "Overview",
                subTitle:
                  "Keep your Event planning seamless from start to finish!",
              },
            ]}
          />
        </div>
        <div>
          <BrideGroomCard />
        </div>
        <div className="mt-6">
          <EventInformationCard />
        </div>
        <div className="mt-6">
          <GuestsCard />
        </div>
        <div className="mt-6">
          <ChecklistProgress />
        </div>
        <div className="mt-6">
          <Estimatechart />
        </div>
        <div className="mt-6">
          <EventItinerary />
        </div>
      </Container>
    </Fragment>
  );
};

export { EventOverviewPage };
