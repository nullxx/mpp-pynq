import { Input, Select, Modal, Tooltip, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import React, { memo, useMemo } from "react";
import { Base, bases, prefixes } from "../constants/bases";
import I18n from "./i18n";
const { Option } = Select;

export function getRadix(base: Base) {
  const targetBase = bases.find(({ base: b }) => b === base);
  if (!targetBase) return 0;

  return targetBase.radix;
}
const getFormatted = (number: number, newBase: Base) => {
  const targetBase = bases.find(({ base }) => base === newBase);
  if (!targetBase) return "";

  const value = prefixes[newBase] + number.toString(targetBase.radix).toUpperCase();
  return value;
};

const prettifyBin = (bin: string) => {
  const chunks = bin.match(/.{1,4}/g);
  if (!chunks) return bin;

  return chunks.join(" ");
}

const validateNumberBase = (number: string, base: Base) => {
  const targetBase = bases.find(({ base: b }) => b === base);
  if (!targetBase) return false;

  return targetBase.regex.test(number);
};

const NumberBaseInput = memo(({
  number,
  initialBase,
  onChange,
  onBaseChange,
  readOnly = false,
  width,
  isError,
  max,
  disabled = false
}: {
  number: number;
  initialBase: Base;
  onChange?: (number: number, base: Base) => void;
  onBaseChange?: (newBase: Base) => void;
  readOnly?: boolean;
  width?: number | "100%";
  isError?: boolean;
  max?: number;
  disabled?: boolean;
}) => {
  const [base, setBase] = React.useState<Base>(initialBase);
  const [formatted, setFormatted] = React.useState(getFormatted(number, base));
  const [isValid, setIsValid] = React.useState(
    validateNumberBase(formatted, base)
  );

  const [visible, setVisible] = React.useState(false);
  const [wantVisible, setWantVisible] = React.useState(false);

  React.useEffect(() => {
    setFormatted(getFormatted(number, base)); // for updating props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  const handleBaseChange = (newBase: Base) => {
    setBase(newBase);
    const frmt = getFormatted(number, newBase);
    if (!frmt) return;

    setFormatted(frmt);
    setIsValid(validateNumberBase(frmt, newBase));
    onBaseChange && onBaseChange(newBase);
  };

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    const isValid = validateNumberBase(e.target.value, base);
    setIsValid(isValid);

    const targetBase = bases.find(({ base: b }) => b === base);
    if (!targetBase) return "";

    if (isValid) {
      let num = parseInt(e.target.value, targetBase.radix);
      num = max && num > max ? max : num;
      newValue = getFormatted(num, base);
      onChange && onChange(num, base);
    }

    setFormatted(newValue);
  };

  const selectBefore = useMemo(() => (
    <Select value={base} onChange={handleBaseChange} disabled={disabled}>
      {bases.map(({ base, radix }) => (
        <Option key={base} value={base}>
          {base}
          <sub>({radix})</sub>
        </Option>
      ))}
    </Select>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [base, disabled]);

  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible);
    setTimeout(() => {
      setWantVisible(visible);
    }, 500);
  }

  return (
    <Tooltip open={!isValid} title={<I18n k="invalidNumber" />}>
      <Input
        readOnly={readOnly}
        addonBefore={selectBefore}
        disabled={disabled}
        value={formatted}
        onChange={onValueChange}
        status={!isValid || isError ? "error" : undefined}
        style={{ width }}
        styles={{
          input: {
            cursor: readOnly ? 'pointer' : 'auto'
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (readOnly) {
            handleVisibleChange(true);
          }
        }}
      />

      {readOnly && (visible || wantVisible) && (
        <MoreInfoModal visible={visible} onClose={() => handleVisibleChange(false)} number={number} />
      )}
    </Tooltip>
  );
}, (prevProps, nextProps) => {
  return prevProps.number === nextProps.number
    && prevProps.initialBase === nextProps.initialBase
    && prevProps.readOnly === nextProps.readOnly
    && prevProps.width === nextProps.width
    && prevProps.isError === nextProps.isError
    && prevProps.max === nextProps.max
    && prevProps.disabled === nextProps.disabled
});

const MoreInfoModal = ({ number, visible, onClose }: { number: number, visible: boolean, onClose: () => void }) => {

  const [copiedFeedbackVisible, setCopiedFeedbackVisible] = React.useState(false);
  React.useEffect(() => {
    if (copiedFeedbackVisible) {
      setTimeout(() => {
        setCopiedFeedbackVisible(false);
      }, 1000);
    }
  }, [copiedFeedbackVisible]);

  return (<Modal
    title={<br />}
    open={visible}
    onOk={() => onClose()}
    onCancel={() => onClose()}
    footer={null}
    centered
    styles={{
      // mask: {
      //   backdropFilter: 'blur(5px)'
      // }
    }}
  >
    {/* display all bases */}
    {bases.map(({ base, radix }) => (
      <>
        <Input
          key={number + base}
          addonBefore={base}
          addonAfter={
            <Tooltip
              title={copiedFeedbackVisible ? <I18n k="copied" /> : <I18n k="copy" />}
              placement="topRight"
              onOpenChange={(open) => {
                if (!open) {
                  setCopiedFeedbackVisible(false);
                }
              }}
            >
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  setCopiedFeedbackVisible(true);
                  navigator.clipboard.writeText(getFormatted(number, base));
                }}
              />
            </Tooltip>
          }
          readOnly
          value=
          {base === 'BIN' ? prettifyBin(getFormatted(number, base)) : getFormatted(number, base)}
          size="large"
        />
        <div style={{ height: 10 }} />
      </>
    ))}

  </Modal>);
}

export default NumberBaseInput;