import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";

const EventInvoicePage = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Invoice" }]} />
        </div>
        <div
          className={`grid grid-cols-11 lg:grid-cols-11 border rounded-lg gap-4 p-4 ${classes.customStyle}`}
        >
          Invoice
        </div>
      </Container>
    </Fragment>
  );
};
export default EventInvoicePage;
