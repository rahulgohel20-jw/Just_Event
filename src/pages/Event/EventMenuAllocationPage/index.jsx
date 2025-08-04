import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Input, DatePicker, Radio, Select, Button, Table } from "antd";
import dayjs from "dayjs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import useStyles from "./style";

const EventMenuAllocationPage = () => {
  const classes = useStyles();
const [tableData, setTableData] = useState();
  const responseFormate = () => {
      const data = defaultData.map((item) => {
        return {
          ...item,
        };
      });
      return data;
    };
  useEffect(() => {
      setTableData(responseFormate());
    }, []);
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Allocation" }]} />
        </div>
        <div
          className={`grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5`}
        >
          <div className="col-span-2">
            <div className={`flex flex-col gap-5 lg:gap-7.5 border rounded-lg gap-4 p-4 ${classes.customStyle}`}>
            <div className="kt-card">
              <div className="kt-card-header gap-2">
                <p><span>Date & Time: 30/07/2025 06:00 PM</span> <span>Person: 400</span></p>
              </div>
              <hr />  
              <div id="notifications_cards">
                <TableComponent
                          columns={columns}
                          data={tableData}
                        />
                 {/* <table className="ant-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Menu Item Name</th>
                      <th>Inside/Agency Order</th>
                      <th>Date & Time</th>
                      <th>Person</th>
                      <th>Place</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        STRAWBERRY <br />
                        BLACK GRAPES
                      </td>
                      <td>
                        <Radio.Group defaultValue="Outside Food">
                          <Radio value="Chef Labour">Chef Labour</Radio>
                          <Radio value="Outside Food">Outside Food</Radio>
                          <Radio value="Inside">Inside</Radio>
                        </Radio.Group>
                      </td>
                      <td>
                        <DatePicker
                          showTime
                          defaultValue={dayjs("2025-07-30 06:00", "YYYY-MM-DD HH:mm")}
                          format="DD/MM/YYYY HH:mm"
                        />
                      </td>
                      <td>
                        <Input defaultValue={400} />
                      </td>
                      <td>
                        <Select defaultValue="At Ven" style={{ width: 100 }}>
                          <Option value="At Ven">At Ven</Option>
                          <Option value="Other">Other</Option>
                        </Select>
                      </td>
                    </tr>
                  </tbody>
                </table> */}
              </div>
            </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className={`flex flex-col gap-5 lg:gap-7.5 border rounded-lg gap-4 p-4 ${classes.customStyle}`}>
            <div className="kt-card">
              <div className="kt-card-header">
              <h3 className="kt-card-title">
                WELCOME DRINKS AND SPRITZERS
              </h3>
              </div>
            </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Container>
    </Fragment>
  );
};
export default EventMenuAllocationPage;
