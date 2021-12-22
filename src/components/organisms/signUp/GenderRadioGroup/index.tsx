import React from "react";
import styles from "./style.module.css";
import GenderRadio from "../GenderRadio";
import { Gender } from "../../../../types";

type GenderRadioGroupProps = {
  gender?: Gender | "";
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const GenderRadioGroup = ({ gender, onChange }: GenderRadioGroupProps) => {
  return (
    <div className={styles.container}>
      <GenderRadio
        id="male"
        value="male"
        checked={gender === "male"}
        onChange={onChange}
      >
        男性
      </GenderRadio>
      <GenderRadio
        id="female"
        value="female"
        checked={gender === "female"}
        onChange={onChange}
      >
        女性
      </GenderRadio>
      <GenderRadio
        id="others"
        value="others"
        checked={gender === "others"}
        onChange={onChange}
      >
        その他
      </GenderRadio>
      <GenderRadio id="na" value="" checked={gender === ""} onChange={onChange}>
        未回答
      </GenderRadio>
    </div>
  );
};

export default GenderRadioGroup;
