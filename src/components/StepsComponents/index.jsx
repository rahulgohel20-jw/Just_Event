import { Steps, theme } from "antd";
import useStyles from "./style";
const StepsComponent = ({ steps, current, onNext, onPrev, onFinish }) => {
  const classes = useStyles();
  const { token } = theme.useToken();

  const contentStyle = {
    // padding: 24,
    // color: token.colorTextTertiary,
    // borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    // marginTop: 16,
  };
  return (
    <div className={`${classes.customSteps} customStepsCommon`}>
      <Steps current={current} items={steps} type="navigation" />
      <div className="ant-content" style={contentStyle}>
        <div className="ant-body" style={contentStyle}>
          {steps[current].content}
        </div>
        <div className="ant-foot mt-4 flex justify-end gap-3">
          {current > 0 && (
            <button
              className="btn btn-light justify-center w-32"
              onClick={onPrev}
            >
              <i className="ki-filled ki-arrow-left font-14"></i> Prev
            </button>
          )}
          {current < steps.length - 1 && (
            <button
              className="btn btn-primary justify-center w-32"
              onClick={onNext}
            >
              Next <i className="ki-filled ki-arrow-right font-14"></i>
            </button>
          )}
          {current === steps.length - 1 && (
            <button
              className="btn btn-success justify-center w-32"
              onClick={onFinish}
            >
              Save <i className="ki-filled ki-save-2 font-14"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default StepsComponent;
