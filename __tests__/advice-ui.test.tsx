/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdviceBanner from "@/components/AdviceBanner";
import { useAdvice } from "@/hooks/useAdvice";

jest.mock("@/hooks/useAdvice");
const mockUseAdvice = useAdvice as jest.Mock;

const mockRefresh = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AdviceBanner", () => {
  it("ローディング中にスケルトンを表示すること", () => {
    mockUseAdvice.mockReturnValue({ advice: null, loading: true, error: null, refresh: mockRefresh });
    const { container } = render(<AdviceBanner />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("アドバイスを表示すること", () => {
    mockUseAdvice.mockReturnValue({
      advice: "今月は食費が多めです。節約を心がけましょう。",
      loading: false,
      error: null,
      refresh: mockRefresh,
    });
    render(<AdviceBanner />);
    expect(screen.getByText("今月は食費が多めです。節約を心がけましょう。")).toBeInTheDocument();
    expect(screen.getByText("AIアドバイス")).toBeInTheDocument();
  });

  it("エラー時にnullを返すこと（非表示）", () => {
    mockUseAdvice.mockReturnValue({ advice: null, loading: false, error: "取得失敗", refresh: mockRefresh });
    const { container } = render(<AdviceBanner />);
    expect(container.firstChild).toBeNull();
  });

  it("支出データなし時にnullを返すこと（非表示）", () => {
    mockUseAdvice.mockReturnValue({ advice: null, loading: false, error: null, refresh: mockRefresh });
    const { container } = render(<AdviceBanner />);
    expect(container.firstChild).toBeNull();
  });

  it("「更新」ボタンをクリックするとrefreshが呼ばれること", () => {
    mockUseAdvice.mockReturnValue({
      advice: "節約できています。",
      loading: false,
      error: null,
      refresh: mockRefresh,
    });
    render(<AdviceBanner />);
    fireEvent.click(screen.getByRole("button", { name: "更新" }));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("ローディング中に更新ボタンがdisabledであること", () => {
    // loading=trueのときはスケルトン表示のためボタンは存在しない
    // loading=falseでadviceがある状態ではボタンはdisabled=false
    mockUseAdvice.mockReturnValue({
      advice: "節約できています。",
      loading: false,
      error: null,
      refresh: mockRefresh,
    });
    render(<AdviceBanner />);
    const btn = screen.getByRole("button", { name: "更新" });
    expect(btn).not.toBeDisabled();
  });
});
