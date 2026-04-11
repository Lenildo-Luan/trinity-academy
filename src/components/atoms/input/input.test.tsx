/** @vitest-environment jsdom */

import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderComponent } from "@/test/component-test-utils";

const otpMockState = vi.hoisted(() => ({
  props: null as Record<string, unknown> | null,
}));

vi.mock("input-otp", () => {
  return {
    REGEXP_ONLY_DIGITS: /^[0-9]+$/,
    SlotProps: {},
    OTPInput: (props: Record<string, any>) => {
      otpMockState.props = props;
      return props.render({
        slots: [
          { isActive: true, hasFakeCaret: true, char: "" },
          { isActive: false, hasFakeCaret: false, char: "7" },
        ],
      });
    },
  };
});

import { OTPInput, TextInput } from "./input";

describe("input components", () => {
  afterEach(() => {
    otpMockState.props = null;
    document.body.innerHTML = "";
  });

  it("renders TextInput with forwarded props and classes", () => {
    const { container, unmount } = renderComponent(
      <TextInput className="custom-input" placeholder="Digite aqui" />,
    );

    const input = container.querySelector("input");
    expect(input).not.toBeNull();
    expect(input?.getAttribute("placeholder")).toBe("Digite aqui");
    expect(input?.className).toContain("custom-input");
    expect(input?.className).toContain("rounded-lg");

    unmount();
  });

  it("renders OTP slots and forwards props to base OTP input", () => {
    const onChange = vi.fn();
    const { container, unmount } = renderComponent(
      <OTPInput className="otp-wrapper" maxLength={6} value="12" onChange={onChange} />,
    );

    expect(otpMockState.props).not.toBeNull();
    expect(otpMockState.props?.required).toBe(true);
    expect(otpMockState.props?.name).toBe("otp");
    expect(otpMockState.props?.containerClassName).toBe("otp-wrapper");
    expect(otpMockState.props?.maxLength).toBe(6);
    expect(otpMockState.props?.value).toBe("12");
    expect(otpMockState.props?.spellCheck).toBe(false);
    expect(otpMockState.props?.pattern).toEqual(/^[0-9]+$/);

    const activeSlot = container.querySelector('[data-active=""]');
    expect(activeSlot).not.toBeNull();
    expect(activeSlot?.querySelector('span[aria-hidden="true"]')).not.toBeNull();
    expect(container.textContent).toContain("7");

    act(() => {
      otpMockState.props?.onChange?.("3456");
    });
    expect(onChange).toHaveBeenCalledWith("3456");

    unmount();
  });

  it("allows overriding OTP input name", () => {
    const { unmount } = renderComponent(<OTPInput maxLength={4} name="token" />);
    expect(otpMockState.props?.name).toBe("token");
    unmount();
  });
});
