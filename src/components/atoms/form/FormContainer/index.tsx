import React from "react";
import styles from "./style.module.css";

type FormContainerProps = {
  children?: React.ReactNode;
  className?: string;
  isPureForm?: boolean;
};

const FormContainer = ({
  children,
  className,
  isPureForm = true,
}: FormContainerProps) => {
  return (
    <>
      {isPureForm ? (
        <form className={[className, styles.container].join(" ")}>
          {children}
        </form>
      ) : (
        <div className={[className, styles.container].join(" ")}>
          {children}
        </div>
      )}
    </>
  );
};

export default FormContainer;
