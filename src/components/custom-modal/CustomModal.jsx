import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import useStyle from "./style";
const CustomModal = ({ open, onClose, children, footer, title, ...rest }) => {
  const classes = useStyle();
  const [shake, setShake] = useState(false);
  const modalRef = useRef(null);
  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      setShake(true);
      setTimeout(() => setShake(false), 300); // Clear after animation
      return;
    }
    onClose();
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;

      // Check if clicked element is inside any AntD popup (class starts with 'ant-')
      const isAntdPopup = [
        ...document.querySelectorAll("[class^='ant-']"),
      ].some((el) => el.contains(target));

      if (isAntdPopup) return;

      if (open && modalRef.current && !modalRef.current.contains(e.target)) {
        // Clicked outside the modal content
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  return (
    <Modal
      maskClosable={false} //  disables closing on backdrop click
      keyboard={false} //disables closing on Esc
      closable={false} // Disable default close button
      title={
        title ? (
          <div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-base font-medium">{title}</span>
              <button
                type="text"
                onClick={handleClose}
                className="text-[#000] hover:text-gray-700"
              >
                <i className="ki-filled ki-cross text-xl"></i>
              </button>
            </div>
            <hr className=" border-t border-[#00000033]" />
          </div>
        ) : null
      }
      open={open}
      onCancel={handleClose}
      modalRender={(modal) => (
        // for shake animation
        <div ref={modalRef} className={shake ? classes.shake : ""}>
          {modal}
        </div>
      )}
      footer={footer ? <div className="pt-3">{footer}</div> : null}
      {...rest}
    >
      {children}
    </Modal>
  );
};
export { CustomModal };
